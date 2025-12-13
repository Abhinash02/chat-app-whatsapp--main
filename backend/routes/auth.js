const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const twilio = require("twilio"); 
const User = require("../models/User");
const router = express.Router();

// Initialize Twilio Client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// MIDDLEWARE
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// --- 1. SIGNUP 
router.post("/signup", async (req, res) => {
  const { username, phoneNumber, password } = req.body;

  // Validation
  if (!username || !phoneNumber || !password) {
    return res.status(400).json({ message: "Fill all fields" });
  }
  if (phoneNumber.length !== 10) {
    return res.status(400).json({ message: "Phone number must be 10 digits" });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  try {
    // Check if user exists
    let user = await User.findOne({ phoneNumber });

    if (user) {
      if (user.isVerified) {
        return res.status(400).json({ message: "Phone number already registered" });
      } else {
        // User exists but is not verified. Update their details.
        user.username = username;
        user.password = password; 
      }
    } else {
      // Check if username is taken by a DIFFERENT verified user
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({ message: "Username taken" });
      }
      // Create new user instance
      user = new User({ username, phoneNumber, password });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set OTP and Expiry
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    
    await user.save();
    console.log(`🔐 MOCK OTP for ${phoneNumber} (RESET PASSWORD): ${otp}`);
  
    // --- SEND OTP VIA TWILIO ---
    await client.messages.create({
      body: `Your WhatsApp Clone verification code is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${phoneNumber}`, // Add country code here
    });

    res.json({ message: "OTP sent successfully", phoneNumber });

  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error sending OTP" });
  }
});

// --- 2. VERIFY OTP 
router.post("/verify-otp", async (req, res) => {
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
    return res.status(400).json({ message: "Phone and OTP are required" });
  }

  try {
    const user = await User.findOne({ phoneNumber });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if OTP matches and is not expired
    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Verify User
    user.isVerified = true;
    user.otp = undefined; 
    user.otpExpires = undefined;
    await user.save();

    // Generate Token (Login)
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      username: user.username,
      phoneNumber: user.phoneNumber,
      profileImage: user.profileImage,
    });

  } catch (err) {
    console.error("Verification error:", err);
    res.status(500).json({ message: "Server error verifying OTP" });
  }
});

// LOGIN 
router.post("/login", async (req, res) => {
  const { phoneNumber, password } = req.body;

  if (!phoneNumber || !password) {
    return res.status(400).json({ message: "Please enter phone and password" });
  }

  try {
    const user = await User.findOne({ phoneNumber });
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Wrong credentials" });
    }

    // Optional: Prevent login if not verified
    if (!user.isVerified) {
       return res.status(400).json({ message: "Account not verified. Please sign up again." });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      username: user.username,
      phoneNumber: user.phoneNumber,
      profileImage: user.profileImage,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// FORGOT PASSWORD: Send OTP 
router.post("/forgot-password", async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ message: "User not found with this number" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Save OTP to DB (valid for 10 mins)
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();
    console.log(`🔐 MOCK OTP for ${phoneNumber} (SIGNUP): ${otp}`);
    
    // Send via Twilio
    await client.messages.create({
      body: `Your WhatsApp Clone Password Reset Code is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${phoneNumber}`, 
    });

    res.json({ message: "OTP sent for password reset" });

  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Server error sending OTP" });
  }
});

//RESET PASSWORD: Verify OTP & Update 
router.post("/reset-password", async (req, res) => {
  const { phoneNumber, otp, newPassword } = req.body;

  if (newPassword.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  try {
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify OTP
    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Update Password
    user.password = newPassword;
    
    // Clear OTP fields
    user.otp = undefined;
    user.otpExpires = undefined;
    
    await user.save();

    res.json({ message: "Password reset successful. Please login." });

  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Server error resetting password" });
  }
});

module.exports = { router, authenticate };


// GET ALL USERS
router.get("/users", authenticate, async (req, res) => {
  const users = await User.find({ isVerified: true }).select("username profileImage");
  res.json(users);
});

// GET ME
router.get("/me", authenticate, async (req, res) => {
  const user = await User.findById(req.user.userId).select("-password");
  res.json(user);
});

// UPDATE PROFILE
router.put("/profile", authenticate, async (req, res) => {
  try {
    const { username, phoneNumber, profileImage, oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (username && username !== user.username && (await User.findOne({ username }))) {
      return res.status(400).json({ message: "Username taken" });
    }
    if (phoneNumber && phoneNumber !== user.phoneNumber && (await User.findOne({ phoneNumber }))) {
      return res.status(400).json({ message: "Phone taken" });
    }

    user.username = username || user.username;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.profileImage = profileImage || user.profileImage;

    if (oldPassword && newPassword) {
      if (newPassword.length < 6) return res.status(400).json({ message: "New password too short" });
      const isMatch = await user.comparePassword(oldPassword);
      if (!isMatch) return res.status(400).json({ message: "Incorrect old password" });
      user.password = newPassword;
    }

    await user.save();

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, username: user.username, phoneNumber: user.phoneNumber, profileImage: user.profileImage });

  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = { router, authenticate };
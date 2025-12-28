// "use client";
// import { useState } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import { Eye, EyeOff, ArrowLeft } from "lucide-react";

// const API_URL = "http://localhost:5000";

// export default function LoginPage() {
//   // Form States
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [password, setPassword] = useState("");
//   const [username, setUsername] = useState("");
  
//   // --- TWILIO: Commented out OTP State ---
//   // const [otp, setOtp] = useState(""); 
  
//   // UI States
//   const [isSignup, setIsSignup] = useState(false);
  
//   // --- TWILIO: Commented out UI Logic ---
//   // const [showOtpInput, setShowOtpInput] = useState(false); 
//   // const [isResetMode, setIsResetMode] = useState(false); 
//   // const [resetStep, setResetStep] = useState(1); 
  
//   const [error, setError] = useState("");
//   const [successMsg, setSuccessMsg] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const router = useRouter();

//   // --- 1. HANDLE LOGIN & SIGNUP ---
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccessMsg("");

//     if (phoneNumber.length !== 10) return setError("Phone number must be 10 digits.");

//     // --- TWILIO: Commented out OTP Step Check ---
//     /*
//     if (showOtpInput) {
//       handleVerifySignupOtp();
//       return;
//     }
//     */

//     if (isSignup && password.length < 6) return setError("Password min 6 chars.");

//     try {
//       const endpoint = isSignup ? "/signup" : "/login";
//       const payload = isSignup ? { username, phoneNumber, password } : { phoneNumber, password };

//       const { data } = await axios.post(`${API_URL}/api/auth${endpoint}`, payload);

//       // --- TWILIO: Commented out OTP Flow ---
//       /*
//       if (isSignup) {
//         setShowOtpInput(true);
//         setSuccessMsg("OTP sent to your phone!");
//       } else {
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("username", data.username);
//         window.location.href = "/";
//       }
//       */

//       // --- REPLACEMENT: Direct Login for both Signup and Login ---
//       // (Assuming backend now returns token for signup too)
//       localStorage.setItem("token", data.token);
//       localStorage.setItem("username", data.username || username); // Fallback to state username if data.username is missing
//       window.location.href = "/chat"; // Redirect to chat

//     } catch (err) {
//       setError(err.response?.data?.message || "Request failed");
//     }
//   };

//   // --- 2. VERIFY SIGNUP OTP (TWILIO: Commented out) ---
//   /*
//   const handleVerifySignupOtp = async () => {
//     try {
//       const { data } = await axios.post(`${API_URL}/api/auth/verify-otp`, { phoneNumber, otp });
//       localStorage.setItem("token", data.token);
//       localStorage.setItem("username", data.username);
//       window.location.href = "/";
//     } catch (err) {
//       setError(err.response?.data?.message || "Invalid OTP");
//     }
//   };
//   */

//   // --- 3. FORGOT PASSWORD (TWILIO: Commented out) ---
//   /*
//   const handleForgotPassword = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccessMsg("");

//     if (resetStep === 1) {
//       // Step 1: Send OTP
//       try {
//         await axios.post(`${API_URL}/api/auth/forgot-password`, { phoneNumber });
//         setResetStep(2);
//         setSuccessMsg("OTP sent! Enter it below to reset password.");
//       } catch (err) {
//         setError(err.response?.data?.message || "Failed to send OTP");
//       }
//     } else {
//       // Step 2: Reset Password
//       if (password.length < 6) return setError("New password must be 6+ chars");
//       try {
//         await axios.post(`${API_URL}/api/auth/reset-password`, {
//           phoneNumber,
//           otp,
//           newPassword: password // reusing password state for new password
//         });
//         alert("Password Reset Successful! Please Login.");
//         // Reset everything to Login View
//         setIsResetMode(false);
//         setResetStep(1);
//         setPassword("");
//         setOtp("");
//         setSuccessMsg("");
//       } catch (err) {
//         setError(err.response?.data?.message || "Failed to reset password");
//       }
//     }
//   };
//   */

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-400 to-blue-600">
//       <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md relative">
        
//         {/* Header */}
//         <h1 className="text-4xl font-bold text-center text-green-600 mb-8">
//           {/* TWILIO: Removed OTP/Reset conditions from header */}
//           {isSignup ? "Join WhatsApp" : "Welcome Back"}
//         </h1>

//         {/* Error / Success Messages */}
//         {error && <p className="text-red-500 text-center font-bold mb-4 bg-red-100 p-2 rounded">{error}</p>}
//         {successMsg && <p className="text-green-600 text-center font-bold mb-4 bg-green-100 p-2 rounded">{successMsg}</p>}

//         {/* --- FORM --- */}
//         {/* TWILIO: Removed handleForgotPassword from submit handler */}
//         <form onSubmit={handleSubmit}>
          
//           {/* Username (Only for Signup) */}
//           {/* TWILIO: Removed !isResetMode && !showOtpInput checks */}
//           {isSignup && (
//             <input
//               required
//               placeholder="Your Name"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               className="w-full p-4 border-2 border-gray-300 rounded-xl mb-4 text-lg"
//             />
//           )}

//           {/* Phone Number */}
//           {/* TWILIO: Removed Reset conditions */}
//           <input
//             required
//             placeholder="Phone Number"
//             value={phoneNumber}
//             onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
//             className="w-full p-4 border-2 border-gray-300 rounded-xl mb-4 text-lg"
//           />

//           {/* Password */}
//           {/* TWILIO: Removed OTP/Reset conditions */}
//           <div className="relative w-full mb-6">
//             <input
//               required
//               type={showPassword ? "text" : "password"}
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full p-4 border-2 border-gray-300 rounded-xl text-lg pr-12"
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute top-0 right-0 h-full px-4 text-gray-500"
//             >
//               {showPassword ? <EyeOff /> : <Eye />}
//             </button>
//           </div>

//           {/* TWILIO: OTP Input COMMENTED OUT */}
//           {/*
//           {(showOtpInput || (isResetMode && resetStep === 2)) && (
//             <input
//               required
//               placeholder="Enter 6-digit OTP"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
//               className="w-full p-4 border-2 border-gray-300 rounded-xl mb-6 text-lg text-center tracking-widest"
//             />
//           )}
//           */}

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="w-full bg-green-600 text-white py-5 rounded-xl font-bold text-2xl hover:bg-green-700 transition"
//           >
//             {/* TWILIO: Simplified Button Text */}
//             {isSignup ? "SIGN UP" : "LOGIN"}
//           </button>
//         </form>

//         {/* --- LINKS & NAVIGATION --- */}
//         <div className="text-center mt-6 space-y-2">
          
//           {/* TWILIO: Commented out Forgot Password Link */}
//           {/*
//           {!isResetMode && !isSignup && !showOtpInput && (
//             <button
//               type="button"
//               onClick={() => { setIsResetMode(true); setError(""); setSuccessMsg(""); }}
//               className="text-gray-500 text-sm hover:text-green-600 font-semibold block w-full"
//             >
//               Forgot Password?
//             </button>
//           )}
//           */}

//           {/* Login / Signup Toggle */}
//           {/* TWILIO: Removed OTP checks */}
//           <p className="text-gray-600">
//             {isSignup ? "Already have account?" : "New user?"}{" "}
//             <button
//               type="button"
//               onClick={() => { setIsSignup(!isSignup); setError(""); }}
//               className="text-green-600 font-bold underline"
//             >
//               {isSignup ? "Login" : "Sign Up"}
//             </button>
//           </p>

//           {/* TWILIO: Back Button Commented Out (Only needed for Reset/OTP modes) */}
//           {/*
//           {(isResetMode || showOtpInput) && (
//             <button
//               onClick={() => {
//                 setIsResetMode(false);
//                 setShowOtpInput(false);
//                 setResetStep(1);
//                 setError("");
//                 setSuccessMsg("");
//               }}
//               className="flex items-center justify-center gap-2 w-full text-red-500 font-bold mt-4"
//             >
//               <ArrowLeft className="w-4 h-4" /> Back to Login
//             </button>
//           )}
//           */}
//         </div>

//       </div>
//     </div>
//   );
// }

// "use client";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import { Eye, EyeOff, ArrowLeft } from "lucide-react";

// const API_URL = "http://localhost:5000";

// export default function LoginPage() {
//   // Form States
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [password, setPassword] = useState("");
//   const [username, setUsername] = useState("");
  
//   // UI States
//   const [isSignup, setIsSignup] = useState(false);
//   const [error, setError] = useState("");
//   const [successMsg, setSuccessMsg] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const router = useRouter();

//   // --- HANDLE LOGIN & SIGNUP ---
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccessMsg("");

//     if (phoneNumber.length !== 10) return setError("Phone number must be 10 digits.");
//     if (isSignup && password.length < 6) return setError("Password min 6 chars.");

//     try {
//       const endpoint = isSignup ? "/signup" : "/login";
//       const payload = isSignup ? { username, phoneNumber, password } : { phoneNumber, password };

//       const { data } = await axios.post(`${API_URL}/api/auth${endpoint}`, payload);

//       // --- Direct Login (Twilio OTP Removed) ---
//       localStorage.setItem("token", data.token);
//       localStorage.setItem("username", data.username || username);
//       window.location.href = "/chat"; // Redirect to chat

//     } catch (err) {
//       setError(err.response?.data?.message || "Request failed");
//     }
//   };

//   useEffect(() => {
//     const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
//     if (token) {
//       router.push("/chat");
//     } else {
//       router.push("/login");
//     }
//   }, [router]);
//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-400 to-blue-600">
//       <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md relative">
        
//         {/* Header */}
//         <h1 className="text-4xl font-bold text-center text-green-600 mb-8">
//           {isSignup ? "Join WhatsApp" : "Welcome Back"}
//         </h1>

//         {/* Error / Success Messages */}
//         {error && <p className="text-red-500 text-center font-bold mb-4 bg-red-100 p-2 rounded">{error}</p>}
//         {successMsg && <p className="text-green-600 text-center font-bold mb-4 bg-green-100 p-2 rounded">{successMsg}</p>}

//         {/* --- FORM --- */}
//         <form onSubmit={handleSubmit}>
          
//           {/* Username (Only for Signup) */}
//           {isSignup && (
//             <input
//               required
//               placeholder="Your Name"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               className="w-full p-4 border-2 border-gray-300 rounded-xl mb-4 text-lg"
//             />
//           )}

//           {/* Phone Number */}
//           <input
//             required
//             placeholder="Phone Number"
//             value={phoneNumber}
//             onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
//             className="w-full p-4 border-2 border-gray-300 rounded-xl mb-4 text-lg"
//           />

//           {/* Password */}
//           <div className="relative w-full mb-6">
//             <input
//               required
//               type={showPassword ? "text" : "password"}
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full p-4 border-2 border-gray-300 rounded-xl text-lg pr-12"
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute top-0 right-0 h-full px-4 text-gray-500"
//             >
//               {showPassword ? <EyeOff /> : <Eye />}
//             </button>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="w-full bg-green-600 text-white py-5 rounded-xl font-bold text-2xl hover:bg-green-700 transition"
//           >
//             {isSignup ? "SIGN UP" : "LOGIN"}
//           </button>
//         </form>

//         {/* --- LINKS & NAVIGATION --- */}
//         <div className="text-center mt-6 space-y-2">
//           <p className="text-gray-600">
//             {isSignup ? "Already have account?" : "New user?"}{" "}
//             <button
//               type="button"
//               onClick={() => { setIsSignup(!isSignup); setError(""); }}
//               className="text-green-600 font-bold underline"
//             >
//               {isSignup ? "Login" : "Sign Up"}
//             </button>
//           </p>
//         </div>

//       </div>
//     </div>
//   );
// }


// "use client";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import { Eye, EyeOff, ArrowLeft } from "lucide-react";

// const API_URL = "http://localhost:5000";

// export default function LoginPage() {
//   // Form States
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [password, setPassword] = useState("");
//   const [username, setUsername] = useState("");
//   const [otp, setOtp] = useState(""); // Needed for reset

//   // UI States
//   const [isSignup, setIsSignup] = useState(false);
//   const [isResetMode, setIsResetMode] = useState(false); // Toggle for Forgot Password
//   const [resetStep, setResetStep] = useState(1); // 1: Request OTP, 2: Reset Password

//   const [error, setError] = useState("");
//   const [successMsg, setSuccessMsg] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const router = useRouter();

//   // --- AUTO-REDIRECT IF LOGGED IN ---
//   useEffect(() => {
//     const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
//     if (token) {
//       router.push("/chat");
//     }
//   }, [router]);

//   // --- 1. HANDLE LOGIN & SIGNUP ---
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccessMsg("");

//     if (phoneNumber.length !== 10) return setError("Phone number must be 10 digits.");
//     if (isSignup && password.length < 6) return setError("Password min 6 chars.");

//     try {
//       const endpoint = isSignup ? "/signup" : "/login";
//       const payload = isSignup ? { username, phoneNumber, password } : { phoneNumber, password };

//       const { data } = await axios.post(`${API_URL}/api/auth${endpoint}`, payload);

//       // Direct Login
//       localStorage.setItem("token", data.token);
//       localStorage.setItem("username", data.username || username);
//       window.location.href = "/chat"; 

//     } catch (err) {
//       setError(err.response?.data?.message || "Request failed");
//     }
//   };

//   // --- 2. HANDLE FORGOT PASSWORD ---
//   const handleForgotPassword = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccessMsg("");

//     if (resetStep === 1) {
//       // Step 1: Send OTP
//       if (phoneNumber.length !== 10) return setError("Enter a valid phone number.");
//       try {
//         await axios.post(`${API_URL}/api/auth/forgot-password`, { phoneNumber });
//         setResetStep(2);
//         setSuccessMsg(`OTP generated! [ ${data.otp} ]`);
//       } catch (err) {
//         setError(err.response?.data?.message || "Failed to send OTP");
//       }
//     } else {
//       // Step 2: Reset Password
//       if (password.length < 6) return setError("New password must be 6+ chars");
//       if (otp.length !== 6) return setError("Enter valid 6-digit OTP");
      
//       try {
//         await axios.post(`${API_URL}/api/auth/reset-password`, {
//           phoneNumber,
//           otp,
//           newPassword: password // reusing password state
//         });
//         alert("Password Reset Successful! Please Login.");
        
//         // Reset UI to Login View
//         setIsResetMode(false);
//         setResetStep(1);
//         setPassword("");
//         setOtp("");
//         setSuccessMsg("");
//       } catch (err) {
//         setError(err.response?.data?.message || "Failed to reset password");
//       }
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-400 to-blue-600">
//       <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md relative">
        
//         {/* Header */}
//         <h1 className="text-4xl font-bold text-center text-green-600 mb-8">
//           {isResetMode 
//             ? (resetStep === 1 ? "Reset Password" : "Set New Password")
//             : (isSignup ? "Join WhatsApp" : "Welcome Back")
//           }
//         </h1>

//         {/* Messages */}
//         {error && <p className="text-red-500 text-center font-bold mb-4 bg-red-100 p-2 rounded">{error}</p>}
//         {successMsg && <p className="text-green-600 text-center font-bold mb-4 bg-green-100 p-2 rounded">{successMsg}</p>}

//         {/* --- FORM --- */}
//         <form onSubmit={isResetMode ? handleForgotPassword : handleSubmit}>
          
//           {/* Username (Signup Only) */}
//           {!isResetMode && isSignup && (
//             <input
//               required
//               placeholder="Your Name"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               className="w-full p-4 border-2 border-gray-300 rounded-xl mb-4 text-lg"
//             />
//           )}

//           {/* Phone Number (Always visible except Reset Step 2) */}
//           {(!isResetMode || resetStep === 1) && (
//             <input
//               required
//               placeholder="Phone Number"
//               value={phoneNumber}
//               onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
//               className="w-full p-4 border-2 border-gray-300 rounded-xl mb-4 text-lg"
//             />
//           )}

//           {/* OTP Input (Only Reset Step 2) */}
//           {isResetMode && resetStep === 2 && (
//             <input
//               required
//               placeholder="Enter 6-digit OTP"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
//               className="w-full p-4 border-2 border-gray-300 rounded-xl mb-4 text-lg text-center tracking-widest"
//             />
//           )}

//           {/* Password Input (Login, Signup, or Reset Step 2) */}
//           {(!isResetMode || resetStep === 2) && (
//             <div className="relative w-full mb-6">
//               <input
//                 required
//                 type={showPassword ? "text" : "password"}
//                 placeholder={isResetMode ? "New Password" : "Password"}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full p-4 border-2 border-gray-300 rounded-xl text-lg pr-12"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute top-0 right-0 h-full px-4 text-gray-500"
//               >
//                 {showPassword ? <EyeOff /> : <Eye />}
//               </button>
//             </div>
//           )}

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="w-full bg-green-600 text-white py-5 rounded-xl font-bold text-2xl hover:bg-green-700 transition"
//           >
//             {isResetMode 
//               ? (resetStep === 1 ? "SEND OTP" : "RESET PASSWORD")
//               : (isSignup ? "SIGN UP" : "LOGIN")
//             }
//           </button>
//         </form>

//         {/* --- LINKS & NAVIGATION --- */}
//         <div className="text-center mt-6 space-y-2">
          
//           {/* Forgot Password Link */}
//           {!isResetMode && !isSignup && (
//             <button
//               type="button"
//               onClick={() => { setIsResetMode(true); setError(""); setSuccessMsg(""); }}
//               className="text-gray-500 text-sm hover:text-green-600 font-semibold block w-full"
//             >
//               Forgot Password?
//             </button>
//           )}

//           {/* Login / Signup Toggle */}
//           {!isResetMode && (
//             <p className="text-gray-600">
//               {isSignup ? "Already have account?" : "New user?"}{" "}
//               <button
//                 type="button"
//                 onClick={() => { setIsSignup(!isSignup); setError(""); }}
//                 className="text-green-600 font-bold underline"
//               >
//                 {isSignup ? "Login" : "Sign Up"}
//               </button>
//             </p>
//           )}

//           {/* Back Button (For Reset Mode) */}
//           {isResetMode && (
//             <button
//               onClick={() => {
//                 setIsResetMode(false);
//                 setResetStep(1);
//                 setError("");
//                 setSuccessMsg("");
//               }}
//               className="flex items-center justify-center gap-2 w-full text-red-500 font-bold mt-4"
//             >
//               <ArrowLeft className="w-4 h-4" /> Back to Login
//             </button>
//           )}
//         </div>

//       </div>
//     </div>
//   );
// }


"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

// const API_URL = "http://localhost:5000";
const API_URL="https://chat-app-whatsapp-main.vercel.app/";
export default function LoginPage() {
  // Form States
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState(""); 

  // UI States
  const [isSignup, setIsSignup] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false); 
  const [resetStep, setResetStep] = useState(1); 

  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // --- AUTO-REDIRECT IF LOGGED IN ---
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      router.push("/chat");
    }
  }, [router]);

  // --- 1. HANDLE LOGIN & SIGNUP ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (phoneNumber.length !== 10) return setError("Phone number must be 10 digits.");
    if (isSignup && password.length < 6) return setError("Password min 6 chars.");

    try {
      const endpoint = isSignup ? "/signup" : "/login";
      const payload = isSignup ? { username, phoneNumber, password } : { phoneNumber, password };

      const { data } = await axios.post(`${API_URL}/api/auth${endpoint}`, payload);

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username || username);
      window.location.href = "/chat"; 

    } catch (err) {
      setError(err.response?.data?.message || "Request failed");
    }
  };

  // --- 2. HANDLE FORGOT PASSWORD ---
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (resetStep === 1) {
      // Step 1: Send OTP
      if (phoneNumber.length !== 10) return setError("Enter a valid phone number.");
      try {
        const { data } = await axios.post(`${API_URL}/api/auth/forgot-password`, { phoneNumber });
        setResetStep(2);
        
        // --- UPDATED: Show OTP in brackets ---
        setSuccessMsg(`OTP generated! [ ${data.otp} ]`); 
        
      } catch (err) {
        setError(err.response?.data?.message || "Failed to send OTP");
      }
    } else {
      // Step 2: Reset Password
      if (password.length < 6) return setError("New password must be 6+ chars");
      if (otp.length !== 6) return setError("Enter valid 6-digit OTP");
      
      try {
        await axios.post(`${API_URL}/api/auth/reset-password`, {
          phoneNumber,
          otp,
          newPassword: password 
        });
        alert("Password Reset Successful! Please Login.");
        
        // Reset UI to Login View
        setIsResetMode(false);
        setResetStep(1);
        setPassword("");
        setOtp("");
        setSuccessMsg("");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to reset password");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-400 to-blue-600">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md relative">
        
        {/* Header */}
        <h1 className="text-4xl font-bold text-center text-green-600 mb-8">
          {isResetMode 
            ? (resetStep === 1 ? "Reset Password" : "Set New Password")
            : (isSignup ? "Join WhatsApp" : "Welcome Back")
          }
        </h1>

        {/* Messages */}
        {error && <p className="text-red-500 text-center font-bold mb-4 bg-red-100 p-2 rounded">{error}</p>}
        {successMsg && <p className="text-green-600 text-center font-bold mb-4 bg-green-100 p-2 rounded">{successMsg}</p>}

        {/* --- FORM --- */}
        <form onSubmit={isResetMode ? handleForgotPassword : handleSubmit}>
          
          {/* Username (Signup Only) */}
          {!isResetMode && isSignup && (
            <input
              required
              placeholder="Your Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-4 border-2 border-gray-300 rounded-xl mb-4 text-lg"
            />
          )}

          {/* Phone Number (Always visible except Reset Step 2) */}
          {(!isResetMode || resetStep === 1) && (
            <input
              required
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
              className="w-full p-4 border-2 border-gray-300 rounded-xl mb-4 text-lg"
            />
          )}

          {/* OTP Input (Only Reset Step 2) */}
          {isResetMode && resetStep === 2 && (
            <input
              required
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="w-full p-4 border-2 border-gray-300 rounded-xl mb-4 text-lg text-center tracking-widest"
            />
          )}

          {/* Password Input (Login, Signup, or Reset Step 2) */}
          {(!isResetMode || resetStep === 2) && (
            <div className="relative w-full mb-6">
              <input
                required
                type={showPassword ? "text" : "password"}
                placeholder={isResetMode ? "New Password" : "Password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 border-2 border-gray-300 rounded-xl text-lg pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-0 right-0 h-full px-4 text-gray-500"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-5 rounded-xl font-bold text-2xl hover:bg-green-700 transition"
          >
            {isResetMode 
              ? (resetStep === 1 ? "SEND OTP" : "RESET PASSWORD")
              : (isSignup ? "SIGN UP" : "LOGIN")
            }
          </button>
        </form>

        {/* --- LINKS & NAVIGATION --- */}
        <div className="text-center mt-6 space-y-2">
          
          {/* Forgot Password Link */}
          {!isResetMode && !isSignup && (
            <button
              type="button"
              onClick={() => { setIsResetMode(true); setError(""); setSuccessMsg(""); }}
              className="text-gray-500 text-sm hover:text-green-600 font-semibold block w-full"
            >
              Forgot Password?
            </button>
          )}

          {/* Login / Signup Toggle */}
          {!isResetMode && (
            <p className="text-gray-600">
              {isSignup ? "Already have account?" : "New user?"}{" "}
              <button
                type="button"
                onClick={() => { setIsSignup(!isSignup); setError(""); }}
                className="text-green-600 font-bold underline"
              >
                {isSignup ? "Login" : "Sign Up"}
              </button>
            </p>
          )}

          {/* Back Button (For Reset Mode) */}
          {isResetMode && (
            <button
              onClick={() => {
                setIsResetMode(false);
                setResetStep(1);
                setError("");
                setSuccessMsg("");
              }}
              className="flex items-center justify-center gap-2 w-full text-red-500 font-bold mt-4"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

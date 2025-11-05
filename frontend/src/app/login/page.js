// // src/app/login/page.js
// "use client";
// import { useState } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// export default function Login() {
//   const [phone, setPhone] = useState("");
//   const [pass, setPass] = useState("");
//   const [isSignup, setIsSignup] = useState(false);
//   const [name, setName] = useState("");
//   const [error, setError] = useState("");
//   const router = useRouter();

//   const submit = async () => {
//     setError("");
//     if (!phone || !pass || (isSignup && !name)) {
//       setError("Fill all fields");
//       return;
//     }

//     try {
//       const url = isSignup ? "/signup" : "/login";
//       const body = isSignup ? { username: name, phoneNumber: phone, password: pass } : { phoneNumber: phone, password: pass };

//       const res = await axios.post(`${API_URL}/api/auth${url}`, body);
//       localStorage.setItem("token", res.data.token);
//       localStorage.setItem("username", res.data.username);

//       // SUCCESS → GO TO CHAT
//       router.push("/chat");
//     } catch (e) {
//       setError(e.response?.data?.message || "Server error");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-600 flex items-center justify-center p-5">
//       <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md">
//         <h1 className="text-4xl font-bold text-center text-green-600 mb-8">
//           {isSignup ? "Join WhatsApp" : "Welcome Back"}
//         </h1>

//         {error && <p className="text-red-500 text-center mb-4">{error}</p>}

//         {isSignup && (
//           <input
//             placeholder="Your Name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="w-full p-4 border-2 border-gray-300 rounded-xl mb-4 text-lg"
//           />
//         )}

//         <input
//           placeholder="Phone Number"
//           value={phone}
//           onChange={(e) => setPhone(e.target.value)}
//           className="w-full p-4 border-2 border-gray-300 rounded-xl mb-4 text-lg"
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           value={pass}
//           onChange={(e) => setPass(e.target.value)}
//           className="w-full p-4 border-2 border-gray-300 rounded-xl mb-6 text-lg"
//         />

//         <button
//           onClick={submit}
//           className="w-full bg-green-500 text-white py-5 rounded-xl font-bold text-2xl hover:bg-green-600 transition"
//         >
//           {isSignup ? "SIGN UP" : "LOGIN"}
//         </button>

//         <p className="text-center mt-6 text-gray-600">
//           {isSignup ? "Already have account?" : "New here?"}{" "}
//           <button
//             onClick={() => {
//               setIsSignup(!isSignup);
//               setError("");
//             }}
//             className="text-green-600 font-bold underline"
//           >
//             {isSignup ? "Login" : "Create Account"}
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// }

// src/app/login/page.js
// "use client";
// import { useState } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import socket from "../utils/socket.client.js";

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// export default function LoginPage() {
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [password, setPassword] = useState("");
//   const [username, setUsername] = useState("");
//   const [isSignup, setIsSignup] = useState(false);
//   const [error, setError] = useState("");
//   const router = useRouter();

//   const handleAuth = async () => {
//     setError("");
//     if (!phoneNumber || !password || (isSignup && !username)) {
//       setError("Fill all fields");
//       return;
//     }

//     try {
//       const endpoint = isSignup ? "/signup" : "/login";
//       const payload = isSignup
//         ? { username, phoneNumber, password }
//         : { phoneNumber, password };

//       const { data } = await axios.post(`${API_URL}/api/auth${endpoint}`, payload);

//       localStorage.setItem("token", data.token);
//       localStorage.setItem("username", data.username);
//       localStorage.setItem("profileImage", data.profileImage || "/default.png");

//       // CONNECT SOCKET
//       socket.auth = { token: data.token };
//       socket.connect();

//       router.push("/chat");
//     } catch (err) {
//       setError(err.response?.data?.message || "Server down. Try again.");
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-400 to-blue-600">
//       <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">
//         <h1 className="text-4xl font-bold text-center text-green-600 mb-8">
//           {isSignup ? "Join WhatsApp" : "Welcome Back"}
//         </h1>

//         {isSignup && (
//           <input
//             placeholder="Your Name"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             className="w-full p-4 border-2 border-gray-300 rounded-xl mb-4 text-lg"
//           />
//         )}

//         <input
//           placeholder="Phone Number"
//           value={phoneNumber}
//           onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
//           className="w-full p-4 border-2 border-gray-300 rounded-xl mb-4 text-lg"
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full p-4 border-2 border-gray-300 rounded-xl mb-6 text-lg"
//         />

//         {error && <p className="text-red-500 text-center font-bold mb-4">{error}</p>}

//         <button
//           onClick={handleAuth}
//           className="w-full bg-green-600 text-white py-5 rounded-xl font-bold text-2xl hover:bg-green-700 transition transform hover:scale-105"
//         >
//           {isSignup ? "CREATE ACCOUNT" : "LOGIN NOW"}
//         </button>

//         <p className="text-center mt-6 text-gray-600">
//           {isSignup ? "Already have account?" : "New user?"}{" "}
//           <button
//             onClick={() => {
//               setIsSignup(!isSignup);
//               setError("");
//             }}
//             className="text-green-600 font-bold underline"
//           >
//             {isSignup ? "Login" : "Sign Up"}
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// }




// src/app/login/page.js
// "use client";
// import { useState } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";

// const API_URL = "http://localhost:5000";

// export default function LoginPage() {
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [password, setPassword] = useState("");
//   const [username, setUsername] = useState("");
//   const [isSignup, setIsSignup] = useState(false);
//   const [error, setError] = useState("");
//   const router = useRouter();

//   const handleSubmit = async (e) => {
//     e.preventDefault(); 
//     setError("");

//     try {
//       const endpoint = isSignup ? "/signup" : "/login";
//       const payload = isSignup
//         ? { username, phoneNumber, password }
//         : { phoneNumber, password };

//       const { data } = await axios.post(`${API_URL}/api/auth${endpoint}`, payload);

//       // SAVE TOKEN
//       localStorage.setItem("token", data.token);
//       localStorage.setItem("username", data.username);

//       // FORCE REDIRECT
//       window.location.href = "/";
//     } catch (err) {
//       setError(err.response?.data?.message || "Wrong details");
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-400 to-blue-600">
//       <form onSubmit={handleSubmit} className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">
//         <h1 className="text-4xl font-bold text-center text-green-600 mb-8">
//           {isSignup ? "Join WhatsApp" : "Welcome Back"}
//         </h1>

//         {isSignup && (
//           <input
//             required
//             placeholder="Your Name"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             className="w-full p-4 border-2 border-gray-300 rounded-xl mb-4 text-lg"
//           />
//         )}

//         <input
//           required
//           placeholder="Phone Number"
//           value={phoneNumber}
//           onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
//           className="w-full p-4 border-2 border-gray-300 rounded-xl mb-4 text-lg"
//         />

//         <input
//           required
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full p-4 border-2 border-gray-300 rounded-xl mb-6 text-lg"
//         />

//         {error && <p className="text-red-500 text-center font-bold mb-4">{error}</p>}

//         <button
//           type="submit"
//           className="w-full bg-green-600 text-white py-5 rounded-xl font-bold text-2xl hover:bg-green-700 transition"
//         >
//           {isSignup ? "CREATE ACCOUNT" : "LOGIN NOW"}
//         </button>

//         <p className="text-center mt-6 text-gray-600">
//           {isSignup ? "Already have account?" : "New user?"}{" "}
//           <button
//             type="button"
//             onClick={() => setIsSignup(!isSignup)}
//             className="text-green-600 font-bold underline"
//           >
//             {isSignup ? "Login" : "Sign Up"}
//           </button>
//         </p>
//       </form>
//     </div>
//   );
// }



"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react"; // <-- 1. Import icons

const API_URL = "http://localhost:5000";

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // <-- 2. Add state
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // --- 3. ADDED VALIDATION ---
    if (phoneNumber.length !== 10) {
      return setError("Phone number must be exactly 10 digits.");
    }
    if (isSignup && password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }
    // --- END VALIDATION ---

    try {
      const endpoint = isSignup ? "/signup" : "/login";
      const payload = isSignup
        ? { username, phoneNumber, password }
        : { phoneNumber, password };

      const { data } = await axios.post(`${API_URL}/api/auth${endpoint}`, payload);

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);

      window.location.href = "/";
    } catch (err) {
      setError(err.response?.data?.message || "Wrong details");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-400 to-blue-600">
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">
        <h1 className="text-4xl font-bold text-center text-green-600 mb-8">
          {isSignup ? "Join WhatsApp" : "Welcome Back"}
        </h1>

        {isSignup && (
          <input
            required
            placeholder="Your Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-4 border-2 border-gray-300 rounded-xl mb-4 text-lg"
          />
        )}

        <input
          required
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
          className="w-full p-4 border-2 border-gray-300 rounded-xl mb-4 text-lg"
        />

        {/* --- 4. WRAPPED PASSWORD INPUT --- */}
        <div className="relative w-full mb-6">
          <input
            required
            type={showPassword ? "text" : "password"} // <-- Toggle type
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 border-2 border-gray-300 rounded-xl text-lg pr-12" // <-- Added padding-right
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-0 right-0 h-full px-4 text-gray-500"
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
        {/* --- END WRAPPER --- */}

        {error && <p className="text-red-500 text-center font-bold mb-4">{error}</p>}

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-5 rounded-xl font-bold text-2xl hover:bg-green-700 transition"
        >
          {isSignup ? "CREATE ACCOUNT" : "LOGIN NOW"}
        </button>

        <p className="text-center mt-6 text-gray-600">
          {isSignup ? "Already have account?" : "New user?"}{" "}
          <button
            type="button"
            onClick={() => setIsSignup(!isSignup)}
            className="text-green-600 font-bold underline"
          >
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </p>
      </form>
    </div>
  );
}
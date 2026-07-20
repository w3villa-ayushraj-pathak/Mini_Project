import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiEye, HiEyeOff, HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";
import { FaGoogle, FaFacebookF } from "react-icons/fa"; 
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

import { loginSuccess } from "../../redux/slices/authSlice";
import { loginUser, getProfile, socialLoginAPI } from "../../services/auth.service"; 

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuthFinalization = async (token, message) => {
    localStorage.setItem("token", token);
    const profile = await getProfile();

    dispatch(
      loginSuccess({
        token,
        user: profile.data.user,
      })
    );

    toast.success(message);
    
    if (profile.data.user.role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const loginResponse = await loginUser(formData);
      await handleAuthFinalization(loginResponse.data.token, loginResponse.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = async (providerType) => {
    try {
      // setLoading(true);
      let provider;
      
      if (providerType === "google") {
        provider = new GoogleAuthProvider();
      } else if (providerType === "facebook") {
        provider = new FacebookAuthProvider();
      }

      const result = await signInWithPopup(auth, provider);
      
      const idToken = await result.user.getIdToken();
      
      const backendResponse = await socialLoginAPI(idToken);
      
      await handleAuthFinalization(backendResponse.data.token, backendResponse.message);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || `${providerType} Authentication Failed`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-[#050505] p-4 font-sans select-none relative overflow-hidden text-zinc-100">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-teal-500/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f0f0f_1px,transparent_1px),linear-gradient(to_bottom,#0f0f0f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative w-full max-w-[440px] bg-zinc-950/40 backdrop-blur-2xl border border-zinc-800/80 p-8 sm:p-10 rounded-3xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.7)]">
        
        <div className="flex flex-col items-center mb-8">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-4">
            <svg className="w-5 h-5 text-zinc-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin='round' strokeWidth='2.5' d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-zinc-500 text-xs sm:text-sm mt-1.5 font-medium tracking-wide">
            Login to continue your learning track
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            disabled={loading}
            onClick={() => handleSocialAuth("google")}
            className="flex items-center justify-center gap-x-2 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 disabled:opacity-50 text-zinc-200 text-sm font-semibold py-3 px-4 rounded-xl transition-all cursor-pointer active:scale-[0.98]"
          >
            <FaGoogle className="text-red-400 text-base" />
            Google
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => handleSocialAuth("facebook")}
            className="flex items-center justify-center gap-x-2 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 disabled:opacity-50 text-zinc-200 text-sm font-semibold py-3 px-4 rounded-xl transition-all cursor-pointer active:scale-[0.98]"
          >
            <FaFacebookF className="text-blue-500 text-base" />
            Facebook
          </button>
        </div>

        <div className="relative flex items-center mb-6">
          <div className="flex-grow border-t border-zinc-800/80"></div>
          <span className="flex-shrink mx-4 text-zinc-600 text-xs font-bold uppercase tracking-widest">Or login with email</span>
          <div className="flex-grow border-t border-zinc-800/80"></div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-y-5">
          <div className="flex flex-col gap-y-1.5">
            <label className="text-zinc-400 text-xs font-semibold tracking-wider uppercase pl-1">
              Email Address
            </label>
            <div className="relative flex items-center group">
              <HiOutlineMail className="absolute left-4 text-zinc-500 text-lg group-focus-within:text-emerald-400 transition-colors" />
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@domain.com"
                required
                className="w-full outline-none bg-zinc-900/30 border border-zinc-800/80 text-zinc-100 pl-11 pr-4 py-3 sm:py-3.5 rounded-xl text-sm transition-all duration-200 placeholder-zinc-600 focus:border-emerald-500 focus:bg-zinc-900/60 focus:ring-4 focus:ring-emerald-500/5"
              />
            </div>
          </div>

          <div className="flex flex-col gap-y-1.5">
            <div className="flex justify-between items-center pl-1">
              <label className="text-zinc-400 text-xs font-semibold tracking-wider uppercase">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition-colors duration-150"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative flex items-center group">
              <HiOutlineLockClosed className="absolute left-4 text-zinc-500 text-lg group-focus-within:text-emerald-400 transition-colors" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full outline-none bg-zinc-900/30 border border-zinc-800/80 text-zinc-100 pl-11 pr-12 py-3 sm:py-3.5 rounded-xl text-sm transition-all duration-200 placeholder-zinc-600 focus:border-emerald-500 focus:bg-zinc-900/60 focus:ring-4 focus:ring-emerald-500/5"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-zinc-500 hover:text-zinc-300 transition-colors focus:outline-none"
              >
                {showPassword ? <HiEyeOff className="text-lg" /> : <HiEye className="text-lg" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-zinc-950 font-bold rounded-xl py-3 sm:py-3.5 text-sm sm:text-base transition-all duration-200 active:scale-[0.98] shadow-lg shadow-emerald-500/10 relative overflow-hidden flex items-center justify-center mt-2 cursor-pointer"
          >
            {loading ? "Signing In..." : "Sign In to Platform"}
          </button>
        </form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="text-center text-xs sm:text-sm text-zinc-500 mt-6"
        >
          Don't have an account?{" "}
          <Link to="/register" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
            register
          </Link>
        </motion.p>
      </div>
    </div>
  );
}

export default Login;

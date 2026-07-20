import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, HiOutlinePhone } from "react-icons/hi";
import { motion } from "framer-motion";

import { registerUser } from "../../services/auth.service";

function Register() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      toast.success(response.message);

      navigate("/check-email", {
        state: { email: formData.email }
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Registration Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-[#050505] p-4 font-sans select-none relative overflow-hidden text-zinc-100">
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-teal-500/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f0f0f_1px,transparent_1px),linear-gradient(to_bottom,#0f0f0f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative w-full max-w-[460px] bg-zinc-950/40 backdrop-blur-2xl border border-zinc-800/80 p-8 sm:p-10 rounded-3xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.7)]">
        
        <div className="flex flex-col items-center mb-6">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-4">
            <svg className="w-5 h-5 text-zinc-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin='round' strokeWidth='2.5' d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-zinc-500 text-xs sm:text-sm mt-1.5 font-medium tracking-wide">
            Start your customized learning journey today
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
          
          <div className="flex flex-col gap-y-1">
            <label className="text-zinc-400 text-xs font-semibold tracking-wider uppercase pl-1">
              Full Name
            </label>
            <div className="relative flex items-center group">
              <HiOutlineUser className="absolute left-4 text-zinc-500 text-lg group-focus-within:text-emerald-400 transition-colors" />
              <input 
                name="name"
                type="text" 
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="w-full outline-none bg-zinc-900/30 border border-zinc-800/80 text-zinc-100 pl-11 pr-4 py-2.5 sm:py-3 rounded-xl text-sm transition-all duration-200 placeholder-zinc-600 focus:border-emerald-500 focus:bg-zinc-900/60 focus:ring-4 focus:ring-emerald-500/5"
              />
            </div>
          </div>

          <div className="flex flex-col gap-y-1">
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
                className="w-full outline-none bg-zinc-900/30 border border-zinc-800/80 text-zinc-100 pl-11 pr-4 py-2.5 sm:py-3 rounded-xl text-sm transition-all duration-200 placeholder-zinc-600 focus:border-emerald-500 focus:bg-zinc-900/60 focus:ring-4 focus:ring-emerald-500/5"
              />
            </div>
          </div>

          

          <div className="flex flex-col gap-y-1">
            <label className="text-zinc-400 text-xs font-semibold tracking-wider uppercase pl-1">
              Password
            </label>
            <div className="relative flex items-center group">
              <HiOutlineLockClosed className="absolute left-4 text-zinc-500 text-lg group-focus-within:text-emerald-400 transition-colors" />
              <input 
                name="password"
                type={showPassword ? "text" : "password"} 
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full outline-none bg-zinc-900/30 border border-zinc-800/80 text-zinc-100 pl-11 pr-12 py-2.5 sm:py-3 rounded-xl text-sm transition-all duration-200 placeholder-zinc-600 focus:border-emerald-500 focus:bg-zinc-900/60 focus:ring-4 focus:ring-emerald-500/5"
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
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-zinc-950 font-bold rounded-xl py-3 mt-4 text-sm sm:text-base transition-all duration-200 active:scale-[0.98] shadow-lg shadow-emerald-500/10 flex items-center justify-center cursor-pointer font-sans"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="text-center text-xs sm:text-sm text-zinc-500 mt-6 font-medium"
        >
          Already have an account?
          <Link
            className="text-emerald-400 hover:text-emerald-300 font-bold ml-1.5 transition-colors duration-150 underline underline-offset-4 decoration-emerald-500/20 hover:decoration-emerald-400"
            to="/"
          >
            Login
          </Link>
        </motion.p>
      </div>
    </div>
  );
}

export default Register;
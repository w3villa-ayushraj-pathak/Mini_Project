import { Link, useLocation,Navigate } from "react-router-dom";
import { MdEmail } from "react-icons/md";

function CheckEmail() {
  const { state } = useLocation();

  const email=state?.email

  if(!email)
  {
    return <Navigate to='/register' replace/>
  }

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-[#050505] p-4 font-sans select-none relative overflow-hidden text-zinc-100">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-teal-500/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f0f0f_1px,transparent_1px),linear-gradient(to_bottom,#0f0f0f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative w-full max-w-[440px] bg-zinc-950/40 backdrop-blur-2xl border border-zinc-800/80 p-8 sm:p-10 rounded-3xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.7)] text-center">
        
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-500/10 to-teal-400/10 border border-emerald-500/20 flex items-center justify-center shadow-lg shadow-emerald-500/5">
            <MdEmail className="text-4xl text-emerald-400" />
          </div>
        </div>

        <div className="flex flex-col items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            Check Your Email
          </h1>
          <p className="text-zinc-500 text-xs sm:text-sm mt-2 font-medium tracking-wide max-w-xs">
            We've sent a verification link to activate your learning track account.
          </p>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-850 p-4 rounded-xl mb-8">
          <p className="text-zinc-500 text-xs font-semibold tracking-wider uppercase">
            Verification email sent to
          </p>
          <h2 className="text-base sm:text-lg font-bold text-white truncate mt-1 tracking-tight">
            {state?.email || "your register email"}
          </h2>
        </div>

        <div className="flex flex-col gap-y-4">
          <a
            href="https://mail.google.com"
            target="_blank"
            rel="noreferrer"
            className="w-full block"
          >
            <button 
              type="button"
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl py-3 text-sm sm:text-base transition-all duration-200 active:scale-[0.98] shadow-lg shadow-emerald-500/10 flex items-center justify-center cursor-pointer"
            >
              Open Gmail Inbox
            </button>
          </a>

          <Link
            to="/"
            className="text-xs sm:text-sm text-zinc-400 hover:text-emerald-400 font-semibold transition-colors duration-150 underline underline-offset-4 decoration-zinc-800 hover:decoration-emerald-400/40"
          >
            Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
}

export default CheckEmail;
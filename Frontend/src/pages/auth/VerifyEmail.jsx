import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        const token = searchParams.get("token");
        const response = await api.get(
          `/auth/verify-email?token=${token}`
        );

        toast.success(response.data.message);

        navigate("/", {
          replace: true,
          state: {
            verified: true,
            message: response.data.message
          }
        });
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Verification failed"
        );

        navigate("/", {
          replace: true
        });
      }
    };

    verify();
  }, [searchParams, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-[#050505] p-4 font-sans select-none relative overflow-hidden text-zinc-100">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-teal-500/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f0f0f_1px,transparent_1px),linear-gradient(to_bottom,#0f0f0f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative w-full max-w-[400px] bg-zinc-950/40 backdrop-blur-2xl border border-zinc-800/80 p-8 sm:p-10 rounded-3xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.7)] flex flex-col items-center text-center">
        
        <div className="relative h-16 w-16 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 border-4 border-zinc-800 rounded-full" />
          <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>

        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
          Verifying Account
        </h1>
        <p className="text-zinc-500 text-xs sm:text-sm mt-2 font-medium tracking-wide max-w-xs">
          Syncing token verification signature with the platform terminal...
        </p>
      </div>
    </div>
  );
}

export default VerifyEmail;
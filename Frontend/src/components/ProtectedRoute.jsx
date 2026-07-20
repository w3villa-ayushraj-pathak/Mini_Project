import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute({ requiredRole }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen w-full bg-[#050505] text-zinc-100 font-sans select-none relative overflow-hidden">
        <div className="relative h-12 w-12 flex items-center justify-center">
          <div className="absolute inset-0 border-4 border-zinc-800 rounded-full" />
          <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
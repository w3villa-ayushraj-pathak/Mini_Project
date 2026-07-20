import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faChartPie, 
  faUsers, 
  faUserCheck, 
  faCrown, 
  faLayerGroup, 
  faCircleXmark, 
  faIndianRupeeSign,
  faArrowRight,
  faEye,
  faUser
} from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";

import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { getDashboard } from "../../services/admin.service";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await getDashboard();
      setStats(response.data);
      setRecentUsers(response.recentUsers || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to sync administrative dashboard telemetry"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen w-full bg-[#050505] text-zinc-100 font-sans select-none relative overflow-hidden">
        <div className="relative h-12 w-12 flex items-center justify-center">
          <div className="absolute inset-0 border-4 border-zinc-800 rounded-full" />
          <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#050505] text-zinc-100 font-sans selection:bg-emerald-500/30 overflow-x-hidden relative flex flex-col">
      <div className="absolute top-0 right-1/4 w-[600px] h-[500px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[400px] h-[400px] bg-teal-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f0f0f_1px,transparent_1px),linear-gradient(to_bottom,#0f0f0f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <Navbar />

      <div className="flex flex-col md:flex-row flex-1 relative z-10 max-w-7xl w-full mx-auto">
       

        <main className="flex-1 p-6 sm:p-8 md:p-10 flex flex-col gap-y-8 overflow-hidden">
          
          <header className="border-b border-zinc-900 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-x-4 max-w-3xl">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-inner mt-1">
                <FontAwesomeIcon icon={faChartPie} className="text-sm" />
              </div>
              
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                  Admin Console
                </h1>
                <p className="text-zinc-500 text-xs sm:text-sm mt-1 font-medium tracking-wide leading-relaxed">
                  System telemetry matrix status overview, revenue logs, and vector subscription allocations.
                </p>
              </div>
            </div>

            <div className="sm:pl-0 pl-14">
              <Link
                to="/admin/dashboard/lms"
                className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-zinc-950 px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide transition-all whitespace-nowrap shadow-lg shadow-emerald-600/10"
              >
                LMS Management
              </Link>
            </div>
          </header>


          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            
            <div className="col-span-2 bg-gradient-to-br from-zinc-950 via-zinc-950 to-emerald-950/20 backdrop-blur-md border border-emerald-500/20 p-5 rounded-3xl shadow-2xl flex items-center justify-between gap-x-4">
              <div className="flex flex-col gap-y-0.5">
                <span className="text-emerald-400 text-xs font-bold tracking-wider uppercase">Gross Revenue Balance</span>
                <span className="text-white text-2xl sm:text-3xl font-black tracking-tight mt-1">
                  ₹{stats?.totalRevenue?.toLocaleString() || "0"}
                </span>
              </div>
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <FontAwesomeIcon icon={faIndianRupeeSign} className="text-base" />
              </div>
            </div>

            <div className="bg-zinc-950/40 backdrop-blur-md border border-zinc-800/80 p-5 rounded-3xl shadow-xl flex items-center justify-between gap-x-4">
              <div className="flex flex-col gap-y-0.5">
                <span className="text-zinc-500 text-xs font-bold tracking-wider uppercase">Total Learners</span>
                <span className="text-white text-2xl font-black tracking-tight mt-1">
                  {stats?.totalUsers || "0"}
                </span>
              </div>
              <div className="h-11 w-11 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 flex items-center justify-center shrink-0">
                <FontAwesomeIcon icon={faUsers} className="text-sm" />
              </div>
            </div>

            <div className="bg-zinc-950/40 backdrop-blur-md border border-zinc-800/80 p-5 rounded-3xl shadow-xl flex items-center justify-between gap-x-4">
              <div className="flex flex-col gap-y-0.5">
                <span className="text-zinc-500 text-xs font-bold tracking-wider uppercase">Verified Signatures</span>
                <span className="text-white text-2xl font-black tracking-tight mt-1">
                  {stats?.verifiedUsers || "0"}
                </span>
              </div>
              <div className="h-11 w-11 rounded-xl bg-zinc-900 border border-zinc-800 text-teal-400 flex items-center justify-center shrink-0">
                <FontAwesomeIcon icon={faUserCheck} className="text-sm" />
              </div>
            </div>

          </section>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8 items-start">
            
            <section className="lg:col-span-2 bg-zinc-950/40 backdrop-blur-md border border-zinc-800/80 rounded-3xl p-6 shadow-2xl flex flex-col gap-y-5">
              <div className="flex items-center gap-x-2 border-b border-zinc-900 pb-4">
                <FontAwesomeIcon icon={faCrown} className="text-emerald-400 text-xs" />
                <h3 className="text-white font-bold text-sm tracking-tight">Tier Volume Allocation</h3>
              </div>

              <div className="flex flex-col gap-y-3">
                {[
                  { label: "Gold Plan Cohort", value: stats?.goldUsers, style: "from-amber-500 to-yellow-400" },
                  { label: "Silver Plan Cohort", value: stats?.silverUsers, style: "from-zinc-400 to-zinc-350" },
                  { label: "Free Access Volume", value: stats?.freeUsers, style: "from-emerald-500 to-teal-400" }
                ].map((tier, idx) => (
                  <div key={idx} className="bg-zinc-900/40 border border-zinc-850 p-3 rounded-xl flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-zinc-400 font-medium">{tier.label}</span>
                    <span className="text-zinc-100 font-bold bg-zinc-950 px-2.5 py-0.5 rounded border border-zinc-850 text-xs">{tier.value || 0}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 mt-1 pt-4 border-t border-zinc-900/60">
                <div className="bg-zinc-900/40 border border-zinc-850 p-3 rounded-xl flex flex-col">
                  <span className="text-[10px] text-zinc-500 font-bold tracking-wider uppercase flex items-center gap-x-1">
                    <FontAwesomeIcon icon={faLayerGroup} className="text-emerald-400 text-[9px]" /> Active
                  </span>
                  <span className="text-white font-black text-lg mt-0.5">{stats?.activePlans || 0}</span>
                </div>
                <div className="bg-zinc-900/40 border border-zinc-850 p-3 rounded-xl flex flex-col">
                  <span className="text-[10px] text-zinc-500 font-bold tracking-wider uppercase flex items-center gap-x-1">
                    <FontAwesomeIcon icon={faCircleXmark} className="text-rose-400 text-[9px]" /> Expired
                  </span>
                  <span className="text-white font-black text-lg mt-0.5">{stats?.expiredPlans || 0}</span>
                </div>
              </div>
            </section>

            <section className="lg:col-span-3 flex flex-col gap-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold tracking-tight text-white flex items-center gap-x-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Recent System Registration Feeds</span>
                </h2>
                <Link 
                  to="/admin/users" 
                  className="group inline-flex items-center gap-x-1.5 text-xs font-bold tracking-wider text-emerald-400 hover:text-emerald-300 transition-colors uppercase"
                >
                  <span>Manage Users</span>
                  <FontAwesomeIcon icon={faArrowRight} className="text-[10px] group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              <div className="flex flex-col gap-y-3">
                {recentUsers.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-zinc-850 bg-zinc-900/10 rounded-2xl text-zinc-500 text-xs font-medium">
                    No account registration telemetry discovered.
                  </div>
                ) : (
                  recentUsers.map((user) => (
                    <div 
                      key={user._id}
                      className="group bg-zinc-900/30 backdrop-blur-md border border-zinc-800/80 hover:border-zinc-750 p-4 rounded-xl flex items-center justify-between gap-4 transition-all duration-150"
                    >
                      <div className="flex items-center gap-x-3.5 min-w-0">
                        <div className="h-9 w-9 bg-zinc-950 border border-zinc-850 rounded-xl flex items-center justify-center text-zinc-500 shrink-0">
                          <FontAwesomeIcon icon={faUser} className="text-xs" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <h4 className="text-white font-bold text-sm tracking-tight truncate group-hover:text-emerald-400 transition-colors">
                            {user.name}
                          </h4>
                          <div className="flex items-center gap-x-2 text-[11px] text-zinc-500 font-mono mt-0.5 truncate">
                            <span>{user.email}</span>
                            <span>•</span>
                            <span className={user.isEmailVerified ? "text-emerald-500/80 font-sans font-semibold" : "text-amber-500/80 font-sans font-semibold"}>
                              {user.isEmailVerified ? "Verified" : "Unverified"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-x-3 shrink-0">
                        <span className="text-[10px] font-bold tracking-wider uppercase bg-zinc-950 border border-zinc-850 px-2 py-0.5 rounded text-zinc-400">
                          {user.role || "user"}
                        </span>
                        <Link 
                          to={`/admin/users/${user._id}`}
                          className="h-8 w-8 rounded-lg bg-zinc-950 border border-zinc-850 text-zinc-500 hover:text-white hover:bg-zinc-900 flex items-center justify-center text-xs transition-colors shadow-inner"
                          title="View Node Configurations"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </Link>
                      </div>

                    </div>
                  ))
                )}
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
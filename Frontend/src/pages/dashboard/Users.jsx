import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUsers, 
  faMagnifyingGlass, 
  faEye, 
  faChevronLeft, 
  faChevronRight, 
  faUserShield, 
  faUser,
  faFilter,
  faCrown,
  faCheckCircle,
  faTimesCircle
} from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";

import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { getAllUsers } from "../../services/admin.service";

function Users() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [plan, setPlan] = useState("");
  const [verified, setVerified] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      fetchUsers();
    }, 500);

    return () => clearTimeout(timer);
  }, [page, search, status, plan, verified]);

  const fetchUsers = async () => {
    console.log(page,
        10,
        search,
        status,
        plan,
        verified)
    try {
      const response = await getAllUsers(
        page,
        10,
        search,
        status,
        plan,
        verified
      );
      console.log(response )
      setUsers(response.data.users || []);
      setPagination(response.data.pagination || {});
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to sync platform telemetry catalog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] text-zinc-100 font-sans selection:bg-emerald-500/30 overflow-x-hidden relative flex flex-col">
      <div className="absolute top-0 right-1/4 w-[600px] h-[500px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f0f0f_1px,transparent_1px),linear-gradient(to_bottom,#0f0f0f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <Navbar />

      <div className="flex flex-col md:flex-row flex-1 relative z-10 max-w-7xl w-full mx-auto">
        

        <main className="flex-1 p-6 sm:p-8 md:p-10 flex flex-col gap-y-6 overflow-hidden">
          
            <Link 
              to="/admin/dashboard"
              className="inline-flex items-center gap-x-2 text-zinc-500 hover:text-emerald-400 text-xs font-bold tracking-wider uppercase mb-4 transition-colors"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
              <span>Back to Dashboard </span>
            </Link>

          <header className="border-b border-zinc-900 pb-6 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
            <div className="flex items-center gap-x-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-inner">
                <FontAwesomeIcon icon={faUsers} className="text-sm" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                  User Cluster Directories
                </h1>
                <p className="text-zinc-500 text-xs sm:text-sm mt-0.5 font-medium tracking-wide">
                  Evaluate real-time account parameters, membership indexes, and lifecycle verification.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
              <div className="relative flex items-center min-w-[200px] flex-1 sm:flex-initial group">
                <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3.5 text-zinc-500 text-xs group-focus-within:text-emerald-400 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Query parameters..." 
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="w-full outline-none bg-zinc-950/40 border border-zinc-800 text-white pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm transition-all placeholder-zinc-600 focus:border-emerald-500 focus:bg-zinc-900/40"
                />
              </div>

              <div className="relative flex items-center flex-1 sm:flex-initial">
                <select
                  value={status}
                  onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                  className="w-full appearance-none outline-none bg-zinc-950/40 border border-zinc-800 text-zinc-300 pl-4 pr-9 py-2 rounded-xl text-xs sm:text-sm focus:border-emerald-500 focus:bg-zinc-900/40 cursor-pointer"
                >
                  <option value="" className="bg-zinc-950 text-zinc-400">Plan Status</option>
                  <option value="Active" className="bg-zinc-950 text-zinc-100">Active</option>
                  <option value="Expired" className="bg-zinc-950 text-amber-400 font-bold">Expired</option>
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-zinc-500 text-[10px]">
                  <FontAwesomeIcon icon={faFilter} />
                </div>
              </div>

              <div className="relative flex items-center flex-1 sm:flex-initial">
                <select
                  value={plan}
                  onChange={(e) => { setPlan(e.target.value); setPage(1); }}
                  className="w-full appearance-none outline-none bg-zinc-950/40 border border-zinc-800 text-zinc-300 pl-4 pr-9 py-2 rounded-xl text-xs sm:text-sm focus:border-emerald-500 focus:bg-zinc-900/40 cursor-pointer"
                >
                  <option value="" className="bg-zinc-950 text-zinc-400">All Bundles</option>
                  <option value="FREE" className="bg-zinc-950 text-zinc-100">FREE Access</option>
                  <option value="SILVER" className="bg-zinc-950 text-zinc-100">SILVER Access</option>
                  <option value="GOLD" className="bg-zinc-950 text-emerald-400 font-bold">GOLD Subscription</option>
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-zinc-500 text-[10px]">
                  <FontAwesomeIcon icon={faFilter} />
                </div>
              </div>

              <div className="relative flex items-center flex-1 sm:flex-initial">
                <select
                  value={verified}
                  onChange={(e) => { setVerified(e.target.value); setPage(1); }}
                  className="w-full appearance-none outline-none bg-zinc-950/40 border border-zinc-800 text-zinc-300 pl-4 pr-9 py-2 rounded-xl text-xs sm:text-sm focus:border-emerald-500 focus:bg-zinc-900/40 cursor-pointer"
                >
                  <option value="null" className="bg-zinc-950 text-zinc-400">All Signatures</option>
                  <option value="true" className="bg-zinc-950 text-emerald-400 font-semibold">Verified Signatures</option>
                  <option value="false" className="bg-zinc-950 text-amber-500">Unverified Logs</option>
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-zinc-500 text-[10px]">
                  <FontAwesomeIcon icon={faFilter} />
                </div>
              </div>
            </div>
          </header>

          <section className="flex-1 w-full min-h-[400px] relative">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative h-10 w-10 flex items-center justify-center">
                  <div className="absolute inset-0 border-4 border-zinc-800 rounded-full" />
                  <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                </div>
              </div>
            ) : users.length === 0 ? (
              <div className="w-full text-center py-20 border border-dashed border-zinc-850 rounded-3xl bg-zinc-900/10 backdrop-blur-sm">
                <p className="text-zinc-500 text-sm font-medium">No database accounts resolved within filtered bounds.</p>
                <p className="text-zinc-600 text-xs mt-1">Calibrate input search or filter criteria arrays above.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {users.map((user) => {
                  const isAdmin = user.role?.toLowerCase() === "admin";
                  
                  return (
                    <div 
                      key={user._id}
                      className="group bg-zinc-950/40 backdrop-blur-md border border-zinc-800/85 hover:border-zinc-750 p-5 rounded-2xl shadow-xl flex flex-col justify-between gap-y-4 transition-all duration-200"
                    >
                      <div className="flex items-start gap-x-3.5">
                        <div className={`h-10 w-10 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${
                          isAdmin 
                            ? "text-amber-400 bg-amber-500/5 border-amber-500/10" 
                            : "text-zinc-400 bg-zinc-900 border-zinc-800"
                        }`}>
                          <FontAwesomeIcon icon={isAdmin ? faUserShield : faUser} className="text-sm" />
                        </div>
                        
                        <div className="flex flex-col min-w-0">
                          <h3 className="text-white font-bold text-sm sm:text-base tracking-tight truncate group-hover:text-emerald-300 transition-colors duration-150">
                            {user.name}
                          </h3>
                          <p className="text-zinc-500 text-xs truncate mt-0.5 font-mono">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-y-3 pt-3 border-t border-zinc-900/60 mt-1">
                        
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded border ${
                            user.currentPlan?.planType === "GOLD" 
                              ? "bg-amber-500/5 text-amber-400 border-amber-500/10"
                              : "bg-zinc-900 text-zinc-400 border-zinc-850"
                          }`}>
                            <FontAwesomeIcon icon={faCrown} className="mr-1 text-[8px]" />
                            {user.currentPlan?.planType || "NONE"}
                          </span>

                          <span className={`inline-flex items-center gap-x-1 text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded border ${
                            user.isEmailVerified
                              ? "bg-emerald-500/5 text-emerald-400 border-emerald-500/10"
                              : "bg-zinc-900/80 text-zinc-500 border-zinc-850"
                          }`}>
                            <FontAwesomeIcon icon={user.isEmailVerified ? faCheckCircle : faTimesCircle} className="text-[9px]" />
                            {user.isEmailVerified ? "Verified" : "Unverified"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className={`text-[10px] font-bold tracking-wider uppercase ${isAdmin ? "text-amber-400" : "text-zinc-500"}`}>
                            {user.role || "user"}
                          </span>
                          
                          <Link 
                            to={`/admin/users/${user._id}`}
                            className="inline-flex items-center gap-x-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors shadow-inner"
                          >
                            <FontAwesomeIcon icon={faEye} className="text-[10px]" />
                            <span>View Node</span>
                          </Link>
                        </div>

                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <footer className="flex items-center justify-between border-t border-zinc-900 pt-6 mt-4">
            <span className="text-xs font-semibold text-zinc-500 tracking-wide">
              Page Node Frame: {page} / {pagination.totalPages || 1}
            </span>
            
            <div className="flex items-center gap-x-2">
              <button 
                type="button"
                disabled={page === 1 || loading}
                onClick={() => setPage(page - 1)}
                className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 disabled:opacity-20 h-9 px-3 flex items-center justify-center rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed active:scale-95 text-xs font-bold gap-x-1 shadow-md"
              >
                <FontAwesomeIcon icon={faChevronLeft} />
                <span>Previous</span>
              </button>
              <button 
                type="button"
                disabled={page === pagination.totalPages || users.length === 0 || loading}
                onClick={() => setPage(page + 1)}
                className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 disabled:opacity-20 h-9 px-3 flex items-center justify-center rounded-xl transition-all cursor-pointer disabled:cursor-not-allowed active:scale-95 text-xs font-bold gap-x-1 shadow-md"
              >
                <span>Next</span>
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          </footer>

        </main>
      </div>
    </div>
  );
}

export default Users;
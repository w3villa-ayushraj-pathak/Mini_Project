import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUser, faEnvelope, faPhone, faShieldHalved, faCheckCircle, 
  faTimesCircle, faCrown, faCalendarDays, faAddressCard, 
  faCreditCard, faHistory, faChevronLeft, faInfoCircle, faMapMarkerAlt
} from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";

import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { getUserDetails } from "../../services/admin.service";

function UserDetails() {
  const { userId } = useParams();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [planHistory, setPlanHistory] = useState([]);

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await getUserDetails(userId);
      setUser(response.data.user);
      setPaymentHistory(response.data.paymentHistory || []);
      setPlanHistory(response.data.planHistory || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load complete user matrix");
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

  if (!user) {
    return (
      <div className="min-h-screen w-full bg-[#050505] text-zinc-100 font-sans flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold">User session signature not resolved</h2>
        <Link to="/admin/users" className="text-emerald-400 text-sm mt-2 hover:underline">Return to Management Hub</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#050505] text-zinc-100 font-sans selection:bg-emerald-500/30 overflow-x-hidden relative flex flex-col">
      <div className="absolute top-0 right-1/4 w-[600px] h-[500px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f0f0f_1px,transparent_1px),linear-gradient(to_bottom,#0f0f0f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <Navbar />

      <div className="flex flex-col md:flex-row flex-1 relative z-10 max-w-7xl w-full mx-auto">

        <main className="flex-1 p-6 sm:p-8 md:p-10 flex flex-col gap-y-8 overflow-hidden">
          
          <header className="border-b border-zinc-900 pb-6">
            <Link 
              to="/admin/users"
              className="inline-flex items-center gap-x-2 text-zinc-500 hover:text-emerald-400 text-xs font-bold tracking-wider uppercase mb-4 transition-colors"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
              <span>Back to Users Cluster</span>
            </Link>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-x-3">
                <div className="h-14 w-14 rounded-full bg-zinc-900 border-2 border-zinc-800 flex items-center justify-center text-zinc-400 text-xl font-bold shrink-0 shadow-inner">
                  {user.name ? user.name.charAt(0).toUpperCase() : <FontAwesomeIcon icon={faUser} />}
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">{user.name}</h1>
                  <p className="text-zinc-500 text-xs font-mono mt-0.5">{user.email}</p>
                </div>
              </div>

              <div className="bg-zinc-900/60 border border-zinc-800 p-3 rounded-2xl flex items-center gap-x-3 self-start sm:self-center">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <FontAwesomeIcon icon={faCrown} className="text-xs" />
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Active Configuration Plan</p>
                  <p className="text-sm font-bold text-white uppercase mt-0.5">{user.currentPlan?.planType || "NONE"}</p>
                </div>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8 items-start">
            
            <section className="lg:col-span-3 flex flex-col gap-y-6 bg-zinc-950/40 backdrop-blur-md border border-zinc-800/80 rounded-3xl p-6 shadow-2xl">
              <h3 className="text-white font-bold text-sm tracking-wide flex items-center gap-x-2 border-b border-zinc-900 pb-3">
                <FontAwesomeIcon icon={faInfoCircle} className="text-emerald-400 text-xs" />
                <span>Account Telemetry Parameters</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  { label: "Phone Connection", val: user.phone || "Not Cataloged", icon: faPhone },
                  { label: "Access Privilege Authority", val: user.role, icon: faShieldHalved },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-x-3 bg-zinc-900/20 border border-zinc-850/60 p-3 rounded-xl">
                    <div className="h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 shrink-0">
                      <FontAwesomeIcon icon={item.icon} className="text-xs" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{item.label}</span>
                      <span className="text-zinc-300 text-sm font-semibold truncate mt-0.5">{item.val}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-x-3 bg-zinc-900/30 border border-zinc-850 p-4 rounded-xl">
                <div className={`h-9 w-9 rounded-xl border flex items-center justify-center shrink-0 ${
                  user.isEmailVerified ? "text-emerald-400 bg-emerald-500/5 border-emerald-500/10" : "text-amber-400 bg-amber-500/5 border-amber-500/10"
                }`}>
                  <FontAwesomeIcon icon={user.isEmailVerified ? faCheckCircle : faTimesCircle} className="text-sm" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Email Verification Lifecycle</span>
                  <span className={`text-sm font-bold mt-0.5 ${user.isEmailVerified ? "text-emerald-400" : "text-amber-400"}`}>
                    {user.isEmailVerified ? "Verified Framework Signature" : "Pending Activation Link"}
                  </span>
                </div>
              </div>

              {user.bio && (
                <div className="bg-zinc-900/20 border border-zinc-850/60 p-4 rounded-xl flex flex-col gap-y-1">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Learner Bio Summary</span>
                  <p className="text-zinc-400 text-sm leading-relaxed font-medium mt-0.5">{user.bio}</p>
                </div>
              )}
            </section>

            <section className="lg:col-span-2 bg-zinc-950/40 backdrop-blur-md border border-zinc-800/80 rounded-3xl p-6 shadow-2xl flex flex-col gap-y-5">
              <h3 className="text-white font-bold text-sm tracking-wide flex items-center gap-x-2 border-b border-zinc-900 pb-3">
                <FontAwesomeIcon icon={faAddressCard} className="text-emerald-400 text-xs" />
                <span>Geographic Target Metadata</span>
              </h3>

              {user.address?.fullAddress || user.address?.city ? (
                <div className="flex flex-col gap-y-4 text-xs sm:text-sm font-medium">
                  <div className="flex items-start gap-x-2.5">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-zinc-600 text-sm mt-0.5 shrink-0" />
                    <p className="text-zinc-300 leading-relaxed">{user.address.fullAddress || "No full address entry"}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-zinc-900/60 text-zinc-400">
                    <div className="flex flex-col"><span className="text-[10px] text-zinc-600 font-bold uppercase">City</span><span className="text-zinc-300 mt-0.5 truncate">{user.address.city || "—"}</span></div>
                    <div className="flex flex-col"><span className="text-[10px] text-zinc-600 font-bold uppercase">State</span><span className="text-zinc-300 mt-0.5 truncate">{user.address.state || "—"}</span></div>
                    <div className="flex flex-col"><span className="text-[10px] text-zinc-600 font-bold uppercase">Postal Code</span><span className="text-zinc-300 mt-0.5 font-mono">{user.address.postalCode || "—"}</span></div>
                    <div className="flex flex-col"><span className="text-[10px] text-zinc-600 font-bold uppercase">Country</span><span className="text-zinc-300 mt-0.5 truncate">{user.address.country || "—"}</span></div>
                  </div>
                </div>
              ) : (
                <p className="text-zinc-600 text-xs italic py-4">No regional destination entries registered for this node summary.</p>
              )}
            </section>
          </div>

          <section className="bg-zinc-950/40 backdrop-blur-md border border-zinc-800/80 rounded-3xl p-6 shadow-2xl flex flex-col gap-y-5">
            <h3 className="text-white font-bold text-sm tracking-wide flex items-center gap-x-2 border-b border-zinc-900 pb-3">
              <FontAwesomeIcon icon={faCalendarDays} className="text-emerald-400 text-xs" />
              <span>Active Subscription Lifespan Vectors</span>
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-zinc-900/40 border border-zinc-850 p-3.5 rounded-xl flex flex-col">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Active Tier</span>
                <span className="text-white text-base font-bold mt-1 uppercase tracking-wide text-emerald-400">{user.currentPlan?.planType || "NONE"}</span>
              </div>
              <div className="bg-zinc-900/40 border border-zinc-850 p-3.5 rounded-xl flex flex-col">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Status Index</span>
                <span className={`text-base font-bold mt-1 uppercase tracking-wide ${user.currentPlan?.status === "ACTIVE" ? "text-emerald-400" : "text-zinc-400"}`}>{user.currentPlan?.status || "INACTIVE"}</span>
              </div>
              <div className="bg-zinc-900/40 border border-zinc-850 p-3.5 rounded-xl flex flex-col">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Start Sequence</span>
                <span className="text-zinc-300 text-xs sm:text-sm font-semibold mt-1">{user.currentPlan?.startsAt ? new Date(user.currentPlan.startsAt).toLocaleDateString() : "—"}</span>
              </div>
              <div className="bg-zinc-900/40 border border-zinc-850 p-3.5 rounded-xl flex flex-col">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Expiration Bound</span>
                <span className="text-zinc-300 text-xs sm:text-sm font-semibold mt-1">{user.currentPlan?.expiresAt ? new Date(user.currentPlan.expiresAt).toLocaleDateString() : "—"}</span>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            
            <section className="flex flex-col gap-y-4">
              <h3 className="text-white font-bold text-base tracking-tight flex items-center gap-x-2">
                <FontAwesomeIcon icon={faCreditCard} className="text-emerald-400 text-sm" />
                <span>Financial Transactions Ledger</span>
              </h3>
              
              <div className="w-full bg-zinc-950/40 backdrop-blur-md border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-zinc-900 bg-zinc-900/30 text-zinc-500 font-bold tracking-wider uppercase text-[10px]">
                        <th className="px-4 py-3">Plan / ID</th>
                        <th className="px-4 py-3">Cost Vector</th>
                        <th className="px-4 py-3 text-right">Gateway State</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900/60 font-medium text-zinc-300">
                      {paymentHistory.length === 0 ? (
                        <tr>
                          <td colSpan="3" className="px-4 py-8 text-center text-zinc-600 text-xs">No transaction receipts logged.</td>
                        </tr>
                      ) : (
                        paymentHistory.map((payment) => (
                          <tr key={payment._id} className="hover:bg-zinc-900/20 transition-colors">
                            <td className="px-4 py-3.5">
                              <div className="flex flex-col">
                                <span className="text-white font-bold uppercase text-xs tracking-wide">{payment.planType}</span>
                                <span className="text-[10px] text-zinc-600 font-mono mt-0.5 max-w-[150px] truncate">{payment.razorpayPaymentId || "—"}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3.5">
                              <div className="flex flex-col">
                                <span className="text-zinc-200 font-bold">₹{payment.amount}</span>
                                <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider mt-0.5">{payment.paymentMethod || "UNKNOWN"}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3.5 text-right whitespace-nowrap">
                              <span className={`text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded border ${
                                payment.status === "captured" || payment.status === "success"
                                  ? "bg-emerald-500/5 text-emerald-400 border-emerald-500/10"
                                  : "bg-zinc-900 text-zinc-500 border-zinc-850"
                              }`}>
                                {payment.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section className="flex flex-col gap-y-4">
              <h3 className="text-white font-bold text-base tracking-tight flex items-center gap-x-2">
                <FontAwesomeIcon icon={faHistory} className="text-emerald-400 text-sm" />
                <span>Plan Subscription History Matrix</span>
              </h3>
              
              <div className="w-full bg-zinc-950/40 backdrop-blur-md border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-zinc-900 bg-zinc-900/30 text-zinc-500 font-bold tracking-wider uppercase text-[10px]">
                        <th className="px-4 py-3">Plan Node</th>
                        <th className="px-4 py-3">Active Lifespan Range</th>
                        <th className="px-4 py-3 text-right">Lifecycle</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900/60 font-medium text-zinc-300">
                      {planHistory.length === 0 ? (
                        <tr>
                          <td colSpan="3" className="px-4 py-8 text-center text-zinc-600 text-xs">No configuration state changes documented.</td>
                        </tr>
                      ) : (
                        planHistory.map((plan) => (
                          <tr key={plan._id} className="hover:bg-zinc-900/20 transition-colors">
                            <td className="px-4 py-3.5 whitespace-nowrap">
                              <span className="text-white font-bold uppercase text-xs tracking-wide">{plan.planType}</span>
                            </td>
                            <td className="px-4 py-3.5 text-zinc-400 text-xs">
                              <div className="flex flex-col gap-y-0.5 font-sans">
                                <div><span className="text-[9px] uppercase text-zinc-600 font-bold mr-1">In:</span>{new Date(plan.startsAt).toLocaleDateString()}</div>
                                <div><span className="text-[9px] uppercase text-zinc-600 font-bold mr-1">Out:</span>{new Date(plan.expiresAt).toLocaleDateString()}</div>
                              </div>
                            </td>
                            <td className="px-4 py-3.5 text-right whitespace-nowrap">
                              <span className={`text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded border ${
                                plan.status === "ACTIVE"
                                  ? "bg-emerald-500/5 text-emerald-400 border-emerald-500/10"
                                  : "bg-zinc-900 text-zinc-500 border-zinc-850"
                              }`}>
                                {plan.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
}

export default UserDetails;
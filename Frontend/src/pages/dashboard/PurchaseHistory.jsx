import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faHistory, 
  faReceipt, 
  faCircleCheck, 
  faCircleXmark, 
  faSpinner, 
  faCreditCard, 
  faHashtag, 
  faCalendarDays 
} from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";

import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { getPaymentHistory } from "../../services/payment.service";

function PurchaseHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await getPaymentHistory();
      setPayments(response.data.payments);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load payment history"
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
        <Sidebar />

        <main className="flex-1 p-6 sm:p-8 md:p-10 flex flex-col gap-y-8 overflow-hidden">
          
          <header className="border-b border-zinc-900 pb-6 flex items-center gap-x-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-inner">
              <FontAwesomeIcon icon={faHistory} className="text-sm" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                Billing & Purchases
              </h1>
              <p className="text-zinc-500 text-xs sm:text-sm mt-0.5 font-medium tracking-wide">
                Review payment log history indexes, invoice details, and secure transaction receipts.
              </p>
            </div>
          </header>

          <section className="w-full">
            {payments.length === 0 ? (
              <div className="w-full text-center py-20 border border-dashed border-zinc-800 rounded-3xl bg-zinc-900/10 backdrop-blur-sm">
                <div className="h-12 w-12 mx-auto rounded-2xl bg-zinc-900 border border-zinc-850 flex items-center justify-center text-zinc-500 mb-4">
                  <FontAwesomeIcon icon={faReceipt} className="text-base" />
                </div>
                <p className="text-zinc-400 text-sm sm:text-base font-medium">No purchase transactions cataloged on this account.</p>
                <p className="text-zinc-600 text-xs mt-1">Subscriptions will log automated entries here upon node checkout confirmation.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-y-4">
                {payments.map((payment) => {
                  const isSuccess = payment.status?.toLowerCase() === "captured" || payment.status?.toLowerCase() === "success";

                  return (
                    <div 
                      key={payment._id}
                      className="group bg-zinc-950/40 backdrop-blur-md border border-zinc-800/80 hover:border-zinc-700/60 p-5 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-200"
                    >
                      
                      <div className="flex items-start gap-x-4">
                        <div className={`h-11 w-11 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${
                          isSuccess 
                            ? "text-emerald-400 bg-emerald-500/5 border-emerald-500/10" 
                            : "text-rose-400 bg-rose-500/5 border-rose-500/10"
                        }`}>
                          <FontAwesomeIcon icon={isSuccess ? faCircleCheck : faCircleXmark} className="text-base" />
                        </div>
                        
                        <div className="flex flex-col min-w-0">
                          <h3 className="text-white font-bold text-base tracking-tight truncate group-hover:text-emerald-300 transition-colors">
                            {payment.planName || "Premium Tracks Bundle"}
                          </h3>
                          
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2 text-zinc-500 text-xs font-medium">
                            <div className="flex items-center gap-x-1.5">
                              <FontAwesomeIcon icon={faCalendarDays} className="text-zinc-600 text-[11px]" />
                              <span>{new Date(payment.createdAt).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-x-1.5 min-w-0">
                              <FontAwesomeIcon icon={faHashtag} className="text-zinc-600 text-[10px]" />
                              <span className="truncate max-w-[160px] sm:max-w-none">ID: {(payment.razorpayPaymentId)?payment.razorpayPaymentId.slice(4):''}</span>
                            </div>
                            {payment.paymentMethod && (
                              <div className="flex items-center gap-x-1.5 uppercase tracking-wide text-[10px] bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800/80">
                                <FontAwesomeIcon icon={faCreditCard} className="text-zinc-600 text-[10px]" />
                                <span>{payment.paymentMethod}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="w-full sm:w-auto flex sm:flex-col justify-between sm:justify-center items-center sm:items-end border-t sm:border-t-0 border-zinc-900 pt-3 sm:pt-0 shrink-0 gap-y-1">
                        <span className="text-white font-black text-xl tracking-tight">
                          ₹{payment.amount}
                        </span>
                        <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded border ${
                          isSuccess
                            ? "bg-emerald-500/5 text-emerald-400 border-emerald-500/10"
                            : "bg-rose-500/5 text-rose-400 border-rose-500/10"
                        }`}>
                          {payment.status || "Pending"}
                        </span>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </section>

        </main>
      </div>
    </div>
  );
}

export default PurchaseHistory;
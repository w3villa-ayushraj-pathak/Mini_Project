import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faTags, 
  faCheck, 
  faCreditCard, 
  faCalendarDays, 
  faCrown 
} from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";

import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { getPlans, createOrder, verifyPayment } from "../../services/payment.service";
import { getProfile } from "../../services/profile.service";

function Pricing() {
  const [plans, setPlans] = useState([[]]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchPlans();
    fetchProfile();
  }, []);

  

  const fetchPlans = async () => {
    try {
      const response = await getPlans();
      setPlans(Object.values(response.data));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load plans");
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await getProfile();
      setUser(response.data.user);
    } catch (error) {}
  };

  const buyPlan = async (planId) => {
    console.log(planId)
    try {
      const order = await createOrder(planId);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: order.data.amount,
        currency: order.data.currency,
        name: "Learning Track",
        description: "Subscription Plan Access",
        order_id: order.data.orderId,
        handler: async function (response) {
          try {
            const verify = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            toast.success(verify.message || "Payment Successful");
            fetchProfile();
          } catch (error) {
            toast.error(error.response?.data?.message || "Payment verification failed");
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: {
          color: "#10b981", 
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error(error.response?.data?.message || "Order creation failed");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] text-zinc-100 font-sans selection:bg-emerald-500/30 overflow-x-hidden relative flex flex-col">
   
      <div className="absolute top-0 right-1/4 w-[600px] h-[500px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[400px] h-[400px] bg-teal-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f0f0f_1px,transparent_1px),linear-gradient(to_bottom,#0f0f0f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <Navbar />

      <div className="flex flex-col md:flex-row flex-1 relative z-10 max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-6 sm:p-8 md:p-10 flex flex-col gap-y-8 overflow-hidden">
          
          <header className="border-b border-zinc-900 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-x-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-inner">
                <FontAwesomeIcon icon={faTags} className="text-sm" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                  Pricing Plans
                </h1>
                <p className="text-zinc-500 text-xs sm:text-sm mt-0.5 font-medium tracking-wide">
                  Choose a premium roadmap vector tailored to accelerate your mastery pipeline.
                </p>
              </div>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800 p-3 rounded-2xl flex items-center gap-x-3 shrink-0 self-start sm:self-center">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <FontAwesomeIcon icon={faCrown} className="text-xs" />
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Current Account Plan</p>
                <p className="text-sm font-bold text-white uppercase tracking-wide mt-0.5">
                  {user?.currentPlan?.planType || "Free Access"}
                </p>
              </div>
            </div>
          </header>

          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
            {plans[0].map((plan) => {
              const isCurrentPlan = user?.currentPlan?.planType?.toLowerCase() === plan.name?.toLowerCase();

              return (
                <div 
                  key={plan._id}
                  className={`group relative bg-zinc-950/40 backdrop-blur-md border rounded-3xl p-6 sm:p-8 shadow-2xl transition-all duration-300 flex flex-col justify-between min-h-[380px] ${
                    isCurrentPlan 
                      ? "border-emerald-500/50 shadow-[0_0_30px_-12px_rgba(16,185,129,0.2)]" 
                      : "border-zinc-800/80 hover:border-zinc-700/60 hover:-translate-y-1"
                  }`}
                >
                  {isCurrentPlan && (
                    <span className="absolute -top-3 left-6 text-[10px] font-black tracking-wider uppercase bg-emerald-500 text-zinc-950 px-2.5 py-0.5 rounded-md shadow-md">
                      Active Plan
                    </span>
                  )}

                  <div className="flex flex-col gap-y-4">
                    <div>
                      <h3 className="text-zinc-400 font-bold text-xs uppercase tracking-widest">
                        {plan.name}
                      </h3>
                      <div className="flex items-baseline gap-x-1.5 mt-2">
                        <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                          ₹{plan.price}
                        </span>
                        <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                          / bundle
                        </span>
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-x-2 bg-zinc-900/40 border border-zinc-850 px-3 py-1.5 rounded-xl self-start text-xs font-medium text-zinc-300">
                      <FontAwesomeIcon icon={faCalendarDays} className="text-zinc-500 text-[11px]" />
                      <span>Validity Duration: {(plan.id==='free')?'Lifetime':`${plan.durationHours} Hours`}</span>
                    </div>

                    <ul className="flex flex-col gap-y-2.5 pt-4 border-t border-zinc-900/60 mt-1">
                      {[
                        "Full access to learning tracks",
                        "Calibrated curriculum blueprints",
                        "Dynamic certificate credentials",
                        "Offline sandbox access tools"
                      ].map((feat, i) => (
                        <li key={i} className="flex items-center gap-x-2.5 text-xs sm:text-sm text-zinc-400 font-medium">
                          <FontAwesomeIcon icon={faCheck} className="text-emerald-500 text-[10px] shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6 mt-6 border-t border-zinc-900/40">
                    <button 
                      onClick={() => buyPlan(plan.id)}
                      disabled={isCurrentPlan}
                      className={`w-full font-bold rounded-xl py-3 text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-x-2 cursor-pointer ${
                        isCurrentPlan
                          ? "bg-zinc-900 border border-zinc-800 text-zinc-500 cursor-not-allowed"
                          : "bg-zinc-900 hover:bg-emerald-500 border border-zinc-800 hover:border-emerald-400 text-zinc-300 hover:text-zinc-950 active:scale-[0.98] shadow-lg hover:shadow-emerald-500/5"
                      }`}
                    >
                      <FontAwesomeIcon icon={faCreditCard} className="text-[11px]" />
                      <span>{isCurrentPlan ? "Plan Subscribed" : "Purchase Access"}</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </section>

        </main>
      </div>
    </div>
  );
}

export default Pricing;

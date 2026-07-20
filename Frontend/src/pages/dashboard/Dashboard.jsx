import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { 
  faChartPie,
  faCrown,
  faLock,
  faPlayCircle,
  faGraduationCap,
  faTv
} from "@fortawesome/free-solid-svg-icons";

import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { getProfile } from "../../services/dashboard.service";
import { getCourses } from "../../services/course.service";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState(null);

  const navigate = useNavigate();
  const handelUpgrade=()=>{
    navigate("/pricing");
  }

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const profileResp = await getProfile();
        setUser(profileResp.data.user);
        
        const courseResp = await getCourses();
        const courseData = Array.isArray(courseResp.data) ? courseResp.data : courseResp.data;
        setCourses(courseData);
      } catch (error) {
        console.error("Dashboard terminal initialization mismatch:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadDashboardData();
  }, []);

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
      <div className="min-h-screen w-full bg-[#050505] text-zinc-100 font-sans flex flex-col justify-center items-center p-6 text-center">
        <div className="h-16 w-16 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center mb-4 text-xl">
          <FontAwesomeIcon icon={faLock} />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Authentication Required</h2>
        <p className="text-zinc-500 text-sm mt-1 max-w-xs">Please sign in to your profile node terminal to access platform content parameters.</p>
      </div>
    );
  }

  const userPlan = user?.currentPlan?.planType || "NONE";
  const planStatus = user?.currentPlan?.status || "INACTIVE";
  const isPaidUser = userPlan !== "FREE" && userPlan !== "NONE" && planStatus === "ACTIVE";
  

  const courseAccessType = courses?.courseAccess || "free";
  const hasAccess = courseAccessType === "free" || isPaidUser;


  return (
    <div className="min-h-screen w-full bg-[#050505] text-zinc-100 font-sans selection:bg-emerald-500/30 overflow-x-hidden relative flex flex-col">
      <div className="absolute top-0 right-1/4 w-[600px] h-[500px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f0f0f_1px,transparent_1px),linear-gradient(to_bottom,#0f0f0f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <Navbar />

      <div className="flex flex-col md:flex-row flex-1 relative z-10 max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-6 sm:p-8 md:p-10 flex flex-col gap-y-8 overflow-hidden">
          
          <header className="border-b border-zinc-900 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-x-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-inner">
                <FontAwesomeIcon icon={faChartPie} className="text-sm" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                  Content Gateway
                </h1>
                <p className="text-zinc-500 text-xs sm:text-sm mt-0.5 font-medium tracking-wide">
                  Logged in as <span className="text-zinc-300 font-semibold">{user.name}</span>
                </p>
              </div>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800 p-3 rounded-2xl flex items-center gap-x-3 shrink-0">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <FontAwesomeIcon icon={faCrown} className="text-xs" />
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Verification Tier</p>
                <p className="text-sm font-bold text-white uppercase tracking-wide mt-0.5">
                  {userPlan} Plan ({planStatus})
                </p>
              </div>
            </div>
          </header>
          {courses.map((course)=>{
              return ((
            <div className="max-w-4xl w-full bg-zinc-950/40 backdrop-blur-md border border-zinc-800/80 rounded-3xl p-6 shadow-2xl flex flex-col gap-y-6">
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-zinc-900/80 border border-zinc-850 flex items-center justify-center group">
                {(course.courseAccess ==='paid' && user.currentPlan.planType ==='FREE' ) ? (
                 <div className="absolute inset-0 bg-zinc-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
                    <div className="h-12 w-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-3">
                      <FontAwesomeIcon icon={faLock} className="text-base" />
                    </div>
                    <h3 className="text-white font-bold text-base tracking-tight">Paid Content Encryption</h3>
                    <p className="text-zinc-500 text-xs mt-1 max-w-xs leading-relaxed">
                      The course <span className="text-zinc-300 font-semibold">"{course.name}"</span> requires a validated membership tier. Your current setting ({userPlan}) is restricted.
                    </p>
                    <button onClick={handelUpgrade} className="mt-4 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold px-4 py-2 rounded-xl transition-all active:scale-95 shadow-lg shadow-emerald-500/10">
                      Upgrade Access Tier
                    </button>
                  </div>
                ) : (

                  <>
                    <img 
                      src={course.thumbnail?.url || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80"} 
                      alt={course.name} 
                      className="absolute inset-0 object-cover w-full h-full opacity-40 group-hover:scale-102 transition-transform duration-300"
                    />
                    <div className="relative z-10 flex flex-col items-center gap-y-3 cursor-pointer">
                      <a href={course.content?.url} target="_blank" rel="noreferrer" className="flex flex-col items-center group/btn">
                        <FontAwesomeIcon icon={faPlayCircle} className="text-5xl text-emerald-400 drop-shadow-lg group-hover/btn:scale-110 transition-transform duration-200" />
                        <span className="text-xs font-bold tracking-wider uppercase mt-2 text-zinc-300 bg-zinc-950/80 px-3 py-1 rounded-lg border border-zinc-800">Launch Asset Stream</span>
                      </a>
                    </div>
                  </>

                  
                )}
              </div>

              <div className="flex flex-col gap-y-3">
                <div className="flex items-center gap-x-3 flex-wrap gap-y-2">
                  <span className="text-[10px] font-bold tracking-wider uppercase bg-zinc-900 text-emerald-400 border border-zinc-800 px-2.5 py-0.5 rounded-md">
                    {course.courseType}
                  </span>
                  <span className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-md border ${
                    course.courseAccess === "free" 
                      ? "bg-blue-500/5 text-blue-400 border-blue-500/10" 
                      : "bg-amber-500/5 text-amber-400 border-amber-500/10"
                  }`}>
                    {course.courseAccess} access
                  </span>
                  <span className="text-xs text-zinc-500 font-medium ml-auto">{course.duration} track time</span>
                </div>

                <h2 className="text-white font-black text-xl sm:text-2xl tracking-tight mt-1">
                  {course.name}
                </h2>
                
                <p className="text-zinc-400 text-sm leading-relaxed font-medium">
                  {course.description}
                </p>

                <div className="flex items-center gap-x-3 bg-zinc-900/40 border border-zinc-850/60 p-3.5 rounded-2xl mt-2">
                  <div className="h-9 w-9 bg-zinc-950 border border-zinc-800 text-zinc-500 rounded-xl flex items-center justify-center">
                    <FontAwesomeIcon icon={faGraduationCap} className="text-sm" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Instructor Track</p>
                    <p className="text-sm font-semibold text-zinc-200 capitalize mt-0.5">
                      {course.tutor?.name} <span className="text-zinc-500 font-normal text-xs">— {course.tutor?.qualification}</span>
                    </p>
                  </div>
                </div>

              </div>
            </div>
          ))
          }) }
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
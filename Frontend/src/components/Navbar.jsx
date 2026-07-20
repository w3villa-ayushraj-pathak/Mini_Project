import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { logout } from "../redux/slices/authSlice";
import {getProfile} from '../services/profile.service'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen, faUser, faRightFromBracket, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";

function Navbar() {
  // const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    navigate("/");
  };

  const [user, setuser] = useState('')
  const [userImage, setuserImage] = useState('')

  useEffect(() => {
    fetchUser()
  }, [])
  
  
  const fetchUser=async ()=>{
    const response = await getProfile();
    setuser(response.data.user)
    setuserImage(response.data.user.profileImage)
  }
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "";


  return (
    <nav className="w-full bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900 sticky top-0 z-50 px-4 sm:px-6 lg:px-8 select-none font-sans">
      <div className="flex items-center justify-between h-16 max-w-7xl mx-auto">
        
        <div 
          onClick={() =>(user.role=='admin')?navigate("/admin/dashboard"):navigate("/dashboard")} 
          className="flex items-center gap-x-2.5 cursor-pointer group shrink-0"
        >
          <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/10">
            <FontAwesomeIcon icon={faBookOpen} className="text-black text-sm" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight transition-colors group-hover:text-emerald-400">
            Learning Track
          </span>
        </div>

        <div className="flex items-center gap-x-4 relative">
          
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-x-2.5 bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700/80 px-3 py-1.5 rounded-xl transition-all duration-200 focus:outline-none cursor-pointer group"
          >
            <div className="h-7 w-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0 shadow-inner">
              {((userImage.url)!='')?<img src={userImage.url} alt="" /> :userInitial || <FontAwesomeIcon icon={faUser} className="text-xs" />}
            </div>
            

            <span className="text-zinc-300 group-hover:text-white text-sm font-medium tracking-wide max-w-[120px] truncate hidden sm:inline">
              {user?.name || "Account"}
            </span>
            
            <FontAwesomeIcon 
              icon={faChevronDown} 
              className={`text-zinc-500 text-[10px] transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} 
            />
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
              
              <div className="absolute right-0 top-full mt-2 w-52 origin-top-right rounded-2xl border border-zinc-800 bg-zinc-900 p-1.5 shadow-2xl z-20 animate-in fade-in slide-in-from-top-2 duration-150">
                
                <div className="px-3 py-2 border-b border-zinc-800/60 mb-1">
                  <p className="text-[10px] text-zinc-500 font-bold tracking-wider uppercase">Active Session</p>
                  <p className="text-xs text-zinc-400 font-medium truncate mt-0.5">{user?.email || "student@lms.com"}</p>
                </div>

                <button
                  onClick={() => { setDropdownOpen(false); navigate("/dashboard"); }}
                  className="flex items-center gap-x-2.5 w-full px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800/60 rounded-xl transition-colors font-medium text-left cursor-pointer"
                >
                  <FontAwesomeIcon icon={faUser} className="text-zinc-500 text-xs w-4" />
                  Dashboard
                </button>

                <button 
                  onClick={() => { setDropdownOpen(false); handleLogout(); }}
                  className="flex items-center gap-x-2.5 w-full px-3 py-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors font-semibold border-t border-zinc-800/40 mt-1 text-left cursor-pointer"
                >
                  <FontAwesomeIcon icon={faRightFromBracket} className="text-rose-400/70 text-xs w-4" />
                  Logout
                </button>

              </div>
            </>
          )}

        </div>

      </div>
    </nav>
  );
}

export default Navbar;
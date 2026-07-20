import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faChartPie, 
  faUser, 
  faCreditCard, 
  faHistory, 
  faGear 
} from "@fortawesome/free-solid-svg-icons";

function Sidebar() {
  const menuItems = [
    { to: "/dashboard", label: "Dashboard", icon: faChartPie },
    { to: "/profile", label: "Profile", icon: faUser },
    { to: "/pricing", label: "Pricing Tracks", icon: faCreditCard },
    { to: "/purchase-history", label: "Purchase History", icon: faHistory },
  ];

  return (
    <aside className="w-full md:w-64 bg-zinc-950 border-r md:border-b-0 border-b border-zinc-900 md:min-h-screen p-4 flex flex-col gap-y-2 select-none font-sans shrink-0">
      <div className="px-3 py-2 mb-4 hidden md:block">
        <p className="text-[10px] text-zinc-500 font-bold tracking-wider uppercase">
          Learning Pipeline
        </p>
      </div>

      <nav className="flex flex-row md:flex-col items-center gap-2 overflow-x-auto md:overflow-x-visible scrollbar-none w-full">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-x-3 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium tracking-wide transition-all duration-200 cursor-pointer whitespace-nowrap w-auto md:w-full border ${
                isActive
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-semibold shadow-inner"
                  : "bg-transparent border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
              }`
            }
          >
            <FontAwesomeIcon icon={item.icon} className="text-sm shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
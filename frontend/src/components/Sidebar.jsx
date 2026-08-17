import React,{useState} from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  LayoutGrid,
  DoorOpen,
  Workflow,
  Image as ImageIcon,
  Users,
  BarChart2,
  FileText,
  Settings,
  User,
  LogOut,
} from "lucide-react";
import {NAV_ITEMS} from '../constants/typeMeta';
import LogoutModal from "./model/LogoutModelPage";
import { useAuth } from "../context/AuthContext";



export default function Sidebar() {

  const {logout} = useAuth();
  
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleConfirmLogout = async () => {
    await logout(); // 🔥 context logout
    setOpen(false);
    navigate("/login");
  };

  return (
    // bg-[#0D1220]
    <div>
    <aside className=" h-screen hidden md:flex flex-col w-57 shrink-0 bg-white border-r border-slate-800 py-6 px-4">
      <div className="flex items-center gap-2 px-2 mb-5">
        <Home className="text-blue-400" size={26} />
        <span className="text-black font-semibold text-lg">Smart Home</span>
      </div>

      <nav className="flex-1 flex flex-col gap-1">
        {NAV_ITEMS.map(({ label, icon: Icon, path }) => {
          const isActive = location.pathname===path;
        return (
          <button
            key={label}
            onClick={()=>{navigate(path)}}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive ? "bg-blue-600 text-white" : "text-black hover:bg-slate-900/60 hover:text-white"
            }`}
          >
            <Icon size={18} />
            {label}
          </button>
        )})}
      </nav>

      <button
        onClick={()=>setOpen(true)}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 mt-2"
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
    <LogoutModal
      isOpen={open}
      onClose={() => setOpen(false)}
      onConfirm={handleConfirmLogout}
    />
</div>
  );
}

import React, { useContext, useEffect,useState } from "react";
import { Menu, Moon, Bell, ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";
// { user, notifications }
export default function Topbar({notifications}) {
  const [user, setUser] = useState(null);
  const { profileData } = useAuth();


  useEffect(() => {
    profileData().then((response) => { setUser(response) }).catch((err) => { console.log(err) });
  }, [profileData]);

  return (
    <header className="bg-white flex items-center justify-between px-4 py-2  border ">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-slate-400">
          <Menu size={20} />
        </button>
        <Menu className="hidden md:block text-slate-500" size={20} />
        <h1 className="text-black text-lg font-semibold">Dashboard</h1>
      </div>

      <div className=" flex items-center gap-5">
        <button className="text-slate-400 hover:text-black">
          <Moon size={20} />
        </button>
        <button className="relative text-slate-400 hover:text-black">
          <Bell size={20} />
          {notifications > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] leading-none rounded-full w-4 h-4 flex items-center justify-center">
              {notifications}
            </span>
          )}
        </button>
        <div className="flex items-center gap-2">
          <button>
            <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-sm font-medium text-white">
              {user?.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
          </button>
          <div className="hidden sm:block leading-tight">
            <p className="text-gray-500 text-sm font-medium">{user?.name}</p>
            <p className="text-slate-500 text-xs">{user?.role}</p>
          </div>
          {/* <ChevronDown size={16} className="text-slate-500" /> */}
        </div>
      </div>
    </header>
  );
}

import React, { useEffect, useState } from "react";
import { Cpu, Wifi, Zap, Thermometer, Sofa, BedDouble, CookingPot, Lamp, Car, Plus } from "lucide-react";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";
import StatCard from "./StatCard.jsx";
import DeviceControlCard from "./DeviceControlCard.jsx";
import { Outlet } from "react-router-dom";

// const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

const ROOM_ICONS = { sofa: Sofa, bed: BedDouble, kitchen: CookingPot, study: Lamp, garage: Car };

const FALLBACK_DATA = {
  user: { name: "Pintu Kumar Sharma", role: "Admin" },
  notifications: 3,
  stats: { totalDevices: 8, onlineDevices: 6, energyUsageKwh: 2.45, temperatureC: 27 },
  rooms: [
    { id: "living-room", name: "Living Room", devices: 3, icon: "sofa" },
    { id: "bedroom", name: "Bedroom", devices: 2, icon: "bed" },
    { id: "study-room", name: "Study Room", devices: 1, icon: "study" },
    { id: "garage", name: "Garage", devices: 0, icon: "garage" },
    { id: "Dining", name: "Dining Room", devices: 3, icon: "sofa" },
  ],
  quickControls: [
    { id: "living-room-light", name: "Living Room", sub: "Light", icon: "bulb", on: true },
    { id: "bedroom-fan", name: "Bedroom", sub: "Fan", icon: "fan", on: false },
    { id: "ac", name: "AC", sub: "Living Room", icon: "ac", on: true, temp: 24 },
    { id: "Dining", name: "Dining Room", devices: 3, icon: "sofa" },
    { id: "Dining", name: "Dining Room", devices: 3, icon: "sofa" },
    { id: "Dining", name: "Dining Room", devices: 3, icon: "sofa" },
    { id: "Dining", name: "Dining Room", devices: 3, icon: "sofa" },
    { id: "Dining", name: "Dining Room", devices: 3, icon: "sofa" },
    { id: "Dining", name: "Dining Room", devices: 3, icon: "sofa" },
    { id: "Dining", name: "Dining Room", devices: 3, icon: "sofa" },
    { id: "Dining", name: "Dining Room", devices: 3, icon: "sofa" },
    { id: "Dining", name: "Dining Room", devices: 3, icon: "sofa" },
  ],
  recentActivity: [
    { id: 1, text: "Pintu Kumar turned ON Living Room Light", time: "10:30 AM", color: "green" },
    { id: 2, text: "Rahul Kumar turned OFF Bedroom Fan", time: "09:15 AM", color: "yellow" },
    { id: 3, text: "System Automation: All lights turned OFF", time: "11:00 PM (Yesterday)", color: "blue" },
  ],
  devicesStatus: [
    { id: 1, name: "Living Room Light", status: "Online" },
    { id: 2, name: "Bedroom Fan", status: "Online" },
    { id: 3, name: "Kitchen Light", status: "Online" },
  ],
};

function RoomCard({ room }) {
  const Icon = ROOM_ICONS[room.icon] || Sofa;
  return (
    <button className="bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-colors rounded-xl p-4 flex items-center gap-3 text-left">
      <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
        <Icon size={18} className="text-blue-400" />
      </div>
      <div>
        <p className="text-white text-sm font-medium">{room.name}</p>
        <p className="text-slate-500 text-xs">
          {room.devices} {room.devices === 1 ? "Device" : "Devices"}
        </p>
      </div>
    </button>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(FALLBACK_DATA);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   let cancelled = false;
  //   fetch(`${API_BASE}/dashboard`)
  //     .then((res) => {
  //       if (!res.ok) throw new Error("Bad response");
  //       return res.json();
  //     })
  //     .then((json) => {
  //       if (!cancelled) setData(json);
  //     })
  //     .catch(() => {
  //       // API not running — keep fallback mock data.
  //     })
  //     .finally(() => {
  //       if (!cancelled) setLoading(false);
  //     });
  //   return () => {
  //     cancelled = true;
  //   };
  // }, []);

  const toggleControl = (id) => {
    setData((prev) => ({
      ...prev,
      quickControls: prev.quickControls.map((c) => (c.id === id ? { ...c, on: !c.on } : c)),
    }));

    fetch(`${API_BASE}/devices/${id}/toggle`, { method: "POST" }).catch(() => { });
  };

  const { stats } = data;
  // bg-[#0B0F19]

  return (
    <div className=" h-screen w-full bg-gray-50 flex text-slate-200 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar user={data.user} notifications={data.notifications} />

        <main className="p-4  flex flex-col gap-6 overflow-y-auto">
          {/* {loading && <p className="text-slate-500 text-xs">Loading live data…</p>} */}
          <Outlet/>
        </main>
      </div>
    </div>
  );
}

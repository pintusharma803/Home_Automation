import React, { useEffect, useState,useCallback } from "react";
import { Cpu, Wifi, Zap, Thermometer, Sofa, BedDouble, CookingPot, Lamp, Car, Plus } from "lucide-react";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";
import StatCard from "./StatCard.jsx";
import DeviceControlCard from "./DeviceControlCard.jsx";
// import { Outlet } from "react-router-dom";
import AddRoomModel from './AddRoom.jsx';
import api from "../api/axios.js";
import {ROOM_ICONS} from '../constants/typeMeta.js';


const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

// const ROOM_ICONS = { sofa: Sofa, users: BedDouble, kitchen: CookingPot, study: Lamp, garage: Car };

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
    { id: "ac", name: "AC", sub: "Living Room", icon: "ac", on: true, temp: 24 },
    { id: "ac", name: "AC", sub: "Living Room", icon: "ac", on: true, temp: 24 },
    { id: "ac", name: "AC", sub: "Living Room", icon: "ac", on: true, temp: 24 },

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
    // bg-slate-950/60
    <button className="bg-white border border-gray-100 shadow-sm hover:border-slate-400 transition-colors rounded-xl p-4 flex items-center gap-3 text-left">
      <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
        <Icon size={18} className="text-amber-400" />
      </div>
      <div>
        <p className="text-black text-sm font-medium">{formatName(room.name)}</p>
        <p className="text-slate-500 text-xs">
          {room.deviceCount} {room.devices === 1 ? "Device" : "Devices"}
        </p>
      </div>
    </button>
  );
}

const formatName = (name) =>
  name.charAt(0).toUpperCase() + name.slice(1);

export default function Dashboard() {
  const [data, setData] = useState(FALLBACK_DATA);
  const [loading, setLoading] = useState(true);
  const [isModelOpen, setisModelOpen] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [quickControl, setquickControl] = useState([]);

  
  const handleRoom = () => getRooms();


  const getQuickControl = useCallback(async (retries=3) => {
    try {
      const {data} = await api.get('/auth/getQuickControls');
      setquickControl(data.data || []);
    } catch (error) {
      console.error(error);
      if(retries > 0 ){
        getQuickControl(retries-1);
      }
    }
  },[]);

  const getRooms = useCallback(async (retries=3) => {
    try {
      // setLoading(true);
      const { data } = await api.get("/auth/getRooms");
      setRooms(data.data || []);
    } catch (err) {
      console.error(err); 
      if(retries > 0){
        getRooms(retries-1);
      }
    } 
    finally {
      // setLoading(false);
    }
  }, []);

  useEffect(() => {
    // let cancelled = false;
    // fetch(`${API_BASE}/dashboard`)
    //   .then((res) => {
    //     if (!res.ok) throw new Error("Bad response");
    //     return res.json();
    //   })
    //   .then((json) => {
    //     if (!cancelled) setData(json);
    //   })
    //   .catch(() => {
    //     // API not running — keep fallback mock data.
    //   })
    //   .finally(() => {
    //     if (!cancelled) setLoading(false);
    //   });
    // return () => {
    //   cancelled = true;
    // };
    // getRooms(),
    // getQuickControl()
     Promise.all([getRooms(),getQuickControl()]);
  }, [getRooms,getQuickControl]);

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
    <main className="p-1 flex flex-col gap-5 overflow-y-auto">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard icon={Cpu} iconBg="bg-blue-500" label="Total Devices" value={stats.totalDevices} sub="All Devices" />
        <StatCard icon={Wifi} iconBg="bg-emerald-500" label="Online Devices" value={stats.onlineDevices} sub="Currently Online" />
        <StatCard icon={Zap} iconBg="bg-amber-500" label="Energy Usage" value={stats.energyUsageKwh} unit="kWh" sub="Today" />
        <StatCard icon={Thermometer} iconBg="bg-purple-500" label="Temperature" value={stats.temperatureC} unit="\u00b0C" sub="Living Room" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1  gap-6">
        {/* bg-slate-900/60 */}
        <section className="bg-white lg:col-span-2  border border-gray-100 shadow-sm rounded-2xl p-5">
          <h2 className="text-black font-semibold mb-4">Rooms</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
            <button
              className="border  border-gray-100 shadow-sm hover:border-slate-500 transition-colors rounded-xl p-4 flex items-center gap-3 text-slate-400"
              onClick={() => setisModelOpen(true)}
            >
              <div className="w-10 h-10 rounded-lg bg-amber-200 flex items-center justify-center">
                <Plus size={18} />
              </div>
              <span className="text-black text-sm font-medium">Add Room</span>
            </button>
          </div>
        </section>

        {/* <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
              <h2 className="text-white font-semibold mb-4">Live Camera</h2>
              <div className="relative rounded-xl overflow-hidden aspect-video bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                <Sofa size={40} className="text-slate-500" />
                <span className="absolute top-3 right-3 bg-black/60 text-emerald-400 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE
                </span>
              </div>
            </section> */}
      </div>

      <section className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5">
        <h2 className="text-black font-semibold mb-4">Quick Controls</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {quickControl.map((control) => (
            <DeviceControlCard key={control._id} control={control} onToggle={toggleControl} />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className=" bg-white border border-gray-100 shadow-sm rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-black font-semibold">Recent Activity</h2>
            <button className="text-blue-600 text-sm hover:underline">View All</button>
          </div>
          {/* divide-slate-800 */}
          <ul className="flex flex-col divide-y divide-white">
            {data.recentActivity.map((a) => (
              <li key={a.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <span
                    className={`w-2 h-2 rounded-full ${a.color === "green" ? "bg-emerald-400" : a.color === "yellow" ? "bg-amber-400" : "bg-blue-400"
                      }`}
                  />
                  {/* slate-200 */}
                  <span className="text-sm text-gray-700">{a.text}</span>
                </div>
                <span className="text-xs text-gray-700 shrink-0 ml-3">{a.time}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-black font-semibold">Devices Status</h2>
            <button className="text-blue-600 text-sm hover:underline">View All</button>
          </div>
          <ul className="flex flex-col divide-y divide-white">
            {data.devicesStatus.map((d) => (
              <li key={d.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <Lamp size={16} className="text-amber-400" />
                  <span className="text-sm text-gray-700">{d.name}</span>
                </div>
                <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  {d.status}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>



      <AddRoomModel
        isOpen={isModelOpen}
        onClose={() => setisModelOpen(false)}
        onDeviceAdded={handleRoom}
      />
    </main>
  );
}

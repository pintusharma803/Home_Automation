import React from "react";
import { Lamp, Fan, Droplets, Home, Tv, MoreVertical,Plug } from "lucide-react";

const CONTROL_ICONS = {plug:Home, bulb: Lamp, fan: Fan, heater: Droplets, "garage-door": Home, ac: Tv,  };

function Toggle({ on, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`w-12 h-6 rounded-full flex items-center px-0.5 transition-colors shrink-0 ${
        on ? "bg-blue-400 justify-end" : "bg-gray-400 justify-start"
      }`}
      aria-pressed={on}
      aria-label="toggle device"
    >
      <span className="w-5 h-5 rounded-full bg-white block" />
    </button>
  );
}

export default function DeviceControlCard({ control, onToggle }) {
  const Icon = CONTROL_ICONS[control.deviceId.icon] || Fan;
  const statusLabel = control.status 
  // ? control.status : control.on ? "ON" : "OFF";
  
  // const statusColor = control.status === "ON" ? "text-emerald-400" : "text-slate-500";
  const statusColor = control.status  ? "text-slate-400" : control.on ? "text-emerald-400" : "text-slate-500";
  return (
    // bg-slate-950/60 border-slate-800
    <div className="bg-white border border-gray-100 shadow-sm  rounded-xl p-2 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
            <Icon size={18} className="text-amber-400" />
          </div>
          <div>
            <p className="text-black text-[12px] font-medium">{control.deviceId.room}</p>
            <p className="text-slate-500 text-xs">{control.deviceId.deviceName}</p>
          </div>
        </div>
        <button className="text-slate-500 hover:text-slate-300">
          <MoreVertical size={16} />
        </button>
      </div>
      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium ${statusColor}`}>
          {control.temp ? `${control.temp} \u00b0C` : statusLabel}
        </span>
        <Toggle on={control.on} onToggle={() => onToggle(control._id)} />
      </div>
    </div>
  );
}

// on={control.on}
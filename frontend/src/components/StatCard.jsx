import React from "react";

export default function StatCard({ icon: Icon, iconBg, label, value, unit, sub }) {
  return (
    // bg-slate-900
    // border-slate-800
    <div className="bg-white border-gray-100 shadow-sm border  rounded-2xl p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-black text-sm">{label}</p>
        <p className="text-gray-800 text-xl font-semibold leading-tight">
          {value}
          {unit && <span className="text-base font-normal text-slate-400 ml-2">{unit}</span>}
        </p>
        <p className="text-slate-500 text-xs mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

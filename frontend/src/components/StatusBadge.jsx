import React from "react";
export const StatusBadge = React.memo(({ status })=> {
  const online = status === "active";
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium">
      <span
        className={`w-1.5 h-1.5 rounded-full ${online ? "bg-emerald-500" : "bg-rose-500"}`}
      />
      <span className={online ? "text-emerald-600" : "text-rose-500"}>{status}</span>
    </span>
  );
});

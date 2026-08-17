import React from "react";
import { TYPE_META } from "../constants/typeMeta";
import ActionMenu from "./ActionMenu";
import { StatusBadge } from "./StatusBadge"
import getLastSeen from "../utils/getLastSeen";

export const DeviceRow = React.memo(({ device, onEdit, onDelete, onTopicAdd }) => {
    const meta = TYPE_META[device.icon] || TYPE_META.other;
    const Icon = meta.icon;

    return (
        <tr className="hover:bg-gray-50/60 transition-colors">
            <td className="py-3.5 px-5">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center">
                        <Icon className={`w-4 h-4 ${meta.color}`} />
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">
                            {device.deviceName}
                        </p>
                        <p className="text-xs text-gray-400">
                            {device.subtitle}
                        </p>
                    </div>
                </div>
            </td>

            <td className="py-3.5 px-5 text-gray-500">{device.deviceId}</td>
            <td className="py-3.5 px-5 text-gray-500">{device.room}</td>

            <td className="py-3.5 px-5 text-gray-500 ">
                <StatusBadge status={device.status} />
            </td>

            <td className="py-3.5 px-5 text-gray-500">{device.deviceType}</td>

            <td className="py-3.5 px-5 text-gray-500">
                {getLastSeen(device.lastSeenAt)}
            </td>

            {/* <td className="py-3.5 px-5 text-gray-500">
                {getLastSeen(device.lastSeenAt)}
            </td> */}

            <td className="py-3.5 px-5 text-right">
                <ActionMenu
                    onEdit={() => onEdit(device)}
                    onDelete={() => onDelete(device._id)}
                    onTopicAdd={() => onTopicAdd(device._id)}
                />
            </td>
        </tr>
    );
});


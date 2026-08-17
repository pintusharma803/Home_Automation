import React, { useMemo, useState, useCallback, useEffect } from "react";
import {
  Box,
  CheckCircle2,
  WifiOff,
  Activity,
  Search,
  ChevronDown,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// import { socket } from "../socket/socket";
import { DeviceRow } from "../components/DeviceRow";;
import DeleteModal from "../components/DeleteModal";
import AddDevice from "../components/addDevice";
// import ActionMenu from "../components/ActionMenu";
import api from "../api/axios";
import { usePermission } from "../hooks/usePermission";
import { PERMISSIONS } from "../config/permissions";
import AddTopicForm from "../components/AddTopic";
import { useDevice } from "../context/DeviceContext";


// const ROOMS = ["Living Room", "Bedroom", "Kitchen", "Main Door", "Office", "Garage"];

// ---- Small presentational bits ---------------------------------------
function StatCard({ icon: Icon, iconBg, iconColor, label, value, sublabel }) {
  return (
    <div className="flex-1 min-w-[200px] bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
        <Icon className={`w-5 h-5 ${iconColor}`} strokeWidth={2} />
      </div>
      <div>
        <p className="text-sm text-black font-medium">{label}</p>
        <p className="text-xl font-semibold text-gray-900 mt-0.5">{value}</p>
        <p className="text-xs text-gray-400 mt-0.5">{sublabel}</p>
      </div>
    </div>
  );
}

function Dropdown({ label }) {
  return (
    <button
      type="button"
      className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 bg-white hover:bg-gray-50 transition-colors"
    >
      {label}
      <ChevronDown className="w-4 h-4 text-gray-400" />
    </button>
  );
}


// ---- Main component ----------------------------------------------------

export default function DevicesDashboard() {

  const {devices,setDevices} = useDevice();

  const [isModelOpen, setisModelOpen] = useState(false);
  const [isclose, setisclose] = useState(false);
  // const [devices, setDevices] = useState([]);
  const [isOpenAction, setIsOpenAction] = useState(false);
  const [showDeleteModel, setShowDeleteModel] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [editDevice, setEditDevice] = useState(null);

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const [isTopicAdd, setisTopicAdd] = useState(false);
  const [deviceId, setdeviceId] = useState(null);



  const { can } = usePermission();

  const canAddDevice = can(PERMISSIONS.DEVICE_CREATE);


  // useEffect(() => {
  //   const handleStatus = (data) => {
  //     setDevices(prev =>
  //       prev.map(device => {
  //         if (device.deviceId !== data.deviceId) {
  //           return device;
  //         }
  //         return { ...device, status: data.status, lastSeenAt: data.lastSeenAt };
  //       })
  //     )
  //   }
  //   socket.on("deviceStatusChanged", handleStatus);
  //   return () => {
  //     socket.off("deviceStatusChanged", handleStatus);
  //   }
  // }, []);

  const getDevices = useCallback(async () => {
    try {
      // setLoading(true);
      const { data } = await api.get("/auth/gettingDevice");
      console.log("device getting", data.data)
      setDevices(data.data || []);
    } catch (err) {
      console.error(err);
    } 
    finally {
      // setLoading(false);
    }
  }, [setDevices]);

  const handleDeviceAdded = (device) => {
    getDevices();
  };

  

  const handleFormEdit = useCallback((singleDevice) => {
    setisModelOpen(true);
    setEditDevice(singleDevice);
  }, []);

  const handleFormDelete = useCallback((singleDeviceId) => {
    setShowDeleteModel(true);
    setSelectedDevice(singleDeviceId);
  }, []);

  const handleFormTopic = useCallback((deviceId)=> {
    setdeviceId(deviceId)
    console.log(deviceId)
    setisTopicAdd(true);
  },[])

  const handleDelete = useCallback(async (deviceId) => {
    // API Call
    try {
      const { data } = await api.delete(`/auth/deleteDevice/${deviceId}`);
      setShowDeleteModel(false);
      getDevices();
    } catch (err) {
      alert(err.message);
    }
  }, []);

  useEffect(() => {
    getDevices();
  }, [getDevices]);


  const PAGE_SIZE = 6;
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return devices;
    return devices.filter(
      (d) =>
        d.deviceName.toLowerCase().includes(q) ||
        d.deviceId.toLowerCase().includes(q) ||
        d.room.toLowerCase().includes(q)
    );
  }, [query, devices]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const totalDevices = devices.length;
  const onlineDevices = devices.filter((d) => d.status === "active").length;
  const offlineDevices = totalDevices - onlineDevices;
  const alerts = 2; // wire this up to your real alerts source

  const pageNumbers = useMemo(() => {
    const nums = [];
    for (let i = 1; i <= Math.min(totalPages, 5); i++) nums.push(i);
    return nums;
  }, [totalPages]);
  // p-6 md:p-8
  return (
    <div className="min-h-screen bg-gray-50 ">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        {/* <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Devices</h1>
            <p className="text-sm text-gray-400 mt-1">
              Home <span className="mx-1">›</span> Devices
            </p>
          </div>
          <button
            type="button"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-medium px-4 py-2.5 rounded-lg shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Device
          </button>
        </div> */}

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={Box}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
            label="Total Devices"
            value={totalDevices}
            sublabel="All registered devices"
          />
          <StatCard
            icon={CheckCircle2}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
            label="Online Devices"
            value={onlineDevices}
            sublabel="Currently online"
          />
          <StatCard
            icon={WifiOff}
            iconBg="bg-rose-50"
            iconColor="text-rose-500"
            label="Offline Devices"
            value={offlineDevices}
            sublabel="Currently offline"
          />
          <StatCard
            icon={Activity}
            iconBg="bg-violet-50"
            iconColor="text-violet-500"
            label="Alerts"
            value={alerts}
            sublabel="Require attention"
          />
        </div>

        {/* Table card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className=" flex flex-col md:flex-row md:items-center justify-between gap-3 p-5  border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">All Devices</h2>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search devices..."
                  className="text-gray-600 pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                />
              </div>
              <Dropdown label="All Rooms" />
              <Dropdown label="All Status" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className=" text-left text-xs uppercase tracking-wide text-black border-b border-gray-100">
                  <th className="py-3 px-5 font-bold">Device Name</th>
                  <th className="py-3 px-5 font-bold">Device ID</th>
                  <th className="py-3 px-5 font-bold">Room</th>
                  <th className="py-3 px-5 font-bold">Status</th>
                  <th className="py-3 px-5 font-bold">Type</th>
                  <th className="py-3 px-5 font-bold">Last Seen</th>
                  {/* <th className="py-3 px-5 font-bold" >Topic</th> */}
                  <th className="py-3 px-5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {/* {pageItems.map((d) => {
                  const meta = TYPE_META[d.icon];
                  const Icon = meta.icon;
                  return (
                    <tr key={d.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center">
                            <Icon className={`w-4 h-4 ${meta.color}`} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{d.deviceName}</p>
                            <p className="text-xs text-gray-400">{d.subtitle}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-gray-500">{d.deviceId}</td>
                      <td className="py-3.5 px-5 text-gray-500">{d.room}</td>
                      <td className="py-3.5 px-5">
                        <StatusBadge status={d.status} />
                      </td>
                      <td className="py-3.5 px-5 text-gray-500">{d.deviceType}</td>
                      <td className="py-3.5 px-5 text-gray-500">{getLastSeen(d.lastSeenAt)}</td>
                      <td className="py-3.5 px-5 text-gray-500">{getLastSeen(d.lastSeenAt)}</td>
                      <td className="py-3.5 px-5 text-right">
                         <button
                          type="button"
                          className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400"
                          aria-label={`Actions for ${d.deviceName}`}
                          onClick={() => setIsOpenAction(!isOpenAction)}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button> 
                        <ActionMenu
                          // onEdit={() => handleEdit(d)}
                          onEdit={
                            () => {
                              setisModelOpen(true);
                              setEditDevice(d); 
                            }
                          }
                          // onDelete={() => handleDelete(d._id)}
                          onDelete={() =>{ 
                              setShowDeleteModel(true);
                              setSelectedDevice(d._id);
                            }
                          }
                           
                        // onDelete={}
                        />
                      </td>
                    </tr>
                  );
                })}*/}



                {pageItems.map((d) => (
                  <DeviceRow
                    key={d._id}
                    device={d}
                    onEdit={handleFormEdit}
                    onDelete={handleFormDelete}
                    onTopicAdd = {handleFormTopic}
                  />
                ))}


                {pageItems.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-gray-400">
                      No devices match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pl-5 pt-2 pb-2 border-t border-gray-100">
            <p className="text-sm text-gray-400">
              Showing {filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1} to{" "}
              {Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length} devices
            </p>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-400 disabled:opacity-40 hover:bg-gray-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {pageNumbers.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${n === currentPage
                    ? "bg-blue-600 text-white"
                    : "text-gray-500 hover:bg-gray-50 border border-gray-200"
                    }`}
                >
                  {n}
                </button>
              ))}
              {totalPages > 5 && <span className="text-gray-400 px-1">...</span>}
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-400 disabled:opacity-40 hover:bg-gray-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>


        <div className="flex items-center justify-end m-6">
          {/* <div>
            <h1 className="text-2xl font-semibold text-gray-900">Devices</h1>
            <p className="text-sm text-gray-400 mt-1">
              Home <span className="mx-1">›</span> Devices
            </p>
          </div> */}
          <button
            disabled={!canAddDevice}
            onClick={() => setisModelOpen(true)}
            type="button"
            className="
            flex items-center gap-2 bg-blue-600 hover:bg-blue-700 
            transition-colors text-white text-sm font-medium px-4 
            py-2.5 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Add Device
          </button>
        </div>

        <p className="text-center text-xs text-gray-300 mt-1">
          © 2026 SmartManage. All rights reserved.
        </p>

      </div>

      {isTopicAdd && (
        <AddTopicForm
          // onSubmit={handleTopicSubmit}
          deviceId = {deviceId}
          onClose={() => {
            setisTopicAdd(false),
            setdeviceId(null)
            }}
        />
      )}

      <AddDevice
        onDeviceAdded={handleDeviceAdded}
        isOpen={isModelOpen}
        device={editDevice}
        onClose={() => {
          setisModelOpen(false);
          setEditDevice(null);
        }
        }
      />
      <DeleteModal
        isOpen={showDeleteModel}
        onClose={() => setShowDeleteModel(false)}
        onDelete={() => handleDelete(selectedDevice)}
      />
    </div>
  );
}

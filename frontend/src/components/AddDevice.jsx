import React, { useState, useEffect, useCallback } from 'react';
import {
  X, Tag, ScanLine, ChevronDown, Cpu, Lightbulb, Plug, Thermometer, Camera, MoreHorizontal, Plus, Loader2,Pencil
} from 'lucide-react';
import api from '../api/axios';


// Adjust this import to match your project's axios instance
// (the one with the JWT access-token/refresh interceptors you already built).
// import api from '../utils/axiosInstance';

const ICON_OPTIONS = [
  { id: 'cpu', label: 'Device', Icon: Cpu },
  { id: 'bulb', label: 'Bulb', Icon: Lightbulb },
  { id: 'plug', label: 'Plug', Icon: Plug },
  { id: 'thermometer', label: 'Sensor', Icon: Thermometer },
  { id: 'camera', label: 'Camera', Icon: Camera },
  { id: 'other', label: 'Other', Icon: MoreHorizontal },
];

const deviceType = [
  { type: 'led' },
  { type: 'sensor' },
  { type: 'light' },
  { type: 'fan' },
  { type: 'AC' },
  { type: 'heater' },
];

const room = [
  {
    _id: "64f101a1",
    name: "Conference Room"
  },
  {
    _id: "64f101a2",
    name: "Meeting Room"
  },
  {
    _id: "64f101a3",
    name: "Server Room"
  },
  {
    _id: "64f101a4",
    name: "Reception"
  },
  {
    _id: "64f101a5",
    name: "Training Room"
  },
  {
    _id: "64f101a6",
    name: "Innovation Lab"
  },
  {
    _id: "64f101a7",
    name: "Strategy Hub"
  }
];



const DESCRIPTION_MAX = 200;

const INITIAL_FORM = {
  name: '',
  deviceId: '',
  type: '',
  room: '',
  // description: '',
  icon: 'cpu',
  status: 'inactive',
};



export default function AddDeviceModal({ isOpen, onClose, onDeviceAdded, device }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [deviceTypes, setDeviceTypes] = useState(deviceType);
  const [rooms, setRooms] = useState([]);
  const [metaLoading, setMetaLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  //Load device types + rooms for the two dropdowns
  const loadMeta = useCallback(async () => {
    setMetaLoading(true);
    try {
      const { data } = await api.get('/auth/rooms/meta');
      // setDeviceTypes(data.data.types || []);
      setRooms(data.data || []);
    } catch (err) {
      setServerError('Could not load rooms,Please try again.');
    } finally {
      setMetaLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (device) {
        setForm({
          name: device.deviceName,
          deviceId: device.deviceId,
          type: device.deviceType,
          room: device.room,
          // description: device.description,
          icon: device.icon,
          status: device.status,
        })
      }else{
        setForm(INITIAL_FORM);
      }
      setErrors({});
      setServerError('');
      loadMeta();
    }
  }, [isOpen,loadMeta ]); // [,loadMeta]

  if (!isOpen) return null;

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // const handleDescriptionChange = (e) => {
  //   const value = e.target.value.slice(0, DESCRIPTION_MAX);
  //   setForm((prev) => ({ ...prev, description: value }));
  // };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Device name is required.';
    if (!form.deviceId.trim()) next.deviceId = 'Device ID is required.';
    if (!form.type) next.type = 'Device type is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    setSubmitting(true);
    try {
      const payload = {
        deviceName: form.name.trim(),
        deviceId: form.deviceId.trim(),
        deviceType: form.type,
        room: form.room || null,
        // description: form.description.trim()|| '',
        icon: form.icon,
        status: form.status,
      };
      
      if(device){
        const {data} = await api.put(`/auth/updateDevice/${device._id}`,payload);
        onDeviceAdded?.(data.data);
        onClose();
        return;
      }else{
        const { data } = await api.post('/auth/devices', payload);
        onDeviceAdded?.(data.data);
        onClose();
        return;
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        'Something went wrong while adding the device.';
      setServerError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Add New Device</h2>
            <p className="mt-1 text-sm text-gray-500">
              Fill in the details below to add a new device
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 max-h-[75vh] overflow-y-auto px-6 pb-6">
          {serverError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {serverError}
            </div>
          )}



          {/* Device Name */}
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Device Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Tag className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={form.name}
                onChange={handleChange('name')}
                placeholder="Enter device name"
                className={`w-full rounded-lg border py-2 pl-9 pr-3 text-sm placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-400' : 'border-gray-300'
                  }`}
              />
            </div>
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>



          {/* Device ID */}
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Device ID <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              {/* <ScanLine className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /> */}
              <input
                type="text"
                value={form.deviceId}
                onChange={handleChange('deviceId')}
                placeholder="Enter  device ID"
                className={`w-full text-black rounded-lg border py-2 pl-9 pr-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.deviceId ? 'border-red-400' : 'border-gray-300'
                  }`}
              />
            </div>
            {/* <p className="mt-1 text-xs text-gray-400">This ID should be unique for each device</p> */}
            {errors.deviceId && <p className="mt-1 text-xs text-red-500">{errors.deviceId}</p>}
          </div>


          {/* Topic */}

          {/* <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Topic <span className="text-red-500">*</span>
            </label>
            <div className="relative"> */}
              {/* <ScanLine className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /> */}
              {/* <input
                type="text"
                value={form.deviceId}
                onChange={handleChange('deviceId')}
                placeholder="Enter topic"
                className={`w-full text-black rounded-lg border py-2 pl-9 pr-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.deviceId ? 'border-red-400' : 'border-gray-300'
                  }`}
              />
            </div>
            <p className="mt-1 text-xs text-gray-400">Topic should be unique for each device</p>
            {errors.deviceId && <p className="mt-1 text-xs text-red-500">{errors.deviceId}</p>}
          </div> */}



          {/* Device Type */}
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Device Type <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={form.type}
                onChange={handleChange('type')}
                disabled={metaLoading}
                className={`w-full appearance-none rounded-lg border bg-white py-2 pl-3 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${form.type ? 'text-gray-900' : 'text-gray-400'
                  } ${errors.type ? 'border-red-400' : 'border-gray-300'}`}
              >
                <option value="" disabled>
                  Select device type
                </option>
                {deviceTypes.map((device) => (
                  <option key={device.type} value={device.type} className="text-gray-900">
                    {device.type}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
            {errors.type && <p className="mt-1 text-xs text-red-500">{errors.type}</p>}
          </div>

          {/* Room */}
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">Room</label>
            <div className="relative">
              <select
                value={form.room}
                onChange={handleChange('room')}
                disabled={metaLoading}
                className="w-full appearance-none rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-9 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select room</option>
                {rooms.map((room) => (
                  <option key={room._id} value={room.name}>
                    {room.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Description */}
          {/* <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={form.description}
              onChange={handleDescriptionChange}
              placeholder="Enter device description (optional)"
              rows={3}
              className="w-full text-black resize-none rounded-lg border border-gray-300 py-2 px-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-right text-xs text-gray-400">
              {form.description.length}/{DESCRIPTION_MAX}
            </p>
          </div> */}

          {/* Device Icon */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">Device Icon</label>
            <div className="grid grid-cols-6 gap-2">
              {ICON_OPTIONS.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, icon: id }))}
                  aria-label={label}
                  aria-pressed={form.icon === id}
                  className={`flex h-11 items-center justify-center rounded-lg border transition-colors ${form.icon === id
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-400">Choose an icon for this device</p>
          </div>

          {/* Status */}
          {/* <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">Status</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                role="switch"
                aria-checked={form.status === 'active'}
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    status: prev.status === 'active' ? 'inactive' : 'active',
                  }))
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.status === 'active' ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.status === 'active' ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
              </button>
              <span className="text-sm text-gray-700">
                {form.status === 'active' ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div> */}

          {/* Footer */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : device ? (
                <Pencil className="h-4 w-4" />
              ):(<Plus className="h-4 w-4" />)
              }
              {submitting 
              ? device ? 'Updating...' : 'Adding...'
              : device ? 'Update' : 'Add Device'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

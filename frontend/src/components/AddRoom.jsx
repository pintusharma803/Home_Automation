import React, { useState, useEffect, useCallback } from 'react';
import {
    X,
    Tag,
    ScanLine,
    ChevronDown,
    Cpu,
    Lightbulb,
    Plug,
    Thermometer,
    Camera,
    MoreHorizontal,
    Plus,
    Loader2,
    Pencil,

} from 'lucide-react';
import { ROOM_ICON_OPTIONS } from '../constants/typeMeta';
import api from '../api/axios';

const INITIAL_FORM = {
    name: '',
    icon: 'home',
    //   floor:''
};


export default function AddRoomModel({ isOpen, onClose, onDeviceAdded, }) {
    if (!isOpen) return null;

    const [form, setForm] = useState(INITIAL_FORM);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [serverError, setServerError] = useState('');



    const handleChange = (field) => (e) => {
        const value = e.target.value;
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };


    const validate = () => {
        const next = {};
        if (!form.name.trim()) next.name = 'Device name is required.';
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
                roomName: form.name.trim(),
                icon: form.icon,
            };

            const { data } = await api.post('/auth/addRoom/', payload);

            onDeviceAdded?.(data.data);
            onClose();

        } catch (err) {
            const message = err.response?.data?.message || "Something went wrong";
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
                        <h2 className="text-lg font-semibold text-gray-900">Add New Room</h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Fill in the details below to add a new room
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

                    {/* Room Name */}
                    <div className="mb-4">
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Room Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Tag className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={form.name}
                                onChange={handleChange('name')}
                                placeholder="Enter room name"
                                className={`w-full rounded-lg border py-2 pl-9 pr-3 text-sm placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-400' : 'border-gray-300'
                                    }`}
                            />
                        </div>
                        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                    </div>

                    {/* Device Icon */}
                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-medium text-gray-700">Device Icon</label>
                        <div className="grid grid-cols-6 gap-2">
                            {ROOM_ICON_OPTIONS.map(({ id, label, Icon }) => (
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
                        <p className="mt-2 text-xs text-gray-400">Choose an icon for this room</p>
                    </div>



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
                            {submitting
                                ? (<Loader2 className="h-4 w-4 animate-spin" />)
                                : (<Plus className="h-4 w-4" />)
                            }
                            {submitting
                                ? 'Adding...'
                                : 'Add Room'
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

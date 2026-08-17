import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Search,
  Upload,
  Plus,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  Users,
  UserCheck,
  ShieldCheck,
  UserRound,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
// import { userApi } from '../api/userApi';
import api from "../api/axios";
import { PERMISSIONS } from '../config/permissions';
import {usePermission} from '../hooks/usePermission';
import {
  ROLE_STYLES,
  STATUS_STYLES,
  AVATAR_PALETTE,
  PAGE_SIZE,
  SEARCH_DEBOUNCE_MS
} from '../constants/typeMeta';  // constant import of all page



function initialsFor(name = '') {
  const parts = name.trim().split(/\s+/);
  const initials = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '').join('');
  return initials || '?';
}

function colorFor(name = '') {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

function formatLastActive(isoString) {
  if (!isoString) return '—';
  const date = new Date(isoString);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (isToday) return `Today, ${time}`;
  if (isYesterday) return `Yesterday, ${time}`;

  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
}

function Avatar({ name }) {
  return (
    <div
      className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${colorFor(
        name
      )}`}
    >
      {initialsFor(name)}
    </div>
  );
}

function RoleBadge({ role }) {
  return (
    <span
      className={`inline-flex items-center rounded-md  py-1 text-xs font-medium capitalize ${ROLE_STYLES[role] || ROLE_STYLES.Member}`}
    >
      {role}
    </span>
  );
}

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.inactive;
  return (
    <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${style.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {style.label}
    </span>
  );
}

function StatCard({ icon: Icon, iconBg, label, value, sublabel }) {
  return (
    <div className=" bg-white flex items-start gap-4 rounded-xl border border-gray-100  shadow-sm   p-5">
      <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full ${iconBg}`}>
        <Icon className="h-5 w-5 text-white" strokeWidth={2} />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-black">{label}</p>
        <p className="mt-0.5 text-xl font-semibold text-black">{value}</p>
        <p className="text-xs text-slate-500">{sublabel}</p>
      </div>
    </div>
  );
}

function IconButton({ title, onClick, variant, children }) {
  const variants = {
    default: 'text-slate-400  hover:text-blue-600',
    danger: 'text-red-400  hover:text-red-600',
  };
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className={`rounded-md p-1.5 transition-colors ${variants[variant || 'default']}`}
    >
      {children}
    </button>
  );
}

function Modal({ title, onClose, children, maxWidth = 'max-w-xs' }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onMouseDown={onClose}>
      <div
        className={`w-full ${maxWidth} rounded-xl border border-slate-800 bg-white shadow-2xl`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <h2 className="text-base font-semibold text-black">{title}</h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="rounded-md p-1 text-black hover:bg-slate-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  );
}

function ViewUserModal({ user, onClose }) {
  return (
    <Modal title="User details" onClose={onClose}>
      <div className="flex items-center gap-3">
        <div className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold text-white ${colorFor(user.name)}`}>
          {initialsFor(user.name)}
        </div>
        <div>
          <p className="font-medium text-black">
            {user.name} {user.isCurrentUser && <span className="ml-1 text-xs text-blue-400">(You)</span>}
          </p>
          <RoleBadge role={user.role} />
        </div>
      </div>
      <dl className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-black">Email</dt>
          <dd className="text-gray-800">{user.email}</dd>
        </div>
        {/* <div className="flex justify-between">
          <dt className="text-slate-500">Phone</dt>
          <dd className="text-slate-200">{user.phone}</dd>
        </div> */}
        <div className="flex justify-between">
          <dt className="text-black">Status</dt>
          <dd><StatusBadge status={user.status} /></dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-black">Last active</dt>
          <dd className="text-slate-200">{formatLastActive(user.lastActive)}</dd>
        </div>
      </dl>
    </Modal>
  );
}

function UserFormModal({ initialUser, onClose, onSubmit, submitting, errorMessage }) {
  const isEdit = Boolean(initialUser);
  const [form, setForm] = useState({
    name: initialUser?.name || '',
    email: initialUser?.email || '',
    // phone: initialUser?.phone || '',
    role: initialUser?.role || 'Member',
    status: initialUser?.status || 'active',
    password: '',
  });

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form };
    if (isEdit) delete payload.password; // password changes handled elsewhere
    onSubmit(payload);
  };

  return (
    <Modal title={isEdit ? 'Edit user' : 'Add user'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="flex items-start gap-2 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
        <div>
          <label className="mb-1 block text-xs font-medium text-black">Full name</label>
          <input
            required
            value={form.name}
            onChange={handleChange('name')}
            className="w-full rounded-md border border-slate-700 bg-white px-3 py-2 text-sm text-gray-800 placeholder-slate-500 outline-none focus:border-blue-500"
            placeholder="Enter name"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-black">Email</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            className="w-full rounded-md border border-slate-700 bg-white px-3 py-2 text-sm text-gray-800 placeholder-slate-500 outline-none focus:border-blue-500"
            placeholder="Enter Email"
          />
        </div>
        {/* <div>
          <label className="mb-1 block text-xs font-medium text-black">Phone</label>
          <input
            required
            value={form.phone}
            onChange={handleChange('phone')}
            className="w-full rounded-md border border-slate-700 bg-white px-3 py-2 text-sm text-gray-500 placeholder-slate-500 outline-none focus:border-blue-500"
            placeholder="Enter mobile No."
          />
        </div> */}
        {!isEdit && (
          <div>
            <label className="mb-1 block text-xs font-medium text-black">Password</label>
            <input
              required
              type="text"
              minLength={8}
              value={form.password}
              onChange={handleChange('password')}
              className="w-full rounded-md border border-slate-700 bg-white px-3 py-2 text-sm text-gray-800 placeholder-gray-500 outline-none focus:border-blue-500"
              placeholder="Enter temporary password"
            />
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-black">Role</label>
            <select
              value={form.role}
              onChange={handleChange('role')}
              className="w-full rounded-md border border-slate-700 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-500"
            >
              <option value="Admin">Admin</option>
              <option value="Member">Member</option>
              <option value="Guest">Guest</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-black">Status</label>
            <select
              value={form.status}
              onChange={handleChange('status')}
              className="w-full rounded-md border border-slate-700 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-3 py-2 text-sm font-medium text-black hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-60"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEdit ? 'Save changes' : 'Add user'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function ConfirmDeleteModal({ user, onClose, onConfirm, submitting }) {
  return (
    <Modal title="Delete user" onClose={onClose} maxWidth="max-w-sm">
      <p className="text-sm text-slate-700">
        Are you sure you want to remove <span className="font-medium text-black">{user.name} ?</span> 
      </p>
      <div className="mt-5 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-md px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-800 hover:text-white"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={submitting}
          onClick={onConfirm}
          className="flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-60"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Delete user
        </button>
      </div>
    </Modal>
  );
}

export default function UserManagement({ accessToken }) {
  const [stats, setStats] = useState({ totalUsers: 0, activeUsers: 0, admins: 0, guests: 0 });
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalCount: 0, showingFrom: 0, showingTo: 0 });

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  const [viewingUser, setViewingUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [addingUser, setAddingUser] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const debounceRef = useRef(null);

  const {can} = usePermission();
  const canAddUser = can(PERMISSIONS.USER_CREATE);

  // Debounce the search box before it hits the API
  useEffect(() => {
    if (debounceRef.current) 
      clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(debounceRef.current);
  }, [searchInput]);

  const loadStats = useCallback(async () => {
    try {
      const res = await api.get('/auth/getUserStats');
      setStats(res.data.data);
    } catch (err) {
      // Stats failing shouldn't block the table; surface quietly via toast
      setToast({ type: 'error', message: err.message });
    }
  }, []);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/getUsers',{
        page,
        limit: PAGE_SIZE,
        search,
        role: roleFilter,
        // status: statusFilter,
      });
      setUsers(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(err.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  // const handleExport = () => {
  //   const url = userApi.exportUsersUrl({ search, role: roleFilter, status: statusFilter });
  //   window.open(url, '_blank', 'noopener,noreferrer');
  // };

  const handleCreate = async (payload) => {
    setFormSubmitting(true);
    setFormError('');
    console.log(payload);
    try {
      const {data} = await api.post('/auth/createUser', payload);
      setAddingUser(false);
      data.success
        ?
          setToast({ type: 'success', message: `${payload.name} ${data.message}` })
        :
          setToast({ type: 'error', message: `${payload.name} ${data.message}` })

      await Promise.all([loadUsers(), loadStats()]);
    } catch (err) {
      setFormError(err.response.data.message || err.error || 'Failed to add user');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleUpdate = async (payload) => {
    setFormSubmitting(true);
    setFormError('');
    try {
      await userApi.updateUser(editingUser.id, payload, accessToken);
      setEditingUser(null);
      setToast({ type: 'success', message: `${payload.name} was updated.` });
      await Promise.all([loadUsers(), loadStats()]);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setFormSubmitting(true);
    try {
      // await userApi.deleteUser(deletingUser.id, accessToken);
      console.log("userid delete",deletingUser._id);
      await api.delete(`/auth/deleteUser/${deletingUser._id}`)
      setToast({ 
        type: 'success', 
        message: `${deletingUser.name} deleted successfully` 
      });
      setDeletingUser(null);
      const isLastRowOnPage = users.length === 1 && page > 1;
      if (isLastRowOnPage) setPage((p) => p - 1);
      else await Promise.all([loadUsers(), loadStats()]);
      // await loadStats();
    } catch (err) {
      setToast({ 
        type: 'error', 
        message: err.response.data.message || err.message 
      });
    } finally {
      setFormSubmitting(false);
    }
  };

  const statCards = useMemo(
    () => [
      { icon: Users, iconBg: 'bg-blue-500', label: 'Total Users', value: stats.totalUsers, sublabel: 'All registered users' },
      { icon: UserCheck, iconBg: 'bg-emerald-500', label: 'Active Users', value: stats.activeUsers, sublabel: 'Currently active' },
      { icon: ShieldCheck, iconBg: 'bg-amber-500', label: 'Admins', value: stats.admins, sublabel: 'Full access users' },
      { icon: UserRound, iconBg: 'bg-violet-500', label: 'Guests', value: stats.guests, sublabel: 'Limited access users' },
    ],
    [stats]
  );

  return (
    <div className=" bg-gray-50 p-6 text-slate-200">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* <div>
            <h1 className="text-2xl font-semibold text-white">User Management</h1>
            <p className="mt-1 text-sm text-slate-400">
              Manage users and control access to your home automation system.
            </p>
          </div> */}
         
        </div>

        {/* Stat cards */}
        <div className=" grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((c) => (
            <StatCard key={c.label} {...c} />
          ))}
        </div>

        {/* Filters */}
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center ">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search users..."
              className="w-1/3 rounded-md border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-500 placeholder-slate-500 outline-none focus:border-blue-300"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-500 outline-none focus:border-blue-300"
          >
            <option value="all">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Member">Member</option>
            <option value="Guest">Guest</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-500 outline-none focus:border-blue-300"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Table */}
        <div className="mt-4 overflow-hidden rounded-xl border border-gray-100 shadow-sm bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-300 text-xs uppercase tracking-wide text-black">
                  <th className="px-5 py-5 font-medium">User</th>
                  <th className="px-5 py-5 font-medium">Role</th>
                  <th className="px-5 py-5 font-medium">Email</th>
                  <th className="px-5 py-5 font-medium">Status</th>
                  <th className="px-5 py-5 font-medium">Last Active</th>
                  <th className="px-5 py-5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300 ">
                {loading && (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-slate-500">
                      <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
                      Loading users…
                    </td>
                  </tr>
                )}

                {!loading && error && (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-red-400">
                      {error}
                    </td>
                  </tr>
                )}

                {!loading && !error && users.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-slate-500">
                      No users match your filters.
                    </td>
                  </tr>
                )}

                {!loading &&
                  !error &&
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-200/10">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={user.name} />
                          <div className="min-w-0">
                            <p className="flex items-center gap-1.5 font-medium text-black">
                              <span className="truncate">{user.name}</span>
                              {user.isCurrentUser && (
                                <span className="rounded bg-blue-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-blue-300">
                                  You
                                </span>
                              )}
                            </p>
                            <p className="text-xs capitalize text-slate-500">{user.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="px-5 py-3">
                        {/* <p className="text-slate-200">{user.phone}</p> */}
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={user.status} />
                      </td>
                      <td className="px-5 py-3 text-slate-400">{formatLastActive(user.lastActive)}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <IconButton title="View user" onClick={() => setViewingUser(user)}>
                            <Eye className="h-4 w-4" />
                          </IconButton>
                          <IconButton title="Edit user" onClick={() => setEditingUser(user)}>
                            <Pencil className="h-4 w-4" />
                          </IconButton>
                          <IconButton title="Delete user" variant="danger" onClick={() => setDeletingUser(user)}>
                            <Trash2 className="h-4 w-4" />
                          </IconButton>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col gap-3 border-t border-slate-300 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">
              {pagination.totalCount === 0
                ? 'No users found'
                : `Showing ${pagination.startIndex} to ${Math.min(pagination.startIndex + pagination.limit - 1, pagination.total)} of ${pagination.total} Users`}
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-md p-1.5 text-slate-400 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  className={`h-7 w-7 rounded-md text-xs font-medium ${
                    p === page ? 'bg-blue-600 text-white' : 'text-black hover:bg-blue-600 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                type="button"
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                className="rounded-md p-1.5 text-slate-400 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {viewingUser && 
        <ViewUserModal
        user={viewingUser} 
        onClose={() => setViewingUser(null)} 
        />
      }

      {addingUser && (
        <UserFormModal
          onClose={() => {
            setAddingUser(false);
            setFormError('');
          }}
          onSubmit={handleCreate}
          submitting={formSubmitting}
          errorMessage={formError}
        />
      )}

      {editingUser && (
        <UserFormModal
          initialUser={editingUser}
          onClose={() => {
            setEditingUser(null);
            setFormError('');
          }}
          onSubmit={handleUpdate}
          submitting={formSubmitting}
          errorMessage={formError}
        />
      )}

      {deletingUser && (
        <ConfirmDeleteModal
          user={deletingUser}
          onClose={() => setDeletingUser(null)}
          onConfirm={handleDelete}
          submitting={formSubmitting}
        />
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-14 right-20 z-50 rounded-md px-4 py-3 text-sm font-medium shadow-lg ${
            toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
          }`}
        >
          {toast.message}
        </div>
      )}
       <div className="flex gap-7 justify-end mt-6">
            {/* <button
              type="button"
              onClick={handleExport}
              className="flex items-center gap-2 rounded-md border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800"
            >
              <Upload className="h-4 w-4" />
              Export Users
            </button> */}
            <button
              type="button"
              disabled = {!canAddUser}
              onClick={() => setAddingUser(true)}
              className="flex items-center gap-2 rounded-md 
              bg-blue-600 px-4 py-2 text-sm 
              font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              Add User
            </button>
          </div>
    </div>
  );
}

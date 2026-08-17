import React from 'react';
import { ArrowUpDown, Pencil, Trash2, Wifi, Globe2 } from 'lucide-react';
// import { RoleBadge, StatusBadge } from './RoleBadge';
// import { Spinner } from '../common/Badge';
// import { EmptyState } from '../common/Badge';
// import { cn } from '../../utils/cn';

const COLUMNS = [
  { key: 'fullName', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'deviceAccess', label: 'Device access', sortable: false },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'createdAt', label: 'Created', sortable: true },
];

const formatDate = (value) =>
  new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

const DeviceAccessCell = ({ deviceAccess }) => {
  if (!deviceAccess || deviceAccess.scope === 'all') {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-ink-600">
        <Globe2 size={14} className="text-brand-600" />
        All devices
      </span>
    );
  }

  const count = deviceAccess.devices?.length || 0;
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-ink-600">
      <Wifi size={14} className="text-signal-600" />
      {count} device{count === 1 ? '' : 's'}
    </span>
  );
};

const UserTable = ({ users, isLoading, error, canWrite, sortBy, sortOrder, onSort, onEdit, onDelete }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size={28} />
      </div>
    );
  }

  if (error) {
    return <EmptyState title="Couldn't load users" description={error} />;
  }

  if (users.length === 0) {
    return <EmptyState title="No users found" description="Try adjusting your search or filters." />;
  }

  return (
    <div className="scrollbar-thin overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-left">
        <thead>
          <tr className="border-b border-ink-100 bg-ink-50/60">
            {COLUMNS.map((col) => (
              <th key={col.key} className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-500">
                {col.sortable ? (
                  <button
                    type="button"
                    onClick={() => onSort(col.key)}
                    className={cn(
                      'inline-flex items-center gap-1 hover:text-ink-800',
                      sortBy === col.key && 'text-brand-700'
                    )}
                  >
                    {col.label}
                    <ArrowUpDown size={12} />
                  </button>
                ) : (
                  col.label
                )}
              </th>
            ))}
            {canWrite && <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-ink-500">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-b border-ink-50 last:border-0 hover:bg-ink-50/50">
              <td className="whitespace-nowrap px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 font-display text-sm font-semibold text-brand-800">
                    {user.fullName?.charAt(0)?.toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-ink-800">{user.fullName}</span>
                </div>
              </td>
              <td className="whitespace-nowrap px-4 py-3 font-mono text-sm text-ink-500">{user.email}</td>
              <td className="whitespace-nowrap px-4 py-3">
                <RoleBadge role={user.role} />
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <DeviceAccessCell deviceAccess={user.deviceAccess} />
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <StatusBadge status={user.status} />
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-ink-500">{formatDate(user.createdAt)}</td>
              {canWrite && (
                <td className="whitespace-nowrap px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onEdit(user)}
                      className="rounded-lg p-2 text-ink-400 hover:bg-ink-100 hover:text-brand-700"
                      aria-label={`Edit ${user.fullName}`}
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(user)}
                      className="rounded-lg p-2 text-ink-400 hover:bg-red-50 hover:text-red-600"
                      aria-label={`Delete ${user.fullName}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;

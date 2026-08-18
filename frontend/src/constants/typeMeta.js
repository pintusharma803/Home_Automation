import {
  Box,
  Thermometer,
  Lightbulb,
  Plug,
  Camera,

  Home,
  LayoutGrid,
  DoorOpen,
  Workflow,
  Image as ImageIcon,
  Users,
  BarChart2,
  BarChart3,
  FileText,
  Settings,
  User,
  MoreHorizontal,
  Video,
  BookOpen,
  Building,
  Briefcase,
  Monitor
} from "lucide-react";

export const TYPE_META = {
  sensor: { icon: Thermometer, color: "text-sky-500" },
  Switch: { icon: Plug, color: "text-emerald-500" },
  camera: { icon: Camera, color: "text-violet-500" },
  bulb: { icon: Lightbulb, color: "text-amber-500" },
  plug: { icon: Plug, color: "text-emerald-500" },
  thermometer: { icon: Thermometer, color: "text-sky-500" },
  other: { icon: Box, color: "text-gray-500" },
  cpu: { icon: Box, color: "text-gray-500" },
};

export const ROLE_STYLES = {
  Owner: ' text-emerald-500 ',
  Admin: ' text-violet-500 ',
  Guest: ' text-blue-500 ',
  // member: 'bg-blue-500/15 text-blue-300 ring-1 ring-inset ring-blue-500/30',
  Member: 'text-amber-500 ',
};

export const STATUS_STYLES = {
  active: { dot: 'bg-emerald-500', text: 'text-emerald-500', label: 'Active' },
  // pending: { dot: 'bg-amber-400', text: 'text-amber-400', label: 'Pending' },
  inactive: { dot: 'bg-red-500', text: 'text-red-500', label: 'Inactive' },
};

export const AVATAR_PALETTE = [
  'bg-rose-500', 'bg-orange-500', 'bg-amber-500', 'bg-emerald-500',
  'bg-teal-500', 'bg-sky-500', 'bg-indigo-500', 'bg-violet-500', 'bg-fuchsia-500',
];

export const PAGE_SIZE = 10;
export const SEARCH_DEBOUNCE_MS = 400;

export const NAV_ITEMS = [
  { label: "Dashboard", icon: Home, path:"/profile/dashboard" },
  { label: "Devices", icon: LayoutGrid,path:"/profile/device" },
  { label: "Rooms", icon: DoorOpen, },
  { label: "Automation", icon: Workflow },
  { label: "Scenes", icon: ImageIcon },
  { label: "Users", icon: Users, path:"/profile/user" },
  { label: "Reports", icon: BarChart2 },
  { label: "Logs", icon: FileText },
  { label: "Settings", icon: Settings },
  { label: "Profile", icon: User },
];

export const ROOM_ICON_OPTIONS = [
    { id: 'home', label: 'General Room', Icon: Home },
    { id: 'briefcase', label: 'Executive Room', Icon: Briefcase },
    { id: 'users', label: 'Conference Room', Icon: Users },
    { id: 'monitor', label: 'Workspace', Icon: Monitor },
    { id: 'bar-chart-3', label: 'Strategy Room', Icon: BarChart3 },
    { id: 'lightbulb', label: 'Innovation Lab', Icon: Lightbulb },
    { id: 'building', label: 'Office Area', Icon: Building },
    { id: 'book-open', label: 'Training Room', Icon: BookOpen },
    { id: 'video', label: 'Meeting Room', Icon: Video },
    { id: 'other', label: 'Other', Icon: MoreHorizontal },
];

export const ROOM_ICONS = {
  home: Home, briefcase:Briefcase, users:Users, monitor:Monitor,barchart3:BarChart3, lightbulb:Lightbulb, 
  building:Building, "book-open":BookOpen , video:Video, "moreHorizontal":MoreHorizontal
}
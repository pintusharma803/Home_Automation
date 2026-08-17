import { useState, useEffect, useRef } from "react";
import { MoreVertical, Pencil, Trash2, PlusSquare } from "lucide-react";

function ActionMenu({ onEdit, onDelete, onTopicAdd }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  
  // Bahar click karne par menu band ho jayega
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block" ref={menuRef}>
      {/* MoreVertical Button */}
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg hover:bg-gray-100 transition"
      >
        <MoreVertical className="w-5 h-5 text-gray-600" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <button
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
            className="text-black flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-200"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </button>
          
          <button
            onClick={() => {
              setOpen(false);
              onTopicAdd();
            }}
            className="text-black flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-200"
          >
            <PlusSquare className="w-4 h-4" />
            Add Control
          </button>

          <button
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      )}
        
    </div>
      

  );
}

export default ActionMenu;
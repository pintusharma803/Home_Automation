
const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
        <h2 className="text-lg font-semibold mb-2 text-black">Confirm Logout</h2>
        <p className="text-gray-600 mb-5">
          Are you sure you want to logout?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-3 py-2 bg-gray-200 rounded-xl text-gray-800 hover:bg-gray-600 hover:text-white"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-3 py-2 bg-red-500 text-white rounded-xl hover:bg-red-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
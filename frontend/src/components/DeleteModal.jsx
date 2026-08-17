

function DeleteModal({ isOpen, onClose, onDelete }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-96 p-6 shadow-lg">

        <h2 className="text-lg font-semibold text-black">
          Delete Device:
        </h2>

        <p className="text-gray-500 mt-2">
          Do you want to delete this device?
        </p>

        <div className="flex justify-end gap-3 mt-6 ">

          <button
            onClick={onClose}
            className=" px-4 py-2 border rounded-lg text-black hover:bg-gray-200"
          >
            Cancel
          </button>

          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Delete
          </button>

        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
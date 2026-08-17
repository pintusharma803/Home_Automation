


// function Modal({  onClose,  maxWidth = 'max-w-xs' }) {
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onMouseDown={onClose}>
//       <div
//         className={`w-full ${maxWidth} rounded-xl border border-slate-800 bg-white shadow-2xl`}
//         onMouseDown={(e) => e.stopPropagation()}
//       >
//         <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
//           <h2 className="text-base font-semibold text-black">Add Topic</h2>
//           <button
//             type="button"
//             aria-label="Close"
//             onClick={onClose}
//             className="rounded-md p-1 text-black hover:bg-slate-800 hover:text-white"
//           >
//             <X className="h-4 w-4" />
//           </button>
//         </div>
//         <div className="px-5 py-4">{children}</div>
//       </div>
//     </div>
//   );
// }



// function UserFormModal({ onClose, onSubmit, submitting, errorMessage }) {
//   const [form, setForm] = useState({
//     name: initialUser?.name || '',
//     status: initialUser?.status || 'active',
//   });

//   const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const payload = { ...form };
//     onSubmit(payload);
//   };

//   return (
//     <Modal onClose={onClose}>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         {errorMessage && (
//           <div className="flex items-start gap-2 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
//             <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
//             <span>{errorMessage}</span>
//           </div>
//         )}
//         <div>
//           <label className="mb-1 block text-xs font-medium text-black">Full name</label>
//           <input
//             required
//             value={form.name}
//             onChange={handleChange('name')}
//             className="w-full rounded-md border border-slate-700 bg-white px-3 py-2 text-sm text-gray-800 placeholder-slate-500 outline-none focus:border-blue-500"
//             placeholder="Enter name"
//           />
//         </div>
       
        
//         <div className="flex justify-end gap-2 pt-2">
//           <button
//             type="button"
//             onClick={onClose}
//             className="rounded-md px-3 py-2 text-sm font-medium text-black hover:bg-gray-300"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={submitting}
//             className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-60"
//           >
//             {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
//             {isEdit ? 'Save changes' : 'Add user'}
//           </button>
//         </div>
//       </form>
//     </Modal>
//   );
// }



// import { useState } from "react";
// import { Plus } from "lucide-react";

// const AddTopicForm = ({ onSubmit }) => {
//   const [topicName, setTopicName] = useState("");
//   const [status, setStatus] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!topicName.trim()) {
//       return setError("Topic name is required");
//     }

//     try {
//       setLoading(true);
//       setError("");

//       await onSubmit({
//         topicName,
//         status,
//       });

//       // reset
//       setTopicName("");
//       setStatus(true);
//     } catch (err) {
//       setError(err.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="w-full max-w-md bg-white p-6 rounded-xl shadow-2xl border border-slate-200 space-y-4"
//     >
//       {/* Heading */}
//       <div className="flex items-center gap-2 text-lg font-semibold">
//         <Plus size={18} />
//         Add Topic
//       </div>

//       {/* Topic Name */}
//       <div>
//         <label className="text-sm text-gray-600">Topic Name</label>
//         <input
//           type="text"
//           value={topicName}
//           onChange={(e) => setTopicName(e.target.value)}
//           placeholder="Enter topic name"
//           className="w-full mt-1 px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
//         />
//       </div>

//       {/* Status Toggle */}
//       <div className="flex items-center justify-between">
//         <span className="text-sm text-gray-600">Status</span>

//         <button
//           type="button"
//           onClick={() => setStatus(!status)}
//           className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
//             status ? "bg-green-500" : "bg-gray-300"
//           }`}
//         >
//           <div
//             className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
//               status ? "translate-x-6" : "translate-x-0"
//             }`}
//           />
//         </button>
//       </div>

//       {/* Error */}
//       {error && <p className="text-red-500 text-sm">{error}</p>}

//       {/* Submit */}
//       <button
//         type="submit"
//         disabled={loading}
//         className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
//       >
//         {loading ? "Adding..." : "Add Topic"}
//       </button>
//     </form>
//   );
// };

// export default AddTopicForm;



import { useState } from "react";
import { Plus, X } from "lucide-react";
import { jsx } from "react/jsx-runtime";
import api from "../api/axios";

const AddTopicForm = ({  onClose , deviceId}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({status:"OFF",topic:""});

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.topic.trim()) {
      return setError("Topic name is required");
    }

    try {
      setLoading(true);
      setError("");

    //   await onSubmit({
    //     topicName,
    //     status,
    //   });

      const payLoad = {
        topic: form.topic.trim(),
        status:form.status,
        deviceId:deviceId
      }

      const {data} = await api.post('/auth/addControl',payLoad);
    //   onSubmit(data.data);
      onClose(); // submit ke baad close
    } catch (err) {
      setError(err.message || err.response?.data?.message|| "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    // 🔥 Overlay
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onMouseDown={onClose}
    >
      {/* 🔥 Modal Box */}
      <div
        className="w-full max-w-xs bg-white p-6 rounded-xl shadow-2xl border border-slate-200 space-y-4 relative"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* ❌ Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-600 hover:text-black"
        >
          <X size={20} />
        </button>

        {/* Heading */}
        <div className="flex items-center gap-2 text-lg font-semibold text-black">
          {/* <Plus size={18} /> */}
          Add Control
        </div>

        {/* Topic Name */}
        <div>
          <label className="text-sm text-black">Topic Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={form.topic}
            onChange={(e) => setForm((prev)=>({...prev, topic: e.target.value}))}
            placeholder="Enter correct topic"
            className="w-full text-gray-800 mt-1 px-3 py-2 border rounded-lg outline-none focus:ring-1 focus:ring-blue-400"
          />
        </div>

        {/* Status Toggle */}

         <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">Status</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                role="switch"
                aria-checked={form.status === 'OFF'}
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    status: prev.status === 'OFF' ? 'ON' : 'OFF',
                  }))
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors 
                     ${form.status === 'ON' ? 'bg-blue-600' : 'bg-gray-300' }`
                }
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform 
                      ${form.status === 'ON' ? 'translate-x-6' : 'translate-x-1' }` 
                }
                />
              </button>
              <span className="text-sm text-gray-700">
                {form.status === 'ON' ? 'ON' : 'OFF'}
              </span>
            </div>
          </div>

        {/* Error */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Buttons */}
        <div className="flex mt-7 justify-end gap-3">
          {/* Cancel */}
          <button
            type="button"
            onClick={onClose}
            className="px-2 py-1 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-800"
          >
            Cancel
          </button>

          {/* Submit */}
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="px-3 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            {loading ? "Adding..." : "Add Topic"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTopicForm;
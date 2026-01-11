// src/pages/admin/AddEvent.jsx
import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
export default function AddEvent() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    seats: "",
    price: ""
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "success" });
  const navigator = useNavigate();                

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage({ text: "", type: "success" });
  };

  const saveEvent = async () => {
    // Basic validation
    if (!form.title.trim() || !form.date.trim() || !form.location.trim()) {
      setMessage({ text: "Please fill required fields (Title, Date, Location)", type: "error" });
      return;
    }

    setIsLoading(true);
    setMessage({ text: "", type: "success" });

    try {
      console.log("Submitting event:", form);
      const res = await axios.post("http://localhost:5000/admin/add-events", form, {
        withCredentials: true // if you use auth like in AddAdmin
      });

      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to create event");
      }else{
      setMessage({ text: "Event created successfully!", type: "success" });
      setTimeout(() => {
        navigator("/admin/events");
      }, 1200);
    }
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Failed to create event",
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fieldConfig = [
    { name: "title", type: "text", placeholder: "Event Title", required: true },
    { name: "location", type: "text", placeholder: "Location / Venue", required: true },
    { name: "date", type: "datetime-local", placeholder: "Date & Time", required: true },
    { name: "seats", type: "number", placeholder: "Total Seats Available" },
    { name: "price", type: "number", placeholder: "Ticket Price (₹)" },
    { name: "description", type: "textarea", placeholder: "Event Description..." }
  ];

  return (
    <div className="min-h-[80vh] flex items-start justify-center pt-6 md:pt-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-3xl"
      >
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/50 rounded-2xl shadow-2xl shadow-indigo-500/10 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-10 text-white">
            <h1 className="text-3xl md:text-4xl font-bold">Create New Event</h1>
            <p className="text-indigo-100 mt-2 opacity-90">
              Add an upcoming event to the system
            </p>
          </div>

          {/* Form Content */}
          <div className="p-8 md:p-10">
            {/* Messages */}
            {message.text && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-8 p-5 rounded-xl text-center font-medium flex items-center justify-center gap-3 ${
                  message.type === "success"
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : "bg-red-100 text-red-800 border border-red-200"
                }`}
              >
                {message.type === "success" ? "✓" : "!"}
                {message.text}
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fieldConfig.map((field, index) => (
                <motion.div
                  key={field.name}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.08, duration: 0.5 }}
                  className={field.name === "description" ? "md:col-span-2" : ""}
                >
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                    {field.placeholder}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>

                  {field.type === "textarea" ? (
                    <textarea
                      name={field.name}
                      value={form[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      rows={5}
                      className="w-full px-5 py-4 rounded-xl bg-white/60 dark:bg-gray-900/60 
                               border border-gray-300 dark:border-gray-600
                               focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/50
                               text-gray-900 dark:text-gray-100
                               placeholder-gray-500 dark:placeholder-gray-500
                               transition-all duration-300 resize-none"
                    />
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      value={form[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className="w-full px-5 py-4 rounded-xl bg-white/60 dark:bg-gray-900/60 
                               border border-gray-300 dark:border-gray-600
                               focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/50
                               text-gray-900 dark:text-gray-100
                               placeholder-gray-500 dark:placeholder-gray-500
                               transition-all duration-300"
                    />
                  )}
                </motion.div>
              ))}
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={saveEvent}
              disabled={isLoading}
              className={`
                mt-10 w-full py-4 px-8 rounded-xl font-semibold text-lg
                transition-all duration-300 shadow-lg
                ${
                  isLoading
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                }
              `}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating Event...
                </div>
              ) : (
                "Create Event"
              )}
            </motion.button>

            <p className="text-center text-sm text-gray-500 dark:text-gray-500 mt-6">
              All events will be visible to users after approval
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
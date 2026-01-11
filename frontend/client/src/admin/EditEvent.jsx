// src/pages/admin/EditEvent.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Save, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    seats: "",
    price: "",
    image: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "success" });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/events/${id}`, {
          withCredentials: true,
        });
        // Convert date to datetime-local format if needed
        const eventData = res.data;
        if (eventData.date) {
          eventData.date = new Date(eventData.date).toISOString().slice(0, 16);
        }
        setForm(eventData);
      } catch (err) {
        setMessage({
          text: "Failed to load event details",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setMessage({ text: "", type: "success" });
  };

  const updateEvent = async () => {
    // Basic validation
    if (!form.title?.trim() || !form.date?.trim() || !form.location?.trim()) {
      setMessage({
        text: "Please fill required fields (Title, Date, Location)",
        type: "error",
      });
      return;
    }

    setSaving(true);
    setMessage({ text: "", type: "success" });

    try {
      await axios.put(`http://localhost:5000/events/${id}`, form, {
        withCredentials: true,
      });

      setMessage({ text: "Event updated successfully!", type: "success" });

      // Redirect after short delay to show success message
      setTimeout(() => {
        navigate("/admin/events");
      }, 1200);
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Failed to update event",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const fieldConfig = [
    { name: "title", label: "Event Title", type: "text", required: true },
    { name: "location", label: "Location / Venue", type: "text", required: true },
    { name: "date", label: "Date & Time", type: "datetime-local", required: true },
    { name: "seats", label: "Total Seats", type: "number" },
    { name: "price", label: "Ticket Price (₹)", type: "number" },
    { name: "image", label: "Image URL", type: "url" },
    { name: "description", label: "Description", type: "textarea" },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] py-6 md:py-10">
      <div className="max-w-4xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/admin/events")}
              className="p-3 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-xl hover:bg-indigo-200 transition-colors"
            >
              <ArrowLeft size={24} />
            </motion.button>

            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Edit Event
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Update event details below
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-8 p-5 rounded-xl flex items-center gap-3 ${
              message.type === "success"
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="text-green-600" size={24} />
            ) : (
              <AlertCircle className="text-red-600" size={24} />
            )}
            <span className="font-medium">{message.text}</span>
          </motion.div>
        )}

        {/* Form */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/30 dark:border-gray-700/50 rounded-2xl shadow-2xl shadow-indigo-500/10 p-8 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fieldConfig.map((field, index) => (
              <motion.div
                key={field.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.08 }}
                className={field.type === "textarea" ? "md:col-span-2" : ""}
              >
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>

                {field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    value={form[field.name] || ""}
                    onChange={handleChange}
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
                    value={form[field.name] || ""}
                    onChange={handleChange}
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
            onClick={updateEvent}
            disabled={saving}
            className={`
              mt-12 w-full py-4 px-8 rounded-xl font-semibold text-lg
              transition-all duration-300 shadow-lg flex items-center justify-center gap-3
              ${
                saving
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
              }
            `}
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Saving Changes...
              </>
            ) : (
              <>
                <Save size={20} />
                Update Event
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
// src/pages/admin/EventList.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigator = useNavigate();
  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("http://localhost:5000/events", {
        withCredentials: true, // if authentication is needed
      });
      setEvents(res.data);
    } catch (err) {
      setError("Failed to load events. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const deleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await axios.delete(`http://localhost:5000/events/${id}`, {
        withCredentials: true,
      });
      setEvents(events.filter((event) => event.id !== id));
    } catch (err) {
      alert("Failed to delete event");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-[80vh] py-6 md:py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header + Add Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Manage Events
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              View, edit and manage all upcoming events
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigator('/admin/add-event')}
            className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300"
          >
            <Plus size={20} />
            Add New Event
          </motion.button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-100 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/30 dark:border-gray-700/50 rounded-2xl p-12 text-center">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
              No events found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Start by creating your first event!
            </p>
            <button
              onClick={() => (window.location.href = "/admin/add-event")}
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Create First Event
            </button>
          </div>
        ) : (
          /* Events Table / Cards */
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/50 rounded-2xl shadow-2xl shadow-indigo-500/10 overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-600/10 to-purple-600/10 border-b border-gray-200 dark:border-gray-700">
                    <th className="px-6 py-5 text-left font-semibold text-gray-700 dark:text-gray-300">
                      Title
                    </th>
                    <th className="px-6 py-5 text-left font-semibold text-gray-700 dark:text-gray-300">
                      Date & Time
                    </th>
                    <th className="px-6 py-5 text-left font-semibold text-gray-700 dark:text-gray-300">
                      Location
                    </th>
                    <th className="px-6 py-5 text-center font-semibold text-gray-700 dark:text-gray-300">
                      Seats
                    </th>
                    <th className="px-6 py-5 text-center font-semibold text-gray-700 dark:text-gray-300">
                      Price
                    </th>
                    <th className="px-6 py-5 text-center font-semibold text-gray-700 dark:text-gray-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event, index) => (
                    <motion.tr
                      key={event.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-100 dark:border-gray-700 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors"
                    >
                      <td className="px-6 py-5 font-medium text-gray-900 dark:text-gray-100">
                        {event.title}
                      </td>
                      <td className="px-6 py-5 text-gray-600 dark:text-gray-400">
                        {formatDate(event.date)}
                      </td>
                      <td className="px-6 py-5 text-gray-600 dark:text-gray-400">
                        {event.location || "—"}
                      </td>
                      <td className="px-6 py-5 text-center text-gray-700 dark:text-gray-300">
                        {event.available_seats || event.seats || "—"}
                      </td>
                      <td className="px-6 py-5 text-center text-gray-700 dark:text-gray-300">
                        {event.price ? `₹${event.price}` : "Free"}
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => (window.location.href = `/admin/edit-event/${event.id}`)}
                            className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => deleteEvent(event.id)}
                            className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden space-y-5 p-6">
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                  className="bg-white/60 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2">
                    {event.title}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Date</p>
                      <p className="font-medium">{formatDate(event.date)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Location</p>
                      <p className="font-medium">{event.location || "—"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Seats</p>
                      <p className="font-medium">{event.available_seats || event.seats || "—"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Price</p>
                      <p className="font-medium">{event.price ? `₹${event.price}` : "Free"}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => (window.location.href = `/admin/edit-event/${event.id}`)}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit size={16} /> Edit
                    </button>
                    <button
                      onClick={() => deleteEvent(event.id)}
                      className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
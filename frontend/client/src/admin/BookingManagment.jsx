// src/pages/admin/BookingManagement.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Calendar, User, Ticket, IndianRupee, Clock, CheckCircle, XCircle } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

export default function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/admin/bookings`, {
        withCredentials: true, // if using cookie-based auth
      });
      setBookings(res.data);
    } catch (err) {
      setError("Failed to load bookings. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const getStatusBadge = (status) => {
    const styles = {
      confirmed: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300",
      cancelled: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-300",
    };

    const icons = {
      confirmed: <CheckCircle size={16} />,
      pending: <Clock size={16} />,
      cancelled: <XCircle size={16} />,
      amount: <Tag size={16} />,
    };

    const defaultStyle = "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300";

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${
          styles[status?.toLowerCase()] || defaultStyle
        }`}
      >
        {icons[status?.toLowerCase()] || null}
        {status || "Unknown"}
      </span>
    );
  };

  // Group bookings by event
  const groupedBookings = bookings.reduce((acc, booking) => {
    const eventName = booking.event?.title || "Unknown Event";
    if (!acc[eventName]) acc[eventName] = [];
    acc[eventName].push(booking);
    return acc;
  }, {});

  return (
    <div className="min-h-[80vh] py-6 md:py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Manage Bookings
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              View and monitor all customer bookings grouped by events
            </p>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            Total: <span className="font-bold text-indigo-600 dark:text-indigo-400">{bookings.length}</span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-8 bg-red-100 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/30 dark:border-gray-700/50 rounded-2xl p-12 text-center">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
              No bookings yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              When customers start booking events, they'll appear here.
            </p>
          </div>
        ) : (
          /* Bookings Grouped by Event */
          <div className="space-y-12">
            {Object.entries(groupedBookings).map(([eventName, eventBookings], idx) => (
              <motion.div 
                key={eventName}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/30 dark:border-gray-700/50 rounded-2xl shadow-2xl shadow-indigo-500/10 overflow-hidden"
              >
                <div className="bg-indigo-600 dark:bg-indigo-900 px-6 py-4 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-white">{eventName}</h2>
                  <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {eventBookings.length} Bookings
                  </span>
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                        <th className="px-6 py-5 text-left font-semibold text-gray-700 dark:text-gray-300">
                          Customer
                        </th>
                        <th className="px-6 py-5 text-center font-semibold text-gray-700 dark:text-gray-300">
                          Tickets
                        </th>
                        <th className="px-6 py-5 text-center font-semibold text-gray-700 dark:text-gray-300">
                          Amount
                        </th>
                        <th className="px-6 py-5 text-center font-semibold text-gray-700 dark:text-gray-300">
                          Booking Date
                        </th>
                        <th className="px-6 py-5 text-center font-semibold text-gray-700 dark:text-gray-300">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {eventBookings.map((booking, index) => (
                        <tr
                          key={booking._id}
                          className="border-b border-gray-100 dark:border-gray-700 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors"
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                <User size={20} />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900 dark:text-gray-100">
                                  {booking.name || "Guest"}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {booking.email || "—"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium">
                              <Ticket size={16} />
                              {booking.quantity}
                            </div>
                          </td>
                          <td className="px-6 py-5 text-center font-medium text-gray-900 dark:text-gray-100">
                            <div className="flex items-center justify-center gap-1">
                              <IndianRupee size={16} />
                              {booking.total_amount?.toLocaleString("en-IN") || "—"}
                            </div>
                          </td>
                          <td className="px-6 py-5 text-center text-gray-600 dark:text-gray-400">
                            {new Date(booking.createdAt).toLocaleString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </td>
                          <td className="px-6 py-5 text-center">
                            {getStatusBadge(booking.status || 'confirmed')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards View */}
                <div className="md:hidden space-y-4 p-4">
                  {eventBookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {booking.name || "Guest"}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {booking.email || "—"}
                          </p>
                        </div>
                        {getStatusBadge(booking.status || 'confirmed')}
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Tickets</p>
                          <p className="font-medium flex items-center gap-1 mt-1 text-gray-900 dark:text-gray-100">
                            <Ticket size={16} className="text-indigo-500" /> {booking.quantity}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Amount</p>
                          <p className="font-medium flex items-center gap-1 mt-1 text-gray-900 dark:text-gray-100">
                            <IndianRupee size={16} className="text-green-500" />
                            {booking.total_amount?.toLocaleString("en-IN") || "—"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
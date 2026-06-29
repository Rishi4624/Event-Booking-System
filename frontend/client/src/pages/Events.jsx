// src/pages/Events.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ← added
import axios from "axios";
import { motion } from "framer-motion";
import { Calendar, MapPin, ArrowRight, ArrowLeft, LogOut } from "lucide-react";
import { Link } from "react-router-dom"; // ← added
const API_URL = import.meta.env.VITE_API_URL;

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // ← added
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  const handleLogout = async () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    try {
      await axios.post(`${API_URL}/admin/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout failed", err);
    }
    navigate("/login");
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/events`);
        setEvents(res.data);
        console.log('Fetched events:', res.data);
      } catch (err) {
        setError("Failed to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button + Header */}
        <div className="flex items-center justify-between mb-10">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-5 py-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/30 dark:border-gray-700/50 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-white/90 dark:hover:bg-gray-700/90 transition-all shadow-sm hover:shadow-md"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Home</span>
          </motion.button>
          {isLoggedIn && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-3 bg-red-500/10 dark:bg-red-500/10 backdrop-blur-md border border-red-500/30 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-all shadow-sm hover:shadow-md"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </motion.button>
          )}
        </div>
          <div className="text-center flex-1">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Discover Events
            </h1>
          </div>

        {/* Description (optional - can be removed if you want cleaner look) */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-center text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto"
        >
          Find and book amazing events happening near you — concerts, workshops, conferences & more
        </motion.p>

        {/* Loading & Error States */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-200 text-red-700 px-6 py-4 rounded-xl text-center max-w-2xl mx-auto">
            {error}
          </div>
        )}

        {/* Events Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {events.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  No upcoming events found...
                </p>
                <p className="mt-2 text-gray-500">Check back soon!</p>
              </div>
            ) : (
              events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/30 dark:border-gray-700/50 rounded-2xl shadow-xl shadow-indigo-500/10 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={event.img || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800"}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 line-clamp-2">
                      {event.title}
                    </h2>

                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <MapPin size={18} />
                        <span className="line-clamp-1">{event.location || "Online / TBA"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Calendar size={18} />
                        <span>{formatDate(event.date)}</span>
                      </div>
                    </div>

                    {/* Price & Button */}
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                        {event.price ? `₹${event.price}` : "Free"}
                      </div>

                      <Link to={`/event/${event.id}`}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg group/btn"
                      >
                        View Details
                        <ArrowRight
                          size={18}
                          className="group-hover/btn:translate-x-1 transition-transform"
                        />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
// src/pages/EventDetails.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Users, ArrowLeft, IndianRupee } from "lucide-react";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        console.error("Failed to load event:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Event Not Found</h2>
          <button
            onClick={() => navigate("/events")}
            className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onClick={() => navigate("/events")}
          className="mb-8 flex items-center gap-2 text-indigo-700 dark:text-indigo-400 hover:text-indigo-900 transition-colors font-medium"
        >
          <ArrowLeft size={20} />
          Back to Events
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/30 dark:border-gray-700/50 rounded-2xl shadow-2xl shadow-indigo-500/10 overflow-hidden"
        >
          {/* Hero Image */}
          <div className="relative h-64 sm:h-96 overflow-hidden">
            <img
              src={event.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600"}
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
                {event.title}
              </h1>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 sm:p-10">
            {/* Quick Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10">
              <div className="flex flex-col items-center text-center">
                <Calendar className="text-indigo-600 dark:text-indigo-400 mb-2" size={28} />
                <span className="font-medium text-gray-700 dark:text-gray-300">Date</span>
                <p className="text-gray-900 dark:text-gray-100 mt-1">{formatDate(event.date)}</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <Clock className="text-purple-600 dark:text-purple-400 mb-2" size={28} />
                <span className="font-medium text-gray-700 dark:text-gray-300">Time</span>
                <p className="text-gray-900 dark:text-gray-100 mt-1">{formatTime(event.date)}</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <MapPin className="text-pink-600 dark:text-pink-400 mb-2" size={28} />
                <span className="font-medium text-gray-700 dark:text-gray-300">Location</span>
                <p className="text-gray-900 dark:text-gray-100 mt-1 line-clamp-2">
                  {event.location || "Online Event"}
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <Users className="text-indigo-600 dark:text-indigo-400 mb-2" size={28} />
                <span className="font-medium text-gray-700 dark:text-gray-300">Seats Left</span>
                <p className="text-gray-900 dark:text-gray-100 mt-1 font-bold">
                  {event.available_seats || "Sold Out"}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                About This Event
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {event.description || "No description available."}
              </p>
            </div>

            {/* Price & Book Button */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 p-6 rounded-xl mb-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                  <IndianRupee className="text-indigo-600 dark:text-indigo-400" size={36} />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Price</p>
                    <p className="text-3xl font-bold text-indigo-700 dark:text-indigo-300">
                      {event.price ? `₹${event.price}` : "Free"}
                    </p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(`/book/${id}`)}
                  disabled={!event.available_seats || event.available_seats <= 0}
                  className={`
                    px-12 py-5 rounded-xl font-bold text-lg shadow-xl transition-all duration-300
                    ${
                      !event.available_seats || event.available_seats <= 0
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                    }
                  `}
                >
                  {event.available_seats && event.available_seats > 0
                    ? "Book Now"
                    : "Sold Out"}
                </motion.button>
              </div>
            </div>

            <p className="text-center text-sm text-gray-500 dark:text-gray-500">
              Event ID: {id} • Limited seats — book early!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import { CreditCard, CheckCircle, ArrowLeft, Calendar, MapPin, Users, IndianRupee, ShieldCheck } from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL;

export default function BookingPage() {
  const { id } = useParams(); // event ID from URL
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: ""
  });

  // Fetch event details
  useEffect(() => {
    axios.get(`${API_URL}/events/${id}`).then((res) => {
      setEvent(res.data.event);
    });
  }, [id]);

  // Handle input change
  const updateField = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Calculate total price
  const total = event ? event.price * quantity : 0;

  const bookEvent = async () => {
    if (!form.name || !form.email || !form.mobile) {
      return alert("Please fill all details!");
    }

    const bookingData = {
      event_id: id,
      name: form.name,
      email: form.email,
      mobile: form.mobile,
      quantity,
      total_amount: total,
    };

    try {
      const res = await axios.post(`${API_URL}/bookings`, bookingData);
      
      if (res.data.booking_id) {
        const bookingId = res.data.booking_id;
        
        // Generate PDF
        const doc = new jsPDF();
        
        // Ticket Border
        doc.setDrawColor(79, 70, 229); // Indigo
        doc.setLineWidth(1);
        doc.rect(10, 10, 190, 100);
        
        // Header
        doc.setFillColor(79, 70, 229);
        doc.rect(10, 10, 190, 20, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.text("Event Booking Ticket", 105, 23, { align: "center" });
        
        // Content
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.text(`Ticket ID: ${bookingId}`, 15, 45);
        doc.text(`Event: ${event.title}`, 15, 55);
        doc.text(`Date: ${new Date(event.date).toLocaleDateString()}`, 15, 65);
        doc.text(`Name: ${form.name}`, 15, 75);
        doc.text(`Tickets: ${quantity}`, 15, 85);
        doc.text(`Total Paid: Rs. ${total}`, 15, 95);
        
        doc.save(`ticket-${bookingId}.pdf`);
      }

      alert(res.data.message + " Your ticket has been downloaded.");
      navigate("/success");
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || "Booking failed";
      alert("Booking failed: " + errorMessage);
    }
  };

  if (!event) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onClick={() => navigate(`/event/${id}`)}
          className="mb-8 flex items-center gap-2 text-indigo-700 dark:text-indigo-400 hover:text-indigo-900 transition-colors font-medium"
        >
          <ArrowLeft size={20} />
          Back to Event
        </motion.button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Order Summary Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-5/12"
          >
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/30 dark:border-gray-700/50 rounded-3xl shadow-2xl overflow-hidden sticky top-8">
              <div className="relative h-48 sm:h-56">
                <img
                  src={event.img || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800"}
                  className="w-full h-full object-cover"
                  alt={event.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
                    Order Summary
                  </span>
                  <h2 className="text-2xl font-bold text-white line-clamp-1">{event.title}</h2>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                    <Calendar className="text-indigo-500 mt-1" size={20} />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Date & Time</p>
                      <p className="font-medium">
                        {new Date(event.date).toLocaleDateString("en-IN", {
                          weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
                          hour: 'numeric', minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                    <MapPin className="text-pink-500 mt-1" size={20} />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                      <p className="font-medium line-clamp-2">{event.location || "Online Event"}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>Tickets ({quantity}x)</span>
                    <span className="font-medium">₹{(event.price * quantity).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>Taxes & Fees</span>
                    <span className="font-medium">₹0</span>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                    <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                      ₹{total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Checkout Form Column */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full lg:w-7/12"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl border border-white/40 dark:border-gray-700/60 rounded-3xl shadow-2xl p-6 sm:p-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-indigo-100 dark:bg-indigo-900/40 p-3 rounded-2xl">
                  <CreditCard className="text-indigo-600 dark:text-indigo-400" size={32} />
                </div>
                <div>
                  <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Checkout</h2>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">Provide your details to securely book your tickets</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Quantity Selector */}
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-gray-100 dark:border-gray-700/50">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 dark:bg-purple-900/40 p-2 rounded-xl">
                      <Users className="text-purple-600 dark:text-purple-400" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Select Tickets</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{event.available_seats} seats available</p>
                    </div>
                  </div>

                  <div className="flex items-center bg-white dark:bg-gray-800 rounded-xl p-1 shadow-sm border border-gray-200 dark:border-gray-700">
                    <button
                      className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                      onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      <span className="text-xl font-bold">−</span>
                    </button>
                    <span className="w-12 text-center font-bold text-lg text-gray-900 dark:text-white">
                      {quantity}
                    </span>
                    <button
                      className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                      onClick={() => quantity < event.available_seats && setQuantity(quantity + 1)}
                      disabled={quantity >= event.available_seats}
                    >
                      <span className="text-xl font-bold">+</span>
                    </button>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-5">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-100 dark:border-gray-700/50 mt-6">
                    Contact Details
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={updateField}
                      className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="e.g. Rahul Sharma"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={updateField}
                        className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="you@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone Number</label>
                      <input
                        type="text"
                        name="mobile"
                        value={form.mobile}
                        onChange={updateField}
                        className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6 justify-center">
                    <ShieldCheck size={16} className="text-green-500" />
                    <span>Your booking information is encrypted and secure.</span>
                  </div>

                  <button
                    onClick={bookEvent}
                    className="w-full relative group overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl py-4 px-8 font-bold text-lg shadow-xl shadow-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/40 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0"
                  >
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                    <span className="flex items-center justify-center gap-2 relative z-10">
                      <CheckCircle size={22} />
                      Pay ₹{total.toLocaleString('en-IN')} & Book Ticket
                    </span>
                  </button>
                </div>

              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

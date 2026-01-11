import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";

export default function BookingPage() {
  const { id } = useParams(); // event ID from URL
  const [event, setEvent] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: ""
  });

  // Fetch event details
  useEffect(() => {
    axios.get(`http://localhost:5000/events/${id}`).then((res) => {
      setEvent(res.data);
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
      const res = await axios.post("http://localhost:5000/bookings", bookingData);
      alert(res.data.message);
    } catch (err) {
      console.log(err);
      alert("Booking failed");
    }
  };

  if (!event) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-10 flex flex-col items-center">
      
      {/* Event Card */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-xl rounded-xl p-6 w-full max-w-2xl"
      >
        <img
          src={event.image}
          className="w-full h-64 rounded-lg object-cover"
          alt=""
        />

        <h1 className="text-3xl font-bold mt-4">{event.title}</h1>
        <p className="mt-2 text-gray-600">{event.description}</p>

        <div className="mt-3 text-lg font-semibold">
          📅 {new Date(event.date).toLocaleDateString()}
        </div>
        <div className="text-lg font-semibold">💺 Seats Available: {event.available_seats}</div>
        <div className="text-lg font-semibold text-indigo-600">₹ {event.price} / ticket</div>
      </motion.div>

      {/* Booking Form */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-xl rounded-xl p-6 mt-8 w-full max-w-2xl"
      >

        <h2 className="text-2xl font-bold mb-4">Enter Your Details</h2>

        {/* Name */}
        <label className="block mb-2 font-semibold">Name</label>
        <input
          type="text"
          name="name"
          className="w-full p-3 border rounded-lg mb-4"
          placeholder="Your Name"
          onChange={updateField}
        />

        {/* Email */}
        <label className="block mb-2 font-semibold">Email</label>
        <input
          type="email"
          name="email"
          className="w-full p-3 border rounded-lg mb-4"
          placeholder="Your Email"
          onChange={updateField}
        />

        {/* Mobile */}
        <label className="block mb-2 font-semibold">Mobile</label>
        <input
          type="text"
          name="mobile"
          className="w-full p-3 border rounded-lg mb-4"
          placeholder="Your Mobile"
          onChange={updateField}
        />

        {/* Ticket Quantity */}
        <div className="flex items-center justify-between mt-4">
          <h3 className="text-lg font-bold">Tickets:</h3>

          <div className="flex items-center gap-4">
            <button
              className="px-3 py-1 bg-gray-300 rounded"
              onClick={() => quantity > 1 && setQuantity(quantity - 1)}
            >
              -
            </button>

            <span className="text-xl">{quantity}</span>

            <button
              className="px-3 py-1 bg-gray-300 rounded"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </button>
          </div>
        </div>

        {/* Total */}
        <div className="mt-4 text-2xl font-bold text-indigo-600">
          Total: ₹ {total}
        </div>

        {/* Submit */}
        <button
          onClick={bookEvent}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg mt-6 font-bold"
        >
          Book Now
        </button>
      </motion.div>

    </div>
  );
}

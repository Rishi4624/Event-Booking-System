import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { UserPlus, ArrowLeft, Eye, EyeOff } from "lucide-react";
import {Link} from "react-router-dom";



const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "success" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage({ text: "", type: "success" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (form.password !== form.confirmPassword) {
      setMessage({ text: "Passwords do not match", type: "error" });
      return;
    }

    if (form.password.length < 4) {
      setMessage({ text: "Password must be at least 4 characters", type: "error" });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "success" });

    try {
      const res = await axios.post(`${API_URL}/auth/signup`, {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      setMessage({
        text: res.data.message || "Account created successfully!",
        type: "success",
      });

      // Redirect after short delay
      setTimeout(() => {
        navigate("/");
      }, 1800);
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Signup failed. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-32 -top-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -right-32 top-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        <div className="absolute left-1/2 -bottom-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-blob"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onClick={() => navigate("/")}
          className="mb-8 flex items-center gap-2 text-white/80 hover:text-white transition-colors font-medium"
        >
          <ArrowLeft size={20} />
          Back to Home
        </motion.button>

        {/* Signup Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-white/10 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl shadow-black/40 p-8 md:p-10"
        >
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 text-white mb-4">
              <UserPlus size={28} />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Create Account
            </h2>
            <p className="text-indigo-200 mt-3 text-sm md:text-base">
              Join now and start booking amazing events
            </p>
          </div>

          {/* Message */}
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-8 p-4 rounded-xl text-center text-sm font-medium flex items-center justify-center gap-2 ${
                message.type === "success"
                  ? "bg-green-500/20 border border-green-500/40 text-green-200"
                  : "bg-red-500/20 border border-red-500/40 text-red-200"
              }`}
            >
              {message.type === "success" ? "✓" : "!"}
              {message.text}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div whileFocus={{ scale: 1.02 }}>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full Name"
                required
                className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-indigo-300/70 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30 transition-all duration-300"
              />
            </motion.div>

            <motion.div whileFocus={{ scale: 1.02 }}>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email Address"
                required
                className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-indigo-300/70 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30 transition-all duration-300"
              />
            </motion.div>

            <motion.div whileFocus={{ scale: 1.02 }} className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-indigo-300/70 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30 transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-300 hover:text-white"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </motion.div>

            <motion.div whileFocus={{ scale: 1.02 }} className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                required
                className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-indigo-300/70 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30 transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-300 hover:text-white"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              type="submit"
              className={`
                w-full py-4 rounded-xl font-semibold text-lg mt-4
                transition-all duration-300 shadow-lg flex items-center justify-center gap-3
                ${
                  loading
                    ? "bg-indigo-600/50 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                }
              `}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  Sign Up
                </>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <p className="text-center text-indigo-300/70 text-sm mt-10">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-300 hover:text-white font-medium">Log in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import {Link} from "react-router-dom";
// import { setAuthState } from "../../middleware";
const API_URL = import.meta.env.VITE_API_URL;


export default function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    setLoading(true);
    setError("");

    console.log(API_URL);

    try {
      const res = await axios.post(`${API_URL}/admin/login`,
        {
          email,
          password: pass,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("role", res.data.message);
        localStorage.setItem("token", res.data.token);
        if (res.data.email) localStorage.setItem("adminEmail", res.data.email);

        if(res.data?.message==="admin")
          navigate("/admin/events");
        else
          navigate("/events");
      } else {
          setError(res.data?.message || "Login failed");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        err.response?.statusText ||
        err.statusText ||
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-20 -top-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -right-20 top-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
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

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative transform transition-all duration-700 hover:scale-[1.02]"
        >
          <div className="bg-white/10 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl shadow-black/40 p-8 md:p-10">
            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                Admin Panel
              </h1>
              <p className="text-indigo-200 mt-3 text-sm md:text-base">
                Secure Access Required
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 bg-red-500/20 border border-red-500/40 text-red-200 px-5 py-4 rounded-xl text-center text-sm animate-pulse"
              >
                {error}
              </motion.div>
            )}

            {/* Form */}
            <div className="space-y-6">
              <motion.div whileFocus={{ scale: 1.02 }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-indigo-300/70 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30 transition-all duration-300"
                />
              </motion.div>

              <motion.div whileFocus={{ scale: 1.02 }}>
                <input
                  type="password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-indigo-300/70 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30 transition-all duration-300"
                />
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={login}
                disabled={loading}
                className={`
                  w-full py-4 rounded-xl font-semibold text-lg mt-2
                  transition-all duration-300 shadow-lg
                  ${
                    loading
                      ? "bg-indigo-600/50 cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl hover:shadow-indigo-500/30 active:scale-[0.98]"
                  }
                  text-white
                `}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  "Sign In to Admin Panel"
                )}
              </motion.button>
            </div>

             {/* Footer */}
            <p className="text-center text-indigo-300/70 text-sm mt-10">
              Don't have an account?{" "}
              <Link to="/signup" className="text-indigo-300 hover:text-white font-medium">Sign up</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

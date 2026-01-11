import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function AddAdmin() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "success" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage({ text: "", type: "success" }); // clear message on change
  };

  const submitAdmin = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setMessage({ text: "Please fill all fields", type: "error" });
      return;
    }

    setIsLoading(true);
    setMessage({ text: "", type: "success" });

    try {
      const res = await axios.post(
        "http://localhost:5000/admin/create",
        form,
        { withCredentials: true }
      );

      if (res.data.success) {
        setMessage({ text: "Admin created successfully!", type: "success" });
        setForm({ name: "", email: "", password: "" });
      } else {
        setMessage({ text: res.data.message || "Failed to create admin", type: "error" });
      }
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Something went wrong",
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const inputVariants = {
    focus: { scale: 1.02, boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.2)" },
    blur: { scale: 1, boxShadow: "none" }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-lg"
      >
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/50 rounded-2xl shadow-2xl shadow-indigo-500/10 p-8 md:p-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Add New Admin
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Create another administrator account
            </p>
          </motion.div>

          {/* Messages */}
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded-lg text-center text-sm font-medium ${
                message.type === "success"
                  ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border border-green-200 dark:border-green-800/50"
                  : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border border-red-200 dark:border-red-800/50"
              }`}
            >
              {message.text}
            </motion.div>
          )}

          {/* Form Fields */}
          <div className="space-y-6">
            {["name", "email", "password"].map((field, index) => (
              <motion.div
                key={field}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <motion.input
                  type={field === "password" ? "password" : field === "email" ? "email" : "text"}
                  name={field}
                  placeholder={
                    field === "name"
                      ? "Full Name"
                      : field === "email"
                      ? "Email Address"
                      : "Password"
                  }
                  value={form[field]}
                  onChange={handleChange}
                  whileFocus="focus"
                  variants={inputVariants}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="w-full px-5 py-4 rounded-xl bg-white/60 dark:bg-gray-900/60 
                           border border-gray-300 dark:border-gray-600 
                           focus:border-indigo-500 focus:ring-0 
                           text-gray-900 dark:text-gray-100 
                           placeholder-gray-500 dark:placeholder-gray-500
                           transition-all duration-300"
                />
              </motion.div>
            ))}
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={submitAdmin}
            disabled={isLoading}
            className={`
              mt-8 w-full py-4 px-6 rounded-xl font-semibold text-lg
              transition-all duration-300 shadow-lg
              ${
                isLoading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              }
              text-white
            `}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creating...
              </div>
            ) : (
              "Create Admin"
            )}
          </motion.button>

          <p className="text-center text-sm text-gray-500 dark:text-gray-500 mt-8">
            This action requires super-admin privileges
          </p>
        </div>
      </motion.div>
    </div>
  );
}
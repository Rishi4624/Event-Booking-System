// src/layouts/AdminLayout.jsx
import { motion } from "framer-motion";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import axios from "axios";
// import { clearAuthState } from "../../middleware";
const API_URL = import.meta.env.VITE_API_URL;

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = async() => {
    // Clear auth token / session
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    const res = await axios.post(`${API_URL}/admin/logout`, {}, { withCredentials: true });
    if(res.data.success){
      // clearAuthState();
      // Redirect to login
      navigate("/login");
    }else{
      alert("Logout failed. Please try again.");
    }

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex flex-col md:flex-row">
      {/* Sidebar */}
      <motion.aside
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="hidden md:block w-full md:w-72 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-r border-white/30 dark:border-gray-700/50 shadow-2xl shadow-indigo-500/10"
      >
        <div className="p-8 md:p-10 flex flex-col h-full">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Admin Panel
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm md:text-base">
              Manage your system
            </p>
          </motion.div>

          {/* Navigation - takes available space */}
          <nav className="space-y-4 flex-1">
            {[
              { to: "/admin/events", label: "Events" },
              { to: "/admin/add-event", label: "Add Event" },
              { to: "/admin/bookings", label: "Bookings" },
              { to: "/admin/add-admin", label: "Add Admin" },
            ].map((item, index) => (
              <motion.div
                key={item.to}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `block px-5 py-4 rounded-xl text-lg font-medium transition-all duration-300 ${
                      isActive
                        ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 shadow-md"
                        : "text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:shadow-sm"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </motion.div>
            ))}
          </nav>

          {/* Logout Button - at the bottom */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            onClick={handleLogout}
            className="mt-8 flex items-center gap-3 px-5 py-4 rounded-xl text-lg font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-700 transition-all duration-300"
          >
            <LogOut size={20} />
            Logout
          </motion.button>
        </div>
      </motion.aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-white/30 dark:border-gray-700/50 shadow-md p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Admin Panel
        </h1>

        {/* Logout button for mobile */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-600 dark:text-red-400 hover:text-red-700 px-4 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </motion.button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}

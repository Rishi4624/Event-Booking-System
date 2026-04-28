import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Chart from "chart.js/auto";
const API_URL = import.meta.env.VITE_API_URL;

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [chart, setChart] = useState(null);

  useEffect(() => {
    axios.get(
      `${API_URL}/admin/stats`).then(res => {
      setStats(res.data);
    });
  }, []);

  useEffect(() => {
    axios.get(`${API_URL}/admin/event-sales`).then(res => {
      const ctx = document.getElementById("salesChart");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: res.data.labels,
          datasets: [{
            label: "Bookings per Event",
            data: res.data.data,
            backgroundColor: "rgba(99, 102, 241, 0.7)",
          }],
        },
      });
    });
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      
      <h1 className="text-4xl font-bold mb-8">Dashboard Analytics</h1>

      {/* Widgets */}
      <div className="grid grid-cols-3 gap-6 mb-10">

        <div className="bg-white dark:bg-gray-800 p-6 shadow rounded text-center">
          <h2 className="text-xl font-semibold">Total Bookings</h2>
          <p className="text-3xl font-bold">{stats.totalBookings}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 shadow rounded text-center">
          <h2 className="text-xl font-semibold">Total Revenue</h2>
          <p className="text-3xl font-bold">₹{stats.totalRevenue}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 shadow rounded text-center">
          <h2 className="text-xl font-semibold">Active Events</h2>
          <p className="text-3xl font-bold">{stats.totalEvents}</p>
        </div>

      </div>

      {/* Sales chart */}
      <canvas id="salesChart" className="w-full max-w-3xl"></canvas>

    </motion.div>
  );
}

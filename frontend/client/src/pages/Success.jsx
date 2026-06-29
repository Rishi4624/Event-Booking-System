import { motion } from "framer-motion";
import { CheckCircle, Home, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Success({ qr }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex flex-col justify-center items-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl border border-white/40 dark:border-gray-700/50 rounded-3xl shadow-2xl p-8 md:p-12 max-w-lg w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
          className="w-24 h-24 bg-green-100 dark:bg-green-900/40 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner"
        >
          <CheckCircle size={56} />
        </motion.div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
          Booking Successful!
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Your ticket has been confirmed and the PDF has been downloaded to your device.
        </p>

        {qr && (
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl inline-block mb-8 border border-gray-200 dark:border-gray-700">
            <img src={qr} className="w-40 h-40 object-cover" alt="QR Code" />
            <p className="text-sm text-gray-500 mt-3 font-medium">Scan this at the event</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
          >
            <Home size={20} />
            Back to Home
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/events")}
            className="flex items-center justify-center gap-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-white px-8 py-4 rounded-xl font-bold text-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-all"
          >
            <FileText size={20} />
            More Events
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

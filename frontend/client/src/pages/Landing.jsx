  import { motion } from "framer-motion";
  import { ArrowRight, Calendar, Zap, ShieldCheck, Users, MapPin, LogIn, UserPlus, LogOut } from "lucide-react";
  import { Link, useNavigate } from "react-router-dom";
  import axios from "axios";

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  export default function LandingPage() {
    const navigate = useNavigate();
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
    return (
      <div className="bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50/30 min-h-screen text-gray-900 overflow-x-hidden">

        {/* 1. Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -left-40 -top-40 w-[500px] h-[500px] bg-purple-400/15 rounded-full blur-3xl animate-blob"></div>
            <div className="absolute right-0 bottom-0 w-[600px] h-[600px] bg-pink-400/15 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
          </div>

          <div className="relative z-10 max-w-5xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
              className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 bg-clip-text text-transparent leading-tight mb-8"
            >
              Your Next Event
              <br />
              Awaits You
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-12"
            >
              Discover and book concerts, conferences, workshops, sports & more — instantly and securely.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-5 justify-center items-center"
            >
              <Link
                to="/events"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-3 group order-1 sm:order-1"
              >
                Browse Events
                <ArrowRight className="group-hover:translate-x-1.5 transition-transform" />
              </Link>

              {/* NEW: Login Button */}
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="bg-red-500/10 backdrop-blur-sm border-2 border-red-600/40 text-red-700 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-red-50 hover:border-red-600/60 transition-all duration-300 flex items-center justify-center gap-3 group order-2 sm:order-2"
                >
                  <LogOut size={20} className="group-hover:scale-110 transition-transform" />
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login" // ← change this path to your actual admin login route
                    className="bg-white/90 backdrop-blur-sm border-2 border-indigo-600/40 text-indigo-700 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-indigo-50 hover:border-indigo-600/60 transition-all duration-300 flex items-center justify-center gap-3 group order-2 sm:order-2"
                  >
                    <LogIn size={20} className="group-hover:scale-110 transition-transform" />
                    Login
                  </Link>

                  {/* Added: Sign Up Button */}
                  <Link
                    to="/signup"  // ← change to your actual signup route
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center gap-3 group order-3 sm:order-3"
                  >
                    <UserPlus size={20} className="group-hover:scale-110 transition-transform" />
                    Sign Up
                  </Link>
                </>
              )}
            </motion.div>
          </div>
        </section>

        {/* 2. Features Highlights */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent"
            >
              Why Choose Us?
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Zap, title: "Instant Booking", desc: "Book in seconds with real-time availability", color: "indigo" },
                { icon: ShieldCheck, title: "Secure & Safe", desc: "Bank-grade encryption & trusted payments", color: "purple" },
                { icon: MapPin, title: "Live Seat Map", desc: "Choose your perfect seat in real-time", color: "pink" },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl p-8 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                >
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br from-${item.color}-500 to-${item.color}-600 flex items-center justify-center mb-6 text-white`}>
                    <item.icon size={32} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Popular Event Categories */}
        <section id="events-types" className="py-20 px-6 bg-gradient-to-b from-purple-50/40 to-transparent">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-purple-700 via-indigo-700 to-pink-600 bg-clip-text text-transparent"
            >
              Explore Event Types
            </motion.h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: "Concerts", img: "https://img.freepik.com/free-photo/concert-energy_23-2151953445.jpg" },
                { name: "Workshops", img: "https://images.unsplash.com/photo-1552581234-26160f608093?w=800" },
                { name: "Conferences", img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800" },
                { name: "Sports Events", img: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800" },
              ].map((cat, i) => (
                <motion.a
                  key={cat.name}
                  href="/events"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 aspect-[4/5]"
                >
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  <div className="absolute bottom-8 left-6 right-6">
                    <h3 className="text-2xl md:text-3xl font-bold text-white">{cat.name}</h3>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Real-time Experience Teaser */}
        <section className="py-24 px-6 bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-700 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="text-4xl md:text-5xl font-bold mb-8"
            >
              Feel the Thrill of Live Booking
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl md:text-2xl opacity-90 mb-12"
            >
              Watch seats get taken in real-time — just like being at the venue box office.
            </motion.p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mt-8">
              <motion.a
                href="/events"
                whileHover={{ scale: 1.05 }}
                className="inline-block bg-white text-indigo-900 px-12 py-6 rounded-2xl font-bold text-xl shadow-2xl hover:bg-gray-100 transition-colors"
              >
                Start Booking Now →
              </motion.a>

              {/* NEW: Login button in CTA section too */}
              {!isLoggedIn && (
                <>
                  <motion.a
                    href="/login"
                    whileHover={{ scale: 1.05 }}
                    className="inline-block bg-transparent border-2 border-white text-white px-12 py-6 rounded-2xl font-bold text-xl hover:bg-white/10 transition-all duration-300"
                  >
                    Admin Login →
                  </motion.a>

                  {/* Added: Sign Up Button */}
                  <motion.a
                    href="/signup"  // ← change to your actual signup route
                    whileHover={{scale : 1.05}}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center gap-3 group order-3 sm:order-3"
                  >
                    <UserPlus size={20} className="group-hover:scale-110 transition-transform" />
                    Sign Up
                  </motion.a>
                </>
              )}



            </div>
          </div>
        </section>

        {/* 5. Testimonials */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent"
            >
              Loved by Event Lovers
            </motion.h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { name: "Aarav S.", text: "Best booking experience ever! So fast & smooth.", avatar: "https://i.pravatar.cc/120?img=32" },
                { name: "Priya M.", text: "Live seat selection is amazing — got perfect seats!", avatar: "https://i.pravatar.cc/120?img=44" },
                { name: "Rahul K.", text: "Finally a platform that actually works well!", avatar: "https://i.pravatar.cc/120?img=68" },
              ].map((t, i) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl p-8 shadow-lg"
                >
                  <div className="flex items-center gap-4 mb-5">
                    <img src={t.avatar} alt={t.name} className="w-14 h-14 rounded-full object-cover" />
                    <h4 className="font-bold text-lg">{t.name}</h4>
                  </div>
                  <p className="text-gray-700 italic">"{t.text}"</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Final CTA + Footer */}
        <section className="py-20 px-6 bg-gradient-to-br from-purple-900 to-indigo-900 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-4xl md:text-5xl font-bold mb-8"
            >
              Ready for Your Next Adventure?
            </motion.h2>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.a
                href="/events"
                whileHover={{ scale: 1.05 }}
                className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white px-12 py-6 rounded-2xl font-bold text-xl shadow-2xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300"
              >
                Discover Events Now →
              </motion.a>

              {/* Extra Login option in final CTA */}
              {!isLoggedIn && (
                <>
                  <motion.a
                    href="/login"
                    whileHover={{ scale: 1.05 }}
                    className="inline-block bg-transparent border-2 border-white/70 text-white px-12 py-6 rounded-2xl font-bold text-xl hover:bg-white/10 transition-all duration-300"
                  >
                    Admin Login →
                  </motion.a>

                  {/* Added: Sign Up Button */}
                  <motion.a
                    href="/signup"  // ← change to your actual signup route
                    whileHover={{scale : 1.05}}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center gap-3 group order-3 sm:order-3"
                  >
                    <UserPlus size={20} className="group-hover:scale-110 transition-transform" />
                    Sign Up
                  </motion.a>
                </>
              )}



            </div>

            <p className="mt-16 text-gray-300">
              © {new Date().getFullYear()} Smart Event Booking • Made with ❤️ in India
            </p>
          </div>
        </section>
      </div>
    );
  }
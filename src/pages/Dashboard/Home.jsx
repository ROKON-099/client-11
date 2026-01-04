import { Link } from "react-router";
import { motion } from "framer-motion";
import bannerImg from "../../assets/banner.png";

const Home = () => {
  return (
    <div>
      {/* ================= Banner Section ================= */}
      <section className="bg-gradient-to-r from-red-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Donate Blood, <br />
                <span className="text-red-600">Save a Life Today</span>
              </h1>

              <p className="text-gray-600 mb-8 max-w-lg">
                Blood donation is a simple act of kindness that can save lives.
                Join our community and help patients get blood quickly and safely.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-center"
                >
                  Join as a Donor
                </Link>

                <Link
                  to="/search"
                  className="px-6 py-3 border border-red-600 text-red-600 rounded-md hover:bg-red-100 transition text-center"
                >
                  Search Donors
                </Link>
              </div>
            </motion.div>

            {/* Right Image (Blended) */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative flex justify-center"
            >
              <div className="absolute inset-0 bg-gradient-to-l from-white/80 to-transparent rounded-lg"></div>
              <img
                src={bannerImg}
                alt="Blood Donation"
                className="w-full max-w-md rounded-lg mix-blend-multiply"
              />
            </motion.div>

          </div>
        </div>
      </section>

      {/* ================= Featured Section ================= */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Why Donate Blood?
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              {
                title: "Save Lives",
                desc: "One blood donation can help save up to three lives.",
              },
              {
                title: "Quick & Safe",
                desc: "The donation process is simple, fast, and completely safe.",
              },
              {
                title: "Community Support",
                desc: "Helping patients and hospitals across the country.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 border rounded-lg text-center hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-red-600 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= Our Impact Section ================= */}
      <section className="py-20 bg-red-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
            Our <span className="text-red-600">Impact</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "5,000+", label: "Registered Donors" },
              { value: "1,200+", label: "Blood Requests Fulfilled" },
              { value: "300+", label: "Hospitals Connected" },
              { value: "8,000+", label: "Lives Impacted" },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-lg shadow-sm"
              >
                <h3 className="text-4xl font-bold text-red-600 mb-2">
                  {item.value}
                </h3>
                <p className="text-gray-600">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= Contact Section ================= */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-900">
            Contact Us
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold text-red-600 mb-4">
                Get in Touch
              </h3>
              <p className="text-gray-600 mb-2">📍 Dhaka, Bangladesh</p>
              <p className="text-gray-600 mb-2">📞 +880 1234-567890</p>
              <p className="text-gray-600">✉️ support@blooddonation.com</p>
            </motion.div>

            {/* Contact Form */}
            <motion.form
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-lg border space-y-4"
            >
              <input
                type="text"
                placeholder="Your Name"
                className="w-full border px-4 py-2 rounded"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full border px-4 py-2 rounded"
              />
              <textarea
                rows="4"
                placeholder="Your Message"
                className="w-full border px-4 py-2 rounded"
              ></textarea>
              <button
                type="submit"
                className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
              >
                Send Message
              </button>
            </motion.form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

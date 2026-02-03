import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import useAuth from "../../hooks/useAuth";
import LoadingSpinner from "../../components/comon/LoadingSpinner";

const API_URL = import.meta.env.VITE_API_URL;

const Registration = () => {
  const { createUser } = useAuth();

  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [selectedDistrictId, setSelectedDistrictId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });

    fetch("/District.json")
      .then((res) => res.json())
      .then(setDistricts);

    fetch("/Upzila.json")
      .then((res) => res.json())
      .then(setUpazilas);
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    const form = e.target;

    const name = form.name.value.trim();
    const email = form.email.value.trim().toLowerCase();
    const password = form.password.value;
    const confirmPassword = form.confirm_password.value;
    const bloodGroup = form.bloodGroup.value;
    const districtId = Number(form.district.value);
    const districtName = districts.find((d) => d.id === districtId)?.name;
    const upazila = form.upazila.value;

    if (password !== confirmPassword)
      return toast.error("Passwords do not match");

    if (password.length < 6)
      return toast.error("Password must be at least 6 characters");

    if (!districtName)
      return toast.error("Please select a district");

    try {
      setLoading(true);

      // 🔥 ONLY Firebase register → AUTO LOGIN
      await createUser(email, password);

      // 🔥 Save user to DB (no auth impact)
      await axios.post(`${API_URL}/users`, {
        name,
        email,
        avatar: "",          // image feature OFF
        bloodGroup,
        district: districtName,
        upazila,
        role: "donor",
        status: "active",
      });

      toast.success("Registration successful");

      // ❌ No navigate
      // ❌ No login call
      // Firebase onAuthStateChanged will auto-login

    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-red-50 px-4">
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8"
        data-aos="fade-up"
      >
        <h2 className="text-3xl font-bold text-center text-red-600 mb-6">
          Create Account
        </h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            name="name"
            placeholder="Full Name"
            required
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-300 outline-none"
          />

          <input
            name="email"
            type="email"
            placeholder="Email Address"
            required
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-300 outline-none"
          />

          <select
            name="bloodGroup"
            required
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-300 outline-none"
          >
            <option value="">Select Blood Group</option>
            {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(bg => (
              <option key={bg}>{bg}</option>
            ))}
          </select>

          <select
            name="district"
            required
            onChange={(e) => {
              setSelectedDistrictId(Number(e.target.value));
              e.target.form.upazila.value = "";
            }}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-300 outline-none"
          >
            <option value="">Select District</option>
            {districts.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          <select
            name="upazila"
            required
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-300 outline-none"
          >
            <option value="">Select Upazila</option>
            {upazilas
              .filter(u => u.district_id === selectedDistrictId)
              .map(u => (
                <option key={u.id}>{u.name}</option>
              ))}
          </select>

          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-300 outline-none"
          />

          <input
            name="confirm_password"
            type="password"
            placeholder="Confirm Password"
            required
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-300 outline-none"
          />

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-red-600 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Registration;


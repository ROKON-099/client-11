import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import useAuth from "../../hooks/useAuth";
import LoadingSpinner from "../../components/comon/LoadingSpinner";

const imageBBKey = import.meta.env.VITE_IMGBB_API_KEY;
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
      .then(res => res.json())
      .then(setDistricts);

    fetch("/Upzila.json")
      .then(res => res.json())
      .then(setUpazilas);
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    const form = e.target;

    const name = form.name.value.trim();
    const email = form.email.value.trim().toLowerCase();
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;
    const imageFile = form.avatar.files[0];
    const bloodGroup = form.bloodGroup.value;
    const districtId = Number(form.district.value);
    const districtName = districts.find(d => d.id === districtId)?.name;
    const upazila = form.upazila.value;

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    if (!districtName) {
      return toast.error("Please select a district");
    }

    try {
      setLoading(true);

      // default avatar
      let avatarUrl =
        "https://cdn-icons-png.flaticon.com/512/149/149071.png";

      // upload avatar (optional)
      if (imageFile && imageBBKey) {
        const imageFormData = new FormData();
        imageFormData.append("image", imageFile);

        const imgRes = await axios.post(
          `https://api.imgbb.com/1/upload?key=${imageBBKey}`,
          imageFormData
        );

        avatarUrl = imgRes.data.data.display_url;
      }

      // 🔥 Firebase register (AUTO LOGIN)
      await createUser(email, password);

      // 🔥 Save user in DB (avatar from user)
      await axios.post(`${API_URL}/users`, {
        name,
        email,
        avatar: avatarUrl,
        bloodGroup,
        district: districtName,
        upazila,
        role: "donor",
        status: "active",
      });

      toast.success("Registration successful 🎉");
      // ❌ no navigate — auto login handled globally
    } catch (error) {
      toast.error(error?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingSpinner />}

      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div
          className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full"
          data-aos="fade-up"
        >
          <h2 className="text-2xl font-bold text-center mb-6">
            Create Account
          </h2>

          <form onSubmit={handleRegister} className="space-y-4">
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              required
              className="w-full px-4 py-3 border rounded-lg"
            />

            <input
              name="email"
              type="email"
              placeholder="Email Address"
              required
              className="w-full px-4 py-3 border rounded-lg"
            />

            <input
              name="avatar"
              type="file"
              accept="image/*"
              className="w-full px-4 py-2 border rounded-lg"
            />

            <select
              name="bloodGroup"
              required
              className="w-full px-4 py-3 border rounded-lg"
            >
              <option value="">Blood Group</option>
              {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(bg => (
                <option key={bg}>{bg}</option>
              ))}
            </select>

            <select
              name="district"
              required
              onChange={(e) => {
                setSelectedDistrictId(Number(e.target.value));
                form.upazila.value = "";
              }}
              className="w-full px-4 py-3 border rounded-lg"
            >
              <option value="">District</option>
              {districts.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>

            <select
              name="upazila"
              required
              className="w-full px-4 py-3 border rounded-lg"
            >
              <option value="">Upazila</option>
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
              className="w-full px-4 py-3 border rounded-lg"
            />

            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              required
              className="w-full px-4 py-3 border rounded-lg"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-red-600 font-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Registration;



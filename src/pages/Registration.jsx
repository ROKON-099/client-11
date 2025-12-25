import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import toast from "react-hot-toast";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import useAuth from "../hooks/useAuth";

const Registration = () => {
  const { createUser } = useAuth();
  const navigate = useNavigate();

  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [selectedDistrictId, setSelectedDistrictId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    fetch("/District.json")
      .then(res => res.json())
      .then(data => setDistricts(data));

    fetch("/Upzila.json")
      .then(res => res.json())
      .then(data => setUpazilas(data));
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    const form = e.target;

    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;
    const bloodGroup = form.bloodGroup.value;
    const districtId = form.district.value;
    const upazila = form.upazila.value;
    const avatarFile = form.avatar.files[0];

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("image", avatarFile);

      const imgRes = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_KEY}`,
        formData
      );

      const avatar = imgRes.data.data.url;
      const districtName = districts.find(d => d.id == districtId)?.name;

      await createUser(email, password);

      const userInfo = {
        name,
        email,
        avatar,
        bloodGroup,
        district: districtName,
        upazila,
        role: "donor",
        status: "active",
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/users`, userInfo);

      toast.success("Registration successful 🎉");
      navigate("/dashboard");
    } catch {
      toast.error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div
        className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl"
        data-aos="fade-up"
      >
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-8">
          Create Account
        </h2>

        <form onSubmit={handleRegister} className="space-y-4" data-aos="fade-right">
          {/* Name */}
          <input
            name="name"
            placeholder="Your Name"
            required
            className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-400"
          />

          {/* Email */}
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-400"
          />

          {/* Avatar */}
          <label className="w-full px-4 py-2.5 border rounded-xl cursor-pointer text-gray-400 text-sm flex items-center">
            Click to upload profile image
            <input
              type="file"
              name="avatar"
              accept="image/*"
              required
              className="hidden"
            />
          </label>

          {/* Blood Group */}
          <select
            name="bloodGroup"
            required
            className="w-full px-4 py-2.5 border rounded-xl"
            defaultValue=""
          >
            <option value="" disabled hidden>
              Select Blood Group
            </option>
            {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(bg => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>

          {/* District */}
          <select
            name="district"
            required
            className="w-full px-4 py-2.5 border rounded-xl"
            defaultValue=""
            onChange={(e) => setSelectedDistrictId(e.target.value)}
          >
            <option value="" disabled hidden>
              Select District (e.g. Sirajganj)
            </option>
            {districts.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          {/* Upazila */}
          <select
            name="upazila"
            required
            className="w-full px-4 py-2.5 border rounded-xl"
            defaultValue=""
          >
            <option value="" disabled hidden>
              Select Upazila (e.g. Sirajganj Sadar)
            </option>
            {upazilas
              .filter(u => String(u.district_id) === String(selectedDistrictId))
              .map(u => (
                <option key={u.id} value={u.name}>{u.name}</option>
              ))}
          </select>

          {/* Password */}
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="w-full px-4 py-2.5 border rounded-xl"
          />

          {/* Confirm Password */}
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            required
            className="w-full px-4 py-2.5 border rounded-xl"
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700
                       text-white py-3 rounded-xl font-semibold
                       disabled:opacity-70"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-700 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Registration;

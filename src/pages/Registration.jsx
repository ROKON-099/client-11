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

  // 🔹 Load district & upazila JSON
  useEffect(() => {
    AOS.init({ duration: 900, once: true });

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

      // 🔹 Upload avatar to imageBB
      const formData = new FormData();
      formData.append("image", avatarFile);

      const imgRes = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_KEY}`,
        formData
      );

      const avatar = imgRes.data.data.url;
      const districtName = districts.find(d => d.id == districtId)?.name;

      // 🔹 Firebase user create
      await createUser(email, password);

      // 🔹 Save user to DB
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
    } catch (err) {
      console.error(err);
      toast.error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div
        className="w-full max-w-lg bg-white p-8 sm:p-10 rounded-3xl shadow-xl"
        data-aos="fade-up"
      >
        <h2
          className="text-3xl sm:text-4xl font-bold text-center text-indigo-600 mb-8"
          data-aos="zoom-in"
        >
          Create Account
        </h2>

        <form onSubmit={handleRegister} className="space-y-4" data-aos="fade-right">
          <input name="name" placeholder="Full Name" required className="input" />
          <input name="email" type="email" placeholder="Email" required className="input" />

          {/* 🌟 Beautiful Avatar Upload */}
      <div className="space-y-1">
  <label className="block text-sm font-medium text-gray-600">
    
  </label>

  <label className="input flex items-center justify-between cursor-pointer">
    <span className="text-gray-400 text-sm">
      Upload an image
    </span>
    <input
      type="file"
      name="avatar"
      accept="image/*"
      required
      className="hidden"
    />
  </label>
</div>


          {/* Blood Group */}
          <select name="bloodGroup" required className="input">
            <option value="">Select Blood Group</option>
            {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(bg => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>

          {/* District */}
          <select
            name="district"
            required
            className="input"
            onChange={(e) => setSelectedDistrictId(e.target.value)}
          >
            <option value="">Select District</option>
            {districts.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          {/* ✅ Upazila (FIXED) */}
          <select name="upazila" required className="input">
            <option value="">Select Upazila</option>
            {upazilas
              .filter(u => String(u.district_id) === String(selectedDistrictId))
              .map(u => (
                <option key={u.id} value={u.name}>{u.name}</option>
              ))}
          </select>

          <input name="password" type="password" placeholder="Password" required className="input" />
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            required
            className="input"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600
                       hover:from-indigo-700 hover:to-purple-700
                       text-white py-3 rounded-xl font-semibold transition
                       disabled:opacity-70"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600" data-aos="zoom-in">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Registration;

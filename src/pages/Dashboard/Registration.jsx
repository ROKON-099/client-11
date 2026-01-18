import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import useAuth from "../../hooks/useAuth";

const imageBBKey = import.meta.env.VITE_IMGBB_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

const Registration = () => {
  const { createUser, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [selectedDistrictId, setSelectedDistrictId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

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
    const email = form.email.value.trim();
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;
    const imageFile = form.avatar.files[0];
    const bloodGroup = form.bloodGroup.value;
    const districtId = Number(form.district.value);
    const districtName =
      districts.find((d) => d.id === districtId)?.name;
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

      let avatarUrl =
        "https://i.ibb.co/2kRZb5P/avatar.png";

      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append("image", imageFile);

        const imageRes = await axios.post(
          `https://api.imgbb.com/1/upload?key=${imageBBKey}`,
          imageFormData
        );

        avatarUrl = imageRes.data.data.display_url;
      }

      await createUser(email, password);
      await updateUserProfile(name, avatarUrl);

      await axios.post(`${API_URL}/users`, {
        name,
        email,
        avatar: avatarUrl,
        bloodGroup,
        district: districtName,
        upazila,
      });

      const jwtRes = await axios.post(`${API_URL}/jwt`, {
        email,
      });
      localStorage.setItem(
        "access-token",
        jwtRes.data.token
      );

      toast.success("Registration successful 🎉");
      navigate("/");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div
        className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full"
        data-aos="fade-up"
      >
        <h2 className="text-2xl font-bold text-center mb-8">
          Register
        </h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            name="name"
            type="text"
            placeholder="Name"
            required
            className="w-full px-4 py-3 border rounded-lg"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="w-full px-4 py-3 border rounded-lg"
          />

          <input
            name="avatar"
            type="file"
            accept="image/*"
            className="w-full px-4 py-3 border rounded-lg"
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
            onChange={(e) =>
              setSelectedDistrictId(Number(e.target.value))
            }
            className="w-full px-4 py-3 border rounded-lg"
          >
            <option value="">District</option>
            {districts.map((d) => (
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
              .filter(
                (u) =>
                  u.district_id === selectedDistrictId
              )
              .map((u) => (
                <option key={u.id} value={u.name}>
                  {u.name}
                </option>
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
            className="w-full bg-red-600 text-white py-3 rounded-lg disabled:opacity-70"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-red-600 font-semibold"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Registration;

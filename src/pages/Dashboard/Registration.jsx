import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import useAuth from "../../hooks/useAuth";
import LoadingSpinner from "../../components/comon/LoadingSpinner";
import { updateProfile } from "firebase/auth";
import { auth } from "../../firebase/firebase.config";

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
    const confirmPassword = form.confirm_password.value;
    const imageFile = form.avatar.files[0];
    const bloodGroup = form.bloodGroup.value;
    const districtId = Number(form.district.value);
    const districtName = districts.find(d => d.id === districtId)?.name;
    const upazila = form.upazila.value;

    if (password !== confirmPassword)
      return toast.error("Passwords do not match");

    if (password.length < 6)
      return toast.error("Password must be at least 6 characters");

    if (!districtName)
      return toast.error("Please select a district");

    try {
      setLoading(true);

      // 1️⃣ Upload image
      let avatarUrl =
        "https://cdn-icons-png.flaticon.com/512/149/149071.png";

      if (imageFile && imageBBKey) {
        const fd = new FormData();
        fd.append("image", imageFile);

        const imgRes = await axios.post(
          `https://api.imgbb.com/1/upload?key=${imageBBKey}`,
          fd
        );

        avatarUrl = imgRes.data.data.display_url.replace(
          "i.ibb.co.com",
          "i.ibb.co"
        );
      }

      // 2️⃣ Firebase create user (AUTO LOGIN happens here)
      const result = await createUser(email, password);

      // 3️⃣ Immediately set Firebase profile (SAFE)
      await updateProfile(result.user, {
        displayName: name,
        photoURL: avatarUrl,
      });

      // 4️⃣ Save to DB (does NOT affect auth)
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

      toast.success("Registration successful");

      // ❌ NO navigate
      // ❌ NO login call
      // onAuthStateChanged will handle everything

    } catch (err) {
      toast.error(err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">
          Register
        </h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <input name="name" placeholder="Name" required className="input" />
          <input name="email" type="email" placeholder="Email" required className="input" />
          <input name="avatar" type="file" accept="image/*" className="input" />

          <select name="bloodGroup" required className="input">
            <option value="">Blood Group</option>
            {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(bg =>
              <option key={bg}>{bg}</option>
            )}
          </select>

          <select
            name="district"
            required
            onChange={e => setSelectedDistrictId(+e.target.value)}
            className="input"
          >
            <option value="">District</option>
            {districts.map(d =>
              <option key={d.id} value={d.id}>{d.name}</option>
            )}
          </select>

          <select name="upazila" required className="input">
            <option value="">Upazila</option>
            {upazilas
              .filter(u => u.district_id === selectedDistrictId)
              .map(u => <option key={u.id}>{u.name}</option>)
            }
          </select>

          <input name="password" type="password" placeholder="Password" required className="input" />
          <input name="confirm_password" type="password" placeholder="Confirm Password" required className="input" />

          <button className="w-full bg-red-600 text-white py-3 rounded-lg">
            Register
          </button>
        </form>

        <p className="mt-4 text-center">
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

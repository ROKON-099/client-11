import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import toast from "react-hot-toast";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import useAuth from "../../hooks/useAuth";

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
    const photo = form.photo.value;
    const bloodGroup = form.bloodGroup.value;
    const district = form.district.value;
    const upazila = form.upazila.value;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const { user } = await createUser(email, password);
      await updateUserProfile(name, photo);

      await axios.post(`${import.meta.env.VITE_API_URL}/users`, {
        name,
        email,
        photo,
        bloodGroup,
        district,
        upazila,
        role: "donor",
        status: "active",
      });

      toast.success("Registered successfully!");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full" data-aos="fade-up">
        <h2 className="text-2xl font-bold text-center mb-8">Register</h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <input name="name" type="text" placeholder="Name" required className="w-full px-4 py-3 border rounded-lg" />
          <input name="email" type="email" placeholder="Email" required className="w-full px-4 py-3 border rounded-lg" />
          <input name="photo" type="text" placeholder="Photo URL" required className="w-full px-4 py-3 border rounded-lg" />

          <select name="bloodGroup" required className="w-full px-4 py-3 border rounded-lg">
            <option value="">Blood Group</option>
            <option>A+</option>
            <option>A-</option>
            <option>B+</option>
            <option>B-</option>
            <option>O+</option>
            <option>O-</option>
            <option>AB+</option>
            <option>AB-</option>
          </select>

          <select
            name="district"
            onChange={(e) => setSelectedDistrictId(Number(e.target.value))}
            required
            className="w-full px-4 py-3 border rounded-lg"
          >
            <option value="">District</option>
            {districts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <select name="upazila" required className="w-full px-4 py-3 border rounded-lg">
            <option value="">Upazila</option>
            {upazilas
              .filter((u) => u.district_id === selectedDistrictId)
              .map((u) => (
                <option key={u.id} value={u.name}>
                  {u.name}
                </option>
              ))}
          </select>

          <input name="password" type="password" placeholder="Password" required className="w-full px-4 py-3 border rounded-lg" />
          <input name="confirmPassword" type="password" placeholder="Confirm Password" required className="w-full px-4 py-3 border rounded-lg" />

          <button type="submit" disabled={loading} className="w-full bg-red-600 text-white py-3 rounded-lg">
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center">
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

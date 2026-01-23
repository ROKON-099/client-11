import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";

import useAuth from "../../hooks/useAuth";
import LoadingSpinner from "../../components/comon/LoadingSpinner";

const Login = () => {
  const { signIn, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    AOS.init({ duration: 900, once: true });
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    try {
      setLoading(true);

      // 🔐 Firebase login
      await signIn(email, password);

      // 🔑 Request JWT after successful login
      const jwtRes = await axios.post(
        `${import.meta.env.VITE_API_URL}/jwt`,
        { email }
      );

      if (jwtRes?.data?.token) {
        localStorage.setItem("access-token", jwtRes.data.token);
      }

      toast.success("Login successful 🎉");
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(
        err.code === "auth/wrong-password" ||
        err.code === "auth/user-not-found"
          ? "Invalid email or password"
          : "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div
        className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl shadow-xl"
        data-aos="fade-up"
      >
        {/* Heading */}
        <h2
          className="text-3xl font-bold text-center text-indigo-600 mb-6"
          data-aos="zoom-in"
        >
          Welcome Back
        </h2>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4" data-aos="fade-right">
          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              required
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 pr-12"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-indigo-600"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register Link */}
        <p className="mt-6 text-center text-gray-600" data-aos="zoom-in">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-indigo-600 font-semibold">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

import { NavLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import axiosSecure from "../../hooks/axiosSecure";
import LoadingSpinner from "../comon/LoadingSpinner";

const Sidebar = () => {
  const { user, loading } = useAuth();

  const { data: dbUser, isLoading } = useQuery({
    queryKey: ["userRole", user?.email],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data;
    },
  });

  if (loading || isLoading) {
    return <LoadingSpinner />;
  }

  const role = dbUser?.role;

  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-red-50 via-white to-white border-r shadow-lg hidden md:flex flex-col">
      
      {/* Brand */}
      <div className="px-6 py-6 border-b">
        <h1 className="text-2xl font-extrabold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
          Blood-Donation
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back
        </p>
      </div>

      {/* User Info */}
      <div className="flex items-center gap-3 px-6 py-5">
        <img
          src={user?.photoURL || "https://i.ibb.co/2kRZb5P/avatar.png"}
          alt="avatar"
          className="w-12 h-12 rounded-full object-cover border-2 border-red-200"
        />
        <div>
          <p className="text-sm font-semibold text-gray-800">
            {user?.displayName || "User"}
          </p>
          <p className="text-xs text-gray-500 truncate w-36">
            {user?.email}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 mt-4 space-y-2">

        {/* Common */}
        <NavItem to="/dashboard" label="Dashboard" />
        <NavItem to="/dashboard/profile" label="My Profile" />

        {/* Donor Menu */}
        {role === "donor" && (
          <>
            <NavItem
              to="/dashboard/my-donation-requests"
              label="My Donation Requests"
            />
            <NavItem
              to="/dashboard/create-donation-request"
              label="Create Donation Request"
            />
          </>
        )}

        {/* Admin Menu */}
        {role === "admin" && (
          <>
            <NavItem to="/dashboard/all-users" label="All Users" />
            <NavItem
              to="/dashboard/all-blood-donation-request"
              label="All Donation Requests"
            />
            <NavItem to="/dashboard/funding" label="Funding" />
          </>
        )}

        {/* Volunteer Menu */}
        {role === "volunteer" && (
          <NavItem
            to="/dashboard/all-blood-donation-request"
            label="All Donation Requests"
          />
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;

/* -------- Menu Item -------- */
const NavItem = ({ to, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `group flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
        isActive
          ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md"
          : "text-gray-700 hover:bg-red-50 hover:text-red-600"
      }`
    }
  >
    <span className="group-hover:translate-x-1 transition-transform">
      {label}
    </span>
  </NavLink>
);

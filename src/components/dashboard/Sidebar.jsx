import { NavLink } from "react-router";
import useAuth from "../../hooks/useAuth";

const Sidebar = () => {
  const { user } = useAuth();

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

      {/* Menu */}
      <nav className="flex-1 px-4 mt-4 space-y-2">
        <NavItem to="/dashboard/profile" label="My Profile" />
        <NavItem to="/dashboard/home" label="Dashboard" />
      </nav>

      {/* Footer */}
      
      
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

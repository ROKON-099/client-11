import { Link, NavLink } from "react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import logo from "../../assets/Logo.png";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logOut();
  };

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-red-600 font-semibold"
      : "text-gray-700 hover:text-red-600";

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Blood Donation Logo" className="w-10 h-10" />
            <span className="text-xl font-bold text-red-600 hidden sm:block">
              Blood Donation
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/donation-requests" className={navLinkClass}>
              Donation Requests
            </NavLink>

            {user && (
              <NavLink to="/funding" className={navLinkClass}>
                Funding
              </NavLink>
            )}

            {!user ? (
              <NavLink
                to="/login"
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Login
              </NavLink>
            ) : (
              <div className="relative group">
                <img
                  src={user.photoURL}
                  alt="user"
                  className="w-10 h-10 rounded-full cursor-pointer border"
                />

                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all">
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t px-4 py-4 space-y-3">
          <NavLink
            to="/donation-requests"
            className={navLinkClass}
            onClick={() => setOpen(false)}
          >
            Donation Requests
          </NavLink>

          {user && (
            <NavLink
              to="/funding"
              className={navLinkClass}
              onClick={() => setOpen(false)}
            >
              Funding
            </NavLink>
          )}

          {!user ? (
            <NavLink
              to="/login"
              className="block px-4 py-2 bg-red-600 text-white rounded text-center"
              onClick={() => setOpen(false)}
            >
              Login
            </NavLink>
          ) : (
            <>
              <NavLink
                to="/dashboard"
                className={navLinkClass}
                onClick={() => setOpen(false)}
              >
                Dashboard
              </NavLink>
              <button
                onClick={handleLogout}
                className="block text-left text-red-600"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

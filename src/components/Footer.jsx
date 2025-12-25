import { Link } from "react-router";
import logo from "../../assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid gap-8 sm:grid-cols-2 md:grid-cols-4">

        {/* Logo & About */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img src={logo} alt="Blood Donation Logo" className="w-10 h-10" />
            <h2 className="text-lg font-bold text-red-600">
              Blood Donation
            </h2>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            A platform that connects blood donors with people in need.
            Donate blood, save lives, and make a difference today.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-gray-900 font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="text-gray-600 hover:text-red-600">
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/donation-requests"
                className="text-gray-600 hover:text-red-600"
              >
                Donation Requests
              </Link>
            </li>
            <li>
              <Link to="/search" className="text-gray-600 hover:text-red-600">
                Search Donors
              </Link>
            </li>
            <li>
              <Link to="/login" className="text-gray-600 hover:text-red-600">
                Login
              </Link>
            </li>
          </ul>
        </div>

        {/* Dashboard Links */}
        <div>
          <h3 className="text-gray-900 font-semibold mb-4">Dashboard</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to="/dashboard"
                className="text-gray-600 hover:text-red-600"
              >
                Dashboard Home
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/profile"
                className="text-gray-600 hover:text-red-600"
              >
                Profile
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/my-donation-requests"
                className="text-gray-600 hover:text-red-600"
              >
                My Requests
              </Link>
            </li>
            <li>
              <Link
                to="/funding"
                className="text-gray-600 hover:text-red-600"
              >
                Funding
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-gray-900 font-semibold mb-4">Contact Us</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>📍 Dhaka, Bangladesh</li>
            <li>📞 +880 1234-567890</li>
            <li>✉️ support@blooddonation.com</li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Blood Donation Application. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

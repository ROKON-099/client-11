import { NavLink, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import axiosSecure from "../../hooks/axiosSecure";
import LoadingSpinner from "../comon/LoadingSpinner";

const Sidebar = () => {

  const { user, loading } = useAuth();

  const navigate = useNavigate();

  const { data: dbUser, isLoading } = useQuery({

    queryKey: ["userRole", user?.email],

    enabled: !loading && !!user?.email,

    queryFn: async () => {

      const res = await axiosSecure.get(
        `/users/${user?.email?.toLowerCase()}`
      );

      return res.data;

    },

  });

  if (loading || isLoading) {

    return <LoadingSpinner />;

  }

  const role = dbUser?.role || "donor";

  return (

    <aside
      className="
        w-64 min-h-screen
        bg-gradient-to-b from-red-50 via-white to-white
        border-r shadow-lg
        flex flex-col
      "
    >

      {/* Brand */}

      <div className="px-6 py-6 border-b space-y-3">

        <h1 className="text-2xl font-extrabold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">

          Blood-Donation

        </h1>

        <button
          onClick={() => navigate("/")}

          className="
            w-full
            text-left
            px-4 py-2
            rounded-lg
            border border-red-500
            text-red-600
            hover:bg-red-600 hover:text-white
            transition
          "
        >

          ← Back to Home

        </button>

      </div>


      {/* Navigation */}

      <nav className="flex-1 px-4 mt-6 space-y-2">


        <NavItem to="/dashboard" label="Dashboard" end />


        {/* ✅ Profile for ALL USERS */}

        <NavItem
          to="/dashboard/profile"
          label="My Profile"
        />


        {/* DONOR */}

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

            <NavItem
              to="/dashboard/funding"
              label="Funding"
            />

          </>

        )}


        {/* ADMIN */}

        {role === "admin" && (

          <>

            <NavItem
              to="/dashboard/all-users"
              label="All Users"
            />

            {/* ✅ FIXED ROUTE */}

            <NavItem
              to="/dashboard/all-blood-donation-request"
              label="All Donation Requests"
            />

            <NavItem
              to="/dashboard/funding"
              label="Funding"
            />

          </>

        )}


        {/* VOLUNTEER */}

        {role === "volunteer" && (

          <>

            {/* ✅ FIXED ROUTE */}

            <NavItem
              to="/dashboard/all-blood-donation-request"
              label="All Donation Requests"
            />

            <NavItem
              to="/dashboard/funding"
              label="Funding"
            />

          </>

        )}


      </nav>

    </aside>

  );

};

export default Sidebar;


/* -------- Menu Item -------- */


const NavItem = ({ to, label, end }) => (

  <NavLink
    to={to}
    end={end}

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
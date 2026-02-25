import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import axiosSecure from "../../../hooks/axiosSecure";
import LoadingSpinner from "../../../components/comon/LoadingSpinner";
import StatCard from "../../../components/dashboard/StatCard";

import {
  FaUsers,
  FaTint,
  FaDonate,
} from "react-icons/fa";


const AdminHome = () => {

  const { user } = useAuth();


  const {
    data: stats = {},
    isLoading,
    isError,
  } = useQuery({

    queryKey: ["admin-stats"],

    enabled: !!user?.email,

    queryFn: async () => {

      const res = await axiosSecure.get(
        "/admin-stats"
      );

      return res.data;

    },

  });


  if (isLoading)
    return <LoadingSpinner />;


  if (isError) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        <p className="text-red-500 font-medium">

          Failed to load dashboard data

        </p>

      </div>

    );

  }


  return (

    <div className="min-h-screen bg-gray-50 px-4 py-8">

      <div className="max-w-7xl mx-auto space-y-10">


        {/* Title */}

        <div
          data-aos="fade-up"
          className="bg-white rounded-3xl border shadow p-8"
        >

          <h1
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent"
          >

            Welcome Back, {user?.displayName || "Admin"}

          </h1>


          <p className="mt-3 text-gray-500">

            Manage users, track donations, and monitor platform performance.

          </p>


        </div>



        {/* Stat Cards */}

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >


          <StatCard
            title="Total Donors"
            value={stats.users ?? 0}
            icon={FaUsers}
          />


          <StatCard
            title="Total Funding"
            value={`$ ${stats.totalFunds ?? 0}`}
            icon={FaDonate}
          />


          <StatCard
            title="Blood Donation Requests"
            value={stats.requests ?? 0}
            icon={FaTint}
          />


        </div>


      </div>

    </div>

  );

};

export default AdminHome;
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import axiosSecure from "../../../hooks/axiosSecure";
import LoadingSpinner from "../../../components/comon/LoadingSpinner";
import StatCard from "../../../components/dashboard/StatCard";

const AdminHome = () => {
  const { user } = useAuth();

  const {
    data: stats = {},
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin-stats");
      return res.data;
    },
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <p className="text-center mt-10 text-red-600">
        Failed to load dashboard data
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white p-4">
      <div className="max-w-7xl mx-auto">

        {/* Welcome */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-red-600">
            Welcome, {user?.displayName}
          </h1>
          <p className="text-gray-600 mt-1">
            Admin Dashboard Overview
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            icon="👥"
            title="Total Users"
            value={stats.users ?? 0}
          />

          <StatCard
            icon="💰"
            title="Total Funding"
            value={`৳ ${stats.totalFunds ?? 0}`}
          />

          <StatCard
            icon="🩸"
            title="Blood Donation Requests"
            value={stats.requests ?? 0}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminHome;

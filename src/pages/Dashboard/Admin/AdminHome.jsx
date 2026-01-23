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

  if (isLoading) return <LoadingSpinner />;

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
          className="bg-white rounded-3xl border shadow-[0_12px_40px_rgba(0,0,0,0.06)] p-8"
        >
          <h1
            data-aos="fade-right"
            data-aos-delay="100"
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent"
          >
            Welcome Back, {user?.displayName || "Admin"}
          </h1>

          <p
            data-aos="fade-up"
            data-aos-delay="200"
            className="mt-3 text-gray-500 max-w-xl"
          >
            Manage users, track donations, and monitor platform performance.
          </p>
        </div>

        {/* Stats Cards */}
        <div
          data-aos="fade-up"
          data-aos-delay="300"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div className="bg-white rounded-2xl border shadow-sm hover:shadow-md transition p-6">
            <p className="text-sm text-gray-500">Total Donors</p>
            <h2 className="text-3xl font-semibold text-gray-800 mt-2">
              {stats.users ?? 0}
            </h2>
          </div>

          <div className="bg-white rounded-2xl border shadow-sm hover:shadow-md transition p-6">
            <p className="text-sm text-gray-500">Total Funding</p>
            <h2 className="text-3xl font-semibold text-gray-800 mt-2">
              $ {stats.totalFunds ?? 0}

            </h2>
          </div>

          <div className="bg-white rounded-2xl border shadow-sm hover:shadow-md transition p-6">
            <p className="text-sm text-gray-500">
              Blood Donation Requests
            </p>
            <h2 className="text-3xl font-semibold text-gray-800 mt-2">
              {stats.requests ?? 0}
            </h2>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminHome;

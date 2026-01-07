import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../../../hooks/axiosSecure";
import useAuth from "../../../hooks/useAuth";
import LoadingSpinner from "../../../components/comon/LoadingSpinner";
import DonationTable from "../../../components/dashboard/DonationTable";
import toast from "react-hot-toast";

const VolunteerHome = () => {
  const { user } = useAuth();

  const { data: requests = [], isLoading, refetch } = useQuery({
    queryKey: ["volunteer-recent-requests"],
    queryFn: async () => {
      const res = await axiosSecure.get("/donation-requests/all");
      return res.data.slice(0, 5); // recent 5
    },
  });

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axiosSecure.patch(`/donation-requests/${id}`, {
        donationStatus: newStatus,
      });
      toast.success(`Marked as ${newStatus}`);
      refetch();
    } catch {
      toast.error("Failed to update status");
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white p-4">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Welcome */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h1 className="text-3xl font-bold text-red-600">
            Welcome, {user?.displayName}
          </h1>
          <p className="text-gray-600 mt-1">
            Volunteer Dashboard
          </p>
        </div>

        {/* Recent Requests */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
            Recent Blood Donation Requests
          </h2>

          <DonationTable
            data={requests}
            role="volunteer"
            onStatusChange={handleUpdateStatus}
            showDelete={false}
          />
        </div>
      </div>
    </div>
  );
};

export default VolunteerHome;

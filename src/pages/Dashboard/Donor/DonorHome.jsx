import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";
import axiosSecure from "../../../hooks/axiosSecure";
import LoadingSpinner from "../../../components/comon/LoadingSpinner";
import DonationTable from "../../../components/dashboard/DonationTable";

const DonorHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: requests = [], refetch, isLoading } = useQuery({
    queryKey: ["donor-recent-requests", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/donation-requests?email=${user.email}`
      );

      return res.data
        .sort(
          (a, b) => new Date(b.donationDate) - new Date(a.donationDate)
        )
        .slice(0, 3);
    },
  });

  const updateStatus = async (id, status) => {
    await axiosSecure.patch(`/donation-requests/${id}`, {
      donationStatus: status,
    });
    toast.success(`Marked as ${status}`);
    refetch();
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this donation request?")) return;
    await axiosSecure.delete(`/donation-requests/${id}`);
    toast.success("Donation request deleted");
    refetch();
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Welcome */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h1 className="text-3xl font-bold text-red-600">
            Welcome, {user?.displayName}
          </h1>
          <p className="text-gray-600 mt-1">
            Thank you for being a lifesaver ❤️
          </p>
        </div>

        {/* Create Request Card */}
        <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-2">
            Create Donation Request
          </h2>
          <p className="text-sm opacity-90">
            Need blood urgently? Create a request and reach donors fast.
          </p>

          <button
            onClick={() =>
              navigate("/dashboard/create-donation-request")
            }
            className="mt-6 bg-white text-red-600 font-semibold px-6 py-3 rounded-lg hover:bg-red-100 transition"
          >
            + Create Donation Request
          </button>
        </div>

        {/* Recent Requests */}
        {requests.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
              <h2 className="text-xl font-semibold">
                My Recent Donation Requests
              </h2>

              <button
                onClick={() =>
                  navigate("/dashboard/my-donation-requests")
                }
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg transition"
              >
                View All Requests
              </button>
            </div>

            <DonationTable
              data={requests}
              role="donor"
              onStatusChange={updateStatus}
              onDelete={handleDelete}
              showDelete={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DonorHome;

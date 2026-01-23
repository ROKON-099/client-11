import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../../../hooks/axiosSecure";
import useAuth from "../../../hooks/useAuth";
import LoadingSpinner from "../../../components/comon/LoadingSpinner";
import toast from "react-hot-toast";

const AllDonationRequests = () => {
  const { user, loading } = useAuth();

  const {
    data: requests = [],
    isLoading,
    refetch,
    isError,
  } = useQuery({
    queryKey: ["all-donation-requests"],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get("/donation-requests/all");
      return res.data;
    },
  });

  const handleUpdateStatus = async (id, donationStatus) => {
    try {
      await axiosSecure.patch(`/donation-requests/${id}`, {
        donationStatus,
      });
      toast.success(`Marked as ${donationStatus}`);
      refetch();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update status"
      );
    }
  };

  if (loading || isLoading) return <LoadingSpinner />;

  if (isError) {
    return (
      <p className="text-center mt-10 text-red-600">
        Failed to load donation requests
      </p>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        All Donation Requests
      </h1>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Recipient</th>
            <th className="border p-2">Blood Group</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {requests.map((req) => (
            <tr key={req._id}>
              <td className="border p-2">{req.recipientName}</td>
              <td className="border p-2">{req.bloodGroup}</td>
              <td className="border p-2 capitalize">
                {req.donationStatus}
              </td>

              <td className="border p-2 space-x-2">
                {/* VALID FLOW ONLY */}
                {req.donationStatus === "pending" && (
                  <button
                    onClick={() =>
                      handleUpdateStatus(req._id, "inprogress")
                    }
                    className="px-3 py-1 bg-blue-500 text-white rounded"
                  >
                    In Progress
                  </button>
                )}

                {req.donationStatus === "inprogress" && (
                  <>
                    <button
                      onClick={() =>
                        handleUpdateStatus(req._id, "done")
                      }
                      className="px-3 py-1 bg-green-600 text-white rounded"
                    >
                      Done
                    </button>
                    <button
                      onClick={() =>
                        handleUpdateStatus(req._id, "canceled")
                      }
                      className="px-3 py-1 bg-red-600 text-white rounded"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}

          {requests.length === 0 && (
            <tr>
              <td
                colSpan="4"
                className="text-center py-6 text-gray-500"
              >
                No donation requests found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AllDonationRequests;

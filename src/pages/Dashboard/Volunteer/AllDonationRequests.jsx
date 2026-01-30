import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../../../hooks/axiosSecure";
import useAuth from "../../../hooks/useAuth";
import LoadingSpinner from "../../../components/comon/LoadingSpinner";
import toast from "react-hot-toast";

const AllDonationRequests = () => {
  const { user, loading } = useAuth();
  const [status, setStatus] = useState("all");

  const {
    data: requests = [],
    isLoading,
    refetch,
    isError,
  } = useQuery({
    queryKey: ["all-donation-requests", status],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const query = status === "all" ? "" : `?status=${status}`;
      const res = await axiosSecure.get(
        `/donation-requests/all${query}`
      );
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
    <div
      data-aos="fade-up"
      className="min-h-screen bg-gradient-to-br from-red-50 to-white p-4"
    >
      <div
        data-aos="fade-up"
        data-aos-delay="100"
        className="max-w-7xl mx-auto bg-white rounded-xl shadow p-6"
      >
        {/* Header */}
        <div
          data-aos="fade-right"
          data-aos-delay="200"
          className="flex flex-col md:flex-row md:justify-between md:items-center mb-6"
        >
          <h1 className="text-2xl font-bold text-red-600">
            All Blood Donation Requests
          </h1>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-3 md:mt-0 border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border rounded-lg overflow-hidden">
            <thead className="bg-red-100">
              <tr>
                <th className="border p-3 text-left">Recipient</th>
                <th className="border p-3 text-left">Blood Group</th>
                <th className="border p-3 text-left">Status</th>
                <th className="border p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((req) => (
                <tr
                  key={req._id}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="border p-3">
                    {req.recipientName}
                  </td>
                  <td className="border p-3 font-semibold">
                    {req.bloodGroup}
                  </td>
                  <td className="border p-3 capitalize">
                    {req.donationStatus}
                  </td>

                  <td className="border p-3 space-x-2">
                    {req.donationStatus === "pending" && (
                      <button
                        onClick={() =>
                          handleUpdateStatus(
                            req._id,
                            "inprogress"
                          )
                        }
                        className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded transition"
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
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded transition"
                        >
                          Done
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateStatus(
                              req._id,
                              "canceled"
                            )
                          }
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded transition"
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
      </div>
    </div>
  );
};

export default AllDonationRequests;

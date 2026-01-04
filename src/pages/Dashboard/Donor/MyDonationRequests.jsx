import { useState } from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";
import axiosSecure from "../../../hooks/axiosSecure";

const ITEMS_PER_PAGE = 5;

const MyDonationRequests = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const { data: requests = [], refetch, isLoading } = useQuery({
    queryKey: ["my-donation-requests", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/donation-requests?email=${user.email}`
      );

      // ✅ SORT by donationDate (exists in DB)
      return res.data.sort(
        (a, b) =>
          new Date(b.donationDate) - new Date(a.donationDate)
      );
    },
  });

  const filtered =
    status === "all"
      ? requests
      : requests.filter(
          (r) => r.donationStatus === status
        );

  const totalPages = Math.ceil(
    filtered.length / ITEMS_PER_PAGE
  );

  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const updateStatus = async (id, newStatus) => {
    await axiosSecure.patch(`/donation-requests/${id}`, {
      donationStatus: newStatus,
    });
    toast.success(`Marked as ${newStatus}`);
    refetch();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this donation request?")) return;
    await axiosSecure.delete(`/donation-requests/${id}`);
    toast.success("Deleted");
    refetch();
  };

  if (isLoading)
    return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white p-4">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <h1 className="text-2xl font-bold text-red-600">
            My Donation Requests
          </h1>

          {/* Filter */}
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="mt-3 md:mt-0 border px-4 py-2 rounded-lg"
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
          <table className="w-full border text-sm">
            <thead className="bg-red-100">
              <tr>
                <th className="border px-3 py-2">Recipient</th>
                <th className="border px-3 py-2">Location</th>
                <th className="border px-3 py-2">Date</th>
                <th className="border px-3 py-2">Time</th>
                <th className="border px-3 py-2">Blood</th>
                <th className="border px-3 py-2">Status</th>
                <th className="border px-3 py-2">Donor Info</th>
                <th className="border px-3 py-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-6">
                    No donation requests found
                  </td>
                </tr>
              ) : (
                paginated.map((req) => (
                  <tr key={req._id} className="hover:bg-red-50">
                    <td className="border px-3 py-2">
                      {req.recipientName}
                    </td>
                    <td className="border px-3 py-2">
                      {req.recipientDistrict}, {req.recipientUpazila}
                    </td>
                    <td className="border px-3 py-2">
                      {req.donationDate}
                    </td>
                    <td className="border px-3 py-2">
                      {req.donationTime}
                    </td>
                    <td className="border px-3 py-2 font-semibold text-red-600">
                      {req.bloodGroup}
                    </td>
                    <td className="border px-3 py-2 capitalize">
                      {req.donationStatus}
                    </td>

                    {/* Donor info only when inprogress */}
                    <td className="border px-3 py-2">
                      {req.donationStatus === "inprogress" ? (
                        <>
                          <p>{req.donorName}</p>
                          <p className="text-xs text-gray-500">
                            {req.donorEmail}
                          </p>
                        </>
                      ) : (
                        "—"
                      )}
                    </td>

                    {/* Actions */}
                    <td className="border px-3 py-2 space-x-2">
                      {req.donationStatus === "inprogress" && (
                        <>
                          <button
                            onClick={() =>
                              updateStatus(req._id, "done")
                            }
                            className="text-green-600"
                          >
                            Done
                          </button>
                          <button
                            onClick={() =>
                              updateStatus(req._id, "canceled")
                            }
                            className="text-red-600"
                          >
                            Cancel
                          </button>
                        </>
                      )}

                      <Link
                        to={`/donation-details/${req._id}`}
                        className="text-blue-600"
                      >
                        View
                      </Link>

                      <button
                        onClick={() => handleDelete(req._id)}
                        className="text-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {[...Array(totalPages).keys()].map((i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-4 py-2 rounded ${
                  page === i + 1
                    ? "bg-red-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyDonationRequests;

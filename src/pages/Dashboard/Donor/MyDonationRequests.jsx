import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";
import axiosSecure from "../../../hooks/axiosSecure";
import DonationTable from "../../../components/dashboard/DonationTable";
import LoadingSpinner from "../../../components/comon/LoadingSpinner";
import { Link } from "react-router-dom";

const ITEMS_PER_PAGE = 5;

const MyDonationRequests = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const {
    data: requests = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["my-donation-requests", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/donation-requests?email=${user.email.toLowerCase()}`
      );
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

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white p-4">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow p-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <h1 className="text-2xl font-bold text-red-600">
            My Donation Requests
          </h1>

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
        <DonationTable
          data={paginated}
          role="donor"
          onStatusChange={updateStatus}
          onDelete={handleDelete}
          showDelete={true}
        />

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

        {/* Bottom Button */}
        <div className="flex justify-center mt-8">
          <Link
            to="/dashboard/create-donation-request"
            className="px-6 py-2 rounded-lg bg-red-600 text-white font-medium"
          >
            {requests.length === 0
              ? "Create Donation Request"
              : "Add More Request"}
          </Link>
        </div>

      </div>
    </div>
  );
};

export default MyDonationRequests;

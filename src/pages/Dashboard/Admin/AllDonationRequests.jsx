import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axiosSecure from "../../../hooks/axiosSecure";
import DonationTable from "../../../components/dashboard/DonationTable";
import LoadingSpinner from "../../../components/comon/LoadingSpinner";

const AllBloodDonationRequests = ({ role = "admin" }) => {
  const [status, setStatus] = useState("all");

  const { data: requests = [], refetch, isLoading } = useQuery({
    queryKey: ["all-donation-requests", status],
    queryFn: async () => {
      const query = status === "all" ? "" : `?status=${status}`;
      const res = await axiosSecure.get(
        `/donation-requests/all${query}`
      );
      return res.data;
    },
  });

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
    toast.success("Donation request deleted");
    refetch();
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white p-4">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow p-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <h1 className="text-2xl font-bold text-red-600">
            All Blood Donation Requests
          </h1>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-3 md:mt-0 border px-4 py-2 rounded-lg"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>

        {/* Reusable Table */}
        <DonationTable
          data={requests}
          role={role}
          onStatusChange={updateStatus}
          onDelete={handleDelete}
          showDelete={role === "admin"}
        />
      </div>
    </div>
  );
};

export default AllBloodDonationRequests;

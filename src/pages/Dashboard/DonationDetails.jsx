import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import axiosSecure from "../../hooks/axiosSecure";
import LoadingSpinner from "../../components/comon/LoadingSpinner";

const DonationDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const {
    data: donation,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["donation-details", id],
    queryFn: async () => {
      const res = await axiosSecure.get("/donation-requests/all");
      return res.data.find((d) => d._id === id) || null;
    },
  });

  const handleConfirmDonation = async () => {
    try {
      await axiosSecure.patch(`/donation-requests/${id}`, {
        donationStatus: "inprogress",
        donorName: user.displayName,
        donorEmail: user.email,
      });

      toast.success("Donation confirmed successfully");
      setOpen(false);
      refetch();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to confirm donation"
      );
    }
  };

  if (isLoading) return <LoadingSpinner />;

  if (isError || !donation) {
    return (
      <p className="text-center mt-10 text-red-600">
        Donation request not found
      </p>
    );
  }

  const isOwnRequest = donation.requesterEmail === user?.email;
  const canDonate =
    donation.donationStatus === "pending" &&
    user &&
    !isOwnRequest;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white px-4 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">
        <h1 className="text-3xl font-bold text-red-600 mb-6">
          Donation Request Details
        </h1>

        {/* Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <Info label="Recipient Name" value={donation.recipientName} />
          <Info
            label="Location"
            value={`${donation.recipientDistrict}, ${donation.recipientUpazila}`}
          />
          <Info label="Hospital" value={donation.hospitalName} />
          <Info label="Address" value={donation.fullAddress} />
          <Info label="Blood Group" value={donation.bloodGroup} />
          <Info label="Donation Date" value={donation.donationDate} />
          <Info label="Donation Time" value={donation.donationTime} />
          <Info label="Status" value={donation.donationStatus} />
        </div>

        {/* Message */}
        <div className="mt-6">
          <p className="font-semibold text-gray-700 mb-1">
            Request Message
          </p>
          <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
            {donation.requestMessage}
          </p>
        </div>

        {/* Donate Button */}
        {canDonate && (
          <button
            onClick={() => setOpen(true)}
            className="mt-8 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition"
          >
            Donate
          </button>
        )}
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-red-600 mb-4">
              Confirm Donation
            </h2>

            <div className="space-y-3">
              <input
                readOnly
                value={user.displayName}
                className="w-full border px-4 py-2 rounded-lg bg-gray-100"
              />
              <input
                readOnly
                value={user.email}
                className="w-full border px-4 py-2 rounded-lg bg-gray-100"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-lg border"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDonation}
                className="px-4 py-2 rounded-lg bg-red-600 text-white"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationDetails;

/* -------- Info Component -------- */
const Info = ({ label, value }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <p className="text-gray-500 text-xs mb-1">{label}</p>
    <p className="font-medium text-gray-800">{value}</p>
  </div>
);

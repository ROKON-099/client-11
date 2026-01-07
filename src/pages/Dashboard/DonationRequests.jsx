import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import LoadingSpinner from "../../components/comon/LoadingSpinner";

const DonationRequests = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    data: requests = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["public-donation-requests"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/donation-requests/public`
      );
      return res.data;
    },
  });

  const handleView = (id) => {
    if (!user) {
      navigate("/login");
    } else {
      navigate(`/donation-details/${id}`);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  if (isError) {
    return (
      <p className="text-center mt-10 text-red-600">
        Failed to load donation requests
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white px-4 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-red-600 mb-8 text-center">
          Pending Donation Requests
        </h1>

        {requests.length === 0 ? (
          <p className="text-center text-gray-500">
            No pending donation requests available
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((req) => (
              <div
                key={req._id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {req.recipientName}
                </h2>

                <p className="text-gray-600 text-sm mb-1">
                  📍 {req.recipientDistrict}, {req.recipientUpazila}
                </p>

                <p className="text-sm mb-1">
                  🩸 Blood Group:{" "}
                  <span className="font-semibold text-red-600">
                    {req.bloodGroup}
                  </span>
                </p>

                <p className="text-sm mb-1">
                  📅 Date: {req.donationDate}
                </p>

                <p className="text-sm mb-4">
                  ⏰ Time: {req.donationTime}
                </p>

                <button
                  onClick={() => handleView(req._id)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationRequests;

import { useNavigate, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";
import axiosSecure from "../../../hooks/axiosSecure";
import LoadingSpinner from "../../../components/comon/LoadingSpinner";

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

        {/* Welcome Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h1 className="text-3xl font-bold text-red-600">
            Welcome, {user?.displayName}
          </h1>
          <p className="text-gray-600 mt-1">
            Thank you for being a lifesaver ❤️
          </p>
        </div>

        {/* Create Donation Request Cards */}
        <div className="">
          <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl p-6 shadow-lg flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Create Donation Request 
              </h2>
              <p className="text-sm opacity-90">
                Need blood urgently? Create a request and reach donors fast.
              </p>
            </div>

            <button
              onClick={() =>
                navigate("/dashboard/create-donation-request")
              }
              className="mt-6 bg-white text-red-600 font-semibold px-6 py-3 rounded-lg hover:bg-red-100 transition w-fit"
            >
              + Create Donation Request
            </button>
          </div>
        </div>

        {/* Recent Requests Table */}
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
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg transition w-fit"
              >
                View All Requests
              </button>
            </div>

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
                  {requests.map((req) => (
                    <tr key={req._id} className="hover:bg-red-50">
                      <td className="border px-3 py-2">{req.recipientName}</td>
                      <td className="border px-3 py-2">
                        {req.recipientDistrict}, {req.recipientUpazila}
                      </td>
                      <td className="border px-3 py-2">{req.donationDate}</td>
                      <td className="border px-3 py-2">{req.donationTime}</td>
                      <td className="border px-3 py-2 font-semibold text-red-600">
                        {req.bloodGroup}
                      </td>
                      <td className="border px-3 py-2 capitalize">
                        {req.donationStatus}
                      </td>

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

                      <td className="border px-3 py-2 space-x-2 whitespace-nowrap">
                        {req.donationStatus === "inprogress" && (
                          <>
                            <button
                              onClick={() =>
                                updateStatus(req._id, "done")
                              }
                              className="text-green-600 hover:underline"
                            >
                              Done
                            </button>
                            <button
                              onClick={() =>
                                updateStatus(req._id, "canceled")
                              }
                              className="text-red-600 hover:underline"
                            >
                              Cancel
                            </button>
                          </>
                        )}

                        <Link
                          to={`/dashboard/edit-request/${req._id}`}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() => handleDelete(req._id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>

                        <Link
                          to={`/donation-details/${req._id}`}
                          className="text-purple-600 hover:underline"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonorHome;

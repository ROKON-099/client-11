import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../../../hooks/axiosSecure";

const AllDonationRequests = () => {
  const { data: requests = [], refetch } = useQuery({
    queryKey: ["all-donation-requests"],
    queryFn: async () => {
      const res = await axiosSecure.get("/donation-requests");
      return res.data;
    },
  });

  const handleUpdateStatus = async (id, status) => {
    await axiosSecure.patch(`/donation-requests/${id}`, { status });
    refetch();
  };

  return (
    <div>
      <h1>All Donation Requests</h1>
      <table>
        <thead>
          <tr><th>Recipient</th><th>Blood Group</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {requests.map(req => (
            <tr key={req._id}>
              <td>{req.recipientName}</td>
              <td>{req.bloodGroup}</td>
              <td>{req.status}</td>
              <td>
                <button onClick={() => handleUpdateStatus(req._id, "approved")}>Approve</button>
                <button onClick={() => handleUpdateStatus(req._id, "rejected")}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllDonationRequests;
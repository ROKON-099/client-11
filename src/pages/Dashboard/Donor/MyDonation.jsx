import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../../../hooks/axiosSecure";
import useAuth from "../../../hooks/useAuth";

const MyDonation = () => {
  const { user } = useAuth();
  const { data: donations = [] } = useQuery({
    queryKey: ["my-donations"],
    queryFn: async () => {
      const res = await axiosSecure.get("/donation-requests", { params: { requesterEmail: user.email } });
      return res.data;
    },
  });

  return (
    <div>
      <h1>My Donations</h1>
      <ul>
        {donations.map(d => (
          <li key={d._id}>{d.recipientName} - {d.status}</li>
        ))}
      </ul>
    </div>
  );
};

export default MyDonation;
import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../../../hooks/axiosSecure";

const AdminHome = () => {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin-stats");
      return res.data;
    },
  });

  return (
    <div>
      <h1>Admin Home</h1>
      <p>Users: {stats?.users}</p>
      <p>Requests: {stats?.requests}</p>
      <p>Total Funds: {stats?.totalFunds}</p>
    </div>
  );
};

export default AdminHome;
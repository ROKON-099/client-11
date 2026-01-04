import { Navigate, useLocation } from "react-router";
import useAuth from "../hooks/useAuth";
import axiosSecure from "../hooks/axiosSecure";
import { useQuery } from "@tanstack/react-query";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  const { data: isAdmin, isLoading: isAdminLoading } = useQuery({
    queryKey: ["isAdmin", user?.email],
    enabled: !!user?.email && !!localStorage.getItem("token"),
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data.role === "admin";
    },
  });

  if (loading || isAdminLoading) {
    return <div>Loading...</div>;
  }

  if (user && isAdmin) {
    return children;
  }

  return <Navigate to="/" state={{ from: location }} replace />;
};

export default AdminRoute;
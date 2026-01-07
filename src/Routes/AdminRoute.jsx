import { Navigate, useLocation } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../hooks/useAuth";
import axiosSecure from "../hooks/axiosSecure";
import LoadingSpinner from "../components/comon/LoadingSpinner";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  const { data: isAdmin, isLoading } = useQuery({
    queryKey: ["isAdmin", user?.email],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/admin/${user.email}`);
      return res.data.admin;
    },
  });

  if (loading || isLoading) {
    return <LoadingSpinner />;
  }

  if (user && isAdmin) {
    return children;
  }

  return (
    <Navigate
      to="/login"
      state={{ from: location.pathname }}
      replace
    />
  );
};

export default AdminRoute;

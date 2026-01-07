import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import axiosSecure from "../../hooks/axiosSecure";
import LoadingSpinner from "../../components/comon/LoadingSpinner";

// role-based dashboard redirector
const DashboardHome = () => {
  const { user, loading } = useAuth();

  const { data: dbUser, isLoading } = useQuery({
    queryKey: ["dashboard-role", user?.email],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data;
    },
  });

  if (loading || isLoading) {
    return <LoadingSpinner />;
  }

  // Safety fallback
  if (!dbUser?.role) {
    return <Navigate to="/" replace />;
  }

  // Role-based redirect
  if (dbUser.role === "admin") {
    return <Navigate to="/dashboard/all-users" replace />;
  }

  if (dbUser.role === "volunteer") {
    return (
      <Navigate
        to="/dashboard/all-blood-donation-request"
        replace
      />
    );
  }

  // donor (default)
  return (
    <Navigate
      to="/dashboard/my-donation-requests"
      replace
    />
  );
};

export default DashboardHome;

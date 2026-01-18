import { Navigate, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import axiosSecure from "../../hooks/axiosSecure";
import LoadingSpinner from "../../components/comon/LoadingSpinner";
import AdminHome from "./Admin/AdminHome";

// role-based dashboard redirector
const DashboardHome = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

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

  return (
    <div>
      {/* 🔹 Role-based content */}
      {dbUser.role === "admin" && <AdminHome />}

      {dbUser.role === "volunteer" && (
        <Navigate
          to="/dashboard/all-blood-donation-request"
          replace
        />
      )}

      {dbUser.role === "donor" && (
        <Navigate
          to="/dashboard/my-donation-requests"
          replace
        />
      )}
    </div>
  );
};

export default DashboardHome;

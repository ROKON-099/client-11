import { Navigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../hooks/useAuth";
import axiosSecure from "../hooks/axiosSecure";
import LoadingSpinner from "../components/comon/LoadingSpinner";

const VolunteerRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  const {
    data: isVolunteer,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["isVolunteer", user?.email],
    enabled: !!user?.email,           // 🔴 important
    retry: false,                     // 🔴 important
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/users/volunteer/${user.email}`
      );
      return res.data.volunteer;
    },
  });

  // ⏳ wait until auth + role fully resolved
  if (loading || isLoading || isVolunteer === undefined) {
    return <LoadingSpinner />;
  }

  // ✅ Volunteer or Admin allowed
  if (user && isVolunteer) {
    return children;
  }

  // ✅ Logged in but wrong role → dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // ❌ Not logged in → login
  return (
    <Navigate
      to="/login"
      state={{ from: location.pathname }}
      replace
    />
  );
};

export default VolunteerRoute;

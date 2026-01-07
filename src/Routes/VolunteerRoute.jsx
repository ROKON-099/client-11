import { Navigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../hooks/useAuth";
import axiosSecure from "../hooks/axiosSecure";
import LoadingSpinner from "../components/comon/LoadingSpinner";

const VolunteerRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  const { data: isVolunteer, isLoading } = useQuery({
    queryKey: ["isVolunteer", user?.email],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/volunteer/${user.email}`);
      return res.data.volunteer;
    },
  });

  if (loading || isLoading) {
    return <LoadingSpinner />;
  }

  if (user && isVolunteer) {
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

export default VolunteerRoute;

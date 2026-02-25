import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import axiosSecure from "../../hooks/axiosSecure";
import LoadingSpinner from "../../components/comon/LoadingSpinner";

/* ROLE HOMES */

import AdminHome from "./Admin/AdminHome";
import VolunteerHome from "./Volunteer/VolunteerHome";
import DonorHome from "./Donor/DonorHome";


const DashboardHome = () => {

  const { user, loading } = useAuth();


  const {

    data: dbUser,

    isLoading,

    isError,

  } = useQuery({

    queryKey: ["dashboard-role", user?.email],

    enabled: !loading && !!user?.email,

    queryFn: async () => {

      const res = await axiosSecure.get(
        `/users/${user?.email}`
      );

      return res.data;

    },

  });



  /* WAIT */

  if (loading || isLoading) {

    return <LoadingSpinner />;

  }



  /* ERROR */

  if (isError) {

    return (

      <p className="text-center mt-10 text-red-600">

        Failed to load dashboard

      </p>

    );

  }



  /* DEFAULT ROLE */

  const role = dbUser?.role || "donor";



  /* ADMIN */

  if (role === "admin") {

    return <AdminHome />;

  }



  /* VOLUNTEER */

  if (role === "volunteer") {

    return <VolunteerHome />;

  }



  /* DONOR */

  return <DonorHome />;

};


export default DashboardHome;
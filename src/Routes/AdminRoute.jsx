import { Navigate, useLocation } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";

import useAuth from "../hooks/useAuth";

import axiosSecure from "../hooks/axiosSecure";

import LoadingSpinner from "../components/comon/LoadingSpinner";


const AdminRoute = ({ children }) => {

  const { user, loading } = useAuth();

  const location = useLocation();



  const {

    data: isAdmin,

    isLoading,

  } = useQuery({

    queryKey: ["isAdmin", user?.email],

    enabled: !!user?.email,


    queryFn: async () => {

      const res = await axiosSecure.get(

        `/users/admin/${user.email}`

      );

      return res.data.admin;

    },

  });



  /* Loading */

  if (loading || isLoading) {

    return <LoadingSpinner />;

  }



  /* Not logged in */

  if (!user) {

    return (

      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />

    );

  }



  /* Not admin */

  if (!isAdmin) {

    return (

      <Navigate
        to="/dashboard"
        replace
      />

    );

  }



  /* Admin */

  return children;

};


export default AdminRoute;
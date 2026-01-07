import { createBrowserRouter, Navigate } from "react-router-dom";

// layouts
import MainLayout from "../Layout/MainLayout";
import DashboardLayout from "../Layout/DashboardLayout";

// public pages
import Home from "../pages/Dashboard/Home";
import Login from "../pages/Dashboard/Login";
import Registration from "../pages/Dashboard/Registration";
import Search from "../pages/Dashboard/search";
import DonationRequests from "../pages/Dashboard/DonationRequests";
import DonationDetails from "../pages/Dashboard/DonationDetails";
import ErrorPage from "../pages/Dashboard/Errorpage";

// dashboard common
import Profile from "../pages/Dashboard/Profile";
import DashboardHome from "../pages/Dashboard/DashboardHome";


// admin pages
import AdminHome from "../pages/Dashboard/Admin/AdminHome";
import AllUsers from "../pages/Dashboard/Admin/AllUsers";
import AllDonationRequestsAdmin from "../pages/Dashboard/Admin/AllDonationRequests";
import Funding from "../pages/Dashboard/Admin/Funding";

// donor pages
import DonorHome from "../pages/Dashboard/Donor/DonorHome";
import CreateDonationRequest from "../pages/Dashboard/Donor/CreateDonationRequest";
import MyDonationRequests from "../pages/Dashboard/Donor/MyDonationRequests";

// volunteer pages
import VolunteerHome from "../pages/Dashboard/Volunteer/VolunteerHome";
import AllDonationRequestsVolunteer from "../pages/Dashboard/Volunteer/AllDonationRequests";

// route guards
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import VolunteerRoute from "./VolunteerRoute";

const router = createBrowserRouter([
  /* ================= PUBLIC ================= */
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Registration /> },
      { path: "search", element: <Search /> },
      { path: "donation-requests", element: <DonationRequests /> },
      {
        path: "donation-details/:id",
        element: (
          <PrivateRoute>
            <DonationDetails />
          </PrivateRoute>
        ),
      },
    ],
  },

  /* ================= DASHBOARD ================= */
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      /* -------- ROLE AWARE LANDING -------- */
      {
        index: true,
        element: <DashboardHome />, // decides based on role
      },

      /* -------- COMMON -------- */
      { path: "profile", element: <Profile /> },

      /* -------- DONOR -------- */
      {
        path: "my-donation-requests",
        element: <MyDonationRequests />,
      },
      {
        path: "create-donation-request",
        element: <CreateDonationRequest />,
      },

      /* -------- ADMIN -------- */
      {
        path: "all-users",
        element: (
          <AdminRoute>
            <AllUsers />
          </AdminRoute>
        ),
      },
      {
        path: "all-blood-donation-request",
        element: (
          <AdminRoute>
            <AllDonationRequestsAdmin />
          </AdminRoute>
        ),
      },
      {
        path: "funding",
        element: (
          <AdminRoute>
            <Funding />
          </AdminRoute>
        ),
      },

      /* -------- VOLUNTEER -------- */
      {
        path: "volunteer-home",
        element: (
          <VolunteerRoute>
            <VolunteerHome />
          </VolunteerRoute>
        ),
      },
      {
        path: "all-blood-donation-request-volunteer",
        element: (
          <VolunteerRoute>
            <AllDonationRequestsVolunteer />
          </VolunteerRoute>
        ),
      },
    ],
  },
]);

export default router;

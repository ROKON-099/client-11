import { createBrowserRouter } from "react-router";

// layouts
import MainLayout from "../Layout/MainLayout";
import DashboardLayout from "../Layout/DashboardLayout";

// public pages
import Home from "../pages/Dashboard/Home";
import Login from "../pages/Dashboard/Login";
import Registration from "../pages/Dashboard/Registration";
import Search from "../pages/Dashboard/Search";
import DonationRequests from "../pages/Dashboard/DonationRequests";
import DonationDetails from "../pages/Dashboard/DonationDetails";
import ErrorPage from "../pages/Dashboard/ErrorPage";

// dashboard common
import Profile from "../pages/Dashboard/Profile";

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
  // ================= MAIN ROUTES =================
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

  // ================= DASHBOARD ROUTES =================
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      // ✅ DEFAULT DASHBOARD
      { index: true, element: <DonorHome /> },

      // COMMON
      { path: "profile", element: <Profile /> },

      // ADMIN
      {
        path: "admin",
        element: (
          <AdminRoute>
            <AdminHome />
          </AdminRoute>
        ),
      },
      {
        path: "admin/all-users",
        element: (
          <AdminRoute>
            <AllUsers />
          </AdminRoute>
        ),
      },
      {
        path: "admin/all-donation-requests",
        element: (
          <AdminRoute>
            <AllDonationRequestsAdmin />
          </AdminRoute>
        ),
      },
      {
        path: "admin/funding",
        element: (
          <AdminRoute>
            <Funding />
          </AdminRoute>
        ),
      },

      // DONOR (original)
      { path: "donor", element: <DonorHome /> },
      {
        path: "donor/create-donation-request",
        element: <CreateDonationRequest />,
      },
      {
        path: "donor/my-donation-requests",
        element: <MyDonationRequests />,
      },

      // ✅ ADDED (for sidebar compatibility)
      {
        path: "create-donation-request",
        element: <CreateDonationRequest />,
      },
      {
        path: "my-donation-requests",
        element: <MyDonationRequests />,
      },

      // VOLUNTEER
      {
        path: "volunteer",
        element: (
          <VolunteerRoute>
            <VolunteerHome />
          </VolunteerRoute>
        ),
      },
      {
        path: "volunteer/all-donation-requests",
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

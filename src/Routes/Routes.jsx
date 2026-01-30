import { createBrowserRouter } from "react-router-dom";

/* ================= LAYOUTS ================= */
import MainLayout from "../Layout/MainLayout";
import DashboardLayout from "../Layout/DashboardLayout";

/* ================= PUBLIC PAGES ================= */
import Home from "../pages/Dashboard/Home";
import Login from "../pages/Dashboard/Login";
import Registration from "../pages/Dashboard/Registration";
import Search from "../pages/Dashboard/search";
import DonationRequests from "../pages/Dashboard/DonationRequests";
import DonationDetails from "../pages/Dashboard/DonationDetails";
import ErrorPage from "../pages/Dashboard/ErrorPage";

/* ================= DASHBOARD COMMON ================= */
import Profile from "../pages/Dashboard/Profile";
import DashboardHome from "../pages/Dashboard/DashboardHome";
import Funding from "../pages/Dashboard/Funding";

/* ================= ADMIN ================= */
import AllUsers from "../pages/Dashboard/Admin/AllUsers";
import AllDonationRequestsAdmin from "../pages/Dashboard/Admin/AllDonationRequests";

/* ================= DONOR ================= */
import CreateDonationRequest from "../pages/Dashboard/Donor/CreateDonationRequest";
import MyDonationRequests from "../pages/Dashboard/Donor/MyDonationRequests";

/* ================= VOLUNTEER ================= */
import AllDonationRequestsVolunteer from "../pages/Dashboard/Volunteer/AllDonationRequests";

/* ================= ROUTE GUARDS ================= */
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import VolunteerRoute from "./VolunteerRoute";

/* ================= ROUTER ================= */
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
      /* ===== DASHBOARD HOME (ROLE AWARE) ===== */
      {
        index: true,
        element: <DashboardHome />,
      },

      /* ===== COMMON ===== */
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "funding",
        element: (
          <PrivateRoute>
            <Funding />
          </PrivateRoute>
        ),
      },

      /* ===== DONOR ===== */
      {
        path: "my-donation-requests",
        element: <MyDonationRequests />,
      },
      {
        path: "create-donation-request",
        element: <CreateDonationRequest />,
      },

      /* ===== ADMIN ===== */
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

      /* ===== VOLUNTEER ===== */
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

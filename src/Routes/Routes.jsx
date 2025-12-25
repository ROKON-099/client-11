import { createBrowserRouter } from "react-router";
import MainLayout from "../Layout/MainLayout";



import Login from "../pages/Login";
import Register from "../pages/Registration";
import ErrorPage from "../pages/ErrorPage";
import Home from "../pages/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
       element: <Home />,
     },
     {
        path: "login",
       element: <Login />,
     },
      {
       path: "register",
        element: <Register />,
    },
     ],
  },
]);

export default router;

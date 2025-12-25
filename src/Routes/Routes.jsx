import { createBrowserRouter } from "react-router";
import MainLayout from "../Layout/MainLayout";


// pages (create simple ones first)
//import Home from "../components/Home";
//import Login from "../components/Login";
//import Register from "../components/Register";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
  //  errorElement: <ErrorPage />,
   // children: [
   //   {
      //  index: true,
      //  element: <Home />,
     // },
     // {
     //   path: "login",
    ///   element: <Login />,
     // },
    //  {
      //  path: "register",
      //  element: <Register />,
   //   },
    // ],
  },
]);

export default router;

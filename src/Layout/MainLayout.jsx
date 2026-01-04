import { Outlet } from "react-router";
import Navbar from "../components/comon/Navbar";
import Footer from "../components/comon/Footer";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;

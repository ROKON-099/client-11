import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";

const DashboardLayout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Mobile overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed md:static z-50
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          transition-transform duration-300
        `}
      >
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 w-full">
        {/* Mobile top bar */}
        <div className="md:hidden p-4 bg-white shadow flex justify-between items-center">
          <button
            onClick={() => setOpen(true)}
            className="text-2xl"
          >
            ☰
          </button>
          <span className="font-semibold text-red-600">
            Dashboard
          </span>
        </div>

        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;

import { NavLink } from "react-router";

const Sidebar = () => {
  return (
    <div className="w-64 bg-red-600 text-white min-h-screen p-4">
      <h2 className="text-xl font-bold mb-6">Dashboard</h2>

      <nav className="flex flex-col gap-3">
        <NavLink to="/dashboard/profile">Profile</NavLink>
        <NavLink to="/dashboard">Dashboard Home</NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;

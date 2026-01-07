import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axiosSecure from "../../../hooks/axiosSecure";

const AllUsers = () => {
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: users = [], refetch, isLoading } = useQuery({
    queryKey: ["all-users", statusFilter],
    queryFn: async () => {
      const query =
        statusFilter === "all" ? "" : `?status=${statusFilter}`;
      const res = await axiosSecure.get(`/users${query}`);
      return res.data;
    },
  });

  const updateStatus = async (id, status) => {
    await axiosSecure.patch(`/users/status/${id}`, { status });
    toast.success(`User ${status}`);
    refetch();
  };

  const makeVolunteer = async (id) => {
    await axiosSecure.patch(`/users/volunteer/${id}`);
    toast.success("User is now a Volunteer");
    refetch();
  };

  const makeAdmin = async (id) => {
    await axiosSecure.patch(`/users/admin/${id}`);
    toast.success("User is now an Admin");
    refetch();
  };

  if (isLoading) {
    return (
      <p className="text-center mt-10 text-gray-600">
        Loading users...
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white p-4">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <h1 className="text-2xl font-bold text-red-600">
            All Users
          </h1>

          {/* Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="mt-3 md:mt-0 border px-4 py-2 rounded-lg"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead className="bg-red-100">
              <tr>
                <th className="border px-3 py-2">Avatar</th>
                <th className="border px-3 py-2">Name</th>
                <th className="border px-3 py-2">Email</th>
                <th className="border px-3 py-2">Role</th>
                <th className="border px-3 py-2">Status</th>
                <th className="border px-3 py-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-6">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-red-50"
                  >
                    <td className="border px-3 py-2">
                      <img
                        src={
                          user.avatar ||
                          "https://i.ibb.co/2kRZb5P/avatar.png"
                        }
                        className="w-10 h-10 rounded-full object-cover mx-auto"
                        alt="avatar"
                      />
                    </td>

                    <td className="border px-3 py-2">
                      {user.name}
                    </td>

                    <td className="border px-3 py-2">
                      {user.email}
                    </td>

                    <td className="border px-3 py-2 capitalize">
                      {user.role}
                    </td>

                    <td className="border px-3 py-2 capitalize">
                      <span
                        className={`px-2 py-1 rounded text-xs text-white ${
                          user.status === "active"
                            ? "bg-green-600"
                            : "bg-red-600"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="border px-3 py-2 text-center">
                      <DropdownMenu>
                        {user.status === "active" ? (
                          <MenuItem
                            label="Block User"
                            onClick={() =>
                              updateStatus(user._id, "blocked")
                            }
                          />
                        ) : (
                          <MenuItem
                            label="Unblock User"
                            onClick={() =>
                              updateStatus(user._id, "active")
                            }
                          />
                        )}

                        {user.role === "donor" && (
                          <MenuItem
                            label="Make Volunteer"
                            onClick={() =>
                              makeVolunteer(user._id)
                            }
                          />
                        )}

                        {user.role !== "admin" && (
                          <MenuItem
                            label="Make Admin"
                            onClick={() =>
                              makeAdmin(user._id)
                            }
                          />
                        )}
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllUsers;

/* ---------- Dropdown Components ---------- */

const DropdownMenu = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="text-xl px-2"
      >
        ⋮
      </button>

      {open && (
        <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow w-40 z-10">
          {children}
        </div>
      )}
    </div>
  );
};

const MenuItem = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full text-left px-4 py-2 hover:bg-red-50 text-sm"
  >
    {label}
  </button>
);

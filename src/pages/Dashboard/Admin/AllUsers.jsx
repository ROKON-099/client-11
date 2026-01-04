import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../../../hooks/axiosSecure";

const AllUsers = () => {
  const { data: users = [], refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

  const handleUpdateRole = async (id, role) => {
    await axiosSecure.patch(`/users/role/${id}`, { role });
    refetch();
  };

  return (
    <div>
      <h1>All Users</h1>
      <table>
        <thead>
          <tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => handleUpdateRole(user._id, "admin")}>Make Admin</button>
                <button onClick={() => handleUpdateRole(user._id, "volunteer")}>Make Volunteer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllUsers;
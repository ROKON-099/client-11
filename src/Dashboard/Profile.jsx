import { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    axios
      .get(`/users/user@gmail.com`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(res => setUser(res.data));
  }, []);

  const handleChange = e => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    axios.patch(`/users/${user.email}`, user, {
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-xl bg-white p-6 rounded shadow">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">My Profile</h2>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Edit
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="bg-green-500 text-white px-3 py-1 rounded"
          >
            Save
          </button>
        )}
      </div>

      <form className="space-y-3">
        <input
          name="name"
          value={user.name || ""}
          onChange={handleChange}
          disabled={!isEditing}
          className="input"
          placeholder="Name"
        />

        <input
          value={user.email || ""}
          disabled
          className="input bg-gray-200"
        />

        <input
          name="district"
          value={user.district || ""}
          onChange={handleChange}
          disabled={!isEditing}
          className="input"
          placeholder="District"
        />

        <input
          name="upazila"
          value={user.upazila || ""}
          onChange={handleChange}
          disabled={!isEditing}
          className="input"
          placeholder="Upazila"
        />

        <select
          name="bloodGroup"
          value={user.bloodGroup || ""}
          onChange={handleChange}
          disabled={!isEditing}
          className="input"
        >
          <option>A+</option>
          <option>A-</option>
          <option>B+</option>
          <option>B-</option>
          <option>AB+</option>
          <option>AB-</option>
          <option>O+</option>
          <option>O-</option>
        </select>
      </form>
    </div>
  );
};

export default Profile;

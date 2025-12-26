import { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    axios
      .get(
        `${import.meta.env.VITE_API_URL}/users/${user?.email || "me"}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      )
      .then(res => setUser(res.data))
      .catch(() => console.log("Failed to load profile"));
  }, [token]);

  const handleChange = e => {
    setUser(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      const updatedData = {
        name: user.name,
        district: user.district,
        upazila: user.upazila,
        bloodGroup: user.bloodGroup,
      };

      await axios.patch(
        `${import.meta.env.VITE_API_URL}/users/${user.email}`,
        updatedData,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      setIsEditing(false);
    } catch {
      console.log("Profile update failed");
    }
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
          <option value="">Select Blood Group</option>
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

import { useEffect, useState } from "react";
import axiosSecure from "../../hooks/axiosSecure";
import useAuth from "../../hooks/useAuth";

const Profile = () => {
  const { user } = useAuth();

  const [profile, setProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [selectedDistrictId, setSelectedDistrictId] = useState("");

  /* ---------------- Fetch Data ---------------- */
  useEffect(() => {
    if (user?.email) {
      axiosSecure.get(`/users/${user.email}`).then(res => {
        setProfile(res.data);
        setSelectedDistrictId(res.data?.districtId || "");
      });
    }

    fetch("/District.json")
      .then(res => res.json())
      .then(data => setDistricts(data));

    fetch("/Upzila.json")
      .then(res => res.json())
      .then(data => setUpazilas(data));
  }, [user]);

  /* ---------------- Handlers ---------------- */
  const handleChange = e => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    await axiosSecure.patch(`/users/${user.email}`, profile);
    setIsEditing(false);
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg mb-6">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-sm opacity-90">
          Manage your personal information
        </p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
        
        {/* Top Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <img
              src={profile.photo || user?.photoURL || "https://i.ibb.co/2kRZb5P/avatar.png"}
              alt="profile"
              className="w-20 h-20 rounded-full object-cover ring-4 ring-red-100"
            />
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {profile.name || "User"}
              </h2>
              <p className="text-sm text-gray-500">
                {profile.bloodGroup || "Blood Group"}
              </p>
            </div>
          </div>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-5 py-2 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition"
            >
              Edit Profile
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white hover:opacity-90 transition"
            >
              Save Changes
            </button>
          )}
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          <Input
            label="Full Name"
            name="name"
            value={profile.name || ""}
            onChange={handleChange}
            disabled={!isEditing}
          />

          <Input
            label="Email"
            name="email"
            value={profile.email || ""}
            disabled
          />

          {/* District */}
          <div>
            <label className="text-sm text-gray-600">District</label>
            <select
              disabled={!isEditing}
              value={selectedDistrictId}
              onChange={e => {
                const id = Number(e.target.value);
                setSelectedDistrictId(id);
                setProfile(prev => ({
                  ...prev,
                  districtId: id,
                  upazila: ""
                }));
              }}
              className="w-full mt-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-red-300 disabled:bg-gray-100"
            >
              <option value="">Select District</option>
              {districts.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Upazila */}
          <div>
            <label className="text-sm text-gray-600">Upazila</label>
            <select
              name="upazila"
              disabled={!isEditing || !selectedDistrictId}
              value={profile.upazila || ""}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-red-300 disabled:bg-gray-100"
            >
              <option value="">Select Upazila</option>
              {upazilas
                .filter(u => u.district_id === selectedDistrictId)
                .map(u => (
                  <option key={u.id} value={u.name}>
                    {u.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Blood Group */}
          <div>
            <label className="text-sm text-gray-600">Blood Group</label>
            <select
              name="bloodGroup"
              disabled={!isEditing}
              value={profile.bloodGroup || ""}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-red-300 disabled:bg-gray-100"
            >
              <option value="">Select</option>
              <option>A+</option><option>A-</option>
              <option>B+</option><option>B-</option>
              <option>O+</option><option>O-</option>
              <option>AB+</option><option>AB-</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

/* ---------------- Reusable Input ---------------- */

const Input = ({ label, ...props }) => (
  <div>
    <label className="text-sm text-gray-600">{label}</label>
    <input
      {...props}
      className={`w-full mt-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-red-300 ${
        props.disabled ? "bg-gray-100" : ""
      }`}
    />
  </div>
);

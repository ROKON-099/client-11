import { useEffect, useState } from "react";
import axiosSecure from "../../hooks/axiosSecure";
import useAuth from "../../hooks/useAuth";
import LoadingSpinner from "../../components/comon/LoadingSpinner";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, updateUserProfile } = useAuth();

  const [profile, setProfile] = useState({});
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedDistrictId, setSelectedDistrictId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /* ---------------- Fetch Profile ---------------- */
  const fetchProfile = async () => {
    if (!user?.email) return;
    const res = await axiosSecure.get(
      `/users/${user.email.toLowerCase()}`
    );
    setProfile(res.data);
    setSelectedDistrict(res.data?.district || "");
  };

  /* ---------------- Fetch Data ---------------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchProfile();

        const [districtRes, upazilaRes] = await Promise.all([
          fetch("/District.json"),
          fetch("/Upzila.json"),
        ]);

        const districtData = await districtRes.json();
        setDistricts(districtData);
        setUpazilas(await upazilaRes.json());

        const matched = districtData.find(
          (d) => d.name === profile?.district
        );
        setSelectedDistrictId(matched?.id || null);
      } catch {
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, profile?.district]);

  /* ---------------- Handlers ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const updateData = {
        name: profile.name,
        bloodGroup: profile.bloodGroup,
        district: selectedDistrict,
        upazila: profile.upazila,
        avatar: profile.avatar,
      };

      // ✅ Update DB
      await axiosSecure.patch(
        `/users/${user.email.toLowerCase()}`,
        updateData
      );

      // ✅ Update Firebase + Context sync
      await updateUserProfile(profile.name, profile.avatar);

      await fetchProfile();
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  if (isLoading) return <LoadingSpinner />;

  /* ---------- DONOR ONLY ACCESS ---------- */
  if (profile?.role !== "donor") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-500">
          This page is only available for donors.
        </h2>
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">
            My Profile
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your personal information
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-6 md:p-10">

          <div className="flex flex-col sm:flex-row items-center gap-6 mb-10">
            <img
              src={
                profile?.avatar ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="profile"
              className="w-28 h-28 rounded-full object-cover ring-2 ring-rose-200"
            />

            <div>
              <h2 className="text-2xl font-medium text-gray-800">
                {profile.name || "User Name"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Blood Group:{" "}
                <span className="font-semibold text-rose-500">
                  {profile.bloodGroup || "N/A"}
                </span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {profile.email}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              name="name"
              value={profile.name || ""}
              onChange={handleChange}
            />

            <Input
              label="Email Address"
              value={profile.email || ""}
              disabled
            />

            <div>
              <label className="text-sm font-medium text-gray-600">
                District
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => {
                  const districtName = e.target.value;
                  setSelectedDistrict(districtName);

                  const matched = districts.find(
                    (d) => d.name === districtName
                  );
                  setSelectedDistrictId(matched?.id || null);

                  setProfile((p) => ({ ...p, upazila: "" }));
                }}
                className="w-full mt-1 px-4 py-2.5 border rounded-lg"
              >
                <option value="">Select District</option>
                {districts.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Upazila
              </label>
              <select
                name="upazila"
                value={profile.upazila || ""}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2.5 border rounded-lg"
              >
                <option value="">Select Upazila</option>
                {upazilas
                  .filter((u) => u.district_id === selectedDistrictId)
                  .map((u) => (
                    <option key={u.id} value={u.name}>
                      {u.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Blood Group
              </label>
              <select
                name="bloodGroup"
                value={profile.bloodGroup || ""}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2.5 border rounded-lg"
              >
                <option value="">Select Blood Group</option>
                {["A+","A-","B+","B-","O+","O-","AB+","AB-"].map(bg => (
                  <option key={bg}>{bg}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-10 flex justify-end">
            <button
              onClick={handleSave}
              className="px-8 py-2.5 rounded-lg bg-rose-500 text-white font-medium hover:bg-rose-600"
            >
              Save Changes
            </button>
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
    <label className="text-sm font-medium text-gray-600">
      {label}
    </label>
    <input
      {...props}
      className={`w-full mt-1 px-4 py-2.5 border rounded-lg ${
        props.disabled ? "bg-gray-100 cursor-not-allowed" : ""
      }`}
    />
  </div>
);

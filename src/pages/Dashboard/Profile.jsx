import { useEffect, useState } from "react";
import axiosSecure from "../../hooks/axiosSecure";
import useAuth from "../../hooks/useAuth";
import LoadingSpinner from "../../components/comon/LoadingSpinner";
import toast from "react-hot-toast";
import axios from "axios";

const imageBBKey = import.meta.env.VITE_IMGBB_API_KEY;
const DEFAULT_AVATAR =
  "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const Profile = () => {
  const { user, updateUserProfile } = useAuth();

  const [profile, setProfile] = useState({});
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedDistrictId, setSelectedDistrictId] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /* ---------------- Fetch Profile ---------------- */
  const fetchProfile = async () => {
    if (!user?.email) return;
    const res = await axiosSecure.get(`/users/${user.email.toLowerCase()}`);
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

        // 🔥 map district name → id
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

  const handleImageChange = (e) => {
    setAvatarFile(e.target.files[0]);
  };

  const handleSave = async () => {
    try {
      let avatarUrl = profile.avatar || DEFAULT_AVATAR;

      // 🔥 Upload new avatar if selected
      if (avatarFile && imageBBKey) {
        const formData = new FormData();
        formData.append("image", avatarFile);

        const imgRes = await axios.post(
          `https://api.imgbb.com/1/upload?key=${imageBBKey}`,
          formData
        );

        avatarUrl = imgRes?.data?.data?.display_url || avatarUrl;
      }

      const updateData = {
        name: profile.name,
        bloodGroup: profile.bloodGroup,
        district: selectedDistrict,
        upazila: profile.upazila,
        avatar: avatarUrl,
      };

      // ✅ Update DB
      await axiosSecure.patch(
        `/users/${user.email.toLowerCase()}`,
        updateData
      );

      // ✅ Update Firebase
      await updateUserProfile(profile.name, avatarUrl);

      await fetchProfile();
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  if (isLoading) return <LoadingSpinner />;

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">

        <div className="bg-white rounded-2xl shadow-sm border p-6 md:p-10">

          {/* Avatar */}
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-10">
            <img
              src={profile?.avatar || DEFAULT_AVATAR}
              alt="profile"
              className="w-28 h-28 rounded-full object-cover ring-2 ring-rose-200"
            />

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="text-sm"
            />
          </div>

          {/* Form */}
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
                  const value = e.target.value;
                  setSelectedDistrict(value);

                  const match = districts.find(d => d.name === value);
                  setSelectedDistrictId(match?.id || null);

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
    <label className="text-sm font-medium text-gray-600">{label}</label>
    <input
      {...props}
      className={`w-full mt-1 px-4 py-2.5 border rounded-lg ${
        props.disabled ? "bg-gray-100 cursor-not-allowed" : ""
      }`}
    />
  </div>
);

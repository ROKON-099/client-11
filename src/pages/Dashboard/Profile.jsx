import { useEffect, useState } from "react";
import axiosSecure from "../../hooks/axiosSecure";
import useAuth from "../../hooks/useAuth";
import LoadingSpinner from "../../components/comon/LoadingSpinner";
import toast from "react-hot-toast";

const Profile = () => {

  const { user } = useAuth();

  const [profile, setProfile] = useState({});
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);

  const [selectedDistrictId, setSelectedDistrictId] = useState("");

  const [loading, setLoading] = useState(true);

  const [editMode, setEditMode] = useState(false);



  /* ================= FETCH PROFILE ================= */

  useEffect(() => {

    if (!user?.email) return;

    axiosSecure
      .get(`/users/${user.email.toLowerCase()}`)
      .then(res => {

        setProfile(res.data);

      });

  }, [user]);



  /* ================= FETCH DISTRICT ================= */

  useEffect(() => {

    Promise.all([
      fetch("/District.json"),
      fetch("/Upzila.json"),
    ])

      .then(async ([d, u]) => {

        const districtData = await d.json();
        const upazilaData = await u.json();

        setDistricts(districtData);
        setUpazilas(upazilaData);

        setLoading(false);

      });

  }, []);




  /* ================= CHANGE ================= */

  const handleChange = e => {

    const { name, value } = e.target;

    setProfile({

      ...profile,

      [name]: value,

    });

  };



  /* ================= SAVE ================= */

  const handleSave = async () => {

    try {

      await axiosSecure.patch(

        `/users/${user.email.toLowerCase()}`,

        profile

      );

      toast.success("Profile Updated");

      setEditMode(false);

    }

    catch {

      toast.error("Update Failed");

    }

  };



  if (loading)
    return <LoadingSpinner />;




  /* ================= UI ================= */

  return (

    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 py-10">

      <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-2xl p-8">


        {/* HEADER */}

        <div className="flex justify-between mb-6">

          <h2 className="text-2xl font-bold text-red-500">

            My Profile

          </h2>


          {!editMode ? (

            <button
              onClick={() => setEditMode(true)}
              className="bg-red-500 text-white px-5 py-2 rounded"
            >

              Edit

            </button>

          ) : (

            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-5 py-2 rounded"
            >

              Save

            </button>

          )}

        </div>



        {/* FORM */}

        <div className="grid gap-4">


          {/* NAME */}

          <div>

            <label>Name</label>

            <input
              name="name"
              value={profile.name || ""}
              onChange={handleChange}
              disabled={!editMode}
              className="w-full border p-2 rounded"
            />

          </div>



          {/* EMAIL */}

          <div>

            <label>Email</label>

            <input
              value={profile.email || ""}
              disabled
              className="w-full border p-2 rounded bg-gray-100"
            />

          </div>



          {/* DATE OF BIRTH */}

          <div>

            <label>Date of Birth</label>

            <input
              type="date"
              name="dob"
              value={profile.dob || ""}
              onChange={handleChange}
              disabled={!editMode}
              className="w-full border p-2 rounded"
            />

          </div>



          {/* DISTRICT */}

          <div>

            <label>Zilla (District)</label>

            <select
              name="district"
              value={profile.district || ""}
              onChange={handleChange}
              disabled={!editMode}
              className="w-full border p-2 rounded"
            >

              <option>Select District</option>

              {districts.map(d => (

                <option key={d.id}>
                  {d.name}
                </option>

              ))}

            </select>

          </div>



          {/* UPAZILA */}

          <div>

            <label>Upazila</label>

            <select
              name="upazila"
              value={profile.upazila || ""}
              onChange={handleChange}
              disabled={!editMode}
              className="w-full border p-2 rounded"
            >

              <option>Select Upazila</option>

              {upazilas.map(u => (

                <option key={u.id}>
                  {u.name}
                </option>

              ))}

            </select>

          </div>



          {/* BLOOD */}

          <div>

            <label>Blood Group</label>

            <select
              name="bloodGroup"
              value={profile.bloodGroup || ""}
              onChange={handleChange}
              disabled={!editMode}
              className="w-full border p-2 rounded"
            >

              <option>Select</option>

              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>O+</option>
              <option>AB+</option>

            </select>

          </div>


        </div>


      </div>

    </div>

  );

};

export default Profile;
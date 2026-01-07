import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";
import axiosSecure from "../../../hooks/axiosSecure";
import LoadingSpinner from "../../../components/comon/LoadingSpinner";

const CreateDonationRequest = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [districtId, setDistrictId] = useState("");

  // Load district & upazila data
  useEffect(() => {
    const loadData = async () => {
      try {
        const dRes = await fetch("/District.json");
        const uRes = await fetch("/Upzila.json");

        setDistricts(await dRes.json());
        setUpazilas(await uRes.json());
      } catch (err) {
        console.error(err);
        toast.error("Failed to load location data");
      }
    };

    loadData();
  }, []);

  if (loading || !user) {
    return <LoadingSpinner />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    const donationDate = form.donationDate.value;
    if (new Date(donationDate) < new Date().setHours(0, 0, 0, 0)) {
      return toast.error("Donation date must be today or future");
    }

    const donationRequest = {
      requesterName: user.displayName,
      requesterEmail: user.email,

      recipientName: form.recipientName.value,
      recipientDistrict:
        districts.find((d) => d.id === Number(districtId))?.name,
      recipientUpazila: form.upazila.value,

      hospitalName: form.hospitalName.value,
      fullAddress: form.fullAddress.value,

      bloodGroup: form.bloodGroup.value,
      donationDate,
      donationTime: form.donationTime.value,

      requestMessage: form.requestMessage.value,

      // backend default, but safe to send
      donationStatus: "pending",
    };

    try {
      const res = await axiosSecure.post(
        "/donation-requests",
        donationRequest
      );

      if (res.data?.message === "blocked user") {
        return toast.error(
          "You are blocked. You cannot create donation requests."
        );
      }

      toast.success("Donation request created successfully");
      navigate("/dashboard/my-donation-requests");
    } catch (error) {
      toast.error("Failed to create donation request");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white p-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold text-red-600 mb-6">
          Create Donation Request
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Requester Info */}
          <input
            value={user.displayName || ""}
            readOnly
            className="w-full border px-4 py-2 rounded-lg bg-gray-100"
          />

          <input
            value={user.email || ""}
            readOnly
            className="w-full border px-4 py-2 rounded-lg bg-gray-100"
          />

          {/* Recipient */}
          <input
            name="recipientName"
            required
            placeholder="Recipient Name"
            className="w-full border px-4 py-2 rounded-lg"
          />

          <select
            required
            onChange={(e) => setDistrictId(e.target.value)}
            className="w-full border px-4 py-2 rounded-lg"
          >
            <option value="">Select District</option>
            {districts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <select
            name="upazila"
            required
            className="w-full border px-4 py-2 rounded-lg"
          >
            <option value="">Select Upazila</option>
            {upazilas
              .filter((u) => u.district_id === Number(districtId))
              .map((u) => (
                <option key={u.id} value={u.name}>
                  {u.name}
                </option>
              ))}
          </select>

          {/* Hospital */}
          <input
            name="hospitalName"
            required
            placeholder="Hospital Name"
            className="w-full border px-4 py-2 rounded-lg"
          />

          <input
            name="fullAddress"
            required
            placeholder="Full Address"
            className="w-full border px-4 py-2 rounded-lg"
          />

          {/* Blood */}
          <select
            name="bloodGroup"
            required
            className="w-full border px-4 py-2 rounded-lg"
          >
            <option value="">Select Blood Group</option>
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
              (bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              )
            )}
          </select>

          {/* Date & Time */}
          <input
            type="date"
            name="donationDate"
            required
            className="w-full border px-4 py-2 rounded-lg"
          />

          <input
            type="time"
            name="donationTime"
            required
            className="w-full border px-4 py-2 rounded-lg"
          />

          {/* Message */}
          <textarea
            name="requestMessage"
            rows="4"
            required
            placeholder="Why blood is needed"
            className="w-full border px-4 py-2 rounded-lg"
          />

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg"
          >
            Request Donation
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateDonationRequest;

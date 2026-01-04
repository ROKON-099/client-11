import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";
import axiosSecure from "../../../hooks/axiosSecure";

const CreateDonationRequest = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [districtId, setDistrictId] = useState("");

  // Load district & upazila data
  useEffect(() => {
    fetch("/District.json")
      .then((res) => res.json())
      .then((data) => setDistricts(data));

    fetch("/Upzila.json")
      .then((res) => res.json())
      .then((data) => setUpazilas(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    const donationRequest = {
      requesterId: user.uid,                // matches DB
      requesterName: user.displayName,
      requesterEmail: user.email,

      recipientName: form.recipientName.value,
      recipientDistrict:
        districts.find((d) => d.id === Number(districtId))?.name,
      recipientUpazila: form.upazila.value,

      hospitalName: form.hospitalName.value,
      fullAddress: form.fullAddress.value,

      bloodGroup: form.bloodGroup.value,
      donationDate: form.donationDate.value,
      donationTime: form.donationTime.value,

      requestMessage: form.requestMessage.value,

      donationStatus: "pending",             // ✅ default
      donorId: null,
      donorName: null,
      donorEmail: null,
    };

    try {
      const res = await axiosSecure.post(
        "/donation-requests",
        donationRequest
      );

      // Blocked user handling (backend sends this message)
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
          {/* Requester Info (Read Only) */}
          <input
            value={user.displayName}
            readOnly
            className="w-full border px-4 py-2 rounded-lg bg-gray-100"
          />

          <input
            value={user.email}
            readOnly
            className="w-full border px-4 py-2 rounded-lg bg-gray-100"
          />

          {/* Recipient Info */}
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

          {/* Hospital & Address */}
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

          {/* Blood Group */}
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

          {/* Submit */}
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

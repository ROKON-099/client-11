import { useState } from "react";
import axiosSecure from "../../../hooks/axiosSecure";
import useAuth from "../../../hooks/useAuth";

const CreateDonationRequest = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    recipientName: "",
    bloodGroup: "",
    district: "",
    upazila: "",
    hospital: "",
    address: "",
    date: "",
    time: "",
    message: "",
    requesterEmail: user?.email,
  });

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axiosSecure.post("/donation-requests", formData);
      // Toast success
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Create Donation Request</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Inputs for each field */}
        <input name="recipientName" onChange={handleChange} placeholder="Recipient Name" />
        {/* ... other fields */}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateDonationRequest;
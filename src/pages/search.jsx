import { useState } from "react";

// Demo donor data (later replace with API)
const donorsData = [
  {
    id: 1,
    name: "Rahim Ahmed",
    bloodGroup: "A+",
    district: "Dhaka",
    upazila: "Dhanmondi",
  },
  {
    id: 2,
    name: "Karim Hasan",
    bloodGroup: "O+",
    district: "Chattogram",
    upazila: "Pahartali",
  },
  {
    id: 3,
    name: "Sadia Islam",
    bloodGroup: "B+",
    district: "Dhaka",
    upazila: "Mirpur",
  },
];

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const search = () => {
  const [bloodGroup, setBloodGroup] = useState("");
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");
  const [results, setResults] = useState(donorsData); // ✅ default cards

  const handleSearch = (e) => {
    e.preventDefault();

    const filtered = donorsData.filter(
      (donor) =>
        donor.bloodGroup === bloodGroup &&
        donor.district === district &&
        donor.upazila === upazila
    );

    setResults(filtered);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4">

        {/* Page Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-900">
          Search <span className="text-red-600">Blood Donors</span>
        </h1>

        {/* ================= Search Form ================= */}
        <form
          onSubmit={handleSearch}
          className="bg-white p-6 rounded-lg shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 mb-12"
        >
          {/* Blood Group */}
          <select
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
            required
            className="border px-4 py-2 rounded"
          >
            <option value="">Select Blood Group</option>
            {bloodGroups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>

          {/* District */}
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            required
            className="border px-4 py-2 rounded"
          >
            <option value="">Select District</option>
            <option value="Dhaka">Dhaka</option>
            <option value="Chattogram">Chattogram</option>
          </select>

          {/* Upazila */}
          <select
            value={upazila}
            onChange={(e) => setUpazila(e.target.value)}
            required
            className="border px-4 py-2 rounded"
          >
            <option value="">Select Upazila</option>
            {district === "Dhaka" && (
              <>
                <option value="Dhanmondi">Dhanmondi</option>
                <option value="Mirpur">Mirpur</option>
              </>
            )}
            {district === "Chattogram" && (
              <option value="Pahartali">Pahartali</option>
            )}
          </select>

          {/* Search Button */}
          <button
            type="submit"
            className="bg-red-600 text-white rounded px-4 py-2 hover:bg-red-700 transition"
          >
            Search
          </button>
        </form>

        {/* ================= Donor Cards ================= */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {results.map((donor) => (
            <div
              key={donor.id}
              className="bg-white p-6 rounded-lg border hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold text-red-600 mb-2">
                {donor.name}
              </h3>
              <p className="text-gray-600 text-sm">
                Blood Group: <strong>{donor.bloodGroup}</strong>
              </p>
              <p className="text-gray-600 text-sm">
                Location: {donor.upazila}, {donor.district}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default search;

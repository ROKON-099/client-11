import { useState } from "react";

// Demo donor data (later replace with API)
const donorsData = [
  {
    id: 1,
    name: "Md. Rahim Ahmed",
    bloodGroup: "A+",
    district: "Dhaka",
    upazila: "Dhanmondi",
  phone:"01732-35082"  },
  {
    id: 2,
    name: "Karim Hasan",
    bloodGroup: "O+",
    district: "Chattogram",
    upazila: "Pahartali",
    phone: "01845-87654",
  },
  {
    id: 3,
    name: "Sadia Islam",
    bloodGroup: "B+",
    district: "Dhaka",
    upazila: "Mirpur",
    phone: "01922-46789",
  },
  {
    id: 4,
    name: "Tanvir Hossain",
    bloodGroup: "O-",
    district: "Dhaka",
    upazila: "Uttara",
    phone: "01633-12233",
  },
  {
    id: 5,
    name: "Nusrat Jahan",
    bloodGroup: "AB+",
    district: "Sylhet",
    upazila: "Zindabazar",
    phone: "01588-77899",
  },
  {
    id: 6,
    name: "Mahmudul Hasan",
    bloodGroup: "B-",
    district: "Rajshahi",
    upazila: "Boalia",
    phone: "01790-34455",
  },
];

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const Search = () => {
  const [bloodGroup, setBloodGroup] = useState("");
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");
  const [results, setResults] = useState(donorsData); // default cards

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
          className="bg-white p-6 rounded-lg shadow-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-12"
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
            <option value="Sylhet">Sylhet</option>
            <option value="Rajshahi">Rajshahi</option>
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
                <option value="Uttara">Uttara</option>
              </>
            )}
            {district === "Chattogram" && (
              <option value="Pahartali">Pahartali</option>
            )}
            {district === "Sylhet" && (
              <option value="Zindabazar">Zindabazar</option>
            )}
            {district === "Rajshahi" && (
              <option value="Boalia">Boalia</option>
            )}
          </select>

          {/* Search Button */}
          <button
            type="submit"
            className="bg-red-600 text-white rounded px-4 py-2 hover:bg-red-700 transition w-full"
          >
            Search
          </button>
        </form>

        {/* ================= Donor Cards ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((donor) => (
            <div
              key={donor.id}
              className="bg-white p-6 rounded-lg border hover:shadow-md transition"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  {donor.name}
                </h3>
                <span className="px-3 py-1 text-sm rounded-full bg-red-100 text-red-600 font-semibold">
                  {donor.bloodGroup}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-1">
                📍 {donor.upazila}, {donor.district}
              </p>
              <p className="text-gray-600 text-sm">
                📞 {donor.phone}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;

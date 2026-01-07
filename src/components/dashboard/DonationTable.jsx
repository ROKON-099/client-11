import { Link } from "react-router-dom";

const DonationTable = ({
  data = [],
  role = "donor",
  onStatusChange,
  onDelete,
  showDelete = true,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border text-sm">
        <thead className="bg-red-100">
          <tr>
            <th className="border px-3 py-2">Recipient</th>
            <th className="border px-3 py-2">Location</th>
            <th className="border px-3 py-2">Date</th>
            <th className="border px-3 py-2">Time</th>
            <th className="border px-3 py-2">Blood</th>
            <th className="border px-3 py-2">Status</th>
            <th className="border px-3 py-2">Donor Info</th>
            <th className="border px-3 py-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center py-6">
                No donation requests found
              </td>
            </tr>
          ) : (
            data.map((req) => (
              <tr key={req._id} className="hover:bg-red-50">
                <td className="border px-3 py-2">
                  {req.recipientName}
                </td>

                <td className="border px-3 py-2">
                  {req.recipientDistrict}, {req.recipientUpazila}
                </td>

                <td className="border px-3 py-2">
                  {req.donationDate}
                </td>

                <td className="border px-3 py-2">
                  {req.donationTime}
                </td>

                <td className="border px-3 py-2 font-semibold text-red-600">
                  {req.bloodGroup}
                </td>

                <td className="border px-3 py-2 capitalize">
                  {req.donationStatus}
                </td>

                {/* Donor Info */}
                <td className="border px-3 py-2">
                  {req.donationStatus === "inprogress" ? (
                    <>
                      <p>{req.donorName}</p>
                      <p className="text-xs text-gray-500">
                        {req.donorEmail}
                      </p>
                    </>
                  ) : (
                    "—"
                  )}
                </td>

                {/* Actions */}
                <td className="border px-3 py-2 space-x-2">

                  {/* Status update (Donor & Volunteer & Admin) */}
                  {req.donationStatus === "inprogress" && (
                    <>
                      <button
                        onClick={() =>
                          onStatusChange?.(req._id, "done")
                        }
                        className="text-green-600"
                      >
                        Done
                      </button>

                      <button
                        onClick={() =>
                          onStatusChange?.(req._id, "canceled")
                        }
                        className="text-red-600"
                      >
                        Cancel
                      </button>
                    </>
                  )}

                  {/* View */}
                  <Link
                    to={`/dashboard/donation/${req._id}`}
                    className="text-blue-600"
                  >
                    View
                  </Link>

                  {/* Delete (Donor/Admin only) */}
                  {showDelete && role !== "volunteer" && (
                    <button
                      onClick={() => onDelete?.(req._id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DonationTable;


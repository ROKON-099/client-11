const DonationTable = ({
  data,
  role,
  onStatusChange,
  onDelete,
  showDelete,
}) => {
  return (
    <>
      {/* ===== DESKTOP TABLE ===== */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border rounded-lg">
          <thead className="bg-red-100">
            <tr>
              <th className="border p-3 text-left">Recipient</th>
              <th className="border p-3 text-left">Blood Group</th>
              <th className="border p-3 text-left">Status</th>
              <th className="border p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-6 text-gray-500"
                >
                  No donation requests found
                </td>
              </tr>
            )}

            {data.map((req) => (
              <tr
                key={req._id}
                className="hover:bg-gray-50 transition"
              >
                <td className="border p-3 break-words">
                  {req.recipientName}
                </td>

                <td className="border p-3 font-semibold">
                  {req.bloodGroup}
                </td>

                <td
                  className={`border p-3 capitalize font-medium
                    ${req.donationStatus === "pending" && "text-yellow-600"}
                    ${req.donationStatus === "inprogress" && "text-blue-600"}
                    ${req.donationStatus === "done" && "text-green-600"}
                    ${req.donationStatus === "canceled" && "text-red-600"}
                  `}
                >
                  {req.donationStatus}
                </td>

                <td className="border p-3 space-x-2">
                  {req.donationStatus === "pending" && (
                    <button
                      onClick={() =>
                        onStatusChange(req._id, "inprogress")
                      }
                      className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
                    >
                      In Progress
                    </button>
                  )}

                  {req.donationStatus === "inprogress" && (
                    <>
                      <button
                        onClick={() =>
                          onStatusChange(req._id, "done")
                        }
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded"
                      >
                        Done
                      </button>

                      <button
                        onClick={() =>
                          onStatusChange(req._id, "canceled")
                        }
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
                      >
                        Cancel
                      </button>
                    </>
                  )}

                  {showDelete && (
                    <button
                      onClick={() => onDelete(req._id)}
                      className="px-3 py-1 bg-gray-700 hover:bg-gray-800 text-white rounded"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== MOBILE CARD VIEW ===== */}
      <div className="md:hidden space-y-4">
        {data.length === 0 && (
          <p className="text-center text-gray-500 py-6">
            No donation requests found
          </p>
        )}

        {data.map((req) => (
          <div
            key={req._id}
            className="border rounded-lg p-4 shadow-sm bg-white"
          >
            <p className="font-semibold text-lg break-words">
              {req.recipientName}
            </p>

            <p className="text-sm mt-1">
              <span className="font-medium">Blood Group:</span>{" "}
              {req.bloodGroup}
            </p>

            <p
              className={`text-sm mt-1 capitalize font-medium
                ${req.donationStatus === "pending" && "text-yellow-600"}
                ${req.donationStatus === "inprogress" && "text-blue-600"}
                ${req.donationStatus === "done" && "text-green-600"}
                ${req.donationStatus === "canceled" && "text-red-600"}
              `}
            >
              Status: {req.donationStatus}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {req.donationStatus === "pending" && (
                <button
                  onClick={() =>
                    onStatusChange(req._id, "inprogress")
                  }
                  className="w-full px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                >
                  In Progress
                </button>
              )}

              {req.donationStatus === "inprogress" && (
                <>
                  <button
                    onClick={() =>
                      onStatusChange(req._id, "done")
                    }
                    className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
                  >
                    Done
                  </button>

                  <button
                    onClick={() =>
                      onStatusChange(req._id, "canceled")
                    }
                    className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                  >
                    Cancel
                  </button>
                </>
              )}

              {showDelete && (
                <button
                  onClick={() => onDelete(req._id)}
                  className="w-full px-3 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default DonationTable;

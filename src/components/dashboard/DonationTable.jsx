import toast from "react-hot-toast";

const DonationTable = ({
  data = [],
  role = "donor",
  onStatusChange,
  onDelete,
  showDelete = true,
}) => {
  const confirmAction = (message, onConfirm) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium">{message}</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 rounded border text-sm"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                onConfirm();
              }}
              className="px-3 py-1 rounded bg-red-600 text-white text-sm"
            >
              Confirm
            </button>
          </div>
        </div>
      ),
      {
        duration: 6000,
      }
    );
  };

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
                  {/* ACCEPT */}
                  {req.donationStatus === "pending" &&
                    role !== "donor" && (
                      <button
                        onClick={() =>
                          confirmAction(
                            "Accept this donation request?",
                            () => {
                              onStatusChange?.(
                                req._id,
                                "inprogress"
                              );
                              toast.success("Donation accepted");
                            }
                          )
                        }
                        className="text-green-600"
                      >
                        Accept
                      </button>
                    )}

                  {/* DONE / CANCEL */}
                  {req.donationStatus === "inprogress" && (
                    <>
                      <button
                        onClick={() =>
                          confirmAction(
                            "Mark this donation as DONE?",
                            () => {
                              onStatusChange?.(req._id, "done");
                              toast.success("Donation marked as done");
                            }
                          )
                        }
                        className="text-green-600"
                      >
                        Done
                      </button>

                      <button
                        onClick={() =>
                          confirmAction(
                            "Cancel this donation request?",
                            () => {
                              onStatusChange?.(
                                req._id,
                                "canceled"
                              );
                              toast.success("Donation canceled");
                            }
                          )
                        }
                        className="text-red-600"
                      >
                        Cancel
                      </button>
                    </>
                  )}

                  {/* DELETE */}
                  {showDelete && role !== "volunteer" && (
                    <button
                      onClick={() =>
                        confirmAction(
                          "Delete this donation request?",
                          () => {
                            onDelete?.(req._id);
                            toast.success(
                              "Donation request deleted"
                            );
                          }
                        )
                      }
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


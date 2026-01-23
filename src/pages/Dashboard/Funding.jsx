import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axiosSecure from "../../hooks/axiosSecure";
import useAuth from "../../hooks/useAuth";
import LoadingSpinner from "../../components/comon/LoadingSpinner";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

const Funding = () => {
  const { user } = useAuth();
  const stripe = useStripe();
  const elements = useElements();

  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [processing, setProcessing] = useState(false);

  /* ✅ GET ROLE FROM DATABASE */
  const { data: dbUser, isLoading: roleLoading } = useQuery({
    queryKey: ["userRole", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data;
    },
  });

  const role = dbUser?.role;

  const { data: fundings = [], refetch, isLoading } = useQuery({
    queryKey: ["fundings"],
    queryFn: async () => {
      const res = await axiosSecure.get("/fundings");
      return res.data;
    },
  });

  const handleGiveFund = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return toast.error("Stripe not ready");
    if (!amount || amount <= 0) return toast.error("Invalid amount");

    setProcessing(true);

    try {
      const { data } = await axiosSecure.post("/create-payment-intent", {
        amount: Number(amount),
      });

      const { paymentIntent, error } =
        await stripe.confirmCardPayment(data.clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: user.displayName,
              email: user.email,
            },
          },
        });

      if (error) return toast.error(error.message);

      if (paymentIntent.status === "succeeded") {
        await axiosSecure.post("/fundings", {
          userName: user.displayName,
          userEmail: user.email,
          amount: Number(amount),
          paymentIntentId: paymentIntent.id,
        });

        toast.success("Thank you for your funding ❤️");
        setShowModal(false);
        setAmount("");
        elements.getElement(CardElement)?.clear();
        refetch();
      }
    } catch {
      toast.error("Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  if (isLoading || roleLoading) return <LoadingSpinner />;

  return (
    <div data-aos="fade-up" className="p-6 bg-white rounded-xl shadow">
      {/* Header */}
      <div
        data-aos="fade-right"
        data-aos-delay="100"
        className="flex justify-between mb-6"
      >
        <h2 className="text-2xl font-bold text-red-600">
          Funding Records
        </h2>

        {/* ✅ ROLE FROM DB, NOT AUTH */}
        {role === "donor" && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Give Fund
          </button>
        )}
      </div>

      {/* Table */}
      <table className="w-full border">
        <thead className="bg-red-100">
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Amount (USD)</th>
            <th className="border p-2">Funding Date</th>
          </tr>
        </thead>
        <tbody>
          {fundings.map((f) => (
            <tr key={f._id}>
              <td className="border p-2">{f.userName}</td>
              <td className="border p-2 font-semibold">
                ${f.amount}
              </td>
              <td className="border p-2">
                {new Date(
                  f.createdAt || f.fundingDate
                ).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {role === "donor" && showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <form onSubmit={handleGiveFund}>
              <input
                type="number"
                placeholder="Enter amount (USD)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border p-2 rounded mb-4"
                required
              />

              <div className="border p-2 rounded mb-4">
                <CardElement />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="border px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  {processing ? "Processing..." : "Pay Now"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Funding;

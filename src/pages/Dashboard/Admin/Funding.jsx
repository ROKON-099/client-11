import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axiosSecure from "../../../hooks/axiosSecure";
import useAuth from "../../../hooks/useAuth";
import LoadingSpinner from "../../../components/comon/LoadingSpinner";
import {
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";

const Funding = () => {
  const { user } = useAuth();
  const stripe = useStripe();
  const elements = useElements();

  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [processing, setProcessing] = useState(false);

  const {
    data: fundings = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["fundings"],
    queryFn: async () => {
      const res = await axiosSecure.get("/fundings");
      return res.data;
    },
  });

  const handleGiveFund = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return toast.error("Stripe not loaded");
    }

    if (!amount || Number(amount) <= 0) {
      return toast.error("Please enter a valid amount");
    }

    setProcessing(true);

    try {
      // 🔹 Create payment intent (amount in normal unit)
      const { data } = await axiosSecure.post(
        "/create-payment-intent",
        { amount: Number(amount) }
      );

      const { clientSecret } = data;

      // 🔹 Confirm payment
      const { error, paymentIntent } =
        await stripe.confirmCardPayment(
          clientSecret,
          {
            payment_method: {
              card: elements.getElement(CardElement),
              billing_details: {
                name: user.displayName,
                email: user.email,
              },
            },
          }
        );

      if (error) {
        toast.error(error.message);
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        const fundingData = {
          userName: user.displayName,
          userEmail: user.email,
          amount: Number(amount),
          transactionId: paymentIntent.id,
          fundingDate: new Date().toISOString(),
        };

        await axiosSecure.post("/fundings", fundingData);

        toast.success("Thank you for your funding ❤️");
        setShowModal(false);
        setAmount("");
        elements.getElement(CardElement)?.clear();
        refetch();
      }
    } catch (error) {
      toast.error("Payment failed");
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white p-4">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow p-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <h1 className="text-2xl font-bold text-red-600">
            Funding Records
          </h1>

          <button
            onClick={() => setShowModal(true)}
            className="mt-3 md:mt-0 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
          >
            Give Fund
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead className="bg-red-100">
              <tr>
                <th className="border px-4 py-2">User Name</th>
                <th className="border px-4 py-2">Amount</th>
                <th className="border px-4 py-2">Funding Date</th>
              </tr>
            </thead>

            <tbody>
              {fundings.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    className="text-center py-6 text-gray-500"
                  >
                    No funding records found
                  </td>
                </tr>
              ) : (
                fundings.map((fund) => (
                  <tr key={fund._id} className="hover:bg-red-50">
                    <td className="border px-4 py-2">
                      {fund.userName}
                    </td>
                    <td className="border px-4 py-2 font-semibold text-red-600">
                      ৳ {fund.amount}
                    </td>
                    <td className="border px-4 py-2">
                      {new Date(
                        fund.fundingDate
                      ).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-red-600 mb-4">
              Give Fund
            </h2>

            <form onSubmit={handleGiveFund}>
              <input
                type="number"
                placeholder="Enter amount (BDT)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border px-4 py-2 rounded-lg mb-4"
                required
              />

              <div className="border px-4 py-2 rounded-lg mb-4">
                <CardElement />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border"
                  disabled={processing}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-red-600 text-white disabled:opacity-50"
                  disabled={!stripe || processing}
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

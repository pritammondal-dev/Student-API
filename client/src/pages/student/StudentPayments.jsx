import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function StudentPayments() {
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/payments");

      setPayments(response.data.data || []);
    } catch (error) {
      console.error(
        "Failed to fetch payment history:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Unable to load payment history."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Payments
        </h1>

        <p className="mt-4 text-sm text-gray-500">
          Loading your payment history...
        </p>
      </div>
    );
  }

  // ==========================================
  // Error
  // ==========================================

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Payments
        </h1>

        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5">
          <p className="text-sm text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchPayments}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // Statistics
  // ==========================================

  const successfulPayments = payments.filter(
    (payment) => payment.status === "success"
  );

  const totalPaid = successfulPayments.reduce(
    (total, payment) =>
      total + Number(payment.amount || 0),
    0
  );

  // ==========================================
  // Page
  // ==========================================

  return (
    <div className="p-6">

      {/* ============================= */}
      {/* Header */}
      {/* ============================= */}

      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Payments
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          View your payment history and transaction details.
        </p>
      </div>

      {/* ============================= */}
      {/* Summary Cards */}
      {/* ============================= */}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

        {/* Total Transactions */}

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Transactions
          </p>

          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {payments.length}
          </p>
        </div>

        {/* Successful Payments */}

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Successful Payments
          </p>

          <p className="mt-2 text-2xl font-semibold text-green-600">
            {successfulPayments.length}
          </p>
        </div>

        {/* Total Paid */}

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Paid
          </p>

          <p className="mt-2 text-2xl font-semibold text-gray-900">
            ₹{totalPaid.toFixed(2)}
          </p>
        </div>

      </div>

      {/* ============================= */}
      {/* Empty State */}
      {/* ============================= */}

      {payments.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">

          <div className="text-5xl">
            💳
          </div>

          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            No payments yet
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Your payment transactions will appear here.
          </p>

          <button
            type="button"
            onClick={() => navigate("/student/library")}
            className="mt-5 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Browse Library
          </button>

        </div>
      ) : (

        /* ============================= */
        /* Payment History */
        /* ============================= */

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

          {/* ============================= */}
          {/* Desktop Header */}
          {/* ============================= */}

          <div className="hidden border-b border-gray-200 bg-gray-50 px-6 py-4 md:grid md:grid-cols-6 md:gap-4">

            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Document
            </div>

            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Amount
            </div>

            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Status
            </div>

            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Method
            </div>

            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Date
            </div>

            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Payment ID
            </div>

          </div>

          {/* ============================= */}
          {/* Payment Records */}
          {/* ============================= */}

          <div className="divide-y divide-gray-100">

            {payments.map((payment, index) => (

              <div
                key={
                  payment.payment_id ||
                  payment.order_id ||
                  index
                }
                className="px-6 py-5 transition hover:bg-gray-50"
              >

                {/* ============================= */}
                {/* Desktop */}
                {/* ============================= */}

                <div className="hidden md:grid md:grid-cols-6 md:items-center md:gap-4">

                  {/* Document */}

                  <div className="min-w-0">
                    <p className="truncate font-medium text-gray-900">
                      {payment.document?.title || "Document"}
                    </p>

                    <p className="mt-1 truncate text-xs text-gray-400">
                      {payment.document?.subject || "General"}
                    </p>
                  </div>

                  {/* Amount */}

                  <div className="font-medium text-gray-900">
                    ₹{Number(payment.amount || 0).toFixed(2)}
                  </div>

                  {/* Status */}

                  <div>
                    <StatusBadge status={payment.status} />
                  </div>

                  {/* Payment Method */}

                  <div className="text-sm capitalize text-gray-600">
                    {payment.payment_method || "Razorpay"}
                  </div>

                  {/* Date */}

                  <div className="text-sm text-gray-600">
                    {payment.created_at
                      ? new Date(
                          payment.created_at
                        ).toLocaleDateString()
                      : "-"}
                  </div>

                  {/* Payment ID */}

                  <div
                    className="truncate text-xs text-gray-500"
                    title={payment.payment_id || ""}
                  >
                    {payment.payment_id || "-"}
                  </div>

                </div>

                {/* ============================= */}
                {/* Mobile */}
                {/* ============================= */}

                <div className="md:hidden">

                  <div className="flex items-start justify-between gap-4">

                    <div className="min-w-0">

                      <h3 className="truncate font-semibold text-gray-900">
                        {payment.document?.title || "Document"}
                      </h3>

                      <p className="mt-1 text-xs text-gray-400">
                        {payment.document?.subject || "General"}
                      </p>

                    </div>

                    <StatusBadge status={payment.status} />

                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4">

                    {/* Amount */}

                    <div>
                      <p className="text-xs text-gray-400">
                        Amount
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-900">
                        ₹{Number(payment.amount || 0).toFixed(2)}
                      </p>
                    </div>

                    {/* Date */}

                    <div>
                      <p className="text-xs text-gray-400">
                        Date
                      </p>

                      <p className="mt-1 text-sm text-gray-700">
                        {payment.created_at
                          ? new Date(
                              payment.created_at
                            ).toLocaleDateString()
                          : "-"}
                      </p>
                    </div>

                    {/* Payment Method */}

                    <div>
                      <p className="text-xs text-gray-400">
                        Payment Method
                      </p>

                      <p className="mt-1 text-sm capitalize text-gray-700">
                        {payment.payment_method || "Razorpay"}
                      </p>
                    </div>

                    {/* Payment ID */}

                    <div>
                      <p className="text-xs text-gray-400">
                        Payment ID
                      </p>

                      <p
                        className="mt-1 truncate text-xs text-gray-500"
                        title={payment.payment_id || ""}
                      >
                        {payment.payment_id || "-"}
                      </p>
                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>
      )}

    </div>
  );
}

// ==========================================
// Status Badge
// ==========================================

function StatusBadge({ status }) {
  const styles = {
    success:
      "border-green-200 bg-green-50 text-green-700",

    failed:
      "border-red-200 bg-red-50 text-red-700",

    created:
      "border-yellow-200 bg-yellow-50 text-yellow-700",

    refunded:
      "border-purple-200 bg-purple-50 text-purple-700",
  };

  const labels = {
    success: "Paid",
    failed: "Failed",
    created: "Pending",
    refunded: "Refunded",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${
        styles[status] ||
        "border-gray-200 bg-gray-50 text-gray-600"
      }`}
    >
      {labels[status] || status}
    </span>
  );
}

export default StudentPayments;
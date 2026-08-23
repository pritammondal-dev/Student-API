import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function StudentDashboard() {
  const navigate = useNavigate();

  const [purchases, setPurchases] = useState([]);
  const [payments, setPayments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // Fetch Dashboard Data
  // ==========================================

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [libraryResponse, paymentResponse] =
        await Promise.all([
          api.get("/library"),
          api.get("/payments"),
        ]);

      setPurchases(libraryResponse.data.data || []);
      setPayments(paymentResponse.data.data || []);
    } catch (error) {
      console.error(
        "Dashboard error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Unable to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ==========================================
  // Loading State
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-gray-50 p-6">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />

          <p className="mt-4 text-sm text-gray-500">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // Error State
  // ==========================================

  if (error) {
    return (
      <div className="min-h-[60vh] bg-gray-50 p-6">
        <div className="mx-auto max-w-2xl rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-semibold text-red-700">
            Unable to load dashboard
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchDashboardData}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
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

  const totalSpent = successfulPayments.reduce(
    (total, payment) =>
      total + Number(payment.amount || 0),
    0
  );

  const recentPurchases = purchases.slice(0, 5);
  const recentPayments = payments.slice(0, 5);

  // ==========================================
  // Dashboard
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">

      {/* ======================================
          Header
      ====================================== */}

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Student Dashboard
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Welcome back! Manage your documents and
          payments from here.
        </p>
      </div>

      {/* ======================================
          Statistics
      ====================================== */}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

        {/* Purchased Documents */}

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-gray-500">
                Purchased Documents
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-900">
                {purchases.length}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100 text-2xl">
              📚
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/student/purchases")
            }
            className="mt-4 text-sm font-medium text-gray-700 transition hover:text-gray-900 hover:underline"
          >
            View purchases →
          </button>
        </div>

        {/* Total Payments */}

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Payments
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-900">
                {payments.length}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100 text-2xl">
              💳
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/student/payments")
            }
            className="mt-4 text-sm font-medium text-gray-700 transition hover:text-gray-900 hover:underline"
          >
            View payments →
          </button>
        </div>

        {/* Successful Payments */}

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-gray-500">
                Successful Payments
              </p>

              <p className="mt-2 text-3xl font-bold text-green-600">
                {successfulPayments.length}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-50 text-2xl text-green-600">
              ✓
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            Completed transactions
          </p>
        </div>

        {/* Total Spent */}

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Spent
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-900">
                ₹{totalSpent.toFixed(2)}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100 text-2xl">
              ₹
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            On purchased documents
          </p>
        </div>
      </div>

      {/* ======================================
          Recent Sections
      ====================================== */}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">

        {/* ====================================
            Recent Purchases
        ==================================== */}

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">

            <div>
              <h2 className="font-semibold text-gray-900">
                Recent Purchases
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Your recently purchased documents
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/student/purchases")
              }
              className="text-sm font-medium text-gray-700 hover:text-gray-900 hover:underline"
            >
              View All
            </button>
          </div>

          {recentPurchases.length === 0 ? (
            <div className="p-8 text-center">

              <div className="text-4xl">📚</div>

              <p className="mt-3 text-sm text-gray-500">
                You haven't purchased any documents yet.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/student/library")
                }
                className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Browse Library
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">

              {recentPurchases.map((document) => (
                <div
                  key={document.document_id}
                  className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-gray-50"
                >
                  <div className="flex min-w-0 items-center gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xl">
                      📄
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-medium text-gray-900">
                        {document.title}
                      </h3>

                      <p className="mt-1 text-xs text-gray-500">
                        {document.subject || "General"}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/student/library/${document.document_id}`
                      )
                    }
                    className="shrink-0 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-100"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ====================================
            Recent Payments
        ==================================== */}

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">

            <div>
              <h2 className="font-semibold text-gray-900">
                Recent Payments
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Your latest payment transactions
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/student/payments")
              }
              className="text-sm font-medium text-gray-700 hover:text-gray-900 hover:underline"
            >
              View All
            </button>
          </div>

          {recentPayments.length === 0 ? (
            <div className="p-8 text-center">

              <div className="text-4xl">💳</div>

              <p className="mt-3 text-sm text-gray-500">
                No payment transactions yet.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">

              {recentPayments.map((payment, index) => (
                <div
                  key={
                    payment.id ||
                    payment.payment_id ||
                    index
                  }
                  className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-gray-50"
                >

                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-medium text-gray-900">
                      {payment.document?.title ||
                        "Document"}
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      {payment.created_at
                        ? new Date(
                            payment.created_at
                          ).toLocaleDateString("en-IN")
                        : "-"}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">

                    <p className="text-sm font-semibold text-gray-900">
                      ₹
                      {Number(
                        payment.amount || 0
                      ).toFixed(2)}
                    </p>

                    <span
                      className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        payment.status === "success"
                          ? "bg-green-50 text-green-700"
                          : payment.status === "failed"
                          ? "bg-red-50 text-red-700"
                          : "bg-yellow-50 text-yellow-700"
                      }`}
                    >
                      {payment.status === "success"
                        ? "Paid"
                        : payment.status === "failed"
                        ? "Failed"
                        : payment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ======================================
          Quick Actions
      ====================================== */}

      <div className="mt-8">

        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Quick Actions
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {/* Browse Library */}

          <button
            type="button"
            onClick={() =>
              navigate("/student/library")
            }
            className="rounded-xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="text-2xl">📚</div>

            <h3 className="mt-3 font-semibold text-gray-900">
              Browse Library
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Find and purchase study documents.
            </p>
          </button>

          {/* My Purchases */}

          <button
            type="button"
            onClick={() =>
              navigate("/student/purchases")
            }
            className="rounded-xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="text-2xl">📄</div>

            <h3 className="mt-3 font-semibold text-gray-900">
              My Purchases
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Access your purchased documents.
            </p>
          </button>

          {/* Payment History */}

          <button
            type="button"
            onClick={() =>
              navigate("/student/payments")
            }
            className="rounded-xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="text-2xl">💳</div>

            <h3 className="mt-3 font-semibold text-gray-900">
              Payment History
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Check all your transactions.
            </p>
          </button>

        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
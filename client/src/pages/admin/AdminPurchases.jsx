import { useEffect, useState } from "react";
import api from "../../services/api";

function AdminPurchases() {
  const [page, setPage] = useState(1);
const [limit, setLimit] = useState(10);

const [pagination, setPagination] = useState({
  totalItems: 0,
  currentPage: 1,
  totalPages: 1,
  limit: 10,
});
  const [purchases, setPurchases] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // =============================
  // Fetch Purchases
  // =============================

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/purchases/admin", {
  params: {
    page,
    limit,
    status: statusFilter,
    search,
  },
});

setPurchases(response.data.data || []);

setStatistics(
  response.data.statistics || {
    totalPurchases: 0,
    paidPurchases: 0,
    pendingPurchases: 0,
    failedPurchases: 0,
    totalRevenue: 0,
  }
);

setPagination(
  response.data.pagination || {
    totalItems: 0,
    currentPage: 1,
    totalPages: 1,
    limit,
  },
);
    } catch (error) {
      console.error(
        "Admin purchases API error:",
        error.response?.data || error.message,
      );

      setError(
        error.response?.data?.message ||
          "Failed to load purchase records.",
      );
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // Load Purchases
  // =============================

 useEffect(() => {
  fetchPurchases();
}, [page, limit]);

  // =============================
  // Statistics
  // =============================

 const [statistics, setStatistics] = useState({
  totalPurchases: 0,
  paidPurchases: 0,
  pendingPurchases: 0,
  failedPurchases: 0,
  totalRevenue: 0,
});

  // =============================
  // Filter Purchases
  // =============================

  const filteredPurchases = purchases.filter((purchase) => {
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      !searchText ||
      String(purchase.student_id)
        .toLowerCase()
        .includes(searchText) ||
      String(purchase.id)
        .toLowerCase()
        .includes(searchText) ||
      String(purchase.payment_id || "")
        .toLowerCase()
        .includes(searchText) ||
      String(purchase.order_id || "")
        .toLowerCase()
        .includes(searchText) ||
      String(purchase.document?.title || "")
        .toLowerCase()
        .includes(searchText);

    const matchesStatus =
      statusFilter === "all" ||
      purchase.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-full bg-gray-50 p-4 sm:p-6 lg:p-8">

      {/* ============================= */}
      {/* Header */}
      {/* ============================= */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Purchases
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            View documents purchased by students.
          </p>
        </div>
      </div>

      {/* ============================= */}
      {/* Statistics */}
      {/* ============================= */}

      <section className="mb-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* Total Purchases */}

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Purchases
                </p>

                <h2 className="mt-2 text-2xl font-bold text-gray-900">
                  {statistics.totalPurchases}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-2xl">
                🛒
              </div>
            </div>
          </div>

          {/* Paid Purchases */}

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Paid Purchases
                </p>

                <h2 className="mt-2 text-2xl font-bold text-gray-900">
                  {statistics.paidPurchases}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-2xl">
                ✅
              </div>
            </div>
          </div>

          {/* Total Revenue */}

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Revenue
                </p>

                <h2 className="mt-2 text-2xl font-bold text-gray-900">
                  ₹{Number(statistics.totalRevenue).toFixed(2)}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-2xl">
                💰
              </div>
            </div>
          </div>

          {/* Pending */}

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Pending
                </p>

                <h2 className="mt-2 text-2xl font-bold text-gray-900">
                  {statistics.pendingPurchases}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-50 text-2xl">
                ⏳
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ============================= */}
      {/* Error */}
      {/* ============================= */}

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* ============================= */}
      {/* Purchase Records */}
      {/* ============================= */}

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        {/* Section Header */}

        <div className="flex flex-col gap-4 border-b border-gray-200 p-5 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Purchase Records
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              View and monitor student purchases.
            </p>
          </div>

          {/* Search & Filter */}

          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">

            <input
              type="text"
              placeholder="Search student, document..."
              value={search}
              onChange={(e) => {
  setSearch(e.target.value);
  setPage(1);
}}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:w-64"
            />

            <select
              value={statusFilter}
              onChange={(e) => {
  setStatusFilter(e.target.value);
  setPage(1);
}}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:w-40"
            >
              <option value="all">
                All Status
              </option>

              <option value="paid">
                Paid
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="failed">
                Failed
              </option>

              <option value="cancelled">
                Cancelled
              </option>
            </select>

            <select
  value={limit}
  onChange={(e) => {
    setLimit(Number(e.target.value));
    setPage(1);
  }}
  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:w-32"
>
  <option value={5}>5 / page</option>
  <option value={10}>10 / page</option>
  <option value={20}>20 / page</option>
  <option value={50}>50 / page</option>
  <option value={100}>100 / page</option>
</select>

          </div>
        </div>

        {/* ============================= */}
        {/* Loading */}
        {/* ============================= */}

        {loading && (
          <div className="flex min-h-40 items-center justify-center px-6 py-10">
            <div className="text-sm font-medium text-gray-500">
              Loading purchases...
            </div>
          </div>
        )}

        {/* ============================= */}
        {/* Table */}
        {/* ============================= */}

        {!loading && !error && (
          <div className="overflow-x-auto">

            <table className="min-w-full divide-y divide-gray-200">

              <thead className="bg-gray-50">
                <tr>
                  <th className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    ID
                  </th>

                  <th className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Student
                  </th>

                  <th className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Document
                  </th>

                  <th className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Amount
                  </th>

                  <th className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>

                  <th className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Payment ID
                  </th>

                  <th className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Purchase Date
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 bg-white">

                {purchases.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-12 text-center"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
                          🛒
                        </div>

                        <h3 className="text-base font-semibold text-gray-900">
                          No purchases found
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          There are no purchase records to display.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  purchases.map((purchase) => (
                    <tr
                      key={purchase.id}
                      className="transition hover:bg-gray-50"
                    >

                      {/* ID */}

                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-700">
                        <strong className="font-semibold text-gray-900">
                          #{purchase.id}
                        </strong>
                      </td>

                      {/* Student */}

                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-700">
                        Student #{purchase.student_id}
                      </td>

                      {/* Document */}

                      <td className="px-5 py-4">
                        <div className="flex flex-col">
                          <strong className="text-sm font-semibold text-gray-900">
                            {purchase.document?.title || "-"}
                          </strong>

                          {purchase.document?.subject && (
                            <small className="mt-1 text-xs text-gray-500">
                              {purchase.document.subject}
                            </small>
                          )}
                        </div>
                      </td>

                      {/* Amount */}

                      <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-gray-900">
                        ₹
                        {Number(
                          purchase.amount || 0,
                        ).toFixed(2)}
                      </td>

                      {/* Status */}

                      <td className="whitespace-nowrap px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                            purchase.status === "paid"
                              ? "bg-green-100 text-green-700"
                              : purchase.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : purchase.status === "failed"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {purchase.status}
                        </span>
                      </td>

                      {/* Payment ID */}

                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                        {purchase.payment_id || "-"}
                      </td>

                      {/* Purchase Date */}

                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                        {purchase.purchased_at
                          ? new Date(
                              purchase.purchased_at,
                            ).toLocaleDateString(
                              "en-IN",
                            )
                          : "-"}
                      </td>

                    </tr>
                  ))
                )}

              </tbody>

            </table>

            {/* ============================= */}
{/* Pagination */}
{/* ============================= */}

{!loading && purchases.length > 0 && (
  <div className="flex flex-col gap-4 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

    {/* Result Information */}

    <p className="text-sm text-gray-500">
      Showing{" "}
      <span className="font-semibold text-gray-900">
        {(pagination.currentPage - 1) * pagination.limit + 1}
      </span>{" "}
      to{" "}
      <span className="font-semibold text-gray-900">
        {Math.min(
          pagination.currentPage * pagination.limit,
          pagination.totalItems,
        )}
      </span>{" "}
      of{" "}
      <span className="font-semibold text-gray-900">
        {pagination.totalItems}
      </span>{" "}
      purchases
    </p>

    {/* Pagination Buttons */}

    <div className="flex items-center gap-2">

      <button
        type="button"
        disabled={page === 1}
        onClick={() => setPage((prev) => prev - 1)}
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Previous
      </button>

      <span className="px-3 text-sm font-semibold text-gray-700">
        Page {pagination.currentPage} of{" "}
        {pagination.totalPages}
      </span>

      <button
        type="button"
        disabled={page >= pagination.totalPages}
        onClick={() => setPage((prev) => prev + 1)}
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>

    </div>
  </div>
)}

          </div>
        )}

      </section>
    </div>
  );
}

export default AdminPurchases;
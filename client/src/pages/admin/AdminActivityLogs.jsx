import { useEffect, useState } from "react";
import api from "../../services/api";

function AdminActivityLogs() {
  const [logs, setLogs] = useState([]);

  // =============================
  // Pagination
  // =============================

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [pagination, setPagination] = useState({
    totalItems: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 10,
  });

  // =============================
  // Statistics
  // =============================

  const [statistics, setStatistics] = useState({
    totalActivities: 0,
    loginActivities: 0,
    failedLogins: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =============================
  // Fetch Activity Logs
  // =============================

  const fetchActivityLogs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/activity-logs", {
        params: {
          page,
          limit,
        },
      });

      setLogs(response.data.data || []);

      setPagination(
        response.data.pagination || {
          totalItems: 0,
          currentPage: 1,
          totalPages: 1,
          limit,
        },
      );

      // Statistics
      if (response.data.statistics) {
        setStatistics(response.data.statistics);
      }
    } catch (error) {
      console.error(
        "Activity logs API error:",
        error.response?.data || error.message,
      );

      setError(
        error.response?.data?.message ||
          "Failed to load activity logs.",
      );
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // Load Logs
  // =============================

  useEffect(() => {
    fetchActivityLogs();
  }, [page, limit]);

  // =============================
  // Format Date
  // =============================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // =============================
  // Action Label
  // =============================

  const getActionLabel = (action) => {
    switch (action) {
      case "login":
        return "Login";

      case "logout":
        return "Logout";

      case "failed_login":
        return "Failed Login";

      default:
        return action;
    }
  };

  return (
    <div className="min-h-full">
      {/* ============================= */}
      {/* Header */}
      {/* ============================= */}

      <div className="mb-7 flex items-center justify-between gap-5">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Activity Logs
          </h2>

          <p className="mt-1.5 text-sm text-gray-500">
            Monitor admin and student login activity.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchActivityLogs}
          disabled={loading}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors duration-200 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* ============================= */}
      {/* Statistics */}
      {/* ============================= */}

      <section className="mb-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {/* Total Activities */}

          <div className="flex min-h-[150px] items-center justify-between rounded-xl border border-gray-200 bg-white px-7 py-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
            <div className="flex flex-col items-start justify-center gap-2">
              <p className="m-0 text-sm font-medium text-gray-500">
                Total Activities
              </p>

              <h2 className="m-0 text-4xl font-bold leading-none text-gray-900">
                {statistics.totalActivities}
              </h2>
            </div>

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-2xl">
              📋
            </div>
          </div>

          {/* Login Activities */}

          <div className="flex min-h-[150px] items-center justify-between rounded-xl border border-gray-200 bg-white px-7 py-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
            <div className="flex flex-col items-start justify-center gap-2">
              <p className="m-0 text-sm font-medium text-gray-500">
                Login Activities
              </p>

              <h2 className="m-0 text-4xl font-bold leading-none text-gray-900">
                {statistics.loginActivities}
              </h2>
            </div>

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-2xl">
              🔐
            </div>
          </div>

          {/* Failed Logins */}

          <div className="flex min-h-[150px] items-center justify-between rounded-xl border border-gray-200 bg-white px-7 py-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
            <div className="flex flex-col items-start justify-center gap-2">
              <p className="m-0 text-sm font-medium text-gray-500">
                Failed Logins
              </p>

              <h2 className="m-0 text-4xl font-bold leading-none text-gray-900">
                {statistics.failedLogins}
              </h2>
            </div>

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-2xl">
              ⚠️
            </div>
          </div>
        </div>
      </section>

      {/* ============================= */}
      {/* Error */}
      {/* ============================= */}

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ============================= */}
      {/* Activity Logs */}
      {/* ============================= */}

      <section className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white">
        {/* Section Header */}

        <div className="flex min-h-[78px] items-center justify-between gap-5 border-b border-gray-200 px-5 py-4">
          <div>
            <h3 className="m-0 mb-1 text-base font-bold text-gray-900">
              Activity Records
            </h3>

            <p className="m-0 text-sm text-slate-500">
              Recent authentication activity.
            </p>
          </div>

          {/* Page Limit */}

          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            <option value={5}>5 / page</option>
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
            <option value={100}>100 / page</option>
          </select>
        </div>

        {/* Loading */}

        {loading && (
          <div className="flex h-[220px] items-center justify-center text-sm text-slate-500">
            <div className="flex flex-col items-center gap-3">
              <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-gray-200 border-t-gray-900" />

              <span>Loading activity logs...</span>
            </div>
          </div>
        )}

        {/* Table */}

        {!loading && (
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[1000px] border-collapse">
              <thead>
                <tr>
                  <th className="h-11 whitespace-nowrap border-b border-gray-200 bg-slate-50 px-4 text-left text-[11px] font-bold uppercase tracking-wide text-slate-500">
                    ID
                  </th>

                  <th className="h-11 whitespace-nowrap border-b border-gray-200 bg-slate-50 px-4 text-left text-[11px] font-bold uppercase tracking-wide text-slate-500">
                    User ID
                  </th>

                  <th className="h-11 whitespace-nowrap border-b border-gray-200 bg-slate-50 px-4 text-left text-[11px] font-bold uppercase tracking-wide text-slate-500">
                    User Type
                  </th>

                  <th className="h-11 whitespace-nowrap border-b border-gray-200 bg-slate-50 px-4 text-left text-[11px] font-bold uppercase tracking-wide text-slate-500">
                    Action
                  </th>

                  <th className="h-11 whitespace-nowrap border-b border-gray-200 bg-slate-50 px-4 text-left text-[11px] font-bold uppercase tracking-wide text-slate-500">
                    IP Address
                  </th>

                  <th className="h-11 whitespace-nowrap border-b border-gray-200 bg-slate-50 px-4 text-left text-[11px] font-bold uppercase tracking-wide text-slate-500">
                    User Agent
                  </th>

                  <th className="h-11 whitespace-nowrap border-b border-gray-200 bg-slate-50 px-4 text-left text-[11px] font-bold uppercase tracking-wide text-slate-500">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="h-[220px] text-center align-middle"
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="mb-1 flex h-[52px] w-[52px] items-center justify-center rounded-xl bg-gray-100 text-2xl">
                          📋
                        </div>

                        <h3 className="m-0 text-base font-semibold text-gray-900">
                          No activity found
                        </h3>

                        <p className="m-0 text-sm text-gray-500">
                          There are no activity records yet.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr
                      key={log.id}
                      className="transition-colors duration-150 hover:bg-slate-50"
                    >
                      <td className="h-14 whitespace-nowrap border-b border-gray-100 px-4 text-sm text-slate-700">
                        <strong className="text-sm font-bold text-gray-900">
                          #{log.id}
                        </strong>
                      </td>

                      <td className="h-14 whitespace-nowrap border-b border-gray-100 px-4 text-sm text-slate-700">
                        {log.user_id}
                      </td>

                      <td className="h-14 whitespace-nowrap border-b border-gray-100 px-4 text-sm text-slate-700">
                        {log.user_type}
                      </td>

                      <td className="h-14 whitespace-nowrap border-b border-gray-100 px-4 text-sm font-medium text-gray-700">
                        {getActionLabel(log.action)}
                      </td>

                      <td className="h-14 whitespace-nowrap border-b border-gray-100 px-4 text-sm text-slate-700">
                        {log.ip_address || "-"}
                      </td>

                      <td
                        title={log.user_agent || ""}
                        className="max-w-[300px] truncate border-b border-gray-100 px-4 text-sm text-slate-700"
                      >
                        {log.user_agent
                          ? log.user_agent.length > 50
                            ? `${log.user_agent.substring(0, 50)}...`
                            : log.user_agent
                          : "-"}
                      </td>

                      <td className="h-14 whitespace-nowrap border-b border-gray-100 px-4 text-sm text-slate-700">
                        {formatDate(log.created_at)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* ============================= */}
            {/* Pagination */}
            {/* ============================= */}

            {!loading && logs.length > 0 && (
              <div className="flex flex-col gap-4 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Result Information */}

                <p className="text-sm text-gray-500">
                  Showing{" "}
                  <span className="font-semibold text-gray-900">
                    {(pagination.currentPage - 1) *
                      pagination.limit +
                      1}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-gray-900">
                    {Math.min(
                      pagination.currentPage *
                        pagination.limit,
                      pagination.totalItems,
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-900">
                    {pagination.totalItems}
                  </span>{" "}
                  activities
                </p>

                {/* Pagination Buttons */}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={page === 1}
                    onClick={() =>
                      setPage((prev) => prev - 1)
                    }
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
                    disabled={
                      page >= pagination.totalPages
                    }
                    onClick={() =>
                      setPage((prev) => prev + 1)
                    }
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

export default AdminActivityLogs;
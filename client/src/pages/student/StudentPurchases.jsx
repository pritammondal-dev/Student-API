import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function StudentPurchases() {
  const navigate = useNavigate();

  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      setError("");

      // Secure library API returns only paid documents
      const response = await api.get("/library");

      setPurchases(response.data.data || []);
    } catch (error) {
      console.error(
        "Failed to fetch purchased documents:",
        error.response?.data || error.message,
      );

      setError(
        error.response?.data?.message ||
          "Unable to load your purchased documents.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  // =============================
  // Loading
  // =============================

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold">My Purchases</h1>

        <p className="mt-4 text-sm text-gray-500">Loading your documents...</p>
      </div>
    );
  }

  // =============================
  // Error
  // =============================

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold">My Purchases</h1>

        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5">
          <p className="text-sm text-red-600">{error}</p>

          <button
            type="button"
            onClick={fetchPurchases}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">My Purchases</h1>

        <p className="mt-1 text-sm text-gray-500">
          Access the documents you have purchased.
        </p>
      </div>

      {/* Count */}
      <div className="mb-5 text-sm text-gray-500">
        {purchases.length} purchased document
        {purchases.length !== 1 ? "s" : ""}
      </div>

      {/* Empty */}
      {purchases.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
          <div className="text-4xl">📚</div>

          <h2 className="mt-4 text-lg font-semibold">No purchases yet</h2>

          <p className="mt-2 text-sm text-gray-500">
            Purchase a document from the library to access it here.
          </p>

          <button
            type="button"
            onClick={() => navigate("/student/library")}
            className="mt-5 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            Browse Library
          </button>
        </div>
      ) : (
        /* Documents */
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {purchases.map((document) => (
            <div
              key={document.document_id}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
            >
              {/* Document Preview */}
              <div className="flex h-40 items-center justify-center bg-gray-100">
                <div className="text-center">
                  <div className="text-5xl">📄</div>

                  <p className="mt-2 text-xs font-medium uppercase tracking-wide text-gray-400">
                    Document
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Subject */}
                <span className="inline-block rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                  {document.subject || "General"}
                </span>

                {/* Title */}
                <h2 className="mt-3 text-lg font-semibold text-gray-900">
                  {document.title}
                </h2>

                {/* Description */}
                <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                  {document.description || "No description available."}
                </p>

                {/* Purchase information */}
                <div className="mt-4 border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400">Purchased</p>

                      <p className="text-sm font-medium text-gray-700">
                        {document.purchased_at
                          ? new Date(document.purchased_at).toLocaleDateString()
                          : "Recently"}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-gray-400">Paid</p>

                      <p className="text-sm font-semibold text-green-600">
                        ₹{document.price}
                      </p>
                    </div>
                  </div>
                </div>

                {/* View Button */}
                <button
                  type="button"
                  onClick={() =>
                    navigate(`/student/library/${document.document_id}`)
                  }
                  className="mt-5 w-full rounded-lg bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                  View Document
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentPurchases;

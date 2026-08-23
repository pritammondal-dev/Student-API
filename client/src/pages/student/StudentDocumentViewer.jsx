import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

function StudentDocumentViewer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const openDocument = async () => {
      try {
        setLoading(true);
        setError("");

        // Get protected PDF
        const response = await api.get(`/library/${id}/view`, {
          responseType: "blob",
        });

        // Create temporary PDF URL
        const pdfUrl = URL.createObjectURL(response.data);

        // Open browser PDF viewer
        window.open(pdfUrl, "_blank");

        // Revoke temporary URL after browser has time to load it
        setTimeout(() => {
          URL.revokeObjectURL(pdfUrl);
        }, 60000);

        // Return to purchases
        navigate("/student/purchases");
      } catch (error) {
        console.error(
          "Failed to open document:",
          error.response?.data || error.message
        );

        setError("Unable to open document. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      openDocument();
    } else {
      setError("Invalid document ID.");
      setLoading(false);
    }
  }, [id, navigate]);

  // Loading
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black" />

          <p className="mt-4 text-sm text-gray-600">
            Opening document...
          </p>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
        <div className="w-full max-w-md rounded-xl border border-red-200 bg-white p-6 text-center shadow-sm">
          <div className="text-4xl">📄</div>

          <h1 className="mt-4 text-xl font-semibold text-gray-900">
            Unable to open document
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {error}
          </p>

          <button
            type="button"
            onClick={() => navigate("/student/purchases")}
            className="mt-5 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Back to Purchases
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default StudentDocumentViewer;
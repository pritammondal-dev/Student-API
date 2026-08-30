
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function LandingPage() {
  const navigate = useNavigate();

  const { isAuthenticated, role } = useAuth();

  const [documents, setDocuments] = useState([]);
  const [loadingDocuments, setLoadingDocuments] = useState(true);
  const [documentError, setDocumentError] = useState("");

  const [showLoginPopup, setShowLoginPopup] = useState(false);

  // =============================
  // Fetch Public Documents
  // =============================

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoadingDocuments(true);
        setDocumentError("");

        const response = await api.get("/public/documents");

        setDocuments(response.data.data || []);
      } catch (error) {
        console.error(
          "Failed to fetch public documents:",
          error.response?.data || error.message
        );

        setDocumentError(
          error.response?.data?.message ||
            "Unable to load notes right now."
        );
      } finally {
        setLoadingDocuments(false);
      }
    };

    fetchDocuments();
  }, []);

  // =============================
  // Buy Now
  // =============================

  const handleBuyNow = (document) => {
    if (!isAuthenticated || role !== "student") {
      setShowLoginPopup(true);
      return;
    }

    navigate(`/student/dashboard?document=${document.id}`);
  };

  // =============================
  // Student Login
  // =============================

  const handleStudentLogin = () => {
    setShowLoginPopup(false);
    navigate("/student/login");
  };

  // =============================
  // Student Register
  // =============================

  const handleStudentRegister = () => {
    setShowLoginPopup(false);
    navigate("/student/register");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">

      {/* =============================
          Header
      ============================= */}

      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">

          {/* Brand */}

          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-left"
          >
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              Student Management
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Simple. Secure. Efficient.
            </p>
          </button>

          {/* Navigation */}

          <nav className="flex flex-wrap items-center justify-end gap-2">

            {/* Student Register */}

            <button
              type="button"
              onClick={handleStudentRegister}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
            >
              Student Register
            </button>

            {/* Student Login */}

            <button
              type="button"
              onClick={handleStudentLogin}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
            >
              Student Login
            </button>

            {/* Admin Register */}

            <button
              type="button"
              onClick={() => navigate("/admin/register")}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
            >
              Admin Register
            </button>

            {/* Admin Login */}

            <button
              type="button"
              onClick={() => navigate("/admin/login")}
              className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Admin Login
            </button>

          </nav>
        </div>
      </header>

      {/* =============================
          Hero
      ============================= */}

      <main>

        <section className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-20 text-center sm:px-8 lg:py-28">

            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-500">
              Student Management System
            </p>

            <h2 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Everything students need,
              <span className="block">
                in one place.
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
              Stay updated with academic notices, upcoming events,
              and useful study materials from your institution.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">

              <button
                type="button"
                onClick={handleStudentRegister}
                className="rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Student Register
              </button>

              <button
                type="button"
                onClick={handleStudentLogin}
                className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
              >
                Student Login
              </button>

            </div>
          </div>
        </section>

        {/* =============================
            Academic Notices
        ============================= */}

        <section className="mx-auto max-w-7xl px-6 py-16 sm:px-8">

          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
              Stay Updated
            </p>

            <h3 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
              Academic Notices
            </h3>

            <p className="mt-2 text-gray-600">
              Important announcements and academic information.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-5">

              <div>
                <h4 className="font-semibold text-gray-900">
                  Academic notices coming soon
                </h4>

                <p className="mt-1 text-sm text-gray-500">
                  Important college announcements will appear here.
                </p>
              </div>

              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                Notice
              </span>

            </div>

            <div className="pt-5 text-sm text-gray-500">
              Notice management will be connected to the backend next.
            </div>

          </div>
        </section>

        {/* =============================
            Events
        ============================= */}

        <section className="border-y border-gray-200 bg-white">

          <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8">

            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
                What's Happening
              </p>

              <h3 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                Upcoming Events
              </h3>

              <p className="mt-2 text-gray-600">
                Discover upcoming academic and campus events.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center">

              <h4 className="font-semibold text-gray-900">
                Events coming soon
              </h4>

              <p className="mx-auto mt-2 max-w-lg text-sm text-gray-500">
                Upcoming college events will be displayed here once
                the event management module is connected.
              </p>

            </div>

          </div>
        </section>

        {/* =============================
            Notes Shop
        ============================= */}

        <section className="mx-auto max-w-7xl px-6 py-16 sm:px-8">

          <div className="mb-8">

            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
              Study Materials
            </p>

            <h3 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
              Notes Shop
            </h3>

            <p className="mt-2 text-gray-600">
              Find useful notes and study materials for your studies.
            </p>

          </div>

          {/* Loading */}

          {loadingDocuments && (
            <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
              <p className="text-sm text-gray-500">
                Loading notes...
              </p>
            </div>
          )}

          {/* Error */}

          {!loadingDocuments && documentError && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
              <p className="text-sm font-medium text-red-700">
                {documentError}
              </p>
            </div>
          )}

          {/* Empty */}

          {!loadingDocuments &&
            !documentError &&
            documents.length === 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
                <p className="text-sm text-gray-500">
                  No study materials are available right now.
                </p>
              </div>
            )}

          {/* Documents */}

          {!loadingDocuments &&
            !documentError &&
            documents.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                {documents.map((document) => (
                  <article
                    key={document.id}
                    className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >

                    {/* Book Cover */}

                    <div className="flex h-44 items-center justify-center bg-gray-100">

                      <div className="text-center">

                        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-white shadow-sm">
                          <span className="text-2xl">
                            📚
                          </span>
                        </div>

                        <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                          Study Material
                        </p>

                      </div>

                    </div>

                    {/* Content */}

                    <div className="flex flex-1 flex-col p-6">

                      <div>

                        {document.subject && (
                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                            {document.subject}
                          </p>
                        )}

                        <h4 className="mt-2 text-lg font-bold text-gray-900">
                          {document.title}
                        </h4>

                        {document.description && (
                          <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-500">
                            {document.description}
                          </p>
                        )}

                      </div>

                      {/* Price + Buy */}

                      <div className="mt-auto flex items-center justify-between gap-4 pt-6">

                        <div>
                          <p className="text-xs text-gray-500">
                            Price
                          </p>

                          <p className="mt-1 text-xl font-bold text-gray-900">
                            ₹{Number(document.price).toFixed(2)}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleBuyNow(document)}
                          className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
                        >
                          Buy Now
                        </button>

                      </div>

                    </div>
                  </article>
                ))}

              </div>
            )}

        </section>

      </main>

      {/* =============================
          Login Required Popup
      ============================= */}

      {showLoginPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={() => setShowLoginPopup(false)}
        >

          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="flex items-start justify-between gap-4">

              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Login Required
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Please login or register as a student before
                  purchasing study materials.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowLoginPopup(false)}
                className="text-2xl leading-none text-gray-400 transition hover:text-gray-900"
                aria-label="Close"
              >
                ×
              </button>

            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">

              <button
                type="button"
                onClick={handleStudentLogin}
                className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Student Login
              </button>

              <button
                type="button"
                onClick={handleStudentRegister}
                className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
              >
                Student Register
              </button>

            </div>

            <button
              type="button"
              onClick={() => setShowLoginPopup(false)}
              className="mt-3 w-full rounded-lg px-5 py-2.5 text-sm font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
            >
              Cancel
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default LandingPage;

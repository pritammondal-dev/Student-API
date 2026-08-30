import { useEffect, useState } from "react";
import api from "../../services/api";

function AdminNotices() {
  // =============================
  // State
  // =============================

  const [notices, setNotices] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [deletingNotice, setDeletingNotice] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "general",
    publish_date: "",
    expiry_date: "",
    is_published: true,
  });

  // =============================
  // Fetch Notices
  // =============================

  const fetchNotices = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/notices");

      setNotices(response.data.data || []);
    } catch (error) {
      console.error(
        "Failed to fetch notices:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to load notices."
      );
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // Initial Load
  // =============================

  useEffect(() => {
    fetchNotices();
  }, []);

  // =============================
  // Handle Input Change
  // =============================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =============================
  // Reset Form
  // =============================

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "general",
      publish_date: "",
      expiry_date: "",
      is_published: true,
    });

    setEditingNotice(null);
  };

  // =============================
  // Open Create Modal
  // =============================

  const handleCreateClick = () => {
    resetForm();

    setError("");
    setSuccess("");

    setShowModal(true);
  };

  // =============================
  // Open Edit Modal
  // =============================

  const handleEditClick = (notice) => {
    setEditingNotice(notice);

    setFormData({
      title: notice.title || "",
      description: notice.description || "",
      category: notice.category || "general",
      publish_date: notice.publish_date || "",
      expiry_date: notice.expiry_date || "",
      is_published: Boolean(notice.is_published),
    });

    setError("");
    setSuccess("");

    setShowModal(true);
  };

  // =============================
  // Close Modal
  // =============================

  const handleCloseModal = () => {
    if (saving) return;

    setShowModal(false);
    resetForm();
  };

  // =============================
  // Create / Update Notice
  // =============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category.trim() || "general",
        publish_date: formData.publish_date,
        expiry_date: formData.expiry_date || null,
        is_published: formData.is_published,
      };

      if (!payload.title) {
        setError("Title is required.");
        return;
      }

      if (!payload.description) {
        setError("Description is required.");
        return;
      }

      if (!payload.publish_date) {
        setError("Publish date is required.");
        return;
      }

      if (editingNotice) {
        const response = await api.put(
          `/notices/${editingNotice.id}`,
          payload
        );

        setSuccess(
          response.data.message ||
            "Notice updated successfully."
        );
      } else {
        const response = await api.post(
          "/notices",
          payload
        );

        setSuccess(
          response.data.message ||
            "Notice created successfully."
        );
      }

      setShowModal(false);
      resetForm();

      await fetchNotices();
    } catch (error) {
      console.error(
        "Notice save error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to save notice."
      );
    } finally {
      setSaving(false);
    }
  };

  // =============================
  // Open Delete Confirmation
  // =============================

  const handleDeleteClick = (notice) => {
    setDeletingNotice(notice);
    setError("");
    setSuccess("");
  };

  // =============================
  // Delete Notice
  // =============================

  const handleDelete = async () => {
    if (!deletingNotice) return;

    try {
      setDeleting(true);
      setError("");
      setSuccess("");

      const response = await api.delete(
        `/notices/${deletingNotice.id}`
      );

      setSuccess(
        response.data.message ||
          "Notice deleted successfully."
      );

      setDeletingNotice(null);

      await fetchNotices();
    } catch (error) {
      console.error(
        "Delete notice error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete notice."
      );
    } finally {
      setDeleting(false);
    }
  };

  // =============================
  // Format Date
  // =============================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(`${date}T00:00:00`).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =============================
  // Status Badge
  // =============================

  const getStatus = (notice) => {
    if (!notice.is_published) {
      return {
        label: "Draft",
        className:
          "bg-gray-100 text-gray-700",
      };
    }

    if (
      notice.expiry_date &&
      new Date(`${notice.expiry_date}T23:59:59`) < new Date()
    ) {
      return {
        label: "Expired",
        className:
          "bg-red-50 text-red-700",
      };
    }

    return {
      label: "Published",
      className:
        "bg-green-50 text-green-700",
    };
  };

  // =============================
  // Page
  // =============================

  return (
    <div className="min-h-full bg-gray-50 p-4 sm:p-6 lg:p-8">

      {/* =============================
          Header
      ============================= */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Notice Management
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Create, publish, update, and manage academic notices.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreateClick}
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          + Create Notice
        </button>
      </div>

      {/* =============================
          Success Message
      ============================= */}

      {success && (
        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
          <p className="text-sm font-medium text-green-700">
            {success}
          </p>
        </div>
      )}

      {/* =============================
          Error Message
      ============================= */}

      {error && !showModal && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm font-medium text-red-700">
            {error}
          </p>
        </div>
      )}

      {/* =============================
          Notice Table
      ============================= */}

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        {/* Table Header */}

        <div className="border-b border-gray-200 px-5 py-4">
          <h3 className="font-semibold text-gray-900">
            All Notices
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            {notices.length} notice
            {notices.length !== 1 ? "s" : ""} available
          </p>
        </div>

        {/* Loading */}

        {loading && (
          <div className="flex min-h-48 items-center justify-center p-6">
            <div className="text-center">
              <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />

              <p className="mt-3 text-sm text-gray-500">
                Loading notices...
              </p>
            </div>
          </div>
        )}

        {/* Empty */}

        {!loading && !error && notices.length === 0 && (
          <div className="px-5 py-16 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
              📢
            </div>

            <h3 className="mt-4 text-base font-semibold text-gray-900">
              No notices found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Create your first academic notice.
            </p>

            <button
              type="button"
              onClick={handleCreateClick}
              className="mt-5 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Create Notice
            </button>
          </div>
        )}

        {/* Table */}

        {!loading && notices.length > 0 && (
          <div className="overflow-x-auto">

            <table className="w-full min-w-[1000px] text-left">

              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Notice
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Category
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Publish Date
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Expiry Date
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">

                {notices.map((notice) => {
                  const status = getStatus(notice);

                  return (
                    <tr
                      key={notice.id}
                      className="transition hover:bg-gray-50"
                    >

                      {/* Notice */}

                      <td className="max-w-[350px] px-5 py-4">

                        <p className="truncate text-sm font-semibold text-gray-900">
                          {notice.title}
                        </p>

                        <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                          {notice.description}
                        </p>

                      </td>

                      {/* Category */}

                      <td className="px-5 py-4">

                        <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium capitalize text-gray-700">
                          {notice.category || "general"}
                        </span>

                      </td>

                      {/* Publish Date */}

                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-700">
                        {formatDate(notice.publish_date)}
                      </td>

                      {/* Expiry Date */}

                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-700">
                        {formatDate(notice.expiry_date)}
                      </td>

                      {/* Status */}

                      <td className="px-5 py-4">

                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}
                        >
                          {status.label}
                        </span>

                      </td>

                      {/* Actions */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              handleEditClick(notice)
                            }
                            className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-100"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteClick(notice)
                            }
                            className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>
          </div>
        )}

      </section>

      {/* =============================
          Create / Edit Modal
      ============================= */}

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6"
          onClick={handleCloseModal}
        >

          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Modal Header */}

            <div className="flex items-start justify-between border-b border-gray-200 px-6 py-5">

              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {editingNotice
                    ? "Edit Notice"
                    : "Create Notice"}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {editingNotice
                    ? "Update the notice information."
                    : "Create a new academic notice."}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                disabled={saving}
                className="text-2xl leading-none text-gray-400 transition hover:text-gray-900 disabled:cursor-not-allowed"
                aria-label="Close"
              >
                ×
              </button>

            </div>

            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >

              {/* Modal Error */}

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-sm font-medium text-red-700">
                    {error}
                  </p>
                </div>
              )}

              {/* Title */}

              <div>
                <label
                  htmlFor="notice-title"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Title
                </label>

                <input
                  id="notice-title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter notice title"
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* Description */}

              <div>
                <label
                  htmlFor="notice-description"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Description
                </label>

                <textarea
                  id="notice-description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter notice description"
                  rows="5"
                  required
                  className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* Category */}

              <div>
                <label
                  htmlFor="notice-category"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Category
                </label>

                <select
                  id="notice-category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="general">
                    General
                  </option>

                  <option value="academic">
                    Academic
                  </option>

                  <option value="exam">
                    Exam
                  </option>

                  <option value="holiday">
                    Holiday
                  </option>

                  <option value="admission">
                    Admission
                  </option>

                  <option value="event">
                    Event
                  </option>

                  <option value="fee">
                    Fee
                  </option>

                  <option value="important">
                    Important
                  </option>
                </select>
              </div>

              {/* Dates */}

              <div className="grid gap-5 sm:grid-cols-2">

                {/* Publish Date */}

                <div>
                  <label
                    htmlFor="notice-publish-date"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Publish Date
                  </label>

                  <input
                    id="notice-publish-date"
                    type="date"
                    name="publish_date"
                    value={formData.publish_date}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                {/* Expiry Date */}

                <div>
                  <label
                    htmlFor="notice-expiry-date"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Expiry Date
                  </label>

                  <input
                    id="notice-expiry-date"
                    type="date"
                    name="expiry_date"
                    value={formData.expiry_date}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />

                  <p className="mt-1 text-xs text-gray-400">
                    Optional
                  </p>
                </div>

              </div>

              {/* Published */}

              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">

                <input
                  type="checkbox"
                  name="is_published"
                  checked={formData.is_published}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />

                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Publish Notice
                  </p>

                  <p className="text-xs text-gray-500">
                    Published notices can be displayed publicly.
                  </p>
                </div>

              </label>

              {/* Buttons */}

              <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={saving}
                  className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? editingNotice
                      ? "Updating..."
                      : "Creating..."
                    : editingNotice
                    ? "Update Notice"
                    : "Create Notice"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* =============================
          Delete Confirmation Modal
      ============================= */}

      {deletingNotice && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={() => {
            if (!deleting) {
              setDeletingNotice(null);
            }
          }}
        >

          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-xl">
              ⚠️
            </div>

            <h3 className="mt-4 text-xl font-bold text-gray-900">
              Delete Notice?
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">
                "{deletingNotice.title}"
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeletingNotice(null)}
                className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting
                  ? "Deleting..."
                  : "Delete Notice"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default AdminNotices;

import { useEffect, useState } from "react";
import api from "../../services/api";

function AdminDocuments() {
  const [documents, setDocuments] = useState([]);

const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage, setItemsPerPage] = useState(10);

const [pagination, setPagination] = useState({
  totalItems: 0,
  currentPage: 1,
  totalPages: 1,
  limit: 10,
});
 

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    price: "",
    document: null,
  });

  const [uploadLoading, setUploadLoading] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deletingDocument, setDeletingDocument] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [viewingDocument, setViewingDocument] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

  // =============================
  // Get All Documents
  // =============================

  const fetchDocuments = async (
  page = currentPage,
  limit = itemsPerPage,
) => {
  try {
    setLoading(true);
    setError("");

    const response = await api.get("/documents", {
      params: {
        page,
        limit,
      },
    });

    setDocuments(response.data.data || []);

    setPagination(
      response.data.pagination || {
        totalItems: 0,
        currentPage: page,
        totalPages: 1,
        limit,
      },
    );
  } catch (error) {
    console.error(
      "Documents API error:",
      error.response?.data || error.message,
    );

    setError(
      error.response?.data?.message ||
        "Failed to load documents.",
    );
  } finally {
    setLoading(false);
  }
};

  // =============================
  // Load Documents
  // =============================

 useEffect(() => {
  fetchDocuments(currentPage, itemsPerPage);
}, [currentPage, itemsPerPage]);

  // =============================
  // Form Change
  // =============================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =============================
  // File Change
  // =============================

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    setFormData((prev) => ({
      ...prev,
      document: file,
    }));
  };

  // =============================
  // Add Document
  // =============================

  const handleAddDocument = async (e) => {
    e.preventDefault();

    if (!formData.document) {
      setError("Please select a document file.");
      return;
    }

    try {
      setUploadLoading(true);
      setError("");

      const data = new FormData();

      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("subject", formData.subject);
      data.append("price", formData.price);
      data.append("document", formData.document);

      const response = await api.post("/documents", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Document uploaded:", response.data);

      setShowAddModal(false);

      setFormData({
        title: "",
        description: "",
        subject: "",
        price: "",
        document: null,
      });

      await fetchDocuments();
    } catch (error) {
      console.error(
        "Upload document error:",
        error.response?.data || error.message,
      );

      setError(
        error.response?.data?.message || "Failed to upload document.",
      );
    } finally {
      setUploadLoading(false);
    }
  };

  // =============================
  // Delete Click
  // =============================

  const handleDeleteClick = (document) => {
    setDeletingDocument(document);
    setError("");
  };

  // =============================
  // Delete Document
  // =============================

  const handleDeleteDocument = async () => {
    if (!deletingDocument) return;

    try {
      setDeleteLoading(true);
      setError("");

      const documentId = deletingDocument.id;

      const response = await api.delete(`/documents/${documentId}`);

      console.log("Document deleted:", response.data);

      setDeletingDocument(null);

      await fetchDocuments();
    } catch (error) {
      console.error(
        "Delete document error:",
        error.response?.data || error.message,
      );

      setError(
        error.response?.data?.message || "Failed to delete document.",
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // =============================
  // Edit Document
  // =============================

  const handleEditClick = (document) => {
    setEditingDocument({
      id: document.id,
      title: document.title || "",
      description: document.description || "",
      subject: document.subject || "",
      price: document.price || "",
      document: null,
    });

    setError("");
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditingDocument((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditFileChange = (e) => {
    const file = e.target.files[0];

    setEditingDocument((prev) => ({
      ...prev,
      document: file,
    }));
  };

  const handleUpdateDocument = async (e) => {
    e.preventDefault();

    if (!editingDocument) return;

    try {
      setEditLoading(true);
      setError("");

      const data = new FormData();

      data.append("title", editingDocument.title);
      data.append("description", editingDocument.description);
      data.append("subject", editingDocument.subject);
      data.append("price", editingDocument.price);

      if (editingDocument.document) {
        data.append("document", editingDocument.document);
      }

      const response = await api.put(
        `/documents/${editingDocument.id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      console.log("Document updated:", response.data);

      setEditingDocument(null);

      await fetchDocuments();
    } catch (error) {
      console.error(
        "Update document error:",
        error.response?.data || error.message,
      );

      setError(
        error.response?.data?.message || "Failed to update document.",
      );
    } finally {
      setEditLoading(false);
    }
  };

  // =============================
  // View Document
  // =============================

  const handleViewDocument = async (document) => {
    try {
      setViewLoading(true);
      setError("");

      const response = await api.get(
        `/documents/${document.id}/file`,
        {
          responseType: "blob",
        },
      );

      const fileBlob = new Blob([response.data], {
        type:
          response.headers["content-type"] ||
          "application/pdf",
      });

      const fileUrl = URL.createObjectURL(fileBlob);

      setViewingDocument({
        ...document,
        fileUrl,
      });
    } catch (error) {
      console.error(
        "View document error:",
        error.response?.data || error.message,
      );

      setError("Failed to open document.");
    } finally {
      setViewLoading(false);
    }
  };

  // =============================
  // Shared Input Classes
  // =============================

  const inputClasses =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10";

  const labelClasses =
    "text-sm font-semibold text-gray-700";

  return (
    <div className="min-h-full bg-gray-50">

      {/* ============================= */}
      {/* Main Content */}
      {/* ============================= */}

      <main className="w-full p-4 sm:p-6 lg:p-8">

        {/* Header */}

        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Documents
            </h2>

            <p className="mt-1.5 text-sm text-gray-500">
              Manage study documents and learning materials.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setError("");
              setShowAddModal(true);
            }}
            className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 active:scale-[0.98] sm:w-auto"
          >
            + Add Document
          </button>
        </div>

        {/* ============================= */}
        {/* Statistics */}
        {/* ============================= */}

        <section className="mb-7">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

            <div className="flex min-h-[140px] items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-gray-500">
                  Total Documents
                </p>

                <h2 className="text-4xl font-bold leading-none text-gray-900">
                  {pagination.totalItems}
                </h2>
              </div>

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-2xl">
                📚
              </div>

            </div>

          </div>
        </section>

        {/* ============================= */}
        {/* Error */}
        {/* ============================= */}

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* ============================= */}
        {/* Documents Section */}
        {/* ============================= */}

        <section className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white">

          <div className="flex min-h-[78px] flex-col gap-4 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

  <div>
    <h3 className="text-base font-bold text-gray-900">
      Document Records
    </h3>

    <p className="text-sm text-gray-500">
      View and manage uploaded documents.
    </p>
  </div>

  <div className="flex items-center gap-2">
    <label
      htmlFor="itemsPerPage"
      className="text-sm font-medium text-gray-600"
    >
      Show
    </label>

    <select
      id="itemsPerPage"
      value={itemsPerPage}
      onChange={(e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
      }}
      className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
    >
      <option value={5}>5</option>
      <option value={10}>10</option>
      <option value={20}>20</option>
      <option value={50}>50</option>
      <option value={100}>100</option>
    </select>

    <span className="text-sm text-gray-500">
      per page
    </span>
  </div>

</div>

          {/* Loading */}

          {loading && (
            <div className="flex h-56 items-center justify-center text-sm text-gray-500">
              Loading documents...
            </div>
          )}

          {/* Table */}

          {!loading && (
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[950px] border-collapse">

                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="h-11 px-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      ID
                    </th>

                    <th className="h-11 px-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Title
                    </th>

                    <th className="h-11 px-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Subject
                    </th>

                    <th className="h-11 px-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Price
                    </th>

                    <th className="h-11 px-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      File
                    </th>

                    <th className="h-11 px-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Created
                    </th>

                    <th className="h-11 px-4 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {documents.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="h-56 text-center align-middle"
                      >
                        <div className="flex flex-col items-center justify-center gap-2">

                          <div className="mb-1 flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 text-2xl">
                            📚
                          </div>

                          <h3 className="text-base font-semibold text-gray-900">
                            No documents found
                          </h3>

                          <p className="text-sm text-gray-500">
                            Start by uploading your first document.
                          </p>

                        </div>
                      </td>
                    </tr>
                  ) : (
                    documents.map((document) => (
                      <tr
                        key={document.id}
                        className="border-b border-gray-100 transition hover:bg-gray-50 last:border-b-0"
                      >

                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                          <strong className="font-bold text-gray-900">
                            #{document.id}
                          </strong>
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                          {document.title}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                          {document.subject || "-"}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-900">
                          ₹{Number(document.price).toFixed(2)}
                        </td>

                        <td className="max-w-[220px] truncate px-4 py-4 text-sm text-gray-600">
                          {document.file_name || "-"}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                          {document.created_at
                            ? new Date(
                                document.created_at,
                              ).toLocaleDateString("en-IN")
                            : "-"}
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">

                            <button
                              type="button"
                              onClick={() =>
                                handleViewDocument(document)
                              }
                              disabled={viewLoading}
                              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {viewLoading ? "Opening..." : "View"}
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleEditClick(document)
                              }
                              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-100"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteClick(document)
                              }
                              className="rounded-md border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-50"
                            >
                              Delete
                            </button>

                          </div>
                        </td>

                      </tr>
                    ))
                  )}

                </tbody>

              </table>
              {/* Pagination */}

{pagination.totalItems > 0 && (
  <div className="flex flex-col gap-4 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

    {/* Information */}

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
          pagination.currentPage * pagination.limit,
          pagination.totalItems,
        )}
      </span>{" "}
      of{" "}
      <span className="font-semibold text-gray-900">
        {pagination.totalItems}
      </span>{" "}
      documents
    </p>

    {/* Buttons */}

    <div className="flex items-center gap-2">

      <button
        type="button"
        disabled={pagination.currentPage === 1 || loading}
        onClick={() =>
          setCurrentPage((prev) => prev - 1)
        }
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Previous
      </button>

      <div className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white">
        {pagination.currentPage} / {pagination.totalPages}
      </div>

      <button
        type="button"
        disabled={
          pagination.currentPage ===
            pagination.totalPages ||
          loading
        }
        onClick={() =>
          setCurrentPage((prev) => prev + 1)
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
      </main>

      {/* ============================= */}
      {/* Add Document Modal */}
      {/* ============================= */}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">

          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            <div className="flex items-start justify-between border-b border-gray-200 px-6 py-5">

              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Add Document
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Upload a new study document.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                disabled={uploadLoading}
                className="flex h-8 w-8 items-center justify-center rounded-md text-2xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50"
              >
                ×
              </button>

            </div>

            <form
              className="flex flex-col gap-5 p-6"
              onSubmit={handleAddDocument}
            >

              {/* Title */}

              <div className="flex flex-col gap-2">
                <label className={labelClasses}>
                  Title
                </label>

                <input
                  type="text"
                  name="title"
                  placeholder="Enter document title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className={inputClasses}
                />
              </div>

              {/* Description */}

              <div className="flex flex-col gap-2">
                <label className={labelClasses}>
                  Description
                </label>

                <textarea
                  name="description"
                  placeholder="Enter document description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className={inputClasses}
                />
              </div>

              {/* Subject */}

              <div className="flex flex-col gap-2">
                <label className={labelClasses}>
                  Subject
                </label>

                <input
                  type="text"
                  name="subject"
                  placeholder="Example: Data Structures"
                  value={formData.subject}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>

              {/* Price */}

              <div className="flex flex-col gap-2">
                <label className={labelClasses}>
                  Price
                </label>

                <input
                  type="number"
                  name="price"
                  placeholder="Enter price"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className={inputClasses}
                />
              </div>

              {/* File */}

              <div className="flex flex-col gap-2">
                <label className={labelClasses}>
                  Document File
                </label>

                <input
                  type="file"
                  name="document"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-gray-900 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-gray-800"
                />

                {formData.document && (
                  <small className="text-xs text-gray-500">
                    Selected: {formData.document.name}
                  </small>
                )}
              </div>

              {/* Buttons */}

              <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">

                <button
                  type="button"
                  onClick={() =>
                    setShowAddModal(false)
                  }
                  disabled={uploadLoading}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={uploadLoading}
                  className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {uploadLoading
                    ? "Uploading..."
                    : "Upload Document"}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

      {/* ============================= */}
      {/* Edit Document Modal */}
      {/* ============================= */}

      {editingDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">

          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            <div className="flex items-start justify-between border-b border-gray-200 px-6 py-5">

              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Edit Document
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Update document information.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setEditingDocument(null)
                }
                disabled={editLoading}
                className="flex h-8 w-8 items-center justify-center rounded-md text-2xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50"
              >
                ×
              </button>

            </div>

            <form
              className="flex flex-col gap-5 p-6"
              onSubmit={handleUpdateDocument}
            >

              {/* Title */}

              <div className="flex flex-col gap-2">
                <label className={labelClasses}>
                  Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={editingDocument.title}
                  onChange={handleEditChange}
                  required
                  className={inputClasses}
                />
              </div>

              {/* Description */}

              <div className="flex flex-col gap-2">
                <label className={labelClasses}>
                  Description
                </label>

                <textarea
                  name="description"
                  value={editingDocument.description}
                  onChange={handleEditChange}
                  rows="4"
                  className={inputClasses}
                />
              </div>

              {/* Subject */}

              <div className="flex flex-col gap-2">
                <label className={labelClasses}>
                  Subject
                </label>

                <input
                  type="text"
                  name="subject"
                  value={editingDocument.subject}
                  onChange={handleEditChange}
                  className={inputClasses}
                />
              </div>

              {/* Price */}

              <div className="flex flex-col gap-2">
                <label className={labelClasses}>
                  Price
                </label>

                <input
                  type="number"
                  name="price"
                  min="0"
                  step="0.01"
                  value={editingDocument.price}
                  onChange={handleEditChange}
                  required
                  className={inputClasses}
                />
              </div>

              {/* Replace File */}

              <div className="flex flex-col gap-2">
                <label className={labelClasses}>
                  Replace Document File
                </label>

                <input
                  type="file"
                  name="document"
                  accept=".pdf,.doc,.docx"
                  onChange={handleEditFileChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-gray-900 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-gray-800"
                />

                {editingDocument.document && (
                  <small className="text-xs text-gray-500">
                    New file:{" "}
                    {editingDocument.document.name}
                  </small>
                )}
              </div>

              {/* Buttons */}

              <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">

                <button
                  type="button"
                  onClick={() =>
                    setEditingDocument(null)
                  }
                  disabled={editLoading}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={editLoading}
                  className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {editLoading
                    ? "Saving..."
                    : "Save Changes"}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

      {/* ============================= */}
      {/* Delete Modal */}
      {/* ============================= */}

      {deletingDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">

          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">

            <div className="flex items-start justify-between px-6 pt-6">

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-xl font-bold text-red-600">
                !
              </div>

              <button
                type="button"
                onClick={() =>
                  setDeletingDocument(null)
                }
                disabled={deleteLoading}
                className="flex h-8 w-8 items-center justify-center rounded-md text-2xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50"
              >
                ×
              </button>

            </div>

            <div className="px-6 pb-5">

              <h3 className="mt-4 text-xl font-bold text-gray-900">
                Delete Document?
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Are you sure you want to delete this document?
              </p>

              <div className="my-4 flex flex-col gap-1 rounded-lg border border-gray-200 bg-gray-50 p-4">

                <strong className="text-sm font-bold text-gray-900">
                  {deletingDocument.title}
                </strong>

                <span className="text-xs text-gray-500">
                  {deletingDocument.file_name}
                </span>

              </div>

              <p className="text-xs font-medium text-red-600">
                This action cannot be undone.
              </p>

            </div>

            <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">

              <button
                type="button"
                onClick={() =>
                  setDeletingDocument(null)
                }
                disabled={deleteLoading}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteDocument}
                disabled={deleteLoading}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleteLoading
                  ? "Deleting..."
                  : "Delete Document"}
              </button>

            </div>

          </div>
        </div>
      )}

      {/* ============================= */}
      {/* Document Viewer */}
      {/* ============================= */}

      {viewingDocument && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-3 sm:p-5">

          <div className="flex h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">

            <div className="flex min-h-16 items-center justify-between border-b border-gray-200 bg-white px-4">

              <div className="min-w-0">
                <h3 className="truncate text-base font-bold text-gray-900 sm:text-lg">
                  {viewingDocument.title}
                </h3>

                <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
                  {viewingDocument.subject || "Document"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  URL.revokeObjectURL(
                    viewingDocument.fileUrl,
                  );

                  setViewingDocument(null);
                }}
                className="ml-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-2xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
              >
                ×
              </button>

            </div>

            <div className="min-h-0 flex-1 bg-gray-700">

              <iframe
                src={viewingDocument.fileUrl}
                title={viewingDocument.title}
                className="block h-full w-full border-0"
              />

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default AdminDocuments;
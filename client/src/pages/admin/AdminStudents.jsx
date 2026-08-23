import { useEffect, useState } from "react";
import api from "../../services/api";

function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchId, setSearchId] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  const [editingStudent, setEditingStudent] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  const [deletingStudent, setDeletingStudent] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // =============================
  // Get All Students
  // =============================

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/students");

      const studentData = response.data.data || [];

      setStudents(studentData);
      setAllStudents(studentData);
    } catch (error) {
      console.error(
        "Students API error:",
        error.response?.data || error.message,
      );

      setError(
        error.response?.data?.message || "Failed to load students.",
      );
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // Search Student
  // =============================

  const handleSearch = async (e) => {
    e.preventDefault();

    const studentId = searchId.trim();

    if (!studentId) {
      setStudents(allStudents);
      setError("");
      return;
    }

    try {
      setSearchLoading(true);
      setError("");

      const response = await api.get(`/students/${studentId}`);

      setStudents([response.data.data]);
    } catch (error) {
      console.error(
        "Search error:",
        error.response?.data || error.message,
      );

      setStudents([]);

      setError(
        error.response?.data?.message || "Student not found.",
      );
    } finally {
      setSearchLoading(false);
    }
  };

  // =============================
  // Clear Search
  // =============================

  const handleClearSearch = () => {
    setSearchId("");
    setStudents(allStudents);
    setError("");
  };

  // =============================
  // Open Edit Modal
  // =============================

  const handleEditClick = (student) => {
    setEditingStudent({
      student_id: student.student_id,
      name: student.name || "",
      email: student.email || "",
      phone: student.phone || "",
      age: student.age || "",
      gender: student.gender || "",
    });

    setError("");
  };

  // =============================
  // Edit Input Change
  // =============================

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditingStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =============================
  // Update Student
  // =============================

  const handleUpdateStudent = async (e) => {
    e.preventDefault();

    if (!editingStudent) return;

    try {
      setEditLoading(true);
      setError("");

      const studentId = editingStudent.student_id;

      const response = await api.put(`/students/${studentId}`, {
        name: editingStudent.name,
        email: editingStudent.email,
        phone: editingStudent.phone,
        age: editingStudent.age
          ? Number(editingStudent.age)
          : null,
        gender: editingStudent.gender || null,
      });

      console.log("Student updated:", response.data);

      setEditingStudent(null);

      await fetchStudents();
    } catch (error) {
      console.error(
        "Update student error:",
        error.response?.data || error.message,
      );

      setError(
        error.response?.data?.message ||
          "Failed to update student.",
      );
    } finally {
      setEditLoading(false);
    }
  };

  // =============================
  // Open Delete Modal
  // =============================

  const handleDeleteClick = (student) => {
    setDeletingStudent(student);
    setError("");
  };

  // =============================
  // Delete Student
  // =============================

  const handleDeleteStudent = async () => {
    if (!deletingStudent) return;

    try {
      setDeleteLoading(true);
      setError("");

      const studentId = deletingStudent.student_id;

      const response = await api.delete(
        `/students/${studentId}`,
      );

      console.log("Student deleted:", response.data);

      setDeletingStudent(null);

      await fetchStudents();
    } catch (error) {
      console.error(
        "Delete student error:",
        error.response?.data || error.message,
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete student.",
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // =============================
  // Load Students
  // =============================

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="min-h-full bg-gray-50 p-4 sm:p-6 lg:p-8">

      {/* ============================= */}
      {/* Page Header */}
      {/* ============================= */}

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Students
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Search and manage registered student records.
        </p>
      </div>

      {/* ============================= */}
      {/* Student Records */}
      {/* ============================= */}

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        {/* Section Header */}

        <div className="flex flex-col gap-4 border-b border-gray-200 p-5 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Student Records
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              View, search, update, and delete students.
            </p>
          </div>

          {/* Search */}

          <form
            className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto"
            onSubmit={handleSearch}
          >
            <input
              type="text"
              placeholder="Search by Student ID..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:w-64"
            />

            <button
              type="submit"
              disabled={searchLoading}
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {searchLoading ? "Searching..." : "Search"}
            </button>

            {searchId && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Clear
              </button>
            )}
          </form>
        </div>

        {/* ============================= */}
        {/* Loading */}
        {/* ============================= */}

        {loading && (
          <div className="flex min-h-48 items-center justify-center p-6 text-sm text-gray-500">
            Loading students...
          </div>
        )}

        {/* ============================= */}
        {/* Error */}
        {/* ============================= */}

        {!loading && error && (
          <div className="m-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* ============================= */}
        {/* Table */}
        {/* ============================= */}

        {!loading && !error && (
          <div className="w-full overflow-x-auto">

            <table className="w-full min-w-[900px] text-left text-sm">

              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-5 py-4 font-semibold text-gray-600">
                    Student ID
                  </th>

                  <th className="px-5 py-4 font-semibold text-gray-600">
                    Name
                  </th>

                  <th className="px-5 py-4 font-semibold text-gray-600">
                    Email
                  </th>

                  <th className="px-5 py-4 font-semibold text-gray-600">
                    Phone
                  </th>

                  <th className="px-5 py-4 font-semibold text-gray-600">
                    Age
                  </th>

                  <th className="px-5 py-4 font-semibold text-gray-600">
                    Gender
                  </th>

                  <th className="px-5 py-4 font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">

                {students.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-5 py-12 text-center"
                    >
                      <div className="flex flex-col items-center justify-center">

                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-2xl">
                          📋
                        </div>

                        <h3 className="font-semibold text-gray-900">
                          No students found
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          There are no student records to display.
                        </p>

                      </div>
                    </td>
                  </tr>
                ) : (
                  students.map((student) => (
                    <tr
                      key={student.student_id}
                      className="transition hover:bg-gray-50"
                    >

                      <td className="whitespace-nowrap px-5 py-4 font-semibold text-gray-900">
                        {student.student_id}
                      </td>

                      <td className="px-5 py-4 text-gray-700">
                        {student.name}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {student.email}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {student.phone || "-"}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {student.age || "-"}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {student.gender || "Other"}
                      </td>

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              handleEditClick(student)
                            }
                            className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-100"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteClick(student)
                            }
                            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
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

          </div>
        )}

      </section>

      {/* ============================= */}
      {/* Edit Student Modal */}
      {/* ============================= */}

      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">

          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* Header */}

            <div className="flex items-start justify-between border-b border-gray-200 p-6">

              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Edit Student
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Update student information.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setEditingStudent(null)
                }
                disabled={editLoading}
                className="rounded-lg p-2 text-2xl leading-none text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                ×
              </button>

            </div>

            {/* Form */}

            <form
              className="space-y-5 p-6"
              onSubmit={handleUpdateStudent}
            >

              {/* Student ID */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Student ID
                </label>

                <input
                  type="text"
                  value={editingStudent.student_id}
                  disabled
                  className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 text-sm text-gray-500 outline-none"
                />
              </div>

              {/* Name */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={editingStudent.name}
                  onChange={handleEditChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* Email */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={editingStudent.email}
                  onChange={handleEditChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* Phone + Age */}

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Phone
                  </label>

                  <input
                    type="text"
                    name="phone"
                    value={editingStudent.phone}
                    onChange={handleEditChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Age
                  </label>

                  <input
                    type="number"
                    name="age"
                    value={editingStudent.age}
                    onChange={handleEditChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

              </div>

              {/* Gender */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Gender
                </label>

                <select
                  name="gender"
                  value={editingStudent.gender}
                  onChange={handleEditChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="">
                    Select Gender
                  </option>

                  <option value="Male">
                    Male
                  </option>

                  <option value="Female">
                    Female
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>

              {/* Buttons */}

              <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={() =>
                    setEditingStudent(null)
                  }
                  disabled={editLoading}
                  className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={editLoading}
                  className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
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
      {/* Delete Student Modal */}
      {/* ============================= */}

      {deletingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

            {/* Header */}

            <div className="flex items-center justify-between border-b border-gray-200 p-6">

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100 text-lg font-bold text-red-600">
                !
              </div>

              <button
                type="button"
                onClick={() =>
                  setDeletingStudent(null)
                }
                disabled={deleteLoading}
                className="rounded-lg p-2 text-2xl leading-none text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                ×
              </button>

            </div>

            {/* Content */}

            <div className="p-6">

              <h3 className="text-xl font-bold text-gray-900">
                Delete Student?
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Are you sure you want to delete this student?
              </p>

              <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4">

                <strong className="block text-sm font-semibold text-gray-900">
                  {deletingStudent.student_id}
                </strong>

                <span className="mt-1 block text-sm text-gray-600">
                  {deletingStudent.name}
                </span>

              </div>

              <p className="mt-4 text-sm font-medium text-red-600">
                This action cannot be undone.
              </p>

            </div>

            {/* Buttons */}

            <div className="flex flex-col-reverse gap-3 border-t border-gray-200 p-6 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() =>
                  setDeletingStudent(null)
                }
                disabled={deleteLoading}
                className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteStudent}
                disabled={deleteLoading}
                className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleteLoading
                  ? "Deleting..."
                  : "Delete Student"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default AdminStudents;
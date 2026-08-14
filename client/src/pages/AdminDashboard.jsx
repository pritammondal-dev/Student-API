import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminDashboard() {
  const navigate = useNavigate();

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

  const totalStudents = allStudents.length;

  const maleStudents = allStudents.filter(
    (student) => student.gender === "Male",
  ).length;

  const femaleStudents = allStudents.filter(
    (student) => student.gender === "Female",
  ).length;

  // Get all students
  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/students");

      const studentData = response.data.data;

      setStudents(studentData);
      setAllStudents(studentData);
    } catch (error) {
      console.error(
        "Students API error:",
        error.response?.data || error.message,
      );

      setError(error.response?.data?.message || "Failed to load students.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    const studentId = searchId.trim();

    // Empty search → show all students
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
      console.error("Search error:", error.response?.data || error.message);

      setStudents([]);

      setError(error.response?.data?.message || "Student not found.");
    } finally {
      setSearchLoading(false);
    }
  };

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

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditingStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
        age: editingStudent.age ? Number(editingStudent.age) : null,
        gender: editingStudent.gender || null,
      });

      console.log("Student updated:", response.data);

      // Close modal
      setEditingStudent(null);

      // Refresh table
      await fetchStudents();
    } catch (error) {
      console.error(
        "Update student error:",
        error.response?.data || error.message,
      );

      setError(error.response?.data?.message || "Failed to update student.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteClick = (student) => {
    setDeletingStudent(student);
    setError("");
  };

  const handleDeleteStudent = async () => {
    if (!deletingStudent) return;

    try {
      setDeleteLoading(true);
      setError("");

      const studentId = deletingStudent.student_id;

      const response = await api.delete(`/students/${studentId}`);

      console.log("Student deleted:", response.data);

      // Close confirmation modal
      setDeletingStudent(null);

      // Refresh student table
      await fetchStudents();
    } catch (error) {
      console.error(
        "Delete student error:",
        error.response?.data || error.message,
      );

      setError(error.response?.data?.message || "Failed to delete student.");
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/admin/login");
  };

  return (
    <div className="dashboard">
      {/* ================= Header ================= */}

      <header className="dashboard-header">
        <div className="dashboard-brand">
          <h1>Student Management</h1>
        </div>

        <div className="dashboard-user">
          <span>Admin</span>

          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {/* ================= Dashboard Body ================= */}

      <div className="dashboard-body">
        {/* Sidebar */}

        <aside className="dashboard-sidebar">
          <nav>
            <button className="sidebar-item active">Dashboard</button>

            <button className="sidebar-item">Students</button>
          </nav>
        </aside>

        {/* Main Content */}

        <main className="dashboard-content">
          <div className="dashboard-title">
            <div>
              <h2>Dashboard</h2>

              <p>Manage student records from one place.</p>
            </div>
          </div>

          {/* Statistics */}

          <section className="stat-grid">
            <div className="stats-grid">
              {/* Total Students */}

              <div className="stat-card">
                <div className="stat-card-content">
                  <p className="stat-label">Total Students</p>

                  <h2 className="stat-value">{totalStudents}</h2>
                </div>

                <div className="stat-icon">👥</div>
              </div>

              {/* Male Students */}

              <div className="stat-card">
                <div className="stat-card-content">
                  <p className="stat-label">Male Students</p>

                  <h2 className="stat-value">{maleStudents}</h2>
                </div>

                <div className="stat-icon">👨</div>
              </div>

              {/* Female Students */}

              <div className="stat-card">
                <div className="stat-card-content">
                  <p className="stat-label">Female Students</p>

                  <h2 className="stat-value">{femaleStudents}</h2>
                </div>

                <div className="stat-icon">👩</div>
              </div>
            </div>
          </section>

          {/* Student Table */}

          <section className="students-section">
            <div className="section-header">
              <div>
                <h3>Student Records</h3>

                <p>Search and manage registered students</p>
              </div>

              <form className="student-search" onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search by Student ID..."
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                />

                <button type="submit" disabled={searchLoading}>
                  {searchLoading ? "Searching..." : "Search"}
                </button>

                {searchId && (
                  <button
                    type="button"
                    className="clear-search"
                    onClick={() => {
                      setSearchId("");
                      setStudents(allStudents);
                      setError("");
                    }}
                  >
                    Clear
                  </button>
                )}
              </form>
            </div>

            {/* Loading */}

            {loading && <div className="table-state">Loading students...</div>}

            {/* Error */}

            {!loading && error && <div className="error-message">{error}</div>}

            {/* Table */}

            {!loading && !error && (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Student ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Age</th>
                      <th>Gender</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {students.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="table-state">
                          <div className="empty-state">
                            <div className="empty-icon">📋</div>

                            <h3>No students found</h3>

                            <p>There are no student records to display.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      students.map((student) => (
                        <tr key={student.student_id}>
                          <td>
                            <strong>{student.student_id}</strong>
                          </td>

                          <td>{student.name}</td>

                          <td>{student.email}</td>

                          <td>{student.phone || "-"}</td>

                          <td>{student.age || "-"}</td>

                          <td>{student.gender || "Other"}</td>

                          <td>
                            <div className="table-actions">
                              <button
                                className="edit-button"
                                onClick={() => handleEditClick(student)}
                              >
                                Edit
                              </button>

                              <button
                                className="delete-button"
                                onClick={() => handleDeleteClick(student)}
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
        </main>
      </div>
      {editingStudent && (
        <div className="modal-overlay">
          <div className="edit-modal">
            {/* Modal Header */}

            <div className="modal-header">
              <div>
                <h3>Edit Student</h3>

                <p>Update student information</p>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={() => setEditingStudent(null)}
              >
                ×
              </button>
            </div>

            {/* Edit Form */}

            <form className="edit-form" onSubmit={handleUpdateStudent}>
              {/* Student ID */}

              <div className="form-group">
                <label>Student ID</label>

                <input type="text" value={editingStudent.student_id} disabled />
              </div>

              {/* Name */}

              <div className="form-group">
                <label>Name</label>

                <input
                  type="text"
                  name="name"
                  value={editingStudent.name}
                  onChange={handleEditChange}
                  required
                />
              </div>

              {/* Email */}

              <div className="form-group">
                <label>Email</label>

                <input
                  type="email"
                  name="email"
                  value={editingStudent.email}
                  onChange={handleEditChange}
                  required
                />
              </div>

              {/* Phone + Age */}

              <div className="form-row">
                <div className="form-group">
                  <label>Phone</label>

                  <input
                    type="text"
                    name="phone"
                    value={editingStudent.phone}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="form-group">
                  <label>Age</label>

                  <input
                    type="number"
                    name="age"
                    value={editingStudent.age}
                    onChange={handleEditChange}
                  />
                </div>
              </div>

              {/* Gender */}

              <div className="form-group">
                <label>Gender</label>

                <select
                  name="gender"
                  value={editingStudent.gender}
                  onChange={handleEditChange}
                >
                  <option value="">Select Gender</option>

                  <option value="Male">Male</option>

                  <option value="Female">Female</option>

                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Modal Buttons */}

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setEditingStudent(null)}
                  disabled={editLoading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-button"
                  disabled={editLoading}
                >
                  {editLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deletingStudent && (
        <div className="modal-overlay">
          <div className="delete-modal">
            {/* Header */}

            <div className="delete-modal-header">
              <div className="warning-icon">!</div>

              <button
                type="button"
                className="modal-close"
                onClick={() => setDeletingStudent(null)}
                disabled={deleteLoading}
              >
                ×
              </button>
            </div>

            {/* Content */}

            <div className="delete-modal-content">
              <h3>Delete Student?</h3>

              <p>Are you sure you want to delete this student?</p>

              <div className="student-delete-info">
                <strong>{deletingStudent.student_id}</strong>

                <span>{deletingStudent.name}</span>
              </div>

              <p className="delete-warning">This action cannot be undone.</p>
            </div>

            {/* Buttons */}

            <div className="delete-modal-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={() => setDeletingStudent(null)}
                disabled={deleteLoading}
              >
                Cancel
              </button>

              <button
                type="button"
                className="confirm-delete-button"
                onClick={handleDeleteStudent}
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting..." : "Delete Student"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;

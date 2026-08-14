import { useState } from "react";
import api from "../services/api";

function LandingPage() {
  const [formData, setFormData] = useState({
    student_id: "",
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit student registration
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await api.post("/students", {
        ...formData,
        age: Number(formData.age),
      });

      console.log("Student registered:", response.data);

      setMessage(response.data.message);

      // Clear form after successful registration
      setFormData({
        student_id: "",
        name: "",
        email: "",
        phone: "",
        age: "",
        gender: "",
      });
    } catch (error) {
      console.error(
        "Registration error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="brand">
          <h1>Student Management</h1>
          <p>Simple. Secure. Efficient.</p>
        </div>

        <div className="admin-actions">
          <button
            type="button"
            onClick={() => (window.location.href = "/admin/login")}
          >
            Admin Login
          </button>

          <button
            type="button"
            onClick={() => (window.location.href = "/admin/register")}
          >
            Admin Register
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="landing-main">
        <section className="hero-section">
          <h2>Student Registration</h2>

          <p>
            Register your student information quickly and securely.
          </p>

          <form onSubmit={handleSubmit} className="student-form">

            {/* Student ID */}
            <div className="form-group">
              <label htmlFor="student_id">Student ID</label>

              <input
                id="student_id"
                type="text"
                name="student_id"
                placeholder="Example: STU007"
                value={formData.student_id}
                onChange={handleChange}
                required
              />
            </div>

            {/* Name */}
            <div className="form-group">
              <label htmlFor="name">Full Name</label>

              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">Email</label>

              <input
                id="email"
                type="email"
                name="email"
                placeholder="student@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Phone */}
            <div className="form-group">
              <label htmlFor="phone">Phone</label>

              <input
                id="phone"
                type="tel"
                name="phone"
                placeholder="9876543210"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            {/* Age */}
            <div className="form-group">
              <label htmlFor="age">Age</label>

              <input
                id="age"
                type="number"
                name="age"
                placeholder="Enter age"
                value={formData.age}
                onChange={handleChange}
              />
            </div>

            {/* Gender */}
            <div className="form-group">
              <label htmlFor="gender">Gender</label>

              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Success message */}
            {message && (
              <div className="success-message">
                {message}
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="register-button"
            >
              {loading ? "Registering..." : "Register Student"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default LandingPage;
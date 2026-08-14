import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function AdminRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    // Check password
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/users/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      console.log("Admin registration:", response.data);

      setMessage(
        response.data.message || "Admin registered successfully."
      );

      // Clear form
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      // Redirect to login after 1.5 seconds
      setTimeout(() => {
        navigate("/admin/login");
      }, 1500);

    } catch (error) {
      console.error(
        "Admin registration error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-header">
          <h1>Admin Registration</h1>

          <p>
            Create an administrator account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">

          {/* Username */}
          <div className="form-group">
            <label htmlFor="username">
              Username
            </label>

            <input
              id="username"
              type="text"
              name="username"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="admin-email">
              Email
            </label>

            <input
              id="admin-email"
              type="email"
              name="email"
              placeholder="admin@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword">
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {/* Success */}
          {message && (
            <div className="success-message">
              {message}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Admin Account"}
          </button>

        </form>

        <div className="auth-footer">

          <p>
            Already have an admin account?
          </p>

          <Link to="/admin/login">
            Login here
          </Link>

          <Link to="/">
            ← Back to Student Registration
          </Link>

        </div>

      </div>

    </div>
  );
}

export default AdminRegister;
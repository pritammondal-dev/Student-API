import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    setLoading(true);

    try {
      const response = await api.post("/users/login", {
        username: formData.username,
        password: formData.password,
      });

      console.log("Login response:", response.data);

      const token = response.data.token;

      // Store JWT
      localStorage.setItem("token", token);

      // Go to dashboard
      navigate("/admin/dashboard");

    } catch (error) {
      console.error(
        "Login error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-header">
          <h1>Admin Login</h1>

          <p>
            Sign in to manage student records
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">

          {/* Username */}
          <div className="form-group">
            <label htmlFor="login-username">
              Username
            </label>

            <input
              id="login-username"
              type="text"
              name="username"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="login-password">
              Password
            </label>

            <input
              id="login-password"
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

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
            {loading ? "Signing In..." : "Login"}
          </button>

        </form>

        <div className="auth-footer">

          <p>
            Don't have an admin account?
          </p>

          <Link to="/admin/register">
            Create Admin Account
          </Link>

          <Link to="/">
            ← Back to Student Registration
          </Link>

        </div>

      </div>

    </div>
  );
}

export default AdminLogin;
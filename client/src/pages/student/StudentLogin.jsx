import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function StudentLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    student_id: "",
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
      const response = await api.post("/students/login", {
        student_id: formData.student_id,
        password: formData.password,
      });

      console.log("Student login response:", response.data);

      const { token, data } = response.data;

      // Store authentication information
      login({
        token,
        role: "student",
        user: data,
      });

      // Redirect to student dashboard
      navigate("/student/dashboard");
    } catch (error) {
      console.error(
        "Student login error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">

        {/* ============================= */}
        {/* Header */}
        {/* ============================= */}

        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Student Login
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Sign in to access your student portal
          </p>
        </div>

        {/* ============================= */}
        {/* Form */}
        {/* ============================= */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Student ID */}

          <div>
            <label
              htmlFor="student_id"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Student ID
            </label>

            <input
              id="student_id"
              type="text"
              name="student_id"
              placeholder="Enter your student ID"
              value={formData.student_id}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>

          {/* Password */}

          <div>
            <label
              htmlFor="student-password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <input
              id="student-password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>

          {/* Error */}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm font-medium text-red-600">
                {error}
              </p>
            </div>
          )}

          {/* Login */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing In..." : "Login"}
          </button>
        </form>

        {/* ============================= */}
        {/* Footer */}
        {/* ============================= */}

        <div className="mt-6 flex flex-col items-center gap-3 border-t border-gray-100 pt-6 text-sm">
          <Link
            to="/"
            className="font-medium text-gray-600 transition hover:text-gray-900 hover:underline"
          >
            ← Home
          </Link>

          <Link
            to="/student/register"
            className="font-medium text-gray-600 transition hover:text-gray-900 hover:underline"
          >
            ← Back to Student Registration
          </Link>

          <Link
            to="/admin/login"
            className="font-medium text-gray-600 transition hover:text-gray-900 hover:underline"
          >
            Admin Login
          </Link>
        </div>

      </div>
    </div>
  );
}

export default StudentLogin;
import { useState } from "react";
import api from "../services/api";

function LandingPage() {
  const [formData, setFormData] = useState({
    student_id: "",
    name: "",
    email: "",
    password: "",
    phone: "",
    age: "",
    gender: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =============================
  // Handle input changes
  // =============================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =============================
  // Submit student registration
  // =============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await api.post("/students/register", {
        student_id: formData.student_id,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        age: formData.age ? Number(formData.age) : null,
        gender: formData.gender || null,
      });

      console.log("Student registered:", response.data);

      setMessage(
        response.data.message || "Student registered successfully."
      );

      // Clear form
      setFormData({
        student_id: "",
        name: "",
        email: "",
        password: "",
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

  // =============================
  // Reusable input classes
  // =============================

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900";

  const labelClass =
    "mb-2 block text-sm font-medium text-gray-700";

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">

      {/* =============================
          Header
      ============================= */}

      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">

          {/* Brand */}

          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              Student Management
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Simple. Secure. Efficient.
            </p>
          </div>

          {/* Navigation */}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                (window.location.href = "/student/login")
              }
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
            >
              Student Login
            </button>

            <button
              type="button"
              onClick={() =>
                (window.location.href = "/admin/login")
              }
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
            >
              Admin Login
            </button>

            <button
              type="button"
              onClick={() =>
                (window.location.href = "/admin/register")
              }
              className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Admin Register
            </button>
          </div>
        </div>
      </header>

      {/* =============================
          Main Content
      ============================= */}

      <main className="px-4 py-10 sm:px-6 lg:px-8">
        <section className="mx-auto w-full max-w-2xl">

          {/* Hero Header */}

          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Student Registration
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Register your student information quickly and securely.
            </p>
          </div>

          {/* =============================
              Registration Card
          ============================= */}

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

            <form
              onSubmit={handleSubmit}
              className="grid gap-5 sm:grid-cols-2"
            >

              {/* Student ID */}

              <div>
                <label
                  htmlFor="student_id"
                  className={labelClass}
                >
                  Student ID
                </label>

                <input
                  id="student_id"
                  type="text"
                  name="student_id"
                  placeholder="Example: STU007"
                  value={formData.student_id}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>

              {/* Full Name */}

              <div>
                <label
                  htmlFor="name"
                  className={labelClass}
                >
                  Full Name
                </label>

                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>

              {/* Email */}

              <div>
                <label
                  htmlFor="email"
                  className={labelClass}
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="student@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>

              {/* Password */}

              <div>
                <label
                  htmlFor="password"
                  className={labelClass}
                >
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>

              {/* Phone */}

              <div>
                <label
                  htmlFor="phone"
                  className={labelClass}
                >
                  Phone
                </label>

                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {/* Age */}

              <div>
                <label
                  htmlFor="age"
                  className={labelClass}
                >
                  Age
                </label>

                <input
                  id="age"
                  type="number"
                  name="age"
                  placeholder="Enter age"
                  value={formData.age}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {/* Gender */}

              <div className="sm:col-span-2">
                <label
                  htmlFor="gender"
                  className={labelClass}
                >
                  Gender
                </label>

                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Success Message */}

              {message && (
                <div className="sm:col-span-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
                  <p className="text-sm font-medium text-green-700">
                    {message}
                  </p>
                </div>
              )}

              {/* Error Message */}

              {error && (
                <div className="sm:col-span-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-sm font-medium text-red-700">
                    {error}
                  </p>
                </div>
              )}

              {/* Submit */}

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Registering..."
                    : "Register Student"}
                </button>
              </div>

            </form>
          </div>
        </section>
      </main>
    </div>
  );
}

export default LandingPage;
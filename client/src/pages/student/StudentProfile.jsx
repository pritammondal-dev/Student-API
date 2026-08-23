import { useEffect, useState } from "react";
import api from "../../services/api";

function StudentProfile() {
  const [profile, setProfile] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editMode, setEditMode] = useState(false);

  // =============================
  // Get Student Profile
  // =============================

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/students/profile");

      const data = response.data.data;

      setProfile(data);

      setFormData({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        age: data.age || "",
        gender: data.gender || "",
      });
    } catch (error) {
      console.error(
        "Fetch profile error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Unable to load your profile."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // =============================
  // Handle Input
  // =============================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =============================
  // Update Profile
  // =============================

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await api.put(
        "/students/profile",
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          age: formData.age
            ? Number(formData.age)
            : null,
          gender: formData.gender,
        }
      );

      const updatedProfile = response.data.data;

      setProfile(updatedProfile);

      setFormData({
        name: updatedProfile.name || "",
        email: updatedProfile.email || "",
        phone: updatedProfile.phone || "",
        age: updatedProfile.age || "",
        gender: updatedProfile.gender || "",
      });

      setSuccess(
        response.data.message ||
          "Profile updated successfully."
      );

      setEditMode(false);
    } catch (error) {
      console.error(
        "Update profile error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Unable to update your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // =============================
  // Loading
  // =============================

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

          <p className="mt-4 text-sm text-gray-500">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  // =============================
  // Error
  // =============================

  if (error && !profile) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <h2 className="font-semibold text-red-700">
            Unable to load profile
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchProfile}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">

      {/* =============================
          Header
      ============================= */}

      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          My Profile
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage your personal information.
        </p>
      </div>

      {/* =============================
          Messages
      ============================= */}

      {success && (
        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* =============================
          Profile Card
      ============================= */}

      {!editMode ? (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          {/* Profile Header */}

          <div className="border-b border-gray-200 bg-gray-50 px-6 py-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-4">

                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-2xl font-semibold text-white">
                  {profile?.name
                    ? profile.name
                        .charAt(0)
                        .toUpperCase()
                    : "S"}
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {profile?.name || "Student"}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Student ID:{" "}
                    {profile?.student_id || "N/A"}
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={() => {
                  setSuccess("");
                  setError("");
                  setEditMode(true);
                }}
                className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Edit Profile
              </button>

            </div>
          </div>

          {/* Profile Information */}

          <div className="p-6">

            <h3 className="mb-5 text-lg font-semibold text-gray-900">
              Personal Information
            </h3>

            <div className="grid gap-5 sm:grid-cols-2">

              {/* Student ID */}

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Student ID
                </p>

                <p className="mt-1 text-sm font-medium text-gray-800">
                  {profile?.student_id || "N/A"}
                </p>
              </div>

              {/* Name */}

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Full Name
                </p>

                <p className="mt-1 text-sm font-medium text-gray-800">
                  {profile?.name || "N/A"}
                </p>
              </div>

              {/* Email */}

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Email
                </p>

                <p className="mt-1 text-sm font-medium text-gray-800">
                  {profile?.email || "N/A"}
                </p>
              </div>

              {/* Phone */}

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Phone
                </p>

                <p className="mt-1 text-sm font-medium text-gray-800">
                  {profile?.phone || "Not provided"}
                </p>
              </div>

              {/* Age */}

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Age
                </p>

                <p className="mt-1 text-sm font-medium text-gray-800">
                  {profile?.age || "Not provided"}
                </p>
              </div>

              {/* Gender */}

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Gender
                </p>

                <p className="mt-1 text-sm font-medium capitalize text-gray-800">
                  {profile?.gender || "Not provided"}
                </p>
              </div>

            </div>
          </div>
        </div>
      ) : (

        /* =============================
           Edit Profile
        ============================= */

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-gray-200 bg-white shadow-sm"
        >

          <div className="border-b border-gray-200 px-6 py-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Edit Profile
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Update your personal information below.
            </p>
          </div>

          <div className="grid gap-5 p-6 sm:grid-cols-2">

            {/* Student ID */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Student ID
              </label>

              <input
                type="text"
                value={profile?.student_id || ""}
                disabled
                className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-2.5 text-sm text-gray-500 outline-none"
              />

              <p className="mt-1 text-xs text-gray-400">
                Student ID cannot be changed.
              </p>
            </div>

            {/* Name */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
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
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>

            {/* Phone */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Phone
              </label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>

            {/* Age */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Age
              </label>

              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="1"
                max="100"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>

            {/* Gender */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Gender
              </label>

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
              >
                <option value="">
                  Select Gender
                </option>

                <option value="male">
                  Male
                </option>

                <option value="female">
                  Female
                </option>

                <option value="other">
                  Other
                </option>
              </select>
            </div>
          </div>

          {/* Buttons */}

          <div className="flex flex-col-reverse gap-3 border-t border-gray-200 px-6 py-5 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={() => {
                setEditMode(false);
                setError("");
                setSuccess("");
              }}
              disabled={saving}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>
        </form>
      )}
    </div>
  );
}

export default StudentProfile;
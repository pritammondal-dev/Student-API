import { useEffect, useState } from "react";
import api from "../../services/api";

function AdminEvents() {
  // ==========================================
  // State
  // ==========================================

  const [events, setEvents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deletingEvent, setDeletingEvent] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    event_date: "",
    event_time: "",
    location: "",
    image_url: "",
    registration_link: "",
    is_published: true,
  });

  // ==========================================
  // Fetch Events
  // ==========================================

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/events");

      setEvents(response.data.data || []);
    } catch (error) {
      console.error(
        "Failed to fetch events:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to load events."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Initial Load
  // ==========================================

  useEffect(() => {
    fetchEvents();
  }, []);

  // ==========================================
  // Form Input Change
  // ==========================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ==========================================
  // Reset Form
  // ==========================================

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      event_date: "",
      event_time: "",
      location: "",
      image_url: "",
      registration_link: "",
      is_published: true,
    });

    setEditingEvent(null);
    setShowForm(false);
  };

  // ==========================================
  // Open Create Form
  // ==========================================

  const handleCreateClick = () => {
    setError("");
    setSuccess("");

    setEditingEvent(null);

    setFormData({
      title: "",
      description: "",
      event_date: "",
      event_time: "",
      location: "",
      image_url: "",
      registration_link: "",
      is_published: true,
    });

    setShowForm(true);
  };

  // ==========================================
  // Open Edit Form
  // ==========================================

  const handleEditClick = (event) => {
    setError("");
    setSuccess("");

    setEditingEvent(event);

    setFormData({
      title: event.title || "",
      description: event.description || "",
      event_date: event.event_date || "",
      event_time: event.event_time
        ? event.event_time.slice(0, 5)
        : "",
      location: event.location || "",
      image_url: event.image_url || "",
      registration_link:
        event.registration_link || "",
      is_published: Boolean(event.is_published),
    });

    setShowForm(true);
  };

  // ==========================================
  // Create / Update Event
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Frontend validation
    if (!formData.title.trim()) {
      setError("Event title is required.");
      return;
    }

    if (!formData.event_date) {
      setError("Event date is required.");
      return;
    }

    try {
      setSubmitLoading(true);

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        event_date: formData.event_date,
        event_time: formData.event_time || null,
        location: formData.location.trim() || null,
        image_url: formData.image_url.trim() || null,
        registration_link:
          formData.registration_link.trim() || null,
        is_published: formData.is_published,
      };

      if (editingEvent) {
        const response = await api.put(
          `/events/${editingEvent.id}`,
          payload
        );

        setSuccess(
          response.data.message ||
            "Event updated successfully."
        );
      } else {
        const response = await api.post(
          "/events",
          payload
        );

        setSuccess(
          response.data.message ||
            "Event created successfully."
        );
      }

      resetForm();

      await fetchEvents();
    } catch (error) {
      console.error(
        "Event save error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to save event."
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  // ==========================================
  // Delete Event
  // ==========================================

  const handleDeleteClick = (event) => {
    setError("");
    setSuccess("");
    setDeletingEvent(event);
  };

  const handleDeleteEvent = async () => {
    if (!deletingEvent) return;

    try {
      setDeleteLoading(true);
      setError("");

      const response = await api.delete(
        `/events/${deletingEvent.id}`
      );

      setSuccess(
        response.data.message ||
          "Event deleted successfully."
      );

      setDeletingEvent(null);

      await fetchEvents();
    } catch (error) {
      console.error(
        "Delete event error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete event."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // ==========================================
  // Format Date
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ==========================================
  // Format Time
  // ==========================================

  const formatTime = (time) => {
    if (!time) return "-";

    const [hours, minutes] = time
      .split(":")
      .map(Number);

    const date = new Date();

    date.setHours(hours, minutes, 0, 0);

    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ==========================================
  // Dashboard
  // ==========================================

  return (
    <div className="min-h-full bg-gray-50 p-4 sm:p-6 lg:p-8">

      {/* ======================================
          Header
      ====================================== */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Event Management
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Create, manage, publish, and remove
            campus events.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreateClick}
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          + Create Event
        </button>

      </div>

      {/* ======================================
          Success Message
      ====================================== */}

      {success && (
        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          {success}
        </div>
      )}

      {/* ======================================
          Error Message
      ====================================== */}

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* ======================================
          Event Form
      ====================================== */}

      {showForm && (
        <section className="mb-6 rounded-xl border border-gray-200 bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">

            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {editingEvent
                  ? "Edit Event"
                  : "Create Event"}
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                {editingEvent
                  ? "Update the event information."
                  : "Add a new event to the campus calendar."}
              </p>
            </div>

            <button
              type="button"
              onClick={resetForm}
              className="text-2xl leading-none text-gray-400 transition hover:text-gray-900"
              aria-label="Close"
            >
              ×
            </button>

          </div>

          <form
            onSubmit={handleSubmit}
            className="p-5"
          >

            <div className="grid gap-5 md:grid-cols-2">

              {/* Title */}

              <div className="md:col-span-2">
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Event Title *
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter event title"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* Description */}

              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the event..."
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* Event Date */}

              <div>
                <label
                  htmlFor="event_date"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Event Date *
                </label>

                <input
                  id="event_date"
                  name="event_date"
                  type="date"
                  value={formData.event_date}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* Event Time */}

              <div>
                <label
                  htmlFor="event_time"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Event Time
                </label>

                <input
                  id="event_time"
                  name="event_time"
                  type="time"
                  value={formData.event_time}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* Location */}

              <div>
                <label
                  htmlFor="location"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Location
                </label>

                <input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Seminar Hall"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* Image URL */}

              <div>
                <label
                  htmlFor="image_url"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Image URL
                </label>

                <input
                  id="image_url"
                  name="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={handleChange}
                  placeholder="https://example.com/event.jpg"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* Registration Link */}

              <div className="md:col-span-2">
                <label
                  htmlFor="registration_link"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Registration Link
                </label>

                <input
                  id="registration_link"
                  name="registration_link"
                  type="url"
                  value={formData.registration_link}
                  onChange={handleChange}
                  placeholder="https://example.com/register"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* Published */}

              <div className="md:col-span-2">

                <label className="flex cursor-pointer items-center gap-3">

                  <input
                    type="checkbox"
                    name="is_published"
                    checked={formData.is_published}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />

                  <span>
                    <span className="block text-sm font-medium text-gray-700">
                      Publish event
                    </span>

                    <span className="block text-xs text-gray-500">
                      Published events will be visible publicly.
                    </span>
                  </span>

                </label>

              </div>

            </div>

            {/* Form Actions */}

            <div className="mt-6 flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={resetForm}
                disabled={submitLoading}
                className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitLoading}
                className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitLoading
                  ? editingEvent
                    ? "Updating..."
                    : "Creating..."
                  : editingEvent
                  ? "Update Event"
                  : "Create Event"}
              </button>

            </div>

          </form>
        </section>
      )}

      {/* ======================================
          Events Table
      ====================================== */}

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        {/* Section Header */}

        <div className="border-b border-gray-200 px-5 py-4">

          <div className="flex items-center justify-between">

            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Events
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                {events.length} event
                {events.length !== 1 ? "s" : ""} found
              </p>
            </div>

            <button
              type="button"
              onClick={fetchEvents}
              disabled={loading}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Refresh
            </button>

          </div>

        </div>

        {/* Loading */}

        {loading && (
          <div className="flex min-h-48 items-center justify-center p-6">
            <p className="text-sm text-gray-500">
              Loading events...
            </p>
          </div>
        )}

        {/* Empty */}

        {!loading && events.length === 0 && (
          <div className="p-12 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 text-2xl">
              📅
            </div>

            <h3 className="mt-4 text-base font-semibold text-gray-900">
              No events found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Create your first campus event to get started.
            </p>

            <button
              type="button"
              onClick={handleCreateClick}
              className="mt-5 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Create Event
            </button>

          </div>
        )}

        {/* Table */}

        {!loading && events.length > 0 && (
          <div className="overflow-x-auto">

            <table className="w-full min-w-[1100px] text-left">

              <thead className="border-b border-gray-200 bg-gray-50">

                <tr>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Event
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Date
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Time
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Location
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

                {events.map((event) => (
                  <tr
                    key={event.id}
                    className="transition hover:bg-gray-50"
                  >

                    {/* Event */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100">

                          {event.image_url ? (
                            <img
                              src={event.image_url}
                              alt={event.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-lg">
                              📅
                            </span>
                          )}

                        </div>

                        <div className="min-w-0">

                          <h4 className="truncate text-sm font-semibold text-gray-900">
                            {event.title}
                          </h4>

                          {event.description && (
                            <p className="mt-1 max-w-xs truncate text-xs text-gray-500">
                              {event.description}
                            </p>
                          )}

                        </div>

                      </div>

                    </td>

                    {/* Date */}

                    <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-700">
                      {formatDate(event.event_date)}
                    </td>

                    {/* Time */}

                    <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-700">
                      {formatTime(event.event_time)}
                    </td>

                    {/* Location */}

                    <td className="max-w-[180px] px-5 py-4 text-sm text-gray-700">
                      <span className="block truncate">
                        {event.location || "-"}
                      </span>
                    </td>

                    {/* Status */}

                    <td className="px-5 py-4">

                      {event.is_published ? (
                        <span className="inline-flex rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                          Draft
                        </span>
                      )}

                    </td>

                    {/* Actions */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-2">

                        <button
                          type="button"
                          onClick={() =>
                            handleEditClick(event)
                          }
                          className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-100"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteClick(event)
                          }
                          className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </section>

      {/* ======================================
          Delete Confirmation Modal
      ====================================== */}

      {deletingEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={() => setDeletingEvent(null)}
        >

          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-xl">
              ⚠
            </div>

            <h3 className="mt-4 text-lg font-bold text-gray-900">
              Delete Event?
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">
                {deletingEvent.title}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() =>
                  setDeletingEvent(null)
                }
                disabled={deleteLoading}
                className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteEvent}
                disabled={deleteLoading}
                className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleteLoading
                  ? "Deleting..."
                  : "Delete Event"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default AdminEvents;
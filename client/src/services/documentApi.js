const API_URL = "http://localhost:5000/api/v1/documents";

// =============================
// Get token
// =============================
const getToken = () => {
  return localStorage.getItem("token");
};

// =============================
// Get all documents
// =============================
export const getDocuments = async () => {
  const token = getToken();

  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch documents");
  }

  return data;
};

// =============================
// Get document by ID
// =============================
export const getDocumentById = async (id) => {
  const token = getToken();

  const response = await fetch(`${API_URL}/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch document");
  }

  return data;
};

// =============================
// Upload document
// Admin
// =============================
export const uploadDocument = async (formData) => {
  const token = getToken();

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to upload document");
  }

  return data;
};

// =============================
// Update document
// Admin
// =============================
export const updateDocument = async (id, formData) => {
  const token = getToken();

  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update document");
  }

  return data;
};

// =============================
// Delete document
// Admin
// =============================
export const deleteDocument = async (id) => {
  const token = getToken();

  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete document");
  }

  return data;
};

// =============================
// View protected document
// Admin + Student
// =============================
export const getDocumentFile = async (id) => {
  const token = getToken();

  const response = await fetch(`${API_URL}/${id}/file`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    let message = "Failed to load document";

    try {
      const data = await response.json();
      message = data.message || message;
    } catch {
      // Response wasn't JSON
    }

    throw new Error(message);
  }

  return await response.blob();
};
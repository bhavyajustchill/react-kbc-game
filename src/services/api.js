const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8081/api/v1";

const TOKEN_KEY = "kbc_token";
const USER_KEY = "kbc_admin_user";

export const getAuthToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setAuthToken = (token, user) => {
  localStorage.setItem(TOKEN_KEY, token);
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

export const getStoredUser = () => {
  const userStr = localStorage.getItem(USER_KEY);
  try {
    return userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    return null;
  }
};

export const logoutAdmin = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

const getAuthHeaders = () => {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
    headers["x-auth-token"] = token;
  }
  return headers;
};

export const loginAdmin = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || "Login failed");
  }

  if (data.token) {
    setAuthToken(data.token, data.user);
  }

  return data;
};

export const fetchQuizQuestions = async () => {
  const response = await fetch(`${API_BASE_URL}/quiz`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || "Failed to fetch quiz questions");
  }

  return Array.isArray(data) ? data : [];
};

export const createQuizQuestion = async (questionData) => {
  const response = await fetch(`${API_BASE_URL}/quiz`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(questionData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || "Failed to create quiz question");
  }

  return data;
};

export const updateQuizQuestion = async (id, questionData) => {
  const response = await fetch(`${API_BASE_URL}/quiz/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(questionData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || "Failed to update quiz question");
  }

  return data;
};

export const deleteQuizQuestion = async (id) => {
  const response = await fetch(`${API_BASE_URL}/quiz/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || "Failed to delete quiz question");
  }

  return data;
};

export const bulkCreateQuizQuestions = async (questions) => {
  const response = await fetch(`${API_BASE_URL}/quiz/bulk`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(questions),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || "Failed to bulk import questions");
  }

  return data;
};

const API_URL = "https://excavatorlogs.onrender.com/api" // change this if backend is deployed elsewhere

// 🔑 AUTH ENDPOINTS
export const login = async (email, password) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Login failed");
  }
  return res.json();
};

export const register = async (email, password) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Registration failed");
  }
  return res.json();
};

// 🚜 EXCAVATOR ENDPOINTS
export const getExcavators = async (token) => {
  const res = await fetch(`${API_URL}/excavators`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch excavators");
  }
  return res.json();
};

export const addExcavator = async (token, data) => {
  const res = await fetch(`${API_URL}/excavators`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to add excavator");
  }
  return res.json();
};

// 📄 LOGS ENDPOINTS
export const addLog = async (token, data) => {
  const res = await fetch(`${API_URL}/logs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to add log");
  }
  return res.json();
};

export const deleteExcavator = async (token, id) => {
  const res = await fetch(`${API_URL}/excavators/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete excavator");
  }
  return res.json();
};

export const deleteLog = async (token, id) => {
  const res = await fetch(`${API_URL}/logs/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete excavator");
  }
  return res.json();
};

export const getLogsReport = async (token, excavatorId, startDate, endDate) => {
    
  const res = await fetch(
    `${API_URL}/logs/excavator/${excavatorId}?startDate=${startDate}&endDate=${endDate}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to get logs report");
  }
  return res.json();
};

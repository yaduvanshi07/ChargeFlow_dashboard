// API helper for ChargeFlow Backend
import { useState, useEffect } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// Generic fetch wrapper with error handling
async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.message || `HTTP error! status: ${response.status}`,
        response.status
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Network errors or other issues
    throw new ApiError(
      'Network error or server is unavailable',
      0
    );
  }
}

// Money API endpoints
export const moneyAPI = {
  // Add a transaction
  addTransaction: async (amount, source, description = '') => {
    return apiFetch('/api/money/add', {
      method: 'POST',
      body: JSON.stringify({ amount, source, description }),
    });
  },

  // Get total revenue (all sources)
  getTotalRevenue: async () => {
    const response = await apiFetch('/api/money/total');
    return response.data;
  },

  // Get total by specific source
  getRevenueBySource: async (source) => {
    const response = await apiFetch(`/api/money/total/${source}`);
    return response.data;
  },

  // Get comprehensive statistics
  getStatistics: async () => {
    const response = await apiFetch('/api/money/statistics');
    return response.data;
  },

  // Get transactions with pagination
  getTransactions: async (page = 1, limit = 10, source = null) => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (source) params.append('source', source);

    const response = await apiFetch(`/api/money/transactions?${params}`);
    return response.data;
  },

  // Health check
  healthCheck: async () => {
    const response = await apiFetch('/health');
    return response;
  },
};

// Chargers API endpoints
export const chargersAPI = {
  // Get charger statistics
  getStatistics: async () => {
    const response = await apiFetch('/api/chargers/statistics');
    return response.data;
  },

  // Get active chargers count
  getActiveChargers: async () => {
    const response = await apiFetch('/api/chargers/active');
    return response.data;
  },

  // Get total sessions
  getTotalSessions: async () => {
    const response = await apiFetch('/api/chargers/sessions');
    return response.data;
  },

  // Get weekly sessions count
  getWeeklySessions: async () => {
    const response = await apiFetch('/api/chargers/weekly-sessions');
    return response.data;
  },

  // Get all chargers with pagination
  getChargers: async (page = 1, limit = 10, status = null) => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (status) params.append('status', status);

    const response = await apiFetch(`/api/chargers?${params}`);
    return response.data;
  },

  // Add a new charger
  addCharger: async (name, location, type, power, status = 'OFFLINE') => {
    return apiFetch('/api/chargers', {
      method: 'POST',
      body: JSON.stringify({ name, location, type, power, status }),
    });
  },

  // Update an existing charger
  updateCharger: async (id, name, location, type, power, status) => {
    return apiFetch(`/api/chargers/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name, location, type, power, status }),
    });
  },
};

// Bookings API endpoints
export const bookingsAPI = {
  // Get all bookings
  getBookings: async (page = 1, limit = 10, status = null) => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (status) params.append('status', status);

    const response = await apiFetch(`/api/bookings?${params}`);
    return response.data;
  },

  // Get single booking
  getBooking: async (id) => {
    const response = await apiFetch(`/api/bookings/${id}`);
    return response.data;
  },

  // Accept booking
  acceptBooking: async (id) => {
    const response = await apiFetch(`/api/bookings/${id}/accept`, {
      method: 'PUT',
    });
    return response.data;
  },

  // Generate OTP
  generateOTP: async (id) => {
    const response = await apiFetch(`/api/bookings/${id}/generate-otp`, {
      method: 'POST',
    });
    return response.data;
  },

  // Auto-generate OTP (development only)
  autoGenerateOTP: async (id) => {
    const response = await apiFetch(`/api/bookings/${id}/auto-generate-otp`, {
      method: 'POST',
    });
    return response.data;
  },

  // Verify OTP
  verifyOTP: async (id, otp) => {
    const response = await apiFetch(`/api/bookings/${id}/verify-otp`, {
      method: 'POST',
      body: JSON.stringify({ otp }),
    });
    return response.data;
  },

  // Get Booking Management Data
  getBookingManagement: async () => {
    const response = await apiFetch('/api/bookings/management');
    return response.data;
  },

  // Complete Session
  completeSession: async (id) => {
    const response = await apiFetch(`/api/bookings/${id}/complete`, {
      method: 'POST',
    });
    return response.data;
  },
};

// Utility functions for formatting
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatCompactNumber = (num) => {
  if (num >= 100000) {
    return (num / 100000).toFixed(1) + 'L';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

// React hook for API data with auto-refresh
/**
 * @template T
 * @param {() => Promise<T>} apiCall - The API function to call
 * @param {any[]} dependencies - Dependencies array for useEffect
 * @param {number | null} refreshInterval - Optional refresh interval in milliseconds
 * @returns {{ data: T | null, loading: boolean, error: string | null, refetch: () => Promise<void> }}
 */
export function useApiData(apiCall, dependencies = [], refreshInterval = null) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err.message);
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    if (refreshInterval) {
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, dependencies);

  return { data, loading, error, refetch: fetchData };
}

export { ApiError };

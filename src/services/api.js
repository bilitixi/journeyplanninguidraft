const API_BASE_URL = 'https://journeyplanningapi.onrender.com';

// Helper function to get the token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Helper function to make authenticated requests
const authenticatedRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'An error occurred');
  }

  return data;
};

// Authentication API
export const authAPI = {
  register: async (firstName, lastName, email, password) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    return data;
  },

  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    // Store token in localStorage
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));

    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!getToken();
  },

  verifyEmail: async (token) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/verify-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Email verification failed');
    }

    return data;
  },

  resendVerification: async (email) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/resend-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to resend verification email');
    }

    return data;
  },

  forgotPassword: async (email) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to send reset email');
    }

    return data;
  },

  resetPassword: async (token, newPassword) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, new_password: newPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to reset password');
    }

    return data;
  },
};

// Journey API
export const journeyAPI = {
  getAllJourneys: async () => {
    const data = await authenticatedRequest('/api/journeys');
    return data.journeys;
  },

  getJourneyById: async (journeyId) => {
    const data = await authenticatedRequest(`/api/journeys/${journeyId}`);
    return data;
  },

  createJourney: async (journeyData) => {
    const data = await authenticatedRequest('/api/journeys', {
      method: 'POST',
      body: JSON.stringify(journeyData),
    });
    return data;
  },

  updateJourney: async (journeyId, journeyData) => {
    const data = await authenticatedRequest(`/api/journeys/${journeyId}`, {
      method: 'PUT',
      body: JSON.stringify(journeyData),
    });
    return data;
  },

  deleteJourney: async (journeyId) => {
    const data = await authenticatedRequest(`/api/journeys/${journeyId}`, {
      method: 'DELETE',
    });
    return data;
  },
};

// Weather API
export const weatherAPI = {
  getWeatherForecast: async (journeyId) => {
    const data = await authenticatedRequest(`/api/weather/${journeyId}`);
    return data;
  },
};

// Recommendations API
export const recommendationsAPI = {
  getRecommendations: async (journeyId) => {
    const data = await authenticatedRequest(`/api/recommendations/${journeyId}`, {
      method: 'POST',
    });
    return data;
  },
};

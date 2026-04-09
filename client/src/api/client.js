import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.pataspace.co.ke/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

export const getApiErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data;

    if (typeof responseData === 'string') {
      return responseData;
    }

    if (responseData?.message) {
      return responseData.message;
    }

    if (Array.isArray(responseData?.errors)) {
      return responseData.errors.join(' ');
    }

    if (responseData?.errors && typeof responseData.errors === 'object') {
      return Object.values(responseData.errors).flat().filter(Boolean).join(' ') || fallback;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

export const submitApplication = async (data) => {
  const response = await api.post('/applications', data);
  return response.data;
};

export const notifyPaymentSent = async (applicationId, data) => {
  const response = await api.post(`/applications/${applicationId}/payment-notify`, data);
  return response.data;
};

export const getCurrentCohort = async () => {
  const response = await api.get('/cohorts/current');
  return response.data;
};

export const getTracks = async () => {
  const response = await api.get('/tracks');
  return response.data;
};

export const checkApplicationStatus = async (applicationId) => {
  const response = await api.get(`/applications/${applicationId}/status`);
  return response.data;
};

export default api;

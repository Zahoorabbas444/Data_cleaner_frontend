import axios from 'axios';

const API_BASE_URL = 'https://data-cleaner-backend-production.up.railway.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timed out. Please try again.';
    } else if (!error.response) {
      error.message = 'Network error. Please check your connection.';
    }
    return Promise.reject(error);
  }
);

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getStatus = async (jobId) => {
  const response = await api.get(`/status/${jobId}`);
  return response.data;
};

export const getResults = async (jobId) => {
  const response = await api.get(`/results/${jobId}`);
  return response.data;
};

export const downloadCleaned = (jobId) => {
  return `${API_BASE_URL}/download/${jobId}/cleaned`;
};

export const downloadReport = (jobId) => {
  return `${API_BASE_URL}/download/${jobId}/report`;
};

export const deleteJob = async (jobId) => {
  const response = await api.delete(`/job/${jobId}`);
  return response.data;
};

import axios from 'axios';

// Backend bazaviy URL manzilini sozlash
const API_URL = "https://workifybackend-production.up.railway.app/api";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// --- TALENT API ---
export const talentApi = {
  registerTalent: (formData) => {
    const token = localStorage.getItem("token");
    return api.post("/talent/register", formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  sendVerifyCode: (email) => api.post("/talent/send-verify-code", { email }),
  checkVerifyCode: (email, code) => api.post("/talent/check-verify-code", { email, code }),
  confirmVerifyEmail: (data) => api.post("/talent/confirm-verify-email", data),

  sendResetCode: (email) => api.post("/talent/send-reset-code", { email }),
  checkResetCode: (email, code) => {
  return api.post("/talent/check-reset-code", { 
    email: email.trim(), 
    code: String(code) 
  });
},
  confirmResetPassword: (email, code, newPassword) =>
    api.post("/talent/confirm-reset-password", { email, code, newPassword }),

  login: (data) => api.post("/talent/login", data),
  getAll: () => api.get("/talent"),
  getById: (id) => api.get(`/talent/${id}`),
  search: (query) => api.get(`/talent/search?query=${query}`),
  update: (id, formData) => {
    const token = localStorage.getItem("token");
    return api.put(`/talent/${id}`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  delete: (id) => api.delete(`/talent/${id}`),
};


// --- COMPANY API ---
export const companyApi = {
  register: (formData) => api.post('/company/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  login: (data) => api.post('/company/login', data),
  getProfile: () => api.get('/company/profile'),
  getAll: () => api.get('/company'),
  getById: (id) => api.get(`/company/${id}`),
  search: (query) => api.get(`/company/search?query=${query}`),
  update: (id, data) => api.put(`/company/${id}`, data),
  delete: (id) => api.delete(`/company/${id}`),
};

// --- JOBS API ---
export const jobApi = {
  create: (data) => api.post('/jobs', data),
  getAll: () => api.get('/jobs'),
  getById: (id) => api.get(`/jobs/${id}`),
  getByCompany: (companyId) => api.get(`/jobs/company/${companyId}`),
  search: (query) => api.get(`/jobs/search?query=${query}`),
  getMatchingJobs: (companyId = "") => api.get(`/jobs/my-skills${companyId ? `?company_id=${companyId}` : ''}`),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`),
};

export const applicationApi = {
  apply: (formData) => api.post('/job-applications', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getAll: () => api.get('/job-applications'),
  getById: (id) => api.get(`/job-applications/${id}`),
  updateStatus: (id, data) => api.put(`/job-applications/${id}`, data),
  delete: (id) => api.delete(`/job-applications/${id}`),
};

export const contactApi = {
  sendMessage: (data) => api.post('/contacts', data),
  getAll: () => api.get('/contacts'),
  getById: (id) => api.get(`/contacts/${id}`),
};

export default api;
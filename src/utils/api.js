const BASE = 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

const req = async (method, path, body) => {
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE}${path}`, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

// ── Generic methods ───────────────────────────────────────────────────────
export const api = {
  get:    (path)       => req('GET',    path),
  post:   (path, body) => req('POST',   path, body),
  put:    (path, body) => req('PUT',    path, body),
  delete: (path)       => req('DELETE', path),
};

// ── Students ──────────────────────────────────────────────────────────────
export const getStudents  = ()     => api.get('/students');
export const addStudent   = (data) => api.post('/students', data);
export const updateStudent = (id, data) => api.put(`/students/${id}`, data);
export const deleteStudent = (id)  => api.delete(`/students/${id}`);
export const getDashboardStats = () => api.get('/students/dashboard/stats');

// ── Auth ──────────────────────────────────────────────────────────────────
export const adminLogin   = (body) => api.post('/auth/admin/login', body);
export const studentLogin = (body) => api.post('/auth/student/login', body);

// ── Results ───────────────────────────────────────────────────────────────
export const getMyResults      = ()          => api.get('/results/my');
export const getStudentResults = (studentId) => api.get(`/results/student/${studentId}`);
export const uploadResults     = (data)      => api.post('/results', data);

// ── Notices ───────────────────────────────────────────────────────────────
export const getNotices    = ()          => api.get('/notices');
export const createNotice  = (data)      => api.post('/notices', data);
export const updateNotice  = (id, data)  => api.put(`/notices/${id}`, data);
export const deleteNotice  = (id)        => api.delete(`/notices/${id}`);

// ── Leaves ────────────────────────────────────────────────────────────────
export const getLeaves      = ()              => api.get('/leaves');
export const applyLeave     = (data)          => api.post('/leaves', data);
export const updateLeaveStatus = (id, data)   => api.put(`/leaves/${id}/status`, data);

// ── Fees ──────────────────────────────────────────────────────────────────
export const getFees       = ()      => api.get('/fees');
export const createFee     = (data)  => api.post('/fees', data);
export const createOrder   = (data)  => api.post('/fees/create-order', data);
export const verifyPayment = (data)  => api.post('/fees/verify-payment', data);

// ── Placements ────────────────────────────────────────────────────────────
export const getPlacements    = ()         => api.get('/placements');
export const createPlacement  = (data)     => api.post('/placements', data);
export const updatePlacement  = (id, data) => api.put(`/placements/${id}`, data);
export const deletePlacement  = (id)       => api.delete(`/placements/${id}`);
export const applyPlacement   = (id)       => api.post(`/placements/${id}/apply`);

// ── Colleges ──────────────────────────────────────────────────────────────
export const getColleges      = ()      => fetch(`${BASE}/colleges`).then(r => r.json());
export const registerCollege  = (data)  => api.post('/colleges/register', data);
export const deleteCollege    = (id)    => api.delete(`/colleges/${id}`);

// ── Password Reset ────────────────────────────────────────────────────────
export const requestPasswordReset = (email) => api.post('/auth/forgot-password', { email });
export const validateResetToken   = (token) => api.post('/auth/validate-reset-token', { token });
export const resetPassword        = (token, password) => api.post('/auth/reset-password', { token, password });

// ── Helpdesk ──────────────────────────────────────────────────────────────
export const getMyTickets    = ()          => api.get('/helpdesk');
export const getAllTickets    = ()          => api.get('/helpdesk/all');
export const createTicket    = (data)      => api.post('/helpdesk', data);
export const replyTicket     = (id, data)  => api.put(`/helpdesk/${id}/reply`, data);

// ── Reset Logs ────────────────────────────────────────────────────────────
export const getResetLogs = () => api.get('/auth/reset-logs');

export default api;

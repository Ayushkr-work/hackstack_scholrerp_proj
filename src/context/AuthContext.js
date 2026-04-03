import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);
const API = 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser]     = useState(null);
  const [role, setRole]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('erp_user');
      const savedRole = localStorage.getItem('erp_role');
      if (token && savedUser) {
        setUser(JSON.parse(savedUser));
        setRole(savedRole);
      }
    } catch {}
    setLoading(false);
  }, []);

  const login = async (email, password, collegeId, loginRole, collegeName) => {
    try {
      const endpoint = loginRole === 'admin' ? '/auth/admin/login' : '/auth/student/login';
      const res = await fetch(`${API}${endpoint}`, {
        method:  'POST',
        headers: { 'Content-Type':'application/json' },
        body:    JSON.stringify({
          email:      email.trim().toLowerCase(),
          password,
          college_id: collegeId ? Number(collegeId) : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, message: data.message || 'Invalid credentials' };

      localStorage.setItem('token',        data.token);
      localStorage.setItem('erp_user',     JSON.stringify(data.user));
      localStorage.setItem('erp_role',     data.role);
      localStorage.setItem('erp_college_id',   String(collegeId || data.user.college_id || ''));
      localStorage.setItem('erp_college_name', collegeName || '');
      setUser(data.user);
      setRole(data.role);
      return { success: true };
    } catch {
      return { success: false, message: 'Cannot connect to server. Make sure backend is running.' };
    }
  };

  const updateUser = (updated) => {
    const newUser = { ...user, ...updated };
    localStorage.setItem('erp_user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const logout = () => {
    const currentRole     = localStorage.getItem('erp_role');
    const collegeId       = localStorage.getItem('erp_college_id');
    const collegeName     = localStorage.getItem('erp_college_name');
    const params = new URLSearchParams();
    if (collegeId)   params.set('college', collegeId);
    if (collegeName) params.set('name', collegeName);
    const redirectPath = `/${currentRole === 'admin' ? 'admin' : 'student'}/login?${params.toString()}`;
    localStorage.removeItem('token');
    localStorage.removeItem('erp_user');
    localStorage.removeItem('erp_role');
    localStorage.removeItem('erp_college_id');
    localStorage.removeItem('erp_college_name');
    setUser(null);
    setRole(null);
    return redirectPath;
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

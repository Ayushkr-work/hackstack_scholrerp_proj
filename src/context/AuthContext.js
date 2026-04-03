import { createContext, useContext, useState, useEffect } from 'react';
import { getAdmins, getAllStudents } from '../utils/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]     = useState(null);
  const [role, setRole]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('erp_session');
      if (saved) { const p = JSON.parse(saved); setUser(p.user); setRole(p.role); }
    } catch {}
    setLoading(false);
  }, []);

  const login = (email, password, collegeId, loginRole) => {
    const list = loginRole === 'admin' ? getAdmins() : getAllStudents();
    const found = list.find(u =>
      u.email === email &&
      u.password === password &&
      (!collegeId || u.college_id === Number(collegeId))
    );
    if (!found) return { success: false, message: 'Invalid email or password' };
    const { password: _p, ...userData } = found;
    localStorage.setItem('erp_session', JSON.stringify({ user: userData, role: loginRole }));
    setUser(userData); setRole(loginRole);
    return { success: true };
  };

  const updateUser = (updated) => {
    const newUser = { ...user, ...updated };
    localStorage.setItem('erp_session', JSON.stringify({ user: newUser, role }));
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('erp_session');
    setUser(null); setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

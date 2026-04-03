import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Component } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Cursor from './components/Cursor';

import LandingPage        from './pages/LandingPage';
import SelectCollege      from './pages/SelectCollege';
import RegisterCollege    from './pages/RegisterCollege';
import LoginPage          from './pages/LoginPage';
import ForgotPassword     from './pages/ForgotPassword';
import ResetPassword      from './pages/ResetPassword';
import AdminDashboard     from './pages/AdminDashboard';
import StudentDashboard   from './pages/StudentDashboard';
import StudentsPage       from './pages/StudentsPage';
import ResultsPage        from './pages/ResultsPage';
import NoticesPage        from './pages/NoticesPage';
import LeavePage          from './pages/LeavePage';
import FeesPage           from './pages/FeesPage';
import PlacementsPage     from './pages/PlacementsPage';
import ProfilePage        from './pages/ProfilePage';
import ManageColleges     from './pages/ManageColleges';
import PasswordResetLogs  from './pages/PasswordResetLogs';
import HelpdeskPage       from './pages/HelpdeskPage';
import AdminHelpdeskPage  from './pages/AdminHelpdeskPage';
import TimetablePage      from './pages/TimetablePage';

class ErrorBoundary extends Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center p-6">
        <div className="glass-strong rounded-2xl p-8 max-w-md w-full border border-red-500/20 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-white/40 text-sm mb-6">{this.state.error?.message}</p>
          <button onClick={() => { this.setState({ hasError:false }); window.location.href='/'; }} className="btn-primary px-6 py-2">
            Go Home
          </button>
        </div>
      </div>
    );
    return this.props.children;
  }
}

const Guard = ({ children, role: need }) => {
  const { user, role, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin"/>
    </div>
  );
  if (!user) return <Navigate to="/" replace/>;
  if (need && role !== need) return <Navigate to="/" replace/>;
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/"                  element={<LandingPage/>}/>
      <Route path="/select-college"    element={<SelectCollege/>}/>
      <Route path="/register-college"  element={<RegisterCollege/>}/>
      <Route path="/admin/login"       element={<LoginPage type="admin"/>}/>
      <Route path="/student/login"     element={<LoginPage type="student"/>}/>
      <Route path="/forgot-password"   element={<ForgotPassword/>}/>
      <Route path="/reset-password"    element={<ResetPassword/>}/>

      <Route path="/admin"             element={<Guard role="admin"><AdminDashboard/></Guard>}/>
      <Route path="/admin/students"    element={<Guard role="admin"><StudentsPage/></Guard>}/>
      <Route path="/admin/results"     element={<Guard role="admin"><ResultsPage/></Guard>}/>
      <Route path="/admin/notices"     element={<Guard role="admin"><NoticesPage/></Guard>}/>
      <Route path="/admin/leaves"      element={<Guard role="admin"><LeavePage/></Guard>}/>
      <Route path="/admin/fees"        element={<Guard role="admin"><FeesPage/></Guard>}/>
      <Route path="/admin/placements"  element={<Guard role="admin"><PlacementsPage/></Guard>}/>
      <Route path="/admin/reset-logs"   element={<Guard role="admin"><PasswordResetLogs/></Guard>}/>
      <Route path="/admin/helpdesk"      element={<Guard role="admin"><AdminHelpdeskPage/></Guard>}/>
      <Route path="/admin/colleges"      element={<Guard role="admin"><ManageColleges/></Guard>}/>
      <Route path="/admin/timetable"     element={<Guard role="admin"><TimetablePage/></Guard>}/>

      <Route path="/student"           element={<Guard role="student"><StudentDashboard/></Guard>}/>
      <Route path="/student/profile"   element={<Guard role="student"><ProfilePage/></Guard>}/>
      <Route path="/student/results"   element={<Guard role="student"><ResultsPage/></Guard>}/>
      <Route path="/student/notices"   element={<Guard role="student"><NoticesPage/></Guard>}/>
      <Route path="/student/leaves"    element={<Guard role="student"><LeavePage/></Guard>}/>
      <Route path="/student/fees"      element={<Guard role="student"><FeesPage/></Guard>}/>
      <Route path="/student/placements" element={<Guard role="student"><PlacementsPage/></Guard>}/>
      <Route path="/student/helpdesk"   element={<Guard role="student"><HelpdeskPage/></Guard>}/>
      <Route path="/student/timetable"  element={<Guard role="student"><TimetablePage/></Guard>}/>

      <Route path="*" element={<Navigate to="/" replace/>}/>
    </Routes>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Cursor/>
            <AppRoutes/>
            <Toaster position="top-right" toastOptions={{
              style:{ background:'#0a1628', color:'#fff', border:'1px solid rgba(255,255,255,.1)', borderRadius:'12px', fontSize:'14px' },
              success:{ iconTheme:{ primary:'#00ff88', secondary:'#020408' } },
              error:  { iconTheme:{ primary:'#ef4444', secondary:'#020408' } },
            }}/>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

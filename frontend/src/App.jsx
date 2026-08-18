import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DeviceProvider } from './context/DeviceContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Home from './pages/Home'
import DashboardLayout from './components/DashBoardLayout';
import DevicesDashboard from './pages/DevicesDashboard';
import Layout from './components/Layout_';
import User from './pages/UserManagement';
import userTableTesting from './components/userTableTesting';
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DeviceProvider>
          <Routes>
            {/* <Route path="/" element={<Navigate to="/login" replace />} /> */}
            <Route path='/' element={<Home />} />
            <Route element={<ProtectedRoute />}>
              <Route path="profile" element={<DashboardLayout />} >
                <Route index element={<Navigate to="/profile/dashboard" replace />}/>
                <Route path='/profile/user' element={<User />} />
                <Route path='/profile/dashboard' element={<Layout />} />
                <Route path="/profile/device" element={<DevicesDashboard />} />
              </Route>
            </Route>


          

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />


            {/* Admin-only example */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<div>Admin Panel</div>} />
            </Route>

            <Route path="/unauthorized" element={<div>You don't have access to this page.</div>} />
            <Route path="*" element={<div>404 - Page Not Found</div>} />
          </Routes>
        </DeviceProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

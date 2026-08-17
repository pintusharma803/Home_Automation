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
import Layout_ from './components/Layout_';
import User from './pages/UserManagement';
// import AddDevice from './components/addDevice';
import userTableTesting from './components/userTableTesting';
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DeviceProvider>
          <Routes>
            {/* <Route path="/" element={<Navigate to="/login" replace />} /> */}
            {/* <Route path='/add' element={<AddDevice />} /> */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<DashboardLayout />} >
                <Route path='user' element={<User />} />
                <Route path='profile' element={<Layout_ />} />
                <Route path="device" element={<DevicesDashboard />} />
                {/* <Route path="DevicesDashboard" element={<DashboardLayout />} /> */}
              </Route>
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* <Route path="/userTable" element={<userTableTesting />} /> */}


            {/* Protected routes */}
            {/* <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />} />
          </Route> */}

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

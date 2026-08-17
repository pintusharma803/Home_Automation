import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProtectedData = async () => {
      try {
        const { data } = await api.get('/protected/dashboard');
        setMessage(data.message);
      } catch (err) {
        setMessage('Could not load protected data');
      }
    };
    fetchProtectedData();
  }, []);

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <p>
        Logged in as <strong>{user?.name}</strong> ({user?.email})
      </p>
      <p>{message}</p>
      <button onClick={logout}>Log Out</button>
    </div>
  );
};

export default Dashboard;

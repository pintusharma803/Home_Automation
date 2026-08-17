import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/profile';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setSubmitting(true);
    const result = await login(formData.email, formData.password);
    setSubmitting(false);
    if (result.success) {
      navigate(redirectTo, { replace: true });
    } else {
      setLocalError(result.message);
    }
  };

  return (
    <div className='bg-[radial-gradient(circle_at_bottom_left,_#1d4f92_0%,_#123165_40%,_#08172e_100%)] w-full h-screen justify-center items-center flex' >
      <div className="auth-form-container">
        <h2 >Login</h2>
        <form onSubmit={handleSubmit}>

          <label>
            Email
            <input
              placeholder='Enter your registered email'
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>


          <label>
            Password

            <input
              type="text"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
              placeholder='Enter your password'

            />
          </label>

          {localError && <p className="auth-error">{localError}</p>}

          <button className='mt-5 active:scale-95' type="submit" disabled={submitting}>
            {submitting ? 'Logging in…' : 'Login'}
          </button>
        </form>
        <div className='mt-5 '>
          <p className='mb-2 text-sm'>
            <Link to="/forgot-password" className='text-blue-500 underline'>Forgot password?</Link>
          </p>
          <p className='text-sm text-gray-500'>
            Don't have an account? <Link to="/register" className='text-blue-500 underline'>Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // esse page relaod nhi hoga component render ho jayega
    setLocalError('');

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    setSubmitting(true);
    const result = await register(formData.name, formData.email, formData.password);
    setSubmitting(false);

    if (result.success) {
      navigate('/dashboard', { replace: true });
    } else {
      setLocalError(result.message);
    }
  };

  return (
    <div className='bg-[radial-gradient(circle_at_bottom_left,_#1d4f92_0%,_#123165_40%,_#08172e_100%)] w-full h-screen flex justify-center items-center'>
      <div className="auth-form-container">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name*
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </label>

          <label>
            Email*
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </label>

          <label>
            Password*
            <input
              type="text"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
            />
          </label>

          <label>
            Confirm Password*
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={8}
            />
          </label>

          {localError && <p className="auth-error">{localError}</p>}

          <button className='mt-3 active:scale-95 bg-[#ff3d5b]' type="submit" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Register'}
          </button>
        </form>

        <p className='mt-3 text-sm text-gray-500'>
          Already have an account? <Link to="/login" className='text-blue-500 underline'>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

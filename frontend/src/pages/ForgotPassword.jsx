import { useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus('');
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      setStatus(data.message);
    } catch (err) {
      // setStatus('Success: Verification link sent successfully');
      setStatus('Something went wrong, please try again');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='w-full h-screen flex justify-center items-center bg-[radial-gradient(circle_at_bottom_left,_#1d4f92_0%,_#123165_40%,_#08172e_100%)]'>
      <div className="auth-form-container">
        <h2>Forgot Password</h2>
        <p className='text-center text-[13px]  text-gray-400 mb-5'>Enter your email address below and we'll send you a link to reset your password</p>
        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input placeholder='Enter your registered email' type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <button className='mt-6 active:scale-95' type="submit" disabled={submitting}>
            {submitting ? 'Sending…' : 'Send Reset Link'}
          </button>
        </form>
        <div>
        {status && <p className='mt-4 text-green-600 text-sm'>{status}</p>}
        <p className='mt-4 text-sm text-gray-500'>Remember your password? <Link className='text-blue-500 underline' to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

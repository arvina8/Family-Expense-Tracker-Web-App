import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await register(name, email, password);
  const count = (user.memberships || []).length;
  if (count === 0) navigate('/welcome/group');
  else if (count === 1) navigate(`/app/${user.memberships[0].group._id}/dashboard`);
  else navigate('/select-group');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Create account</h1>
        {error && <div className="bg-red-50 text-red-700 p-3 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full border p-3 rounded" type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
          <input className="w-full border p-3 rounded" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input className="w-full border p-3 rounded" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Creating...' : 'Register'}
          </button>
        </form>
        <div className="text-sm text-gray-600 mt-4">Have an account? <Link className="text-blue-600" to="/login">Login</Link></div>
      </div>
    </div>
  );
};

export default Register;

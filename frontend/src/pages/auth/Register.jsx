import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await registerUser(form);
      login(res.data, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen font-serif flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center py-12 px-6">
        <div className="w-full max-w-sm">

          <div className="text-center mb-8">
            <h1 className="font-serif text-[28px] md:text-[2rem] text-gray-900 mb-2 font-normal">
              Create Account
            </h1>
            <p className="text-[13px] md:text-[0.85rem] text-gray-500 font-sans tracking-wide">Join us for the finest teas</p>
          </div>

          <form onSubmit={handleSubmit} className="font-sans">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-[13px] mb-5 tracking-wide">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-xs text-gray-600 mb-1.5 ml-1 tracking-wider uppercase">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Your full name"
                className="w-full border border-gray-200 px-4 py-3 text-[13px] focus:outline-none focus:border-gray-500 transition-colors bg-white/50 focus:bg-white"
              />
            </div>

            <div className="mb-4">
              <label className="block text-xs text-gray-600 mb-1.5 ml-1 tracking-wider uppercase">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
                className="w-full border border-gray-200 px-4 py-3 text-[13px] focus:outline-none focus:border-gray-500 transition-colors bg-white/50 focus:bg-white"
              />
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-center mb-1.5 ml-1">
                <label className="block text-xs text-gray-600 tracking-wider uppercase">Password</label>
              </div>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                placeholder="Min 6 characters"
                className="w-full border border-gray-200 px-4 py-3 text-[13px] focus:outline-none focus:border-gray-500 transition-colors bg-white/50 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gray-900 text-white border-none py-3.5 text-[11px] md:text-xs tracking-[0.15em] transition-colors
                ${loading ? 'opacity-70 cursor-wait' : 'cursor-pointer hover:bg-black'}`}
            >
              {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
            </button>
          </form>

          <p className="text-center text-[13px] text-gray-500 mt-8 font-sans">
            Already have an account?{' '}
            <Link to="/login" className="text-gray-900 underline underline-offset-4 decoration-gray-300 hover:decoration-gray-900 transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
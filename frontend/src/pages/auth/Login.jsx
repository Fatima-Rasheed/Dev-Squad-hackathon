import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginUser } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';
import { Eye, EyeOff, Mail, Lock, Loader2, AlertCircle } from 'lucide-react';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginUser(form);
      login(res.data, res.data.token);
      if (location.state?.from) {
        navigate(location.state.from);
      } else if (res.data.role === 'admin' || res.data.role === 'superadmin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <Navbar />
      
      {/* 1. Added px-6 to the wrapper to prevent the card from touching screen edges 
          2. Added py-12 for better vertical centering 
      */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        
        {/* 3. Lowered max-w to 420px for a more "focused" look
            4. Applied responsive horizontal padding (px-8 for mobile, px-12 for desktop)
        */}
        <div className="w-full max-w-[420px] bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 px-8 py-10 md:px-12 md:py-14">
          
          {/* Header Section */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
              Welcome Back
            </h1>
            <p className="text-slate-400 text-sm font-medium">
              Please enter your details to sign in
            </p>
          </div>

          {error && (
            <div className="w-full mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold flex items-center gap-3">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-[12px] font-bold uppercase tracking-widest text-slate-500 ml-1">
                Email Address
              </label>
              <div className="relative px-0"> {/* Added relative wrapper for input spacing */}
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder=""
                  className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 text-sm focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[12px] font-bold uppercase tracking-widest text-slate-500">
                  Password
                </label>
                <Link to="/forgot" className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700">
                  Forgot?
                </Link>
              </div>
              <div className="relative px-0">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder=""
                  className="w-full h-14 pl-12 pr-12 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 text-sm focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2 px-0">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-lg shadow-slate-200 hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Sign In"}
              </button>
            </div>
          </form>

          {/* Footer Section */}
          <div className="mt-10 text-center">
            <p className="text-slate-500 text-sm">
              Don't have an account? {' '}
              <Link to="/register" className="text-slate-900 font-bold hover:underline decoration-2 underline-offset-4">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
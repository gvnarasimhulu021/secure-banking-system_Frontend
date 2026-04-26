import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('🚀 LOGIN PAGE - SUBMITTING LOGIN');
      console.log('📧 Email:', formData.email);
      console.log('🔑 Password:', '[HIDDEN]');
      console.log(' Credentials being sent:', { ...formData });
      
      // Direct login without role - authService will handle role detection
      const response = await login({ ...formData });
      console.log('✅ Login successful, response:', response);
      
      const userRole = response.user?.role || response.role;
      console.log('🎯 Final user role for navigation:', userRole);
      
      // Auto-navigate based on actual user role
      if (userRole === 'ADMIN') {
        console.log('🏢 Auto-navigating to admin dashboard');
        navigate('/admin/dashboard');
      } else {
        console.log('👤 Auto-navigating to user dashboard');
        navigate('/user/dashboard');
      }
      console.log('🎉 LOGIN PAGE - PROCESS COMPLETE');
    } catch (err) {
      setError(err.message || err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Panel */}
      <div className="flex-1 bg-gradient-to-br from-medium-green to-dark-green p-12 flex flex-col justify-center">
        {/* Bank Name */}
        <h1 className="text-[22px] font-medium mb-2 fade-in">Narsi Frnd of Joy Bank</h1>
        <p className="text-white/65 text-sm mb-8 slide-in-left">Your trusted financial partner</p>
        
        {/* Divider */}
        <div className="w-full h-px bg-white/20 mb-8 fade-in"></div>
        
        {/* Features */}
        <div className="text-center">
            <div className="text-gray-700 text-[16px] leading-relaxed slide-in-right">
              Experience secure and modern banking with confidence
            </div>
          </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 bg-white flex flex-col justify-center items-center p-12">
        <div className="w-full max-w-md">
          {/* Title */}
          <h2 className="text-[20px] font-medium text-gray-900 mb-2 fade-in">Welcome Back</h2>
          <p className="text-[13px] text-gray-600 mb-6 slide-in-left">
            Your financial journey continues - sign in to manage your money with confidence
          </p>
          
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-light-red-bg border-[0.5px] border-danger text-danger rounded-small text-[13px] error-message">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
                required
                className="w-full h-10 px-3 text-[14px] border-[0.5px] border-gray-200 rounded-small focus:outline-none focus:border-medium-green"
              />
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                  className="w-full h-10 px-3 pr-12 text-[14px] border-[0.5px] border-gray-200 rounded-small focus:outline-none focus:border-medium-green"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[12px] text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? 'hide' : 'show'}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <button
                type="button"
                className="text-[12px] text-medium-green hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-medium-green text-white font-medium rounded-small hover:bg-primary transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="px-4 text-[12px] text-gray-500">or</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <span className="text-[13px] text-gray-600">Don't have an account? </span>
            <button
              onClick={() => navigate('/register')}
              className="text-[13px] text-medium-green hover:underline font-medium"
            >
              Create one
            </button>
          </div>

          {/* Security Badge */}
          <div className="flex items-center justify-center mt-8 text-[11px] text-gray-500">
            <svg className="w-4 h-4 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C11.5 2 10 2.5 10 5.5V11C10 13.5 11.5 14 12 14C12.5 14 14 13.5 14 11V5.5C14 2.5 12.5 2 12 2M12 16C10.9 16 10 16.9 10 18S10.9 20 12 20C13.1 20 14 19.1 14 18S13.1 16 12 16Z"/>
            </svg>
            256-bit SSL encrypted · BCrypt password hashing
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

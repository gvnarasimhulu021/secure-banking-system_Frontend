import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService.js';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      setSuccess('Welcome to Narsi Bank! Your account has been created successfully - redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-card p-8">
        {/* Title */}
        <h2 className="text-[20px] font-medium text-gray-900 mb-2">Begin Your Banking Journey</h2>
        <p className="text-[13px] text-gray-600 mb-6">
          Take control of your financial future - create your account in just a few moments
        </p>

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-3 bg-light-green-bg border-[0.5px] border-medium-green text-primary rounded-small text-[13px]">
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-light-red-bg border-[0.5px] border-danger text-danger rounded-small text-[13px]">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-[13px] text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              className="w-full h-10 px-3 text-[14px] border-[0.5px] border-gray-200 rounded-small focus:outline-none focus:border-medium-green"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-[13px] text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full h-10 px-3 text-[14px] border-[0.5px] border-gray-200 rounded-small focus:outline-none focus:border-medium-green"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-[13px] text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
              minLength="6"
              className="w-full h-10 px-3 text-[14px] border-[0.5px] border-gray-200 rounded-small focus:outline-none focus:border-medium-green"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-[13px] text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              minLength="6"
              className="w-full h-10 px-3 text-[14px] border-[0.5px] border-gray-200 rounded-small focus:outline-none focus:border-medium-green"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 bg-medium-green text-white font-medium rounded-small hover:bg-primary transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center mt-6">
          <span className="text-[13px] text-gray-600">Already have an account? </span>
          <button
            onClick={() => navigate('/login')}
            className="text-[13px] text-medium-green hover:underline font-medium"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;

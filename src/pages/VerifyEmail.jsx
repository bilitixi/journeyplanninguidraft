import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { authAPI } from '../services/api';
import { Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState('');
  const [status, setStatus] = useState('idle'); // idle, verifying, success, error
  const [message, setMessage] = useState('');
  const [resendEmail, setResendEmail] = useState('');
  const [resendStatus, setResendStatus] = useState('idle');
  const navigate = useNavigate();

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      handleVerification(tokenFromUrl);
    }
  }, [searchParams]);

  const handleVerification = async (verificationToken) => {
    setStatus('verifying');
    try {
      await authAPI.verifyEmail(verificationToken);
      setStatus('success');
      setMessage('Email verified successfully! You can now log in.');
    } catch (err) {
      setStatus('error');
      setMessage(err.message);
    }
  };

  const handleManualVerify = async (e) => {
    e.preventDefault();
    if (!token.trim()) {
      setMessage('Please enter the verification token');
      setStatus('error');
      return;
    }
    handleVerification(token);
  };

  const handleResendVerification = async (e) => {
    e.preventDefault();
    if (!resendEmail.trim()) {
      setMessage('Please enter your email address');
      setStatus('error');
      return;
    }
    setResendStatus('loading');
    try {
      await authAPI.resendVerification(resendEmail);
      setResendStatus('success');
      setMessage('Verification email sent successfully!');
      setStatus('success');
    } catch (err) {
      setResendStatus('error');
      setMessage(err.message);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Verify Your Email</h1>
          <p className="text-gray-600 mt-2">Please verify your email address to continue</p>
        </div>

        {status === 'verifying' && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-6 rounded-lg mb-6 text-center">
            <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin" />
            <p>Verifying your email...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-6 rounded-lg mb-6 flex items-center">
            <CheckCircle className="w-6 h-6 mr-3 flex-shrink-0" />
            <p>{message}</p>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-6 rounded-lg mb-6 flex items-center">
            <AlertCircle className="w-6 h-6 mr-3 flex-shrink-0" />
            <p>{message}</p>
          </div>
        )}

        {status === 'idle' && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-6 rounded-lg mb-6">
            <p className="text-sm">
              If you have a verification token from your email, you can enter it below. 
              Or request a new verification email.
            </p>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Enter Verification Token</h3>
            <form onSubmit={handleManualVerify} className="space-y-4">
              <div>
                <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Token
                </label>
                <input
                  id="token"
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Enter token from email"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'verifying'}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'verifying' ? 'Verifying...' : 'Verify Email'}
              </button>
            </form>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resend Verification Email</h3>
            <form onSubmit={handleResendVerification} className="space-y-4">
              <div>
                <label htmlFor="resendEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="resendEmail"
                  type="email"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="you@example.com"
                />
              </div>
              <button
                type="submit"
                disabled={resendStatus === 'loading'}
                className="w-full bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 focus:ring-4 focus:ring-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendStatus === 'loading' ? 'Sending...' : 'Resend Verification Email'}
              </button>
            </form>
          </div>
        </div>

        {status === 'success' && (
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/login')}
              className="text-indigo-600 font-semibold hover:underline"
            >
              Proceed to Login
            </button>
          </div>
        )}

        <p className="text-center mt-6 text-gray-600">
          Already verified?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-indigo-600 font-semibold hover:underline"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;

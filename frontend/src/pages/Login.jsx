import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import Button from '../components/Button';

const Login = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, user } = useAuth();
  
  // Get return path if available
  const returnTo = searchParams.get('returnTo') || '';
  
  // Get type parameter from URL, defaulting to 'donor' if not specified
  const [loginType, setLoginType] = useState(searchParams.get('type') || 'donor');
  
  useEffect(() => {
    // Update URL when type changes, preserve returnTo if present
    const url = returnTo 
      ? `/auth/login?type=${loginType}&returnTo=${encodeURIComponent(returnTo)}`
      : `/auth/login?type=${loginType}`;
    navigate(url, { replace: true });
  }, [loginType, navigate, returnTo]);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // For debugging purposes, log the URL being used
      console.log(`Making login request to: ${import.meta.env.VITE_BACKEND_URL}/api/auth/login`);
      
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, type: loginType }),
        credentials: 'include'
      });

      // For debugging, log response details
      console.log('Login response status:', response.status);
      
      // Handle non-JSON responses
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text();
        console.error('Non-JSON response:', textResponse);
        throw new Error(`Server returned non-JSON response: ${textResponse.substring(0, 100)}...`);
      }
      
      const data = await response.json();
      console.log('Login response data:', data);

      if (response.ok) {
        login(data); // Update auth context
        
        // Redirect to the return path if provided, otherwise to appropriate dashboard
        if (returnTo) {
          navigate(returnTo);
        } else {
          navigate(data.type === 'donor' ? '/donor/dashboard' : '/organization/dashboard');
        }
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error details:', err);
      if (err.message && err.message.includes('Server returned non-JSON response')) {
        setError('The server is experiencing issues. Please try again later.');
      } else {
        setError('Connection error. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleLoginType = () => {
    setLoginType(loginType === 'donor' ? 'organization' : 'donor');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-emerald-100 to-white pt-16 md:pt-20 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto bg-white p-5 sm:p-8 rounded-xl shadow-lg"
      >
        <div className="flex justify-center mb-6">
          <div className="flex p-1 bg-emerald-100 rounded-lg w-full max-w-xs">
            <button 
              onClick={() => setLoginType('donor')}
              className={`px-3 py-2 text-sm sm:text-base sm:px-4 rounded-md transition-colors flex-1 ${
                loginType === 'donor' 
                  ? 'bg-emerald-600 text-white' 
                  : 'text-emerald-800 hover:bg-emerald-200'
              }`}
            >
              Donor
            </button>
            <button 
              onClick={() => setLoginType('organization')}
              className={`px-3 py-2 text-sm sm:text-base sm:px-4 rounded-md transition-colors flex-1 ${
                loginType === 'organization' 
                  ? 'bg-emerald-600 text-white' 
                  : 'text-emerald-800 hover:bg-emerald-200'
              }`}
            >
              Organization
            </button>
          </div>
        </div>
        
        <h2 className="text-xl sm:text-2xl font-bold text-emerald-900 mb-4 sm:mb-6 text-center">
          Login as {loginType === 'donor' ? 'Donor' : 'Organization'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border"
              disabled={loading}
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}

          <Button
            label={loading ? 'Logging in...' : 'Login'}
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md text-white font-medium
              ${loading 
                ? 'bg-emerald-400 cursor-not-allowed' 
                : 'bg-emerald-600 hover:bg-emerald-700'
              } transition-colors duration-200`}
          />
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link 
            to={`/auth/register?type=${loginType}`}
            className="text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Register here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
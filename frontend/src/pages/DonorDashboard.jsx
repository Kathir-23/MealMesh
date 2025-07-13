import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

const DonorDashboard = () => {
  const { user } = useAuth();
  const [newDonation, setNewDonation] = useState({
    items: '',
    quantity: '',
    pickupTime: '',
    location: '',
    description: ''
  });
  const [recentDonations, setRecentDonations] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDonations: 0,
    activeDonations: 0,
    completedDonations: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      setInitialLoading(true);
      
      // Check if user is authenticated
      if (!user || !user.token || !user.id) {
        setError('Authentication error. Please log in again.');
        setInitialLoading(false);
        return;
      }
      
      try {
        // Fetch donations
        const donationsResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/donations`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        
        // Fetch stats
        const statsResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/${user.id}/stats`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        
        if (donationsResponse.ok) {
          const donationsData = await donationsResponse.json();
          setRecentDonations(donationsData.filter(donation => donation.donor._id === user.id));
        }
        
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError('Failed to load dashboard data. Please refresh the page.');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchData();
  }, [user?.token, user?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewDonation(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    // Check if user is authenticated
    if (!user || !user.token) {
      setError('Authentication error. Please log in again.');
      setLoading(false);
      return;
    }
    
    if (!newDonation.items || !newDonation.quantity || !newDonation.pickupTime || !newDonation.location) {
      setError('Please fill out all required fields');
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/donations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(newDonation)
      });
      
      if (response.ok) {
        const data = await response.json();
        setRecentDonations([data, ...recentDonations]);
        setNewDonation({ items: '', quantity: '', pickupTime: '', location: '', description: '' });
        setSuccess('Donation created successfully!');
        setLoading(false);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create donation');
        setLoading(false);
      }
    } catch (error) {
      setError('Network error, please try again');
      console.error('Failed to create donation:', error);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-emerald-100 to-white pt-16 md:pt-20 px-3 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-8 transition-all hover:shadow-xl"
        >
          <h1 className="text-xl sm:text-2xl font-bold text-emerald-900 mb-2">Welcome, {user?.name || 'User'}! 👋</h1>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Here's an overview of your donation activity</p>
          
          {/* Stats cards - Now properly responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-4">
            <motion.div 
              whileHover={{ scale: 1.03 }} 
              transition={{ duration: 0.2 }}
              className="bg-emerald-50 p-3 sm:p-4 rounded-lg border border-emerald-100 hover:border-emerald-200"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm text-emerald-600">Total Donations</p>
                <span className="text-emerald-500 bg-emerald-100 p-1 rounded-full">📦</span>
              </div>
              <p className="text-lg sm:text-2xl font-bold text-emerald-900">{stats.totalDonations}</p>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.03 }} 
              transition={{ duration: 0.2 }}
              className="bg-emerald-50 p-3 sm:p-4 rounded-lg border border-emerald-100 hover:border-emerald-200 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm text-emerald-600">Active Requests</p>
                <span className="text-emerald-500 bg-emerald-100 p-1 rounded-full">🔄</span>
              </div>
              <p className="text-lg sm:text-2xl font-bold text-emerald-900">{stats.activeDonations}</p>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.03 }} 
              transition={{ duration: 0.2 }}
              className="bg-emerald-50 p-3 sm:p-4 rounded-lg border border-emerald-100 hover:border-emerald-200 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm text-emerald-600">Completed Donations</p>
                <span className="text-emerald-500 bg-emerald-100 p-1 rounded-full">✅</span>
              </div>
              <p className="text-lg sm:text-2xl font-bold text-emerald-900">{stats.completedDonations}</p>
            </motion.div>
          </div>
        </motion.div>

        {/* New Donation Form - Responsive grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-8 transition-all hover:shadow-xl"
        >
          <h2 className="text-lg sm:text-xl font-semibold text-emerald-900 mb-3 sm:mb-4 flex items-center">
            <span className="mr-2">🍽️</span> Create New Donation
          </h2>
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Food Items <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="items"
                  value={newDonation.items}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border transition-colors"
                  placeholder="e.g., Rice, Curry, Bread"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="quantity"
                  value={newDonation.quantity}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border transition-colors"
                  placeholder="e.g., 50 meals"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Time <span className="text-red-500">*</span></label>
                <input
                  type="datetime-local"
                  name="pickupTime"
                  value={newDonation.pickupTime}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="location"
                  value={newDonation.location}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border transition-colors"
                  placeholder="e.g., 123 Main St, City"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={newDonation.description}
                onChange={handleChange}
                rows="3"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border transition-colors"
                placeholder="Additional details about the donation..."
              />
            </div>
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 bg-green-50 border border-green-200 text-green-600 rounded-md text-sm">
                {success}
              </div>
            )}
            <Button
              type="submit"
              label={loading ? "Creating..." : "Create Donation"}
              className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
            />
          </form>
        </motion.div>

        {/* Recent Donations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-6 transition-all hover:shadow-xl"
        >
          <h2 className="text-xl font-semibold text-emerald-900 mb-4 flex items-center">
            <span className="mr-2">📋</span> Recent Donations
          </h2>
          
          {initialLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600 mb-2"></div>
              <p className="text-gray-500">Loading donations...</p>
            </div>
          ) : recentDonations.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500 mb-2">No donations yet</p>
              <p className="text-sm text-gray-400">Your recent donations will appear here</p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle p-4 sm:p-0">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentDonations.map((donation) => (
                      <tr key={donation._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(donation.createdAt)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{donation.items}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{donation.location}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            donation.status === 'Distributed' 
                              ? 'bg-green-100 text-green-800' 
                              : donation.status === 'Accepted' 
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {donation.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DonorDashboard;
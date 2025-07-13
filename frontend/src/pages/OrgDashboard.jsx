import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

const OrgDashboard = () => {
  const { user } = useAuth();
  const [distributionData, setDistributionData] = useState({
    meals: '',
    date: '',
    notes: ''
  });
  const [availableDonations, setAvailableDonations] = useState([]);
  const [acceptedDonations, setAcceptedDonations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [orgStats, setOrgStats] = useState({
    peopleServed: 0,
    activeDonations: 0,
    completedDonations: 0
  });

  useEffect(() => {
    const fetchDonations = async () => {
      setInitialLoading(true);
      
      // Check if user is authenticated
      if (!user || !user.token) {
        setError('Authentication error. Please log in again.');
        setInitialLoading(false);
        return;
      }
      
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/donations`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          const available = data.filter(d => d.status === 'Available');
          const accepted = data.filter(d => d.status === 'Accepted' && d.organization === user.id);
          const distributed = data.filter(d => d.status === 'Distributed' && d.organization === user.id);
          
          let totalPeopleServed = 0;
          distributed.forEach(donation => {
            if (donation.distribution && donation.distribution.meals) {
              totalPeopleServed += parseInt(donation.distribution.meals) || 0;
            }
          });
          
          setAvailableDonations(available);
          setAcceptedDonations(accepted);
          setOrgStats({
            peopleServed: totalPeopleServed,
            activeDonations: accepted.length,
            completedDonations: distributed.length
          });
        }
      } catch (error) {
        console.error('Failed to fetch donations:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchDonations();
  }, [user?.token, user?.id]);

  useEffect(() => {
    setFilteredDonations(
      availableDonations.filter(donation =>
        donation.donor?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        donation.items?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        donation.location?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, availableDonations]);

  const handleAcceptDonation = async (donationId) => {
    setError('');
    setSuccess('');
    setLoading(true);
    
    // Check if user is authenticated
    if (!user || !user.token) {
      setError('Authentication error. Please log in again.');
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/donations/${donationId}/accept`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      if (response.ok) {
        const updatedDonation = await response.json();
        setAvailableDonations(availableDonations.filter(d => d._id !== donationId));
        setAcceptedDonations([...acceptedDonations, updatedDonation]);
        setSuccess('Donation accepted successfully');
        setLoading(false);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to accept donation');
        setLoading(false);
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const handleRecordDistribution = async (donationId) => {
    setError('');
    setSuccess('');
    setLoading(true);
    
    if (!distributionData.meals || !distributionData.date) {
      setError('Please fill in the required distribution details');
      setLoading(false);
      return;
    }
    
    // Check if user is authenticated
    if (!user || !user.token) {
      setError('Authentication error. Please log in again.');
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/donations/${donationId}/distribute`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(distributionData)
      });
      if (response.ok) {
        const updatedDonation = await response.json();
        setAcceptedDonations(acceptedDonations.filter(d => d._id !== donationId));
        setSuccess('Distribution recorded successfully');
        setDistributionData({ meals: '', date: '', notes: '' });
        setSelectedDonation(null);
        setLoading(false);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to record distribution');
        setLoading(false);
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDistributionData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-emerald-100 to-white pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8 transition-all hover:shadow-xl"
        >
          <h1 className="text-2xl font-bold text-emerald-900 mb-2">Welcome, {user?.name || 'User'}! 👋</h1>
          <p className="text-gray-600 mb-6">Here's an overview of your organization activity</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <motion.div 
              whileHover={{ scale: 1.03 }} 
              transition={{ duration: 0.2 }}
              className="bg-emerald-50 p-4 rounded-lg border border-emerald-100 hover:border-emerald-200 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-emerald-600">People Served</p>
                <span className="text-emerald-500 bg-emerald-100 p-1 rounded-full">👥</span>
              </div>
              <p className="text-2xl font-bold text-emerald-900">{orgStats.peopleServed}</p>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.03 }} 
              transition={{ duration: 0.2 }}
              className="bg-emerald-50 p-4 rounded-lg border border-emerald-100 hover:border-emerald-200 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-emerald-600">Active Donations</p>
                <span className="text-emerald-500 bg-emerald-100 p-1 rounded-full">🍽️</span>
              </div>
              <p className="text-2xl font-bold text-emerald-900">{acceptedDonations.length}</p>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.03 }} 
              transition={{ duration: 0.2 }}
              className="bg-emerald-50 p-4 rounded-lg border border-emerald-100 hover:border-emerald-200 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-emerald-600">Completed Donations</p>
                <span className="text-emerald-500 bg-emerald-100 p-1 rounded-full">✅</span>
              </div>
              <p className="text-2xl font-bold text-emerald-900">{orgStats.completedDonations}</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Available Donations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8 transition-all hover:shadow-xl"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-emerald-900 flex items-center">
              <span className="mr-2">🔍</span> Available Donations
            </h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search donations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
              <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
            </div>
          </div>
          
          {initialLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600 mb-2"></div>
              <p className="text-gray-500">Loading donations...</p>
            </div>
          ) : filteredDonations.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500 mb-2">No available donations found</p>
              <p className="text-sm text-gray-400">
                {searchQuery ? "Try changing your search query" : "Check back later for new donations"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-emerald-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-emerald-800 uppercase tracking-wider">Donor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-emerald-800 uppercase tracking-wider">Items</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-emerald-800 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-emerald-800 uppercase tracking-wider">Pickup Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-emerald-800 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-emerald-800 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDonations.map((donation) => (
                    <tr key={donation._id} className="hover:bg-emerald-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{donation.donor?.name || 'Unknown'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{donation.items}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{donation.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(donation.pickupTime)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{donation.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button
                          label={loading && selectedDonation === donation._id ? "Accepting..." : "Accept"}
                          onClick={() => {
                            setSelectedDonation(donation._id);
                            handleAcceptDonation(donation._id);
                          }}
                          className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded hover:bg-emerald-700 transition-colors"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Accepted Donations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-6 transition-all hover:shadow-xl"
        >
          <h2 className="text-xl font-semibold text-emerald-900 mb-6 flex items-center">
            <span className="mr-2">📦</span> Accepted Donations
          </h2>
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm mb-4">
              {error}
            </div>
          )}
          
          {success && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-600 rounded-md text-sm mb-4">
              {success}
            </div>
          )}
          
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-md font-medium text-gray-700 mb-3 flex items-center">
              <span className="mr-2">📝</span> Distribution Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Meals <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  name="meals"
                  value={distributionData.meals}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border transition-colors"
                  placeholder="e.g., 50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Distribution Date <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  name="date"
                  value={distributionData.date}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <input
                  type="text"
                  name="notes"
                  value={distributionData.notes}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border transition-colors"
                  placeholder="Additional information"
                />
              </div>
            </div>
          </div>
          
          {initialLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600 mb-2"></div>
              <p className="text-gray-500">Loading donations...</p>
            </div>
          ) : acceptedDonations.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500 mb-2">No accepted donations yet</p>
              <p className="text-sm text-gray-400">Accept donations from the available list above</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-emerald-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-emerald-800 uppercase tracking-wider">Donor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-emerald-800 uppercase tracking-wider">Items</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-emerald-800 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-emerald-800 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-emerald-800 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {acceptedDonations.map((donation) => (
                    <tr key={donation._id} className="hover:bg-emerald-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{donation.donor?.name || 'Unknown'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{donation.items}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{donation.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {donation.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button
                          label={loading && selectedDonation === donation._id ? "Processing..." : "Record Distribution"}
                          onClick={() => {
                            setSelectedDonation(donation._id);
                            handleRecordDistribution(donation._id);
                          }}
                          className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded hover:bg-emerald-700 transition-colors"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default OrgDashboard;
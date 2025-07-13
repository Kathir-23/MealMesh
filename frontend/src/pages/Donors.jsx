import { motion } from 'framer-motion';
import { DONORS } from '../constants';

const Donors = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-20 px-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Our Amazing Donors</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DONORS.map((donor) => (
            <motion.div
              key={donor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-gray-800">{donor.name}</h2>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {donor.type}
                </span>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-600">Location: {donor.location}</p>
                <p className="text-gray-600">Total Donations: {donor.totalDonations} meals</p>
                <p className="text-gray-600">Rating: {donor.rating} ⭐</p>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Recent Donations</h3>
                {donor.recentDonations.map((donation, index) => (
                  <div key={index} className="text-sm text-gray-600 mb-1">
                    {donation.date}: {donation.items} ({donation.quantity})
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Donors;
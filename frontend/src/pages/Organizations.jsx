import { motion } from 'framer-motion';
import { ORGANIZATIONS } from '../constants';

const Organizations = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-20 px-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Partner Organizations</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ORGANIZATIONS.map((org) => (
            <motion.div 
              key={org.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-gray-800">{org.name}</h2>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm">
                  {org.type}
                </span>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-600">Location: {org.location}</p>
                <p className="text-gray-600">People Served: {org.peopleServed}</p>
                <p className="text-gray-600">Rating: {org.rating} ⭐</p>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Recent Received</h3>
                {org.recentReceived.map((received, index) => (
                  <div key={index} className="text-sm text-gray-600 mb-1">
                    {received.date}: {received.items} ({received.quantity})
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

export default Organizations;
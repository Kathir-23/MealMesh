import { motion } from 'framer-motion';

const FoodSafety = () => {
  const guidelines = [
    {
      title: "Temperature Control",
      icon: "🌡️",
      items: [
        "Keep hot foods above 140°F (60°C)",
        "Keep cold foods below 40°F (4°C)",
        "The 'danger zone' between 40°F and 140°F is where bacteria multiply rapidly",
        "Cool leftovers within 2 hours of cooking"
      ]
    },
    {
      title: "Storage Guidelines",
      icon: "📦",
      items: [
        "Store raw foods below cooked foods to prevent cross-contamination",
        "Use air-tight containers for storage",
        "Label all items with contents and date",
        "Follow FIFO (First In, First Out) principle for stock rotation"
      ]
    },
    {
      title: "Transportation Safety",
      icon: "🚚",
      items: [
        "Use insulated containers for transport",
        "Keep hot and cold foods separate",
        "Minimize transport time to under 30 minutes when possible",
        "Use ice packs for cold foods and thermal containers for hot foods"
      ]
    },
    {
      title: "Personal Hygiene",
      icon: "🧼",
      items: [
        "Wash hands thoroughly before handling food",
        "Wear gloves when preparing or serving food",
        "Tie back hair and wear hairnets when appropriate",
        "Avoid handling food when sick"
      ]
    },
    {
      title: "Food Donation Best Practices",
      icon: "🍽️",
      items: [
        "Only donate unopened packaged foods or professionally prepared foods",
        "Non-perishable items should be within expiration dates",
        "Fresh produce should be clean and undamaged",
        "Include allergen information whenever possible"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-emerald-100 to-white pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
        >
          <h1 className="text-3xl font-bold text-emerald-900 mb-2">Food Safety Guidelines</h1>
          <p className="text-gray-600 mb-6">
            Following proper food safety practices is essential when donating food. These guidelines 
            will help ensure that the food you donate is safe for consumption.
          </p>

          <div className="space-y-8">
            {guidelines.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-emerald-50 p-6 rounded-lg border border-emerald-100"
              >
                <h2 className="text-xl font-semibold text-emerald-900 mb-4 flex items-center">
                  <span className="mr-2">{section.icon}</span> {section.title}
                </h2>
                <ul className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <span className="text-emerald-500 mr-2">•</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-100">
            <h2 className="text-xl font-semibold text-blue-900 mb-4 flex items-center">
              <span className="mr-2">ℹ️</span> Important Reminder
            </h2>
            <p className="text-blue-800">
              Food safety is everyone's responsibility. When in doubt about the safety of food, 
              it is better not to donate it. Contact your local health department for specific 
              guidelines in your area.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FoodSafety; 
import { motion } from 'framer-motion';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-20">
      {/* Hero Section */}
      <motion.section 
        className="px-6 max-w-6xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Our Mission
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connecting surplus food with those in need, creating a sustainable solution to hunger while reducing food waste.
          </p>
        </div>

        {/* Stats Section */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
          variants={fadeIn}
          transition={{ delay: 0.2 }}
        >
          {[
            { number: '10K+', label: 'Meals Donated' },
            { number: '500+', label: 'Active Donors' },
            { number: '100+', label: 'Partner Organizations' }
          ].map((stat, index) => (
            <div key={index} className="text-center p-6 bg-white rounded-lg shadow-lg">
              <h2 className="text-4xl font-bold text-emerald-900 mb-2">{stat.number}</h2>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* How It Works */}
        <motion.section 
          className="mb-20"
          variants={fadeIn}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Register',
                description: 'Sign up as a donor or organization partner',
                icon: '📝'
              },
              {
                title: 'Connect',
                description: 'Match surplus food with local organizations',
                icon: '🤝'
              },
              {
                title: 'Impact',
                description: 'Track your contribution to reducing food waste',
                icon: '🌱'
              }
            ].map((step, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-lg shadow-lg">
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Values Section */}
        <motion.section 
          className="mb-20"
          variants={fadeIn}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: 'Sustainability',
                description: 'We believe in creating lasting solutions that benefit both people and planet.'
              },
              {
                title: 'Community',
                description: 'Building strong networks of caring individuals and organizations.'
              },
              {
                title: 'Innovation',
                description: 'Using technology to solve complex social challenges.'
              },
              {
                title: 'Impact',
                description: 'Measuring and maximizing the positive change we create.'
              }
            ].map((value, index) => (
              <div key={index} className="p-6 bg-white rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </motion.section>
      </motion.section>
    </div>
  );
};

export default About;
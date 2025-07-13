import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.7 }
  }
};

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2 }
  }
};

const Landing = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-300 via-emerald-100 to-emerald-400">
      <div className="flex items-center justify-center px-3 sm:px-6 min-h-[calc(100vh-120px)]">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-8 bg-white/50 backdrop-blur-sm p-5 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl shadow-lg"
        >
          <motion.h1
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-emerald-900 mb-3 sm:mb-6 leading-tight"
          >
            How can you reduce food waste today?
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-emerald-800 mb-6 sm:mb-12 max-w-2xl mx-auto"
          >
            Join our mission to connect surplus food with those in need.
            Every donation makes a difference in fighting hunger and reducing waste.
          </motion.p>

          <motion.div
            variants={buttonVariants}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center"
          >
            <Button
              label="I Want to Donate"
              onClick={() => navigate('/auth/login?type=donor')}
              className="px-6 sm:px-10 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg sm:rounded-xl transform hover:-translate-y-1 transition-all duration-300 shadow-lg"
            />
            <Button
              label="I Represent an Organization"
              onClick={() => navigate('/auth/login?type=organization')}
              className="px-6 sm:px-10 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg sm:rounded-xl transform hover:-translate-y-1 transition-all duration-300 shadow-lg"
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Landing;
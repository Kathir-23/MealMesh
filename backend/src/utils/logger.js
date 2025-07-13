const logger = {
  info: (message, data) => {
    console.log(`[INFO] ${new Date().toISOString()}: ${message}`);
    if (data) {
      console.log(JSON.stringify(data, null, 2));
    }
  },
  
  error: (message, error) => {
    console.error(`[ERROR] ${new Date().toISOString()}: ${message}`);
    if (error) {
      if (typeof error === 'object' && error !== null) {
        console.error(`${error.name}: ${error.message}`);
        if (error.stack) {
          console.error(error.stack.split('\n').slice(0, 3).join('\n'));
        }
      } else {
        console.error(error);
      }
    }
  },
  
  debug: (message, data) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[DEBUG] ${new Date().toISOString()}: ${message}`);
      if (data) {
        console.log(JSON.stringify(data, null, 2));
      }
    }
  }
};

export default logger;
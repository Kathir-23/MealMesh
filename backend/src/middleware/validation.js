export const validateDonation = (req, res, next) => {
  const { items, quantity, pickupTime, location } = req.body;
  
  if (!items || !quantity || !pickupTime || !location) {
    return res.status(400).json({ 
      message: 'Missing required fields',
      details: {
        items: items ? undefined : 'Items field is required',
        quantity: quantity ? undefined : 'Quantity field is required',
        pickupTime: pickupTime ? undefined : 'Pickup time field is required',
        location: location ? undefined : 'Location field is required'
      }
    });
  }
  
  // Additional validation could be added here
  
  next();
};

export const validateContact = (req, res, next) => {
  const { name, email, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({
      message: 'Missing required fields',
      details: {
        name: name ? undefined : 'Name field is required',
        email: email ? undefined : 'Email field is required',
        message: message ? undefined : 'Message field is required'
      }
    });
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: 'Invalid email format'
    });
  }
  
  next();
};
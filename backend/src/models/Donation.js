import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: { type: String, required: true },
  quantity: { type: String, required: true },
  pickupTime: { type: Date, required: true },
  location: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Available', 'Accepted', 'Distributed'], 
    default: 'Available' 
  },
  organization: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  distribution: {
    meals: Number,
    date: Date,
    notes: String
  }
}, { timestamps: true });

export default mongoose.model('Donation', donationSchema);
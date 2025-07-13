import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  peopleServed: { type: Number, required: true },
  rating: { type: Number, required: true },
  location: { type: String, required: true }
}, { timestamps: true });

const Organization = mongoose.model('Organization', organizationSchema);

export default Organization;
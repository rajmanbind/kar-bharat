import mongoose from 'mongoose';
import Customer from './customer.model.js';
const workerSchema = new mongoose.Schema(
  {
    skills: [String], 
    rating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    brokerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer', 
    },
  },
  { timestamps: true }
);

const Worker = Customer.discriminator('Worker', workerSchema);

export default Worker;

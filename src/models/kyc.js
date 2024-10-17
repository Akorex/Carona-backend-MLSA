import mongoose from 'mongoose';

const kycSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  identificationDocument: {
    type: String,
    required: true,
    enum: ['passport', 'driver_license', 'national_id'],
  },
//   documentNumber: {
//     type: String,
//     required: true,
//   },
//   documentImage: {
//     type: String,
//     required: true,
//   },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  verifiedAt: {
    type: Date,
  },
});

const KYC = mongoose.model('KYC', kycSchema);
export default KYC;

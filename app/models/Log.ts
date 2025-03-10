import mongoose from 'mongoose';

const LogSchema = new mongoose.Schema({
  timestamp: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: false
  },
  type: {
    type: String,
    enum: ['LOGIN', '2FA'],
    required: true
  },
  ipAddress: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.models.Log || mongoose.model('Log', LogSchema); 
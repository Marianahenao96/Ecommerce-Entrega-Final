import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  specie: {
    type: String,
    required: true,
    enum: ['dog', 'cat', 'bird', 'rabbit', 'hamster', 'other'],
    default: 'other'
  },
  birthDate: {
    type: Date,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
});

const PetModel = mongoose.model('Pet', petSchema);

export default PetModel;


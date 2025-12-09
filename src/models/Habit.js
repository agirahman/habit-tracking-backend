import mongoose from 'mongoose';

const recordSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  completed: { type: Boolean, default: false },
  duration: { type: Number, default: 0 } // e.g., minutes
});

const habitSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  target: { type: String },
  category: { type: String },
  schedule: { type: String },
  records: [recordSchema],
  createdAt: { type: Date, default: Date.now }
});

const Habit = mongoose.model('Habit', habitSchema);
export default Habit;

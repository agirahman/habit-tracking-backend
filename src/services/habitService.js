import Habit from '../models/Habit.js';
import mongoose from 'mongoose';

const createHabit = async (userId, payload) => {
  const habit = new Habit({ user: userId, ...payload });
  await habit.save();
  return habit;
};

const getHabitsForUser = async (userId) => {
  // Sort by createdAt descending so newest habits appear first
  return Habit.find({ user: userId }).sort({ createdAt: -1 }).lean();
};

const toggleToday = async (userId, habitId, { duration = 0 } = {}) => {
  if (!mongoose.Types.ObjectId.isValid(habitId)) throw new Error('Invalid habit id');
  const habit = await Habit.findOne({ _id: habitId, user: userId });
  if (!habit) throw new Error('Habit not found');

  const today = new Date();
  today.setHours(0,0,0,0);

  let record = habit.records.find(r => {
    const d = new Date(r.date);
    d.setHours(0,0,0,0);
    return d.getTime() === today.getTime();
  });

  if (!record) {
    habit.records.push({ date: today, completed: true, duration });
  } else {
    record.completed = !record.completed;
    if (record.completed) record.duration = duration;
  }

  await habit.save();
  return habit;
};

const updateHabit = async (userId, habitId, payload) => {
  if (!mongoose.Types.ObjectId.isValid(habitId)) throw new Error('Invalid habit id');
  const habit = await Habit.findOneAndUpdate(
    { _id: habitId, user: userId },
    { $set: payload },
    { new: true }
  );
  if (!habit) throw new Error('Habit not found');
  return habit;
};

const deleteHabit = async (userId, habitId) => {
  if (!mongoose.Types.ObjectId.isValid(habitId)) throw new Error('Invalid habit id');
  const res = await Habit.deleteOne({ _id: habitId, user: userId });
  if (res.deletedCount === 0) throw new Error('Habit not found');
  return true;
};

const getSummary = async (userId) => {
  const habits = await Habit.find({ user: userId }).lean();
  // Simple summary: total habits, percent completed today, top/completed count
  const today = new Date();
  today.setHours(0,0,0,0);

  const total = habits.length;
  let completedCount = 0;
  const freq = {};

  habits.forEach(h => {
    const rec = (h.records || []).find(r => {
      const d = new Date(r.date); d.setHours(0,0,0,0); return d.getTime() === today.getTime();
    });
    if (rec && rec.completed) completedCount++;
    const key = h.name;
    freq[key] = (freq[key] || 0) + ((h.records || []).filter(r => r.completed).length);
  });

  const percentToday = total === 0 ? 0 : Math.round((completedCount / total) * 100);

  const top = Object.entries(freq).sort((a,b) => b[1]-a[1]).slice(0,5).map(([name,count]) => ({ name, count }));

  return { total, completedToday: completedCount, percentToday, topHabits: top };
};

export default { createHabit, getHabitsForUser, toggleToday, updateHabit, deleteHabit, getSummary };

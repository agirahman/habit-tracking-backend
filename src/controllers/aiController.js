// src/controllers/aiController.js
import aiService from '../services/aiService.js';
import Habit from '../models/Habit.js';

const getMotivation = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const habits = await Habit.find({ user: userId });
    const motivation = await aiService.getDailyMotivation(habits, req.user.name);
    res.json({ motivation });
  } catch (err) {
    next(err);
  }
};

const suggestHabits = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const habits = await Habit.find({ user: userId });
    const suggestions = await aiService.suggestHabits(habits);
    res.json({ suggestions });
  } catch (err) {
    next(err);
  }
};

export default { getMotivation, suggestHabits };
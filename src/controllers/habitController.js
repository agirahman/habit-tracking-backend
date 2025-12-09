import habitService from '../services/habitService.js';

const create = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const payload = req.body;
    const habit = await habitService.createHabit(userId, payload);
    res.status(201).json(habit);
  } catch (err) {
    next(err);
  }
};

const list = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const habits = await habitService.getHabitsForUser(userId);
    res.json(habits);
  } catch (err) {
    next(err);
  }
};

const toggleToday = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const habitId = req.params.id;
    const { duration } = req.body;
    const habit = await habitService.toggleToday(userId, habitId, { duration });
    res.json(habit);
  } catch (err) {
    next(err);
  }
};

const summary = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const data = await habitService.getSummary(userId);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export default { create, list, toggleToday, summary };

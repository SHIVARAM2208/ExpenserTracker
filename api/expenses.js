const mongoose = require('mongoose');
const Expense = require('../backend/models/Expense');
const { authenticate } = require('../backend/middlewares/authMiddleware');

let conn = null;
async function connectToDatabase() {
  if (!conn) {
    conn = await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  }
}

module.exports = async (req, res) => {
  await connectToDatabase();

  await authenticate(req, res, async () => {
    if (req.method === 'POST') {
      const data = req.body || JSON.parse(req.body || '{}');
      const newExpense = new Expense({
        ...data,
        userId: req.user,
      });
      const saved = await newExpense.save();
      res.status(201).json(saved);
    } else if (req.method === 'GET') {
      const expenses = await Expense.find({ userId: req.user }).sort({ date: -1 });
      res.json(expenses);
    } else if (req.method === 'PUT') {
      const { id, ...updates } = req.body || JSON.parse(req.body || '{}');
      const expense = await Expense.findOneAndUpdate(
        { _id: id, userId: req.user },
        { ...updates, updatedAt: new Date() },
        { new: true }
      );
      if (!expense) return res.status(404).json({ error: 'Expense not found or unauthorized' });
      res.json(expense);
    } else if (req.method === 'DELETE') {
      const { id } = req.body || JSON.parse(req.body || '{}');
      const deleted = await Expense.findOneAndDelete({ _id: id, userId: req.user });
      if (!deleted) return res.status(404).json({ error: 'Expense not found or unauthorized' });
      res.json({ message: 'Expense deleted successfully' });
    } else {
      res.status(405).json({ error: 'Method Not Allowed' });
    }
  });
};

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { Expense, ExpenseCategory } from '../types';
import { categoryIcons } from '../utils/categoryIcons';

interface AddExpenseProps {
  onAddExpense: (expense: {
    title: string;
    amount: number;
    category: string;
    date: string;
    notes?: string;
  }) => Promise<void>;
}

const categories: ExpenseCategory[] = ['Food', 'Business', 'Travel', 'Shopping', 'Health', 'Education', 'Other'];

const AddExpense: React.FC<AddExpenseProps> = ({ onAddExpense }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food' as ExpenseCategory,
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.amount) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const expense = {
        title: formData.title,
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: formData.date,
        notes: formData.notes || undefined
      };

      await onAddExpense(expense); // ✅ Using the prop from App.tsx

      setFormData({
        title: '',
        amount: '',
        category: 'Food',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });

      navigate('/expenses');
    } catch (error) {
      console.error('Error adding expense:', error);
      alert('Error adding expense. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold gradient-text mb-2">Add New Expense</h1>
        <p className="text-muted text-lg">Track your spending by adding a new expense entry</p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="card-glass p-8"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">Title *</label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} className="input-field" required />
          </div>

          {/* Amount + Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium mb-2">Amount (₹) *</label>
              <input type="number" id="amount" name="amount" value={formData.amount} onChange={handleInputChange} className="input-field" required />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-2">Category *</label>
              <select id="category" name="category" value={formData.category} onChange={handleInputChange} className="input-field" required>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {categoryIcons[category]} {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium mb-2">Date *</label>
            <input type="date" id="date" name="date" value={formData.date} onChange={handleInputChange} className="input-field" required />
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium mb-2">Notes</label>
            <textarea id="notes" name="notes" value={formData.notes} onChange={handleInputChange} className="input-field" rows={4} />
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-4">
            <motion.button type="submit" disabled={isSubmitting} className="btn-primary flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              {isSubmitting ? 'Adding Expense...' : '💰 Add Expense'}
            </motion.button>
            <motion.button type="button" onClick={() => navigate('/expenses')} className="btn-outline" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              Cancel
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AddExpense;

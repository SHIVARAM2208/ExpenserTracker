import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Expense, ExpenseCategory } from '../types';
import { categoryIcons, categoryColors } from '../utils/categoryIcons';
import { Link } from 'react-router-dom';

interface ExpenseFilters {
    category?: ExpenseCategory;
    dateFrom?: string;
    dateTo?: string;
    searchQuery?: string;
    sortBy?: 'date' | 'amount' | 'title';
    sortOrder?: 'asc' | 'desc';
}

interface AllExpensesProps {
    expenses: Expense[];
    onUpdateExpense: (id: string, updates: Partial<Expense>) => void;
    onDeleteExpense: (id: string) => void;
}

const categories: ExpenseCategory[] = ['Food', 'Business', 'Travel', 'Shopping', 'Health', 'Education', 'Other'];

const AllExpenses = ({ expenses, onUpdateExpense, onDeleteExpense }: AllExpensesProps) => {
    const [filters, setFilters] = useState<ExpenseFilters>({
        searchQuery: '',
        category: undefined,
        sortBy: 'date',
        sortOrder: 'desc'
    });

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<Expense>>({});

    // Handlers for editing
    const handleSaveEdit = () => {
        if (editingId) {
            onUpdateExpense(editingId, editForm);
            setEditingId(null);
            setEditForm({});
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditForm({});
    };

    // Filter and sort expenses
    const filteredExpenses = useMemo(() => {
        let filtered = expenses;

        // Search filter
        if (filters.searchQuery) {
            filtered = filtered.filter(expense =>
                expense.title.toLowerCase().includes(filters.searchQuery!.toLowerCase()) ||
                expense.notes?.toLowerCase().includes(filters.searchQuery!.toLowerCase())
            );
        }

        // Category filter
        if (filters.category) {
            filtered = filtered.filter(expense => expense.category === filters.category);
        }

        // Sort
        filtered.sort((a, b) => {
            let comparison = 0;

            switch (filters.sortBy) {
                case 'date':
                    comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
                    break;
                case 'amount':
                    comparison = a.amount - b.amount;
                    break;
                case 'title':
                    comparison = a.title.localeCompare(b.title);
                    break;
                default:
                    comparison = 0;
            }

            return filters.sortOrder === 'asc' ? comparison : -comparison;
        });

        return filtered;
    }, [expenses, filters]);

    const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.3
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold gradient-text mb-2">
                        All Expenses
                    </h1>
                    <p className="text-muted">
                        Manage and track all your expenses in one place
                    </p>
                </div>
                <Link to="/add-expense" className="btn-primary w-fit">
                    ➕ Add New Expense
                </Link>
            </div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-glass p-6"
            >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Search */}
                    <div>
                        <input
                            type="text"
                            placeholder="Search expenses..."
                            value={filters.searchQuery}
                            onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                            className="input-field"
                        />
                    </div>

                    {/* Category Filter */}
                    <div>
                        <select
                            value={filters.category || ''}
                            onChange={(e) => setFilters(prev => ({
                                ...prev,
                                category: e.target.value ? e.target.value as ExpenseCategory : undefined
                            }))}
                            className="input-field"
                        >
                            <option value="">All Categories</option>
                            {categories.map(category => (
                                <option key={category} value={category}>
                                    {categoryIcons[category]} {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Sort By */}
                    <div>
                        <select
                            value={filters.sortBy}
                            onChange={(e) => setFilters(prev => ({
                                ...prev,
                                sortBy: e.target.value as 'date' | 'amount' | 'title'
                            }))}
                            className="input-field"
                        >
                            <option value="date">Sort by Date</option>
                            <option value="amount">Sort by Amount</option>
                            <option value="title">Sort by Title</option>
                        </select>
                    </div>

                    {/* Sort Order */}
                    <div>
                        <select
                            value={filters.sortOrder}
                            onChange={(e) => setFilters(prev => ({
                                ...prev,
                                sortOrder: e.target.value as 'asc' | 'desc'
                            }))}
                            className="input-field"
                        >
                            <option value="desc">Newest First</option>
                            <option value="asc">Oldest First</option>
                        </select>
                    </div>
                </div>
            </motion.div>

            {/* Summary */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
                <div className="card-glass p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-muted text-sm font-medium">Total Amount</p>
                            <p className="text-2xl font-bold text-electric-400">
                                ₹{totalAmount.toLocaleString()}
                            </p>
                        </div>
                        <div className="w-10 h-10 bg-gradient-to-r from-electric-500 to-electric-600 rounded-lg flex items-center justify-center">
                            <span className="text-white">💰</span>
                        </div>
                    </div>
                </div>

                <div className="card-glass p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-muted text-sm font-medium">Total Expenses</p>
                            <p className="text-2xl font-bold text-accent-400">
                                {filteredExpenses.length}
                            </p>
                        </div>
                        <div className="w-10 h-10 bg-gradient-to-r from-accent-500 to-accent-600 rounded-lg flex items-center justify-center">
                            <span className="text-white">📊</span>
                        </div>
                    </div>
                </div>

                <div className="card-glass p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-muted text-sm font-medium">Average</p>
                            <p className="text-2xl font-bold text-green-400">
                                ₹{filteredExpenses.length > 0 ? Math.round(totalAmount / filteredExpenses.length) : 0}
                            </p>
                        </div>
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                            <span className="text-white">📈</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Expenses List */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
            >
                <AnimatePresence>
                    {filteredExpenses.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12 card-glass"
                        >
                            <p className="text-muted text-xl mb-4">No expenses found</p>
                            <Link to="/add-expense" className="btn-primary">
                                Add Your First Expense
                            </Link>
                        </motion.div>
                    ) : (
                        filteredExpenses.map((expense) => (
                            <motion.div
                                key={expense.id}
                                variants={itemVariants}
                                layout
                                className="card-glass p-6 hover:bg-primary-800/30 transition-all duration-200"
                            >
                                {editingId === expense.id ? (
                                    // Edit Mode
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <input
                                                type="text"
                                                value={editForm.title || ''}
                                                onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                                                className="input-field"
                                                placeholder="Expense title"
                                            />
                                            <input
                                                type="number"
                                                value={editForm.amount || ''}
                                                onChange={(e) => setEditForm(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
                                                className="input-field"
                                                placeholder="Amount"
                                                step="0.01"
                                            />
                                            <select
                                                value={editForm.category || ''}
                                                onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value as ExpenseCategory }))}
                                                className="input-field"
                                            >
                                                {categories.map(category => (
                                                    <option key={category} value={category}>
                                                        {categoryIcons[category]} {category}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input
                                                type="date"
                                                value={editForm.date || ''}
                                                onChange={(e) => setEditForm(prev => ({ ...prev, date: e.target.value }))}
                                                className="input-field"
                                            />
                                            <input
                                                type="text"
                                                value={editForm.notes || ''}
                                                onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                                                className="input-field"
                                                placeholder="Notes (optional)"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={handleSaveEdit} className="btn-primary px-4 py-2 text-sm">
                                                Save
                                            </button>
                                            <button onClick={handleCancelEdit} className="btn-outline px-4 py-2 text-sm">
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    // View Mode
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${categoryColors[expense.category]} flex items-center justify-center`}>
                                                <span className="text-white text-xl">{categoryIcons[expense.category]}</span>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg">{expense.title}</h3>
                                                <div className="flex items-center space-x-4 text-sm text-muted">
                                                    <span>{expense.category}</span>
                                                    <span>•</span>
                                                    <span>{new Date(expense.date).toLocaleDateString()}</span>
                                                </div>
                                                {expense.notes && (
                                                    <p className="text-sm text-muted mt-1 italic">"{expense.notes}"</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-4">
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-electric-400">
                                                    ₹{expense.amount.toLocaleString()}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setEditingId(expense.id);
                                                    setEditForm({
                                                        title: expense.title,
                                                        amount: expense.amount,
                                                        category: expense.category,
                                                        date: expense.date,
                                                        notes: expense.notes || ''
                                                    });
                                                }}
                                                className="btn-secondary px-3 py-1 text-sm"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => onDeleteExpense(expense.id)}
                                                className="btn-danger px-3 py-1 text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
};

export default AllExpenses;

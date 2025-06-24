import { motion } from 'framer-motion';
import type { Expense, ExpenseCategory } from '../types';
import { categoryIcons, categoryColors } from '../utils/categoryIcons';
import { Link } from 'react-router-dom';

interface CategoryStats {
    category: ExpenseCategory;
    total: number;
    count: number;
    percentage: number;
}

interface DashboardProps {
    expenses: Expense[];
}

const Dashboard = ({ expenses }: DashboardProps) => {
    // Calculate current month's expenses
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });

    const totalMonthlyExpense = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalExpenseCount = monthlyExpenses.length;

    // Calculate category stats
    const categoryStats: CategoryStats[] = [];
    const categoryTotals: Record<string, number> = {};
    const categoryCounts: Record<string, number> = {};

    monthlyExpenses.forEach(expense => {
        categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
        categoryCounts[expense.category] = (categoryCounts[expense.category] || 0) + 1;
    });

    Object.entries(categoryTotals).forEach(([category, total]) => {
        categoryStats.push({
            category: category as ExpenseCategory,
            total,
            count: categoryCounts[category],
            percentage: totalMonthlyExpense > 0 ? (total / totalMonthlyExpense) * 100 : 0
        });
    });

    const topCategories = categoryStats
        .sort((a, b) => b.total - a.total)
        .slice(0, 3);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5
            }
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="text-center">
                <h1 className="text-4xl font-bold gradient-text mb-2">
                    Welcome to Your Dashboard
                </h1>
                <p className="text-muted text-lg">
                    Track and manage your expenses with ease
                </p>
            </motion.div>

            {/* Stats Cards */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Monthly Expense */}
                <div className="card-glass p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-muted text-sm font-medium">Total Monthly Expense</p>
                            <p className="text-3xl font-bold text-electric-400">
                                ₹{totalMonthlyExpense.toLocaleString()}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-r from-electric-500 to-electric-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-xl">💰</span>
                        </div>
                    </div>
                </div>

                {/* Total Expense Count */}
                <div className="card-glass p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-muted text-sm font-medium">Total Expenses</p>
                            <p className="text-3xl font-bold text-accent-400">
                                {totalExpenseCount}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-r from-accent-500 to-accent-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-xl">📊</span>
                        </div>
                    </div>
                </div>

                {/* Average Expense */}
                <div className="card-glass p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-muted text-sm font-medium">Average Expense</p>
                            <p className="text-3xl font-bold text-green-400">
                                ₹{totalExpenseCount > 0 ? Math.round(totalMonthlyExpense / totalExpenseCount) : 0}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-xl">📈</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Category Breakdown */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Category Chart */}
                <div className="card-glass p-6">
                    <h2 className="text-xl font-semibold mb-6 flex items-center">
                        <span className="mr-2">📊</span>
                        Category Breakdown
                    </h2>
                    <div className="space-y-4">
                        {categoryStats.map((stat) => (
                            <div key={stat.category} className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-lg">{categoryIcons[stat.category]}</span>
                                        <span className="font-medium">{stat.category}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-semibold">₹{stat.total.toLocaleString()}</span>
                                        <span className="text-muted text-sm ml-2">({stat.percentage.toFixed(1)}%)</span>
                                    </div>
                                </div>
                                <div className="w-full bg-primary-800 rounded-full h-2">
                                    <motion.div
                                        className={`h-2 rounded-full bg-gradient-to-r ${categoryColors[stat.category]}`}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${stat.percentage}%` }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Categories */}
                <div className="card-glass p-6">
                    <h2 className="text-xl font-semibold mb-6 flex items-center">
                        <span className="mr-2">🏆</span>
                        Top Spending Categories
                    </h2>
                    <div className="space-y-4">
                        {topCategories.map((category, index) => (
                            <motion.div
                                key={category.category}
                                initial={{ x: 50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center justify-between p-4 bg-primary-800/50 rounded-lg"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${categoryColors[category.category]} flex items-center justify-center text-white font-bold`}>
                                        {index + 1}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-lg">{categoryIcons[category.category]}</span>
                                        <span className="font-medium">{category.category}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">₹{category.total.toLocaleString()}</p>
                                    <p className="text-muted text-sm">{category.count} expenses</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={itemVariants} className="card-glass p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                    <span className="mr-2">⚡</span>
                    Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link to="/add-expense" className="btn-primary text-center block">
                        ➕ Add New Expense
                    </Link>
                    <Link to="/expenses" className="btn-secondary text-center block">
                        📋 View All Expenses
                    </Link>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Dashboard;

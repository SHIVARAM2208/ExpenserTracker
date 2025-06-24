import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

interface NavbarProps {
  onLogout: () => void;
  isLoggedIn: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout, isLoggedIn }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/add-expense', label: 'Add Expense', icon: '➕' },
    { path: '/expenses', label: 'All Expenses', icon: '📋' },
  ];

  return (
    <nav className="bg-card-bg/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-electric-500 to-accent-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">💰</span>
            </div>
            <span className="text-xl font-bold gradient-text">ExpenseTracker</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex space-x-1 items-center">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="relative px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
              >
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute inset-0 bg-electric-600/20 rounded-lg"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="text-lg">{item.icon}</span>
                <span className={`relative z-10 font-medium ${location.pathname === item.path
                  ? 'text-electric-400'
                  : 'text-muted hover:text-foreground'
                }`}>
                  {item.label}
                </span>
              </Link>
            ))}

            {/* Logout Button */}
            {isLoggedIn && (
              <button
                onClick={onLogout}
                className="ml-4 px-4 py-2 rounded-lg text-sm bg-red-500 text-white hover:bg-red-600 transition-all"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

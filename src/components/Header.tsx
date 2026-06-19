import { Product, User, CartItem } from '../types';
import { Sun, Moon, ShoppingCart, User as UserIcon, LogOut, ArrowUpRight, Sparkles, Sliders } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  currentUser: User | null;
  onLogout: () => void;
  onTriggerAuth: () => void;
  cart: CartItem[];
  onTriggerCartOpen: () => void;
  isAdmin: boolean;
  onTriggerAdminToggle: () => void;
  showAdminView: boolean;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  logoText: string;
}

export default function Header({ 
  currentUser, onLogout, onTriggerAuth, cart, onTriggerCartOpen, 
  isAdmin, onTriggerAdminToggle, showAdminView, theme, onThemeToggle, logoText 
}: HeaderProps) {
  
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const isDark = theme === 'dark';

  return (
    <header className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors duration-300 ${
      isDark ? 'bg-neutral-900/80 border-neutral-800' : 'bg-white/80 border-neutral-100'
    }`} id="main-site-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        
        {/* Left Side: Logo & Sparkle Header Accent */}
        <div className="flex items-center gap-2">
          {/* Logo Brand Title with Custom Image */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-1.5 focus:outline-none select-none cursor-pointer"
            onClick={() => { if (showAdminView) onTriggerAdminToggle(); }}
          >
            <img 
              src="https://i.postimg.cc/PJ0r8MZs/image-removebg-preview-(9).png" 
              alt="Premium Chrono & Shade" 
              className="h-14 md:h-18 w-auto object-contain transition-all duration-300"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>

        {/* Right Side: Theme, Auth, Cart, Admin Tools */}
        <div className="flex items-center gap-3" id="header-actions">
          
          {/* Theme Switch Slider Button */}
          <button
            id="theme-toggle-btn"
            onClick={onThemeToggle}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isDark 
                ? 'bg-neutral-800 border-neutral-700 text-amber-400 hover:bg-neutral-700' 
                : 'bg-neutral-50 border-neutral-200 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800'
            }`}
            title={isDark ? 'Enable Light Mode' : 'Enable Dark Mode'}
          >
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Cart Icon trigger */}
          {!showAdminView && (
            <button
              id="cart-trigger-btn"
              onClick={onTriggerCartOpen}
              className={`p-2 rounded-xl border relative transition-colors cursor-pointer ${
                isDark 
                  ? 'bg-neutral-800 border-neutral-700 text-white hover:bg-neutral-700' 
                  : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 shadow-xs'
              }`}
            >
              <ShoppingCart size={17} />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] text-[10px] font-sans font-bold flex items-center justify-center rounded-full text-white bg-gradient-to-tr from-emerald-600 to-green-500 shadow-md ring-2 ring-white dark:ring-neutral-900"
                    id="cart-count-badge"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          )}

          {/* Admin Toggle Door (Strict Email Access door) */}
          {isAdmin && (
            <button
              id="admin-view-toggle-btn"
              onClick={onTriggerAdminToggle}
              className={`py-2 px-3 sm:px-4 rounded-xl border font-sans text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                showAdminView
                  ? 'bg-gradient-to-r from-red-600 to-pink-500 border-transparent text-white shadow-md'
                  : 'bg-gradient-to-r from-emerald-500/10 to-green-500/10 hover:from-emerald-500/20 text-emerald-600 dark:text-emerald-405 border-emerald-500/20'
              }`}
            >
              <Sliders size={13} />
              <span className="hidden sm:inline">{showAdminView ? 'Exit Admin View' : 'Admin Panel'}</span>
              <span className="sm:hidden">{showAdminView ? 'Exit' : 'Admin'}</span>
            </button>
          )}

          {/* User Signin Trigger / Profile Logged indicator */}
          {currentUser ? (
            <div className="flex items-center gap-2 border-l pl-3 dark:border-neutral-800 border-neutral-100" id="user-header-profile">
              <div className="flex flex-col items-end text-right hidden md:block">
                <span className={`text-xs font-semibold font-sans leading-none ${
                  isDark ? 'text-white' : 'text-neutral-800'
                }`}>
                  {currentUser.displayName}
                </span>
                <span className="text-[9px] text-neutral-400 font-sans mt-0.5 leading-none">
                  {currentUser.email === 'enath629@gmail.com' ? 'Super Admin' : 'Customer'}
                </span>
              </div>
              
              {/* Log Out option */}
              <button
                id="user-logout-btn"
                onClick={onLogout}
                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                  isDark 
                    ? 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-red-400 hover:bg-neutral-750' 
                    : 'bg-neutral-50 border-neutral-200 text-neutral-500 hover:text-red-650 hover:bg-red-50'
                }`}
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              id="header-login-btn"
              onClick={onTriggerAuth}
              className="py-2 px-3 sm:px-4 rounded-xl font-medium font-sans text-xs ring-1 ring-neutral-200 dark:ring-neutral-700 text-neutral-700 dark:text-neutral-200 bg-transparent hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <UserIcon size={13} />
              <span>Login / Register</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
}

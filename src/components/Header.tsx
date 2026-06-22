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
  searchQuery: string;
  setSearchQuery: (val: string) => void;
}

export default function Header({ 
  currentUser, onLogout, onTriggerAuth, cart, onTriggerCartOpen, 
  isAdmin, onTriggerAdminToggle, showAdminView, theme, onThemeToggle, logoText,
  searchQuery, setSearchQuery
}: HeaderProps) {
  
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const isDark = theme === 'dark';

  return (
    <header className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors duration-300 ${
      isDark ? 'bg-neutral-900/90 border-neutral-800' : 'bg-white/90 border-neutral-100'
    }`} id="main-site-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        
        {/* Left Side Group: Logo & Search */}
        <div className="flex items-center justify-between md:justify-start gap-4 flex-grow">
          {/* Logo Brand Title with Custom Image */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-1.5 focus:outline-none select-none cursor-pointer flex-shrink-0"
            onClick={() => { if (showAdminView) onTriggerAdminToggle(); }}
          >
            <img 
              src="https://i.postimg.cc/PJ0r8MZs/image-removebg-preview-(9).png" 
              alt="Premium Chrono & Shade" 
              className="h-12 md:h-16 w-auto object-contain transition-all duration-300"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          {/* Wide product search bar next to logo */}
          <div className="flex-grow max-w-md relative" id="header-search-container">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="পছন্দের ঘড়ি বা চশমা খুঁজুন... (e.g. Naviforce, Clubmaster)"
              className={`w-full px-3.5 py-2 pl-9 rounded-xl text-xs border-2 focus:outline-none transition-all ${
                isDark 
                  ? 'bg-neutral-900 border-neutral-800 text-white placeholder-neutral-500 focus:border-emerald-500' 
                  : 'bg-[#f4faf8] border-[#cbf5ee]/70 text-neutral-800 placeholder-neutral-450 focus:border-teal-500 focus:bg-white'
              }`}
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </div>
        </div>

        {/* Right Side: Theme, Auth, Cart, Admin Tools */}
        <div className="flex items-center justify-end gap-3" id="header-actions">
          
          {/* Theme Switch Slider Button - Premium Silver/Slate Chrome Bubble */}
          <button
            id="theme-toggle-btn"
            onClick={onThemeToggle}
            className={`p-2 rounded-xl transition-all cursor-pointer border border-t-white/40 border-b-[4px] active:border-b-[1px] active:translate-y-[3px] shadow-sm bg-gradient-to-b text-amber-500 ${
              isDark 
                ? 'from-neutral-700 via-neutral-800 to-neutral-850 border-neutral-600 border-b-neutral-950 hover:bg-neutral-700' 
                : 'from-white via-neutral-50 to-neutral-150 border-neutral-200 border-b-neutral-350 hover:bg-white'
            }`}
            title={isDark ? 'Enable Light Mode' : 'Enable Dark Mode'}
          >
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Cart Icon trigger - Premium Emerald Water Bubble */}
          {!showAdminView && (
            <button
              id="cart-trigger-btn"
              onClick={onTriggerCartOpen}
              className="p-2.5 rounded-full relative transition-all cursor-pointer border border-t-white/40 border-b-[5px] active:border-b-[1.5px] active:translate-y-[3.5px] bg-gradient-to-b from-[#34d399] via-[#059669] to-[#047857] border-[#6ee7b7] border-b-[#022c22] hover:brightness-110 text-white shadow-[0_4px_12px_rgba(5,150,105,0.3)] flex items-center justify-center"
            >
              <ShoppingCart size={17} />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] text-[10px] font-sans font-black flex items-center justify-center rounded-full text-white bg-[#ff5a3c] border-t-white/50 border-b-[3px] border-b-[#a8220d] shadow-md ring-1 ring-white dark:ring-neutral-900"
                    id="cart-count-badge"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          )}

          {/* Admin Toggle Door - Premium Emerald / Coral Toggle */}
          {isAdmin && (
            <button
              id="admin-view-toggle-btn"
              onClick={onTriggerAdminToggle}
              className={`py-2 px-3 sm:px-4 rounded-xl font-sans text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer border border-t-white/40 border-b-[4px] active:border-b-[1px] active:translate-y-[3px] bg-gradient-to-b ${
                showAdminView
                  ? 'from-red-500 via-red-650 to-red-700 border-red-400 border-b-red-900 hover:brightness-115 text-white'
                  : 'from-[#34d399] via-[#059669] to-[#047857] border-[#6ee7b7] border-b-[#022c22] hover:brightness-110 text-white'
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
                <span className={`text-xs font-black font-sans leading-none ${
                  isDark ? 'text-white' : 'text-neutral-800'
                }`}>
                  {currentUser.displayName}
                </span>
                <span className="text-[9px] text-neutral-400 font-sans mt-0.5 leading-none">
                  {currentUser.email === 'enath629@gmail.com' ? 'Super Admin' : 'Customer'}
                </span>
              </div>
              
              {/* Log Out option - Premium Red Coral Water Bubble */}
              <button
                id="user-logout-btn"
                onClick={onLogout}
                className="p-2.5 rounded-full transition-all cursor-pointer border border-t-[1px] border-t-white/40 border-b-[4px] active:border-b-[1px] active:translate-y-[3px] bg-gradient-to-b from-[#ff7a60] via-[#ff5a3c] to-[#e03a1d] border-[#ff8a74] border-b-[#a8220d] hover:brightness-110 text-white"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            /* Login Sign up Premium Emerald Water Bubble button */
            <button
              id="header-login-btn"
              onClick={onTriggerAuth}
              className="py-2.5 px-4 rounded-2xl font-black font-sans text-xs transition-colors cursor-pointer border border-t-[1.5px] border-t-white/40 border-b-[5px] active:border-b-[1.5px] active:translate-y-[3.5px] bg-gradient-to-b from-[#34d399] via-[#059669] to-[#047857] border-[#6ee7b7] border-b-[#022c22] hover:brightness-110 text-white shadow-[0_4px_12px_rgba(5,150,105,0.25)] flex items-center justify-center gap-1.5"
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

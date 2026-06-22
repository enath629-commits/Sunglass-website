import { useState, useEffect } from 'react';
import { 
  Product, CartItem, User, CategoryType, PromoBanner, AdminPermission 
} from './types';
import { DB } from './lib/db';
import Header from './components/Header';
import BannerSlider from './components/BannerSlider';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import AuthModal from './components/AuthModal';
import CartDrawer from './components/CartDrawer';
import AdminPanel from './components/AdminPanel';
import ContactButtons from './components/ContactButtons';
import { 
  Sparkles, ShieldCheck, HeartHandshake, Truck, RotateCcw, 
  HelpCircle, Instagram, Facebook, Youtube, Heart, Eye,
  ArrowDownRight, ShoppingBag
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Theme & Layout Settings
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [activeCategory, setActiveCategory] = useState<CategoryType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Core Global States
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<PromoBanner[]>([]);
  const [admins, setAdmins] = useState<AdminPermission[]>([]);
  const [config, setConfig] = useState<any>({
    logoText: 'CHRONO & SHADE',
    whatsappNumber: '+8801811122233',
    hotlineNumber: '01811122233',
    arrivalsTitle: 'Exclusive Handpicked Designs',
    arrivalsSubtitle: 'LATEST ARRIVALS',
    brandStoryTitle: 'CHRONO & SHADE - Premium Lifestyle Partner',
    brandStorySubtitle: 'Our Craftsmanship',
    brandStoryDescription: 'We believe watches and sunglasses are not merely accessories, but assertions of status and personality. Every chronograph watch and polarized lens is meticulously evaluated by our multi-tier Quality Assurance team. Direct distribution allows us to offer premium products... ',
    themePrimaryColor: '#10b981',
    themeAccentColor: '#f97316'
  });

  // Modal Triggers
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showAdminView, setShowAdminView] = useState(false);
  const [buyNowDirectActive, setBuyNowDirectActive] = useState(false);

  // Sync Initial Setup on mount
  useEffect(() => {
    // Read theme from localStorage
    const savedTheme = localStorage.getItem('__ecommerce_theme__') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme('dark');
    }

    // Read active user session
    const savedUser = localStorage.getItem('__currentUser__');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }

    // Read persistent client shopping cart
    const savedCart = localStorage.getItem('__shopping_cart__');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    // Load initial products, banners, configs & admins from simulated DB
    const loadAppData = async () => {
      const pList = await DB.getProducts();
      setProducts(pList);

      const bList = await DB.getBanners();
      setBanners(bList);

      const aList = await DB.getAdmins();
      setAdmins(aList);

      const dbConfig = await DB.getConfig();
      if (dbConfig) {
        setConfig(dbConfig);
      }
    };

    loadAppData();
    
    // Polling timer to sync edited products or banners in background snappily
    const pollingTimer = setInterval(loadAppData, 4000);
    return () => clearInterval(pollingTimer);
  }, []);

  // Sync html element theme classes instantly
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('__ecommerce_theme__', theme);
  }, [theme]);

  // Handle User Log In / Account Sign Up
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('__currentUser__', JSON.stringify(user));
    setIsAuthOpen(false);
  };

  // Handle Session Log Out
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('__currentUser__');
    setShowAdminView(false);
  };

  // Check if current logged-in email is allowed admin permissions
  const isSuperAdmin = currentUser ? (currentUser.email.toLowerCase() === 'enath629@gmail.com' || currentUser.email.toLowerCase() === 'itzemon670@gmail.com') : false;
  const isHelperAdmin = currentUser ? admins.some(a => a.email.toLowerCase() === currentUser.email.toLowerCase()) : false;
  const isUserAdmin = isSuperAdmin || isHelperAdmin;

  // Add Item to Shopping Cart
  const handleAddToCart = async (product: Product, quantity: number) => {
    let freshCart = [...cart];
    const index = freshCart.findIndex(item => item.product.id === product.id);

    if (index >= 0) {
      freshCart[index].quantity += quantity;
    } else {
      freshCart.push({ product, quantity });
    }

    setCart(freshCart);
    localStorage.setItem('__shopping_cart__', JSON.stringify(freshCart));

    // Emit live car activity log to admin metrics in real-time
    const customerIdentifier = currentUser?.displayName || 'Anonymous Guest';
    await DB.addCartNotification(customerIdentifier, product.name, quantity);

    // Prompt user visually
    setBuyNowDirectActive(false); // Normal add to cart
    setIsCartOpen(true);
  };

  // Direct Instant Purchase Buy Now Flow
  const handleBuyNow = async (product: Product, quantity: number = 1) => {
    let freshCart = [...cart];
    const index = freshCart.findIndex(item => item.product.id === product.id);

    if (index >= 0) {
      // Ensure quantity is updated or set to quantity
      freshCart[index].quantity = Math.max(freshCart[index].quantity, quantity);
    } else {
      freshCart.push({ product, quantity });
    }

    setCart(freshCart);
    localStorage.setItem('__shopping_cart__', JSON.stringify(freshCart));

    // Emit live activity log
    const customerIdentifier = currentUser?.displayName || 'Anonymous Guest';
    await DB.addCartNotification(customerIdentifier, product.name, quantity);

    setBuyNowDirectActive(true); // Flag to open CartDrawer immediately in checkout mode
    setIsCartOpen(true);
  };

  // Update Shopping cart Item quantities
  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    const freshCart = cart.map(item => {
      if (item.product.id === productId) {
        return { ...item, quantity };
      }
      return item;
    });
    setCart(freshCart);
    localStorage.setItem('__shopping_cart__', JSON.stringify(freshCart));
  };

  // Remove individual Item
  const handleRemoveCartItem = (productId: string) => {
    const freshCart = cart.filter(item => item.product.id !== productId);
    setCart(freshCart);
    localStorage.setItem('__shopping_cart__', JSON.stringify(freshCart));
  };

  // Purge cart list upon successful order checkout
  const handleClearCart = () => {
    setCart([]);
    localStorage.removeItem('__shopping_cart__');
  };

  // Search and Category Query Filter matching
  const filteredProducts = products.filter(p => {
    const categoryMatches = activeCategory === 'all' || p.category === activeCategory;
    const searchMatches = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatches && searchMatches;
  });

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen flex flex-col justify-between transition-colors duration-300 ${
      isDark ? 'bg-neutral-950 text-neutral-100' : 'bg-neutral-50/60 text-neutral-800'
    }`} id="ecommerce-app-root">

      {/* Dynamic Admin-Configurable Theme Color Overrides */}
      <style>{`
        .bg-emerald-500, .bg-emerald-600, .bg-emerald-650 {
          background-color: ${config.themePrimaryColor || '#10b981'} !important;
        }
        .text-emerald-500, .text-emerald-600, .text-emerald-405, .text-emerald-400 {
          color: ${config.themePrimaryColor || '#10b981'} !important;
        }
        .border-emerald-500, .border-emerald-650 {
          border-color: ${config.themePrimaryColor || '#10b981'} !important;
        }
        .from-emerald-600, .from-emerald-650 {
          --tw-gradient-from: ${config.themePrimaryColor || '#10b981'} !important;
          --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, ${config.themePrimaryColor || '#10b981'}00) !important;
        }
        .to-green-500 {
          --tw-gradient-to: ${config.themePrimaryColor || '#10b981'}dd !important;
        }
        .text-orange-500, .bg-orange-500, .bg-pink-505, .bg-orange-555 {
          background-color: ${config.themeAccentColor || '#f97316'} !important;
          color: white !important;
        }
        .text-sky-505, .text-orange-500 {
          color: ${config.themeAccentColor || '#f97316'} !important;
        }
      `}</style>
      
      {/* 1. Header Bar */}
      <Header
        currentUser={currentUser}
        onLogout={handleLogout}
        onTriggerAuth={() => setIsAuthOpen(true)}
        cart={cart}
        onTriggerCartOpen={() => setIsCartOpen(true)}
        isAdmin={isUserAdmin}
        onTriggerAdminToggle={() => setShowAdminView(!showAdminView)}
        showAdminView={showAdminView}
        theme={theme}
        onThemeToggle={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        logoText={config.logoText}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* 2. Main content container */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {showAdminView ? (
          
          /* VIEW 1: SUPERIOR ADMIN PANEL DASHBOARD */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            id="admin-dashboard-view"
          >
            <div className="flex items-center gap-2 mb-6 text-red-500 font-extrabold text-sm border-b pb-3 dark:border-neutral-900 border-neutral-250">
              <span className="p-1 px-2.5 rounded-lg bg-red-500 text-white font-sans text-xs">SUPER CONTROL</span>
              <span>You have successfully accessed the back-end system and administrative panel</span>
            </div>
            <AdminPanel
              adminEmail={currentUser?.email || ''}
              adminName={currentUser?.displayName || 'Admin Assistant'}
              theme={theme}
            />
          </motion.div>

        ) : selectedProduct ? (

          /* VIEW 2: DEDICATED INDIVIDUAL PRODUCT PAGE */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-4"
            id="product-page-view"
          >
            <ProductDetail
              product={selectedProduct}
              onClose={() => setSelectedProduct(null)}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              currentUser={currentUser}
              onTriggerAuth={() => setIsAuthOpen(true)}
              theme={theme}
            />
          </motion.div>

        ) : (

          /* VIEW 3: CUSTOMER E-COMMERCE LANDING HUB */
          <div className="space-y-12" id="client-landing-view">
            
            {/* Promo Slider Carousel area */}
            <section id="banner-marketing">
              {banners.length > 0 ? (
                <BannerSlider banners={banners} theme={theme} />
              ) : (
                <div className="h-[200px] sm:h-[350px] w-full rounded-2xl bg-gradient-to-tr from-emerald-650/10 to-green-500/10 animate-pulse flex items-center justify-center border dark:border-neutral-800">
                  <p className="text-xs text-neutral-400">Loading promotional campaigns and seasonal offers...</p>
                </div>
              )}
            </section>

            {/* TRUST CRITERIA BENTO BAR */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4" id="trust-bento-bar">
              {/* Box 1 */}
              <div className={`p-4 rounded-2xl border flex gap-3.5 items-center ${
                isDark ? 'bg-neutral-900/60 border-neutral-900' : 'bg-white border-neutral-100 shadow-xs'
              }`}>
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <Truck size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm">No Advance Booking Fee</h4>
                  <p className="text-[10px] sm:text-[11px] text-neutral-400 mt-0.5">Free delivery nationwide</p>
                </div>
              </div>

              {/* Box 2 */}
              <div className={`p-4 rounded-2xl border flex gap-3.5 items-center ${
                isDark ? 'bg-neutral-900/60 border-neutral-900' : 'bg-white border-neutral-100 shadow-xs'
              }`}>
                <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-500/90 flex items-center justify-center">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm">100% Original Products</h4>
                  <p className="text-[10px] sm:text-[11px] text-neutral-400 mt-0.5">1-Year official warranty</p>
                </div>
              </div>

              {/* Box 3 */}
              <div className={`p-4 rounded-2xl border flex gap-3.5 items-center ${
                isDark ? 'bg-neutral-900/60 border-neutral-900' : 'bg-white border-neutral-100 shadow-xs'
              }`}>
                <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-505 flex items-center justify-center">
                  <RotateCcw size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm">7-Day Free Exchange</h4>
                  <p className="text-[10px] sm:text-[11px] text-neutral-400 mt-0.5">Hassle-free design swaps</p>
                </div>
              </div>

              {/* Box 4 */}
              <div className={`p-4 rounded-2xl border flex gap-3.5 items-center ${
                isDark ? 'bg-neutral-900/60 border-neutral-900' : 'bg-white border-neutral-100 shadow-xs'
              }`}>
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                  <HeartHandshake size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm">Double Cargo Checking</h4>
                  <p className="text-[10px] sm:text-[11px] text-neutral-400 mt-0.5">Open & verify parcel before paying</p>
                </div>
              </div>
            </section>

            {/* CATALOG LIST WITH SEARCH AND CATEGORY FILTER TABS */}
            <section className="space-y-6" id="products-catalog-section">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-baseline md:items-center">
                
                {/* Title and tags */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-extrabold font-sans">
                    <Sparkles size={14} className="animate-spin" />
                    <span>{config.arrivalsSubtitle || 'LATEST ARRIVALS'}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight font-sans">
                    {config.arrivalsTitle || 'Exclusive Handpicked Designs'}
                  </h3>
                </div>

                {/* Filter and Search parameters */}
                <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                  {/* Category select buttons */}
                  <div className={`flex gap-2 p-1.5 rounded-full border ${
                    isDark ? 'bg-neutral-900/60 border-neutral-850' : 'bg-white border-neutral-200/85 shadow-xs'
                  }`}>
                    <button
                      id="category-tab-all"
                      onClick={() => setActiveCategory('all')}
                      className={`px-4.5 py-2.5 rounded-full text-xs font-black transition-all cursor-pointer ${
                        activeCategory === 'all'
                          ? 'bg-gradient-to-b from-[#14b8a6] via-[#0d9488] to-[#0f766e] text-white border border-t-white/40 border-[#2dd4bf] border-b-[5px] border-b-[#0b5f55] shadow-md shadow-teal-500/10'
                          : isDark 
                            ? 'text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full' 
                            : 'text-neutral-600 hover:text-neutral-950 hover:bg-[#eaf8f6] rounded-full'
                      }`}
                    >
                      All Collections
                    </button>
                    <button
                      id="category-tab-watch"
                      onClick={() => setActiveCategory('watch')}
                      className={`px-4.5 py-2.5 rounded-full text-xs font-black transition-all cursor-pointer ${
                        activeCategory === 'watch'
                          ? 'bg-gradient-to-b from-[#14b8a6] via-[#0d9488] to-[#0f766e] text-white border border-t-white/40 border-[#2dd4bf] border-b-[5px] border-b-[#0b5f55] shadow-md shadow-teal-500/10'
                          : isDark 
                            ? 'text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full' 
                            : 'text-neutral-600 hover:text-neutral-950 hover:bg-[#eaf8f6] rounded-full'
                      }`}
                    >
                      Luxury Watches
                    </button>
                    <button
                      id="category-tab-sunglass"
                      onClick={() => setActiveCategory('sunglass')}
                      className={`px-4.5 py-2.5 rounded-full text-xs font-black transition-all cursor-pointer ${
                        activeCategory === 'sunglass'
                          ? 'bg-gradient-to-b from-[#14b8a6] via-[#0d9488] to-[#0f766e] text-white border border-t-white/40 border-[#2dd4bf] border-b-[5px] border-b-[#0b5f55] shadow-md shadow-teal-500/10'
                          : isDark 
                            ? 'text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full' 
                            : 'text-neutral-600 hover:text-neutral-950 hover:bg-[#eaf8f6] rounded-full'
                      }`}
                    >
                      Premium Sunglasses
                    </button>
                  </div>
                </div>
              </div>

              {/* Grid of Product Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6" id="products-catalog-grid">
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                      key={product.id}
                    >
                      <ProductCard
                        product={product}
                        onAddToCart={handleAddToCart}
                        onBuyNow={handleBuyNow}
                        onViewDetails={setSelectedProduct}
                        theme={theme}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {filteredProducts.length === 0 && (
                  <div className="col-span-full py-16 text-center text-neutral-400 space-y-2">
                    <p className="text-sm font-semibold">No matching products found!</p>
                    <p className="text-xs text-neutral-500">Try checking spelling tags or clear filters to view more designs.</p>
                  </div>
                )}
              </div>
            </section>

            {/* BRAND STORY & MANUFACTURING PROMISE SECTION */}
            <section className={`p-6 sm:p-10 rounded-3xl border relative overflow-hidden flex flex-col md:flex-row gap-8 items-center ${
              isDark ? 'bg-neutral-900/40 border-neutral-900/60' : 'bg-white border-neutral-100 shadow-sm'
            }`} id="brand-story-bento">
              {/* Visual Decorative Gradient Glow */}
              <div className="absolute -left-12 -bottom-12 w-96 h-48 bg-emerald-505/10 blur-3xl pointer-events-none" />

              {/* Graphic mock */}
              <div className="w-full md:w-[40%] aspect-[4/3] rounded-2xl overflow-hidden border">
                <img 
                  src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=800" 
                  className="w-full h-full object-cover" 
                  alt="Crafting Luxury watches on workplace Table"
                />
              </div>

              <div className="w-full md:w-[60%] space-y-4 text-xs sm:text-sm">
                <div className="space-y-1.5">
                  <span className="p-1 px-2.5 rounded-lg bg-emerald-500/10 text-emerald-500 font-extrabold text-[10px] uppercase font-sans">
                    {config.brandStorySubtitle || 'Our Craftsmanship'}
                  </span>
                  <h3 className="text-lg sm:text-xl font-black font-sans leading-tight">
                    {config.brandStoryTitle || 'CHRONO & SHADE - Premium Lifestyle Partner'}
                  </h3>
                </div>
                <p className="text-neutral-400 leading-relaxed">
                  {config.brandStoryDescription || 'We believe watches and sunglasses are not merely accessories, but assertions of status and personality. Every chronograph watch and polarized lens is meticulously evaluated by our multi-tier Quality Assurance team. Direct distribution allows us to offer premium products, luxury feels, and flawless utility at unmatched wholesale pricing in the region.'}
                </p>
                <div className="flex gap-4 items-center">
                  <div className="space-y-0.5">
                    <span className="font-sans font-black text-emerald-555 dark:text-emerald-400 text-lg sm:text-xl">10,000+</span>
                    <p className="text-[10px] text-neutral-450 uppercase font-bold text-neutral-400">Happy Customers</p>
                  </div>
                  <div className="space-y-0.5 border-l dark:border-neutral-800 pl-4">
                    <span className="font-sans font-black text-emerald-555 dark:text-emerald-400 text-lg sm:text-xl">10-Stage</span>
                    <p className="text-[10px] text-neutral-450 uppercase font-bold text-neutral-400">Design Quality Controls</p>
                  </div>
                </div>
              </div>
            </section>

          </div>
        )}
      </main>

      {/* 3. Empty slot (previously Product Details Modal Drawer view overlay) */}
      
      {/* 4. Cart Sheet Drawer Overlay */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        currentUser={currentUser}
        onTriggerAuth={() => setIsAuthOpen(true)}
        onClearCart={handleClearCart}
        theme={theme}
        initialCheckoutMode={buyNowDirectActive}
      />

      {/* 5. Authentication Login / Signup Dialog */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleLogin}
        theme={theme}
      />

      {/* 6. Realtime Contact Floating Widgets Tray */}
      {!showAdminView && (
        <ContactButtons
          currentUser={currentUser}
          theme={theme}
          whatsappNumber={config.whatsappNumber}
          hotlineNumber={config.hotlineNumber}
        />
      )}

      {/* 7. Footer brand panel */}
      <footer className={`border-t py-12 ${
        isDark ? 'bg-neutral-950 border-neutral-900 text-neutral-400' : 'bg-neutral-100/50 border-neutral-150 text-neutral-510'
      }`} id="primary-footer-area">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand title */}
          <div className="space-y-4">
            <h4 className={`font-sans font-black tracking-widest text-sm ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              PREMIUM CHRONO & SHADE
            </h4>
            <p className="text-xs leading-relaxed">
              Distributor of high-end luxury designer watches and stylish sunglasses at competitive wholesale rates. Your ultimate reliable destination for cash-on-delivery and check-before-payment.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 rounded-lg bg-neutral-900 hover:text-white border border-neutral-800"><Facebook size={14} /></a>
              <a href="#" className="p-2 rounded-lg bg-neutral-900 hover:text-white border border-neutral-800"><Instagram size={14} /></a>
              <a href="#" className="p-2 rounded-lg bg-neutral-900 hover:text-white border border-neutral-800"><Youtube size={14} /></a>
            </div>
          </div>

          {/* Col 2: Fast Links */}
          <div className="space-y-3.5 text-xs text-neutral-420">
            <h5 className={`font-sans font-bold text-xs uppercase tracking-wider ${isDark ? 'text-white' : 'text-neutral-805'}`}>Customer Care</h5>
            <div className="flex flex-col gap-2">
              <a href="#" className="hover:text-emerald-500 hover:underline">Delivery & Tracking Policy</a>
              <a href="#" className="hover:text-emerald-500 hover:underline">7-Day Swap & Refund Policy</a>
              <a href="#" className="hover:text-emerald-500 hover:underline">Showroom Coordinates</a>
              <a href="#" className="hover:text-emerald-500 hover:underline">Terms & Conditions</a>
            </div>
          </div>

          {/* Col 3: Quick Contact direct parameters */}
          <div className="space-y-3.5 text-xs">
            <h5 className={`font-sans font-bold text-xs uppercase tracking-wider ${isDark ? 'text-white' : 'text-neutral-805'}`}>Official Support</h5>
            <div className="space-y-2">
              <p>Hotline: <b className="font-sans text-neutral-300 dark:text-emerald-405">{config.hotlineNumber}</b></p>
              <p>Office Address: Sector-10, Uttara Model Town, Dhaka-1230, Bangladesh.</p>
              <p>Company Email: info@chronoshades.com</p>
            </div>
          </div>

          {/* Col 4: Secured Payment logo grid */}
          <div className="space-y-4 text-xs">
            <h5 className={`font-sans font-bold text-xs uppercase tracking-wider ${isDark ? 'text-white' : 'text-neutral-805'}`}>Secure Payments</h5>
            <p className="text-[11px] leading-relaxed">
              We proudly support secure merchant bKash, Nagad, Rocket wallets, and cash on delivery for absolute convenience.
            </p>
            {/* Minimalist vector layout representing Bkash, Nagad, Rocket, COD */}
            <div className="flex gap-2 flex-wrap" id="secured-payments-badge">
              <span className="p-1 px-2.5 font-sans font-bold text-[9px] bg-pink-505 text-white rounded-lg uppercase">bKash</span>
              <span className="p-1 px-2.5 font-sans font-bold text-[9px] bg-orange-555 text-white rounded-lg uppercase">Nagad</span>
              <span className="p-1 px-2.5 font-sans font-bold text-[9px] bg-purple-655 text-white rounded-lg uppercase">Rocket</span>
              <span className="p-1 px-2.5 font-sans font-bold text-[9px] bg-emerald-600 text-white rounded-lg uppercase">COD</span>
            </div>
          </div>

        </div>

        {/* copyright foot indicator branding with superadmin secret route advice */}
        <div className="mt-12 pt-6 border-t border-neutral-900 text-center text-[10px] text-neutral-500 px-4">
          <p>© {new Date().getFullYear()} Chrono & Shade Inc. All rights reserved. Designed & Hosted by Creative Wings.</p>
          <p className="mt-1.5 opacity-60">Admin Entry: Access admin controls by logging in with super admin email: <b>itzemon670@gmail.com</b> </p>
        </div>
      </footer>
    </div>
  );
}

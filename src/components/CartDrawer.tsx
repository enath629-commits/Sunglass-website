import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Trash2, ShoppingBag, ShieldCheck, CreditCard, 
  ChevronRight, ArrowRight, CornerDownRight, HeartHandshake, HelpCircle 
} from 'lucide-react';
import { CartItem, User, PaymentMethodType, Order } from '../types';
import { DB } from '../lib/db';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  currentUser: User | null;
  onTriggerAuth: () => void;
  onClearCart: () => void;
  theme: 'light' | 'dark';
  config?: any;
  initialCheckoutMode?: boolean;
}

export default function CartDrawer({
  isOpen, onClose, cart, onUpdateQuantity, onRemoveItem, 
  currentUser, onTriggerAuth, onClearCart, theme, config,
  initialCheckoutMode = false
}: CartDrawerProps) {
  const [isCheckoutMode, setIsCheckoutMode] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState<'inside' | 'outside'>('outside');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('cod');
  const [paymentNumber, setPaymentNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [orderName, setOrderName] = useState('');
  const [orderPhone, setOrderPhone] = useState('');
  const [orderedSuccess, setOrderedSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Sync user values if logged in
  React.useEffect(() => {
    if (currentUser) {
      setOrderName(currentUser.displayName);
      setOrderPhone(currentUser.phoneNumber || '');
    }
  }, [currentUser]);

  // Sync checkout mode and success state status when opens
  React.useEffect(() => {
    if (isOpen) {
      if (initialCheckoutMode) {
        setIsCheckoutMode(true);
      } else {
        setIsCheckoutMode(false);
      }
      setOrderedSuccess(null);
    }
  }, [isOpen, initialCheckoutMode]);

  const insideDhakaCharge = config?.deliveryChargeInsideDhaka !== undefined ? Number(config.deliveryChargeInsideDhaka) : 80;
  const outsideDhakaCharge = config?.deliveryChargeOutsideDhaka !== undefined ? Number(config.deliveryChargeOutsideDhaka) : 120;
  const deliveryCharge = deliveryLocation === 'inside' ? insideDhakaCharge : outsideDhakaCharge;

  const itemsTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const grandTotal = itemsTotal + deliveryCharge;

  const handleAddressChange = (addressText: string) => {
    setShippingAddress(addressText);
    const lowerText = addressText.toLowerCase();
    const insideKeywords = [
      'dhaka', 'daka', 'ঢাকা', 'উত্তরা', 'uttara', 'মিরপুর', 'mirpur', 'ধানমন্ডি', 'dhanmondi',
      'গুলশান', 'gulshan', 'বনানী', 'banani', 'খিলগাঁও', 'khilgaon', 'মতিঝিল', 'motijheel',
      'মোহাম্মদপুর', 'mohammadpur', 'যাত্রাবাড়ী', 'যাত্রাবাড়ি', 'jatrabari', 'বাড্ডা', 'badda',
      'তেজগাঁও', 'tejgaon', 'রমনা', 'ramna', 'শাহবাগ', 'shahbag', 'পল্টন', 'paltan', 'খিলক্ষেত', 'khilkhet'
    ];
    const isInsideDhaka = insideKeywords.some(keyword => lowerText.includes(keyword));
    if (isInsideDhaka) {
      setDeliveryLocation('inside');
    } else {
      setDeliveryLocation('outside');
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!shippingAddress.trim() || !orderName.trim() || !orderPhone.trim()) {
      alert('Please fill out all contact and address fields correctly!');
      return;
    }

    setSubmitting(true);

    const generatedOrderId = 'ord-' + Math.floor(1000 + Math.random() * 9000);

    const newOrder: Order = {
      id: generatedOrderId,
      userId: currentUser.uid,
      userName: orderName,
      userEmail: currentUser.email,
      userPhone: orderPhone,
      shippingAddress: shippingAddress.trim(),
      items: cart.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        image: item.product.images[0],
        price: item.product.price,
        quantity: item.quantity
      })),
      totalAmount: grandTotal,
      paymentMethod: paymentMethod,
      paymentNumber: paymentMethod !== 'cod' ? paymentNumber : undefined,
      transactionId: paymentMethod !== 'cod' ? transactionId : undefined,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // Save actual order records
    setTimeout(async () => {
      const ok = await DB.createOrder(newOrder);
      if (ok) {
        setOrderedSuccess(generatedOrderId);
        onClearCart();
        setIsCheckoutMode(false);
        setShippingAddress('');
        setPaymentNumber('');
        setTransactionId('');
      }
      setSubmitting(false);
    }, 1500);
  };

  const isDark = theme === 'dark';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" id="cart-drawer-overlay">
          {/* Backdrop screen */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
          />

          {/* Drawer sheet container */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`w-screen max-w-md h-full flex flex-col justify-between shadow-2xl border-l relative ${
                isDark 
                  ? 'bg-neutral-900 border-neutral-800 text-white' 
                  : 'bg-white border-neutral-150 text-neutral-805'
              }`}
              id="cart-drawer-sheet"
            >
              {/* Green Glow decoration */}
              <div className="absolute top-0 right-0 w-80 h-32 bg-emerald-505/5 blur-3xl pointer-events-none" />

              {/* Drawer Header */}
              <div className={`p-5 flex items-center justify-between border-b ${
                isDark ? 'border-neutral-805' : 'border-neutral-100'
              }`}>
                <div className="flex items-center gap-2">
                  <ShoppingBag className="text-emerald-500" size={18} />
                  <h3 className="font-sans font-bold text-sm sm:text-base">
                    {isCheckoutMode ? 'Secure Checkout Cashier' : 'Your Shopping Cart'}
                  </h3>
                </div>
                <button
                  id="cart-close-cross-btn"
                  onClick={onClose}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isDark ? 'hover:bg-neutral-800 text-neutral-400' : 'hover:bg-neutral-100 text-neutral-500'
                  }`}
                >
                  <X size={18} />
                </button>
              </div>

              {/* ORDER SUBMITTED SUCCESS WINDOW */}
              {orderedSuccess ? (
                <div className="flex-grow p-6 flex flex-col justify-center items-center text-center space-y-4" id="checkout-success">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center animate-bounce mb-2">
                     <ShieldCheck size={40} />
                  </div>
                  <div className="space-y-1">
                    <h4 className={`font-sans font-extrabold text-base sm:text-lg ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                      Order Placed Successfully!
                    </h4>
                    <p className="text-xs text-neutral-400 leading-normal max-w-sm">
                      Thank you! Your premium product order receipt ID is <b>{orderedSuccess}</b>. Our customer support team will contact you shortly to confirm your delivery coordinates.
                    </p>
                  </div>
                  <div className="pt-2 w-full max-w-[250px]">
                    <button
                      id="order-success-continue-btn"
                      onClick={() => {
                        setOrderedSuccess(null);
                        onClose();
                      }}
                      className="w-full py-2.5 rounded-full text-xs sm:text-sm font-black text-white bg-gradient-to-b from-[#14b8a6] via-[#0d9488] to-[#0f766e] border border-t-white/50 border-[#2dd4bf] border-b-[5px] border-b-[#0b5f55] active:border-b-[1.5px] active:translate-y-[3px] shadow-[0_4px_12px_rgba(20,184,166,0.3)] cursor-pointer transition-all"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              ) : isCheckoutMode ? (
                /* CHECKOUT ENTRY MODE SCREEN */
                <form onSubmit={handleCheckoutSubmit} className="flex-grow flex flex-col justify-between h-full overflow-hidden" id="checkout-entry-form">
                  <div className="flex-grow overflow-y-auto p-5 space-y-4" id="checkout-scroller">
                    <button
                      type="button"
                      onClick={() => setIsCheckoutMode(false)}
                      className="text-xs text-emerald-500 hover:underline flex items-center gap-1 font-semibold"
                    >
                      ← Return to Cart List
                    </button>

                    {/* Personal Info inputs */}
                    <div className="space-y-3">
                      <h4 className={`font-semibold text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400`}>1. Contact & Shipping Details</h4>
                      <div className="space-y-2">
                        <input
                          type="text"
                          required
                          value={orderName}
                          onChange={(e) => setOrderName(e.target.value)}
                          placeholder="Your Name *"
                          className={`w-full p-2.5 rounded-xl text-xs border focus:outline-none focus:bg-white transition-all ${
                            isDark ? 'bg-neutral-805 border-neutral-700 text-white focus:border-emerald-500' : 'bg-neutral-50 border-neutral-200 text-neutral-805 focus:border-emerald-600'
                          }`}
                        />
                        <input
                          type="tel"
                          required
                          value={orderPhone}
                          onChange={(e) => setOrderPhone(e.target.value)}
                          placeholder="Phone Number (e.g. 017xxxxxxxx) *"
                          className={`w-full p-2.5 rounded-xl text-xs border focus:outline-none focus:bg-white transition-all ${
                            isDark ? 'bg-neutral-805 border-neutral-700 text-white focus:border-emerald-500' : 'bg-neutral-50 border-neutral-200 text-neutral-805 focus:border-emerald-600'
                          }`}
                        />
                        <div className="space-y-2">
                          <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                            Full Delivery Address * (লোকেশন অনুযায়ী ডেলিভারি চার্জ অটো সেট হবে)
                          </label>
                          <textarea
                            required
                            rows={3}
                            value={shippingAddress}
                            onChange={(e) => handleAddressChange(e.target.value)}
                            placeholder="ঠিকানাঃ বাড়ি নং, রোড নং, এলাকা এবং জেলা লিখুন... (যেমন: মিরপুর ২, ঢাকা) *"
                            className={`w-full p-3 rounded-xl text-sm font-semibold border-2 focus:outline-none transition-all ${
                              isDark 
                                ? 'bg-neutral-900 border-neutral-750 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/25 placeholder-neutral-500' 
                                : 'bg-white border-neutral-300 text-neutral-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 placeholder-neutral-400'
                            }`}
                            id="shipping-address-input-bold"
                          />
                          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                            <span>💡 প্রো-টিপঃ</span>
                            <span>আপনার ঠিকানায় 'ঢাকা' বা 'Dhaka' থাকলে অটো ঢাকার ভেতরে (৳{insideDhakaCharge}) চার্জ হবে, অন্যথায় ঢাকার বাইরে (৳{outsideDhakaCharge}) সেট হবে।</span>
                          </p>
                        </div>

                        {/* Manual override buttons layout */}
                        <div className="space-y-1.5 pt-1">
                          <span className="block text-[11px] font-bold text-neutral-400 uppercase">
                            ডেলিভারি এরিয়াঃ (ম্যানুয়ালি নির্বাচনও করতে পারবেন)
                          </span>
                          <div className="grid grid-cols-2 gap-2" id="delivery-location-override-grid">
                            <button
                              type="button"
                              onClick={() => setDeliveryLocation('inside')}
                              className={`p-2.5 rounded-xl border-2 flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
                                deliveryLocation === 'inside'
                                  ? 'border-emerald-500 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 font-extrabold ring-1 ring-emerald-500/20'
                                  : isDark ? 'border-neutral-800 bg-neutral-850 text-neutral-400 hover:bg-neutral-800' : 'border-neutral-200 bg-white text-neutral-510 hover:bg-neutral-50'
                              }`}
                            >
                              <span className="text-[10px] font-sans">Inside Dhaka</span>
                              <span className="text-xs font-bold font-sans">৳{insideDhakaCharge}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setDeliveryLocation('outside')}
                              className={`p-2.5 rounded-xl border-2 flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
                                deliveryLocation === 'outside'
                                  ? 'border-emerald-500 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 font-extrabold ring-1 ring-emerald-500/20'
                                  : isDark ? 'border-neutral-800 bg-neutral-850 text-neutral-400 hover:bg-neutral-800' : 'border-neutral-200 bg-white text-neutral-510 hover:bg-neutral-50'
                              }`}
                            >
                              <span className="text-[10px] font-sans">Outside Dhaka</span>
                              <span className="text-xs font-bold font-sans">৳{outsideDhakaCharge}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>                    {/* Payment methods list */}
                    <div className="space-y-3 pt-2">
                      <h4 className={`font-semibold text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400`}>2. Payment Method</h4>
                      
                      <div className="grid grid-cols-2 gap-2" id="payment-gateways-grid">
                        <button
                          type="button"
                          id="pay-method-cod"
                          onClick={() => setPaymentMethod('cod')}
                          className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all text-xs font-bold cursor-pointer ${
                            paymentMethod === 'cod' 
                              ? 'border-emerald-500 bg-emerald-505/5 text-emerald-550 dark:text-emerald-400 ring-2 ring-emerald-500/20' 
                              : isDark ? 'border-neutral-800 bg-neutral-850 hover:bg-neutral-800' : 'border-neutral-200 bg-white hover:bg-neutral-50'
                          }`}
                        >
                          <img 
                            src="https://i.postimg.cc/hGgRC643/OIP-removebg-preview.png" 
                            alt="Cash on Delivery" 
                            className="h-7 object-contain rounded-md"
                          />
                          <span>Cash on Delivery</span>
                        </button>

                        <button
                          type="button"
                          id="pay-method-bkash"
                          onClick={() => setPaymentMethod('bkash')}
                          className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all text-xs font-bold cursor-pointer ${
                            paymentMethod === 'bkash' 
                              ? 'border-pink-500 bg-pink-500/5 text-pink-505 ring-2 ring-pink-500/20' 
                              : isDark ? 'border-neutral-800 bg-neutral-850 hover:bg-neutral-800' : 'border-neutral-200 bg-white hover:bg-neutral-50'
                          }`}
                        >
                          <img 
                            src="https://i.postimg.cc/xTCC5kpP/download-removebg-preview.png" 
                            alt="bKash" 
                            className="h-7 object-contain rounded-md"
                          />
                          <span>bKash Wallet</span>
                        </button>

                        <button
                          type="button"
                          id="pay-method-nagad"
                          onClick={() => setPaymentMethod('nagad')}
                          className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all text-xs font-bold cursor-pointer ${
                            paymentMethod === 'nagad' 
                              ? 'border-orange-500 bg-orange-500/5 text-orange-600 dark:text-orange-400 ring-2 ring-orange-500/20' 
                              : isDark ? 'border-neutral-800 bg-neutral-850 hover:bg-neutral-800' : 'border-neutral-200 bg-white hover:bg-neutral-50'
                          }`}
                        >
                          <img 
                            src="https://i.postimg.cc/Gp0mbXL6/download-removebg-preview-(1).png" 
                            alt="Nagad" 
                            className="h-7 object-contain rounded-md"
                          />
                          <span>Nagad Wallet</span>
                        </button>

                        <button
                          type="button"
                          id="pay-method-rocket"
                          onClick={() => setPaymentMethod('rocket')}
                          className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all text-xs font-bold cursor-pointer ${
                            paymentMethod === 'rocket' 
                              ? 'border-purple-500 bg-purple-500/5 text-purple-600 dark:text-purple-400 ring-2 ring-purple-500/20' 
                              : isDark ? 'border-neutral-800 bg-neutral-850 hover:bg-neutral-800' : 'border-neutral-200 bg-white hover:bg-neutral-50'
                          }`}
                        >
                          <img 
                            src="https://i.postimg.cc/W4PTBt8Z/image-removebg-preview-(10).png" 
                            alt="Rocket" 
                            className="h-7 object-contain rounded-md"
                          />
                          <span>Rocket Wallet</span>
                        </button>
                      </div>
                    </div>

                    {/* Instructions display for payment method */}
                    <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
                      paymentMethod === 'cod' 
                        ? 'bg-emerald-500/5 border-emerald-500/10 text-neutral-300' 
                        : 'bg-neutral-500/5 border-neutral-500/10 text-neutral-300'
                    }`} id="payment-instructions">
                      {paymentMethod === 'cod' ? (
                        <div className="space-y-1">
                          <p className="font-bold text-emerald-500">✓ Cash on Delivery (COD)</p>
                          <p className="text-neutral-400">Our delivery personnel will hand over the product at your doorstep. Inspect the items thoroughly before making payment. Cash on delivery has zero advance fees!</p>
                        </div>
                      ) : (
                        <div className="space-y-3.5">
                          <div>
                            <p className="font-bold flex items-center gap-1">
                              <span>Payment Guideline:</span>
                              <span className="text-[10px] font-sans font-black text-emerald-555 dark:text-emerald-400">{paymentMethod.toUpperCase()}</span>
                            </p>
                            <p className="text-neutral-400 mt-1">Please transfer the total of <b className="text-yellow-501 font-sans">৳{grandTotal.toLocaleString('en-US')}</b> to our official merchant wallet <b className="text-yellow-501 font-sans">01800-000000</b> (send money or merchant payment), then submit your wallet account details below.</p>
                          </div>

                          <div className="space-y-2">
                            <input
                              type="tel"
                              required
                              value={paymentNumber}
                              onChange={(e) => setPaymentNumber(e.target.value)}
                              placeholder={`Enter your 11-digit ${paymentMethod === 'bkash' ? 'bKash' : paymentMethod === 'nagad' ? 'Nagad' : 'Rocket'} number *`}
                              className={`w-full p-2 rounded-xl border focus:outline-none text-[11px] ${
                                isDark ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-white border-neutral-200 text-neutral-805'
                              }`}
                            />
                            <input
                              type="text"
                              required
                              value={transactionId}
                              onChange={(e) => setTransactionId(e.target.value)}
                              placeholder="Transaction ID (from transaction SMS / app confirmation) *"
                              className={`w-full p-2 rounded-xl border focus:outline-none text-[11px] ${
                                isDark ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-white border-neutral-200 text-neutral-805'
                              }`}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Place Order bottom action */}
                  <div className={`p-5 border-t space-y-4 bg-neutral-500/5 ${isDark ? 'border-neutral-800' : 'border-neutral-105'}`} id="checkout-action-footer">
                    <div className="space-y-1.5 text-xs text-neutral-450 dark:text-neutral-400">
                      <div className="flex justify-between">
                        <span>পণ্যের মোট মূল্য (Subtotal):</span>
                        <span className="font-semibold font-sans">৳{itemsTotal.toLocaleString('en-US')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ডেলিভারি চার্জ ({deliveryLocation === 'inside' ? 'ঢাকার ভেতরে' : 'ঢাকার বাইরে'}):</span>
                        <span className="font-semibold font-sans text-emerald-550 dark:text-emerald-400">৳{deliveryCharge.toLocaleString('en-US')}</span>
                      </div>
                      <div className={`border-t my-1 ${isDark ? 'border-neutral-800' : 'border-neutral-200'}`} />
                      <div className="flex justify-between items-baseline pt-0.5">
                        <span className={`font-bold ${isDark ? 'text-white' : 'text-neutral-800'}`}>সর্বমোট (Grand Total):</span>
                        <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-sans">৳{grandTotal.toLocaleString('en-US')}</span>
                      </div>
                    </div>

                    <button
                      id="place-checkout-order-btn"
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 rounded-2xl font-black font-sans text-xs sm:text-sm text-white select-none transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 border border-t-[1.5px] border-t-white/50 border-[#6ee7b7] border-b-[5px] border-b-[#022c22] shadow-md bg-gradient-to-b from-[#34d399] via-[#059669] to-[#047857] hover:brightness-110 active:border-b-[1.5px] active:translate-y-[4px]"
                    >
                      {submitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Confirm Order (৳{grandTotal.toLocaleString('en-US')})</span>
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                /* SHOPPING CART LIST ITEMS DISPLAY SCREEN */
                <div className="flex-grow flex flex-col justify-between h-full overflow-hidden" id="cart-list-view">
                  {cart.length > 0 ? (
                    <>
                      {/* Products feed */}
                      <div className="flex-grow overflow-y-auto p-5 space-y-4" id="cart-items-feed">
                        {cart.map((item) => (
                          <div
                            key={item.product.id}
                            id={`cart-item-${item.product.id}`}
                            className={`p-3.5 rounded-xl border flex gap-3 transition-colors ${
                              isDark ? 'bg-neutral-905 border-neutral-850' : 'bg-neutral-50/50 border-neutral-150 shadow-xs'
                            }`}
                          >
                            <div className="w-16 h-16 rounded-xl overflow-hidden border flex-shrink-0">
                              <img src={item.product.images[0]} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                            </div>

                            <div className="flex-grow flex flex-col justify-between min-w-0">
                              <div className="flex justify-between items-start gap-2">
                                <h4 className={`text-xs sm:text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-neutral-800'}`}>
                                  {item.product.name}
                                </h4>
                                <button
                                  id={`remove-cart-item-${item.product.id}`}
                                  onClick={() => onRemoveItem(item.product.id)}
                                  className="text-neutral-400 hover:text-red-500 p-0.5 rounded transition-all cursor-pointer"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>

                              <div className="flex justify-between items-center mt-2">
                                {/* Small quantitier */}
                                <div className={`flex items-center gap-2 rounded-lg border p-1 ${
                                  isDark ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'
                                }`}>
                                  <button
                                    id={`dec-qty-${item.product.id}`}
                                    onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                                    className="w-5 h-5 text-xs text-neutral-400 hover:text-white rounded flex items-center justify-center"
                                  >
                                    -
                                  </button>
                                  <span className="text-[11px] font-bold font-sans">{item.quantity}</span>
                                  <button
                                    id={`inc-qty-${item.product.id}`}
                                    onClick={() => onUpdateQuantity(item.product.id, Math.min(item.product.stock, item.quantity + 1))}
                                    className="w-5 h-5 text-xs text-neutral-400 hover:text-white rounded flex items-center justify-center"
                                  >
                                    +
                                  </button>
                                </div>

                                <span className="text-xs font-bold text-emerald-555 dark:text-emerald-400">
                                  ৳{(item.product.price * item.quantity).toLocaleString('en-US')}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Footer & Checkout actions */}
                      <div className={`p-5 border-t space-y-4 bg-neutral-500/5 ${isDark ? 'border-neutral-800' : 'border-neutral-105'}`} id="cart-footer-actions">
                        <div className="flex justify-between items-baseline">
                          <span className="text-xs text-neutral-400">Subtotal (পণ্যের মোট মূল্য):</span>
                          <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-sans">৳{itemsTotal.toLocaleString('en-US')}</span>
                        </div>

                        {currentUser ? (
                          <button
                            id="proceed-checkout-btn"
                            onClick={() => setIsCheckoutMode(true)}
                            className="w-full py-3.5 rounded-2xl font-black font-sans text-xs sm:text-sm text-white select-none transition-all flex items-center justify-center gap-2 cursor-pointer border border-t-[1.5px] border-t-white/50 border-[#6ee7b7] border-b-[5px] border-b-[#022c22] shadow-md bg-gradient-to-b from-[#34d399] via-[#059669] to-[#047857] hover:brightness-110 active:border-b-[1.5px] active:translate-y-[4px]"
                          >
                            <span>Proceed to Secure Checkout</span>
                            <ChevronRight size={16} />
                          </button>
                        ) : (
                          <div className="space-y-2.5 text-center" id="cart-auth-required-footer">
                            <p className="text-[10px] leading-relaxed text-neutral-400">
                              Please register or login to securely place your order.
                            </p>
                            <button
                              id="cart-login-btn"
                              onClick={onTriggerAuth}
                              className="w-full py-2.5 rounded-2xl text-xs font-black cursor-pointer transition-all flex items-center justify-center gap-1 border border-t-white/50 border-[#6ee7b7] border-b-[4px] border-b-[#022c22] active:border-b-[1px] active:translate-y-[3px] shadow-sm bg-gradient-to-b from-[#34d399] via-[#059669] to-[#047857] text-white hover:brightness-110"
                            >
                              <span>Register / Login</span>
                              <CornerDownRight size={13} />
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="flex-grow p-6 flex flex-col justify-center items-center text-center space-y-4" id="empty-cart-view">
                      <div className="p-4 bg-neutral-500/5 text-neutral-400 rounded-full">
                        <ShoppingBag size={40} className="stroke-1" />
                      </div>
                      <div className="space-y-1">
                        <h4 className={`font-semibold text-xs sm:text-sm ${isDark ? 'text-white' : 'text-neutral-800'}`}>Your shopping cart is empty</h4>
                        <p className="text-[11px] text-neutral-400 max-w-xs px-4">Browse our premium watch and sunglasses collection to select items.</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

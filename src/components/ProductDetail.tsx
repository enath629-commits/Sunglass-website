import React, { useState, useEffect } from 'react';
import { Product, Review, User } from '../types';
import { DB } from '../lib/db';
import { 
  Star, ArrowLeft, ShieldCheck, Truck, RefreshCw, 
  MessageSquarePlus, Sparkles, UserCheck, ChevronRight, CornerDownRight,
  ShoppingCart
} from 'lucide-react';
import { motion } from 'motion/react';

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow?: (product: Product, quantity: number) => void;
  currentUser: User | null;
  onTriggerAuth: () => void;
  theme: 'light' | 'dark';
}

export default function ProductDetail({ 
  product, onClose, onAddToCart, onBuyNow, currentUser, onTriggerAuth, theme 
}: ProductDetailProps) {
  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [comment, setComment] = useState('');
  const [ratingInput, setRatingInput] = useState(5);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState('');
  const [loadingReview, setLoadingReview] = useState(false);

  // Sync reviews dynamically
  useEffect(() => {
    let active = true;
    const fetchReviews = async () => {
      const data = await DB.getReviews(product.id);
      if (active) {
        setReviews(data.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      }
    };
    fetchReviews();
    // Poll for real-time review additions every 3 seconds
    const interval = setInterval(fetchReviews, 3000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [product.id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!comment.trim()) return;

    setLoadingReview(true);
    const newReview: Review = {
      id: 'rev-' + Math.random().toString(36).substring(2, 9),
      productId: product.id,
      userName: currentUser.displayName,
      rating: ratingInput,
      comment: comment.trim(),
      createdAt: new Date().toISOString()
    };

    const ok = await DB.addReview(newReview);
    if (ok) {
      setReviews((prev) => [newReview, ...prev]);
      setComment('');
      setReviewSuccessMsg('Your review has been successfully published!');
      // Update local product rate slightly to reflect in detail view too
      product.rating = parseFloat(((product.rating * reviews.length + ratingInput) / (reviews.length + 1)).toFixed(1));
      setTimeout(() => setReviewSuccessMsg(''), 4000);
    }
    setLoadingReview(false);
  };

  const isDark = theme === 'dark';

  return (
    <div className="space-y-8" id="product-detail-view">
      {/* Navigation & Header Actions */}
      <button
        id="detail-back-btn"
        onClick={onClose}
        className={`group py-2 px-4 rounded-xl text-neutral-400 font-medium text-xs flex items-center gap-2 border transition-colors ${
          isDark ? 'border-neutral-800 bg-neutral-900/60 hover:bg-neutral-855 hover:text-white' : 'border-neutral-200 bg-white hover:bg-neutral-50 hover:text-neutral-900 shadow-sm'
        }`}
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
        <span>Back to Home</span>
      </button>

      {/* Hero Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Pictures Stage */}
        <div className="col-span-1 lg:col-span-6 flex flex-col gap-4">
          <motion.div
            layoutId={`product-image-${product.id}`}
            className={`aspect-square overflow-hidden rounded-2xl border flex items-center justify-center ${
              isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-neutral-50/50 border-neutral-100'
            }`}
          >
            <img
              src={activeImage}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-300"
              id="detail-main-image"
            />
          </motion.div>

          {/* Sub-thumbnails (only if product has > 1 image) */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto py-1" id="detail-thumbnails">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  id={`thumbnail-btn-${index}`}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-20 aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                    activeImage === img 
                      ? 'border-emerald-500 scale-102 ring-2 ring-emerald-500/10' 
                      : isDark ? 'border-neutral-800 hover:border-neutral-700' : 'border-neutral-100 hover:border-neutral-300'
                  }`}
                >
                  <img src={img} alt="Thumbnail view" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Configurations Details */}
        <div className="col-span-1 lg:col-span-6 flex flex-col space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 dark:text-emerald-400">
              {product.category === 'watch' ? "Men's Premium Watch" : 'Fashionable Premium Sunglasses'}
            </span>
            <h1 className={`font-sans font-extrabold tracking-tight text-xl sm:text-2xl md:text-3xl ${
              isDark ? 'text-white' : 'text-neutral-900'
            }`}>
              {product.name}
            </h1>

            {/* Ratings Breakdown row */}
            <div className="flex items-center gap-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                    className="opacity-95"
                  />
                ))}
              </div>
              <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-neutral-800'}`}>
                {product.rating}
              </span>
              <span className="text-xs text-neutral-400">({reviews.length} Verified Customer Review{reviews.length !== 1 ? 's' : ''})</span>
            </div>
          </div>

          {/* Pricing Stage */}
          <div className={`p-4 rounded-2xl flex items-center justify-between ${
            isDark ? 'bg-neutral-900 border border-neutral-800' : 'bg-neutral-50/70 border border-neutral-100'
          }`}>
            <div>
              <p className="text-xs text-neutral-400">Promo Price (Including Original Price)</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  ৳{product.price.toLocaleString('en-US')}
                </span>
                {product.originalPrice && (
                  <span className="text-xs sm:text-sm text-neutral-400 line-through">
                    ৳{product.originalPrice.toLocaleString('en-US')}
                  </span>
                )}
              </div>
            </div>

            <div className="text-right">
              <span className={`inline-block px-2.5 py-1 text-xs font-bold rounded-lg ${
                product.stock > 0 
                  ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/5 dark:text-emerald-400' 
                  : 'bg-red-500/10 text-red-500'
              }`}>
                {product.stock > 0 ? `In Stock: ${product.stock} units available` : 'Out of Stock'}
              </span>
            </div>
          </div>

          {/* Product Description */}
          <div className="space-y-2">
            <h4 className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-neutral-800'}`}>Product Description:</h4>
            <p className={`text-xs sm:text-sm leading-relaxed font-light ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
              {product.description}
            </p>
          </div>

          {/* Key Product Features (Checklist) */}
          <div className="space-y-2.5">
            <h4 className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-neutral-800'}`}>Key Features:</h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-400">
              {product.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5"><CornerDownRight size={12} /></span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Buying & Cart Action Elements */}
          <div className={`pt-4 border-t ${isDark ? 'border-neutral-800' : 'border-neutral-100'} space-y-4`}>
            {product.stock > 0 ? (
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Quantity Incrementor */}
                <div className={`flex items-center justify-between rounded-xl p-1.5 border-2 max-w-[130px] ${
                  isDark ? 'bg-neutral-900 border-neutral-805' : 'bg-neutral-50 border-neutral-200 shadow-inner'
                }`}>
                  <button
                    id="qty-decrement-btn"
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm select-none hover:bg-neutral-250 active:scale-95 transition-all ${
                      isDark ? 'hover:bg-neutral-800 text-white' : 'hover:bg-neutral-200 text-neutral-800'
                    }`}
                  >
                    -
                  </button>
                  <span className={`font-sans font-bold text-sm ${isDark ? 'text-white' : 'text-neutral-800'}`}>{quantity}</span>
                  <button
                    id="qty-increment-btn"
                    onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm select-none hover:bg-neutral-250 active:scale-95 transition-all ${
                      isDark ? 'hover:bg-neutral-800 text-white' : 'hover:bg-neutral-200 text-neutral-800'
                    }`}
                  >
                    +
                  </button>
                </div>
                {/* 3D Action Buttons Grid */}
                <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Add to Cart 3D Button - Premium Emerald Water Bubble */}
                  <button
                    id="add-qty-to-cart-btn"
                    onClick={() => onAddToCart(product, quantity)}
                    className="py-3 px-6 rounded-2xl font-black font-sans text-xs sm:text-sm flex items-center justify-center gap-2 select-none cursor-pointer transition-all border border-t-[1.5px] border-t-white/50 border-[#6ee7b7] border-b-[5px] border-b-[#022c22] shadow-md bg-gradient-to-b from-[#34d399] via-[#059669] to-[#047857] hover:brightness-110 text-white active:border-b-[1.5px] active:translate-y-[4px]"
                  >
                    <ShoppingCart size={15} />
                    <span>Add to Cart (৳{(product.price * quantity).toLocaleString('en-US')})</span>
                  </button>

                  {/* Buy Now Hot 3D Button - Premium Teal/Mint Water Bubble */}
                  <button
                    id="buy-qty-now-btn"
                    onClick={() => onBuyNow ? onBuyNow(product, quantity) : onAddToCart(product, quantity)}
                    className="py-3 px-6 rounded-2xl font-black font-sans text-xs sm:text-sm text-white bg-gradient-to-b from-[#06b6d4] via-[#0d9488] to-[#115e59] border border-t-[1.5px] border-t-white/50 border-[#2dd4bf] border-b-[5px] border-b-[#022826] hover:brightness-115 shadow-md flex items-center justify-center gap-2 select-none cursor-pointer active:border-b-[1.5px] active:translate-y-[4px]"
                  >
                    <Sparkles size={15} />
                    <span>Buy Now</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center text-xs font-semibold text-red-500">
                Sorry! Temporarily out of stock. Standard replenishment is active.
              </div>
            )}
          </div>

          {/* Secure Trust Points */}
          <div className="grid grid-cols-3 gap-3 pt-2 text-[10px] text-neutral-400">
            <div className="flex flex-col items-center text-center p-2 rounded-xl bg-neutral-500/5 border border-neutral-500/5">
              <ShieldCheck className="text-emerald-500 mb-1" size={16} />
              <span className="font-semibold text-neutral-300">100% Genuine</span>
            </div>
            <div className="flex flex-col items-center text-center p-2 rounded-xl bg-neutral-500/5 border border-neutral-500/5">
              <Truck className="text-emerald-500 mb-1" size={16} />
              <span className="font-semibold text-neutral-300">Free Delivery</span>
            </div>
            <div className="flex flex-col items-center text-center p-2 rounded-xl bg-neutral-500/5 border border-neutral-500/5">
              <RefreshCw className="text-emerald-500 mb-1" size={16} />
              <span className="font-semibold text-neutral-300">7-Day Swap Policy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Review Hub & Feedback Log section */}
      <div className={`border-t pt-8 ${isDark ? 'border-neutral-800' : 'border-neutral-100'} grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12`}>
        {/* Left pane: Add and Write user review */}
        <div className="col-span-1 lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2">
            <MessageSquarePlus className="text-emerald-500" size={18} />
            <h3 className={`font-sans font-bold text-base sm:text-lg ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              Leave Your Valuable Feedback
            </h3>
          </div>

          {currentUser ? (
            <form onSubmit={handleReviewSubmit} className="space-y-4" id="review-feedback-form">
              {reviewSuccessMsg && (
                <div className="p-3 text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg text-center font-medium">
                  {reviewSuccessMsg}
                </div>
              )}

              {/* Star Input Choice */}
              <div className="space-y-1">
                <label className="text-xs text-neutral-400 block font-medium">Select Rating:</label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((starValue) => (
                    <button
                      key={starValue}
                      type="button"
                      id={`star-input-${starValue}`}
                      onClick={() => setRatingInput(starValue)}
                      className={`p-1.5 rounded-lg transition-transform active:scale-90 cursor-pointer ${
                        ratingInput >= starValue ? 'text-amber-400' : 'text-neutral-500'
                      }`}
                    >
                      <Star size={24} fill={ratingInput >= starValue ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                  <span className={`text-xs ml-2 font-bold ${isDark ? 'text-white' : 'text-neutral-800'}`}>
                    ({ratingInput} Star)
                  </span>
                </div>
              </div>

              {/* Review Text Area */}
              <div className="space-y-1">
                <label className="text-xs text-neutral-400 block font-medium">Your Review:</label>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience about the product's quality, design, and our delivery service with other buyers..."
                  className={`w-full p-3 rounded-xl text-xs sm:text-sm border focus:outline-none transition-all ${
                    isDark 
                      ? 'bg-neutral-905 border-neutral-800 text-white placeholder-neutral-500 focus:border-emerald-500' 
                      : 'bg-neutral-50 border-neutral-200 text-neutral-800 placeholder-neutral-400 focus:border-emerald-600 focus:bg-white'
                  }`}
                />
              </div>

              <button
                id="submit-review-btn"
                type="submit"
                disabled={loadingReview}
                className="w-full py-2.5 px-4 rounded-2xl text-xs font-black text-white bg-gradient-to-b from-[#34d399] via-[#059669] to-[#047857] border border-t-[1px] border-t-white/50 border-[#6ee7b7] border-b-[4px] border-b-[#022c22] active:border-b-[1px] active:translate-y-[3px] shadow-sm cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                {loadingReview ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span>Submit Review</span>
                )}
              </button>
            </form>
          ) : (
            <div className={`p-6 rounded-2xl border text-center space-y-4 ${
              isDark ? 'bg-neutral-950/40 border-neutral-850' : 'bg-neutral-50 border-neutral-100'
            }`}>
              <div className="flex justify-center text-emerald-500"><UserCheck size={32} /></div>
              <div className="space-y-1">
                <h5 className={`font-sans font-bold text-sm ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                  Login to Leave a Review
                </h5>
                <p className="text-xs text-neutral-400 leading-normal px-2">
                  Please register or log in using your email address or mobile number to place orders and share feedback.
                </p>
              </div>
              <button
                id="review-auth-trigger"
                onClick={onTriggerAuth}
                className="inline-flex items-center gap-1 bg-gradient-to-b from-[#34d399] via-[#059669] to-[#047857] border border-t-[1.5px] border-t-white/50 border-[#6ee7b7] border-[#022c22] border-b-[4px] active:border-b-[1px] active:translate-y-[2px] text-white font-black text-xs py-2.5 px-5 rounded-2xl shadow-md cursor-pointer transition-all"
              >
                <span>Register / Login</span>
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Right pane: All feedbacks feed */}
        <div className="col-span-1 lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className={`font-sans font-bold text-base sm:text-lg ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              Verified Customer Reviews ({reviews.length})
            </h3>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-lg">
              100% Verified
            </span>
          </div>

          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1" id="reviews-feed-container">
            {reviews.length > 0 ? (
              reviews.map((rev) => (
                <div
                  key={rev.id}
                  id={`review-item-${rev.id}`}
                  className={`p-4 rounded-xl border text-xs sm:text-sm space-y-2 transition-all hover:scale-[1.01] ${
                    isDark ? 'bg-neutral-900 border-neutral-850 text-neutral-300' : 'bg-white border-neutral-100 text-neutral-700 shadow-xs'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5">
                      <h5 className={`font-bold font-sans ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                        {rev.userName}
                      </h5>
                      <span className="text-[10px] text-neutral-400">
                        {new Date(rev.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </span>
                    </div>

                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          fill={i < Math.floor(rev.rating) ? 'currentColor' : 'none'}
                          className="opacity-95"
                        />
                      ))}
                    </div>
                  </div>

                  <p className="font-light leading-relaxed whitespace-pre-line text-neutral-300-dark-fix text-neutral-600 dark:text-neutral-300">
                    {rev.comment}
                  </p>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-neutral-400 text-xs">
                No reviews have been posted for this product yet. Be the first to share your thoughts!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

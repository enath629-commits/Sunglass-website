import { Product } from '../types';
import { Star, ShoppingCart, Eye, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
  onViewDetails: (product: Product) => void;
  onBuyNow?: (product: Product) => void;
  theme: 'light' | 'dark';
}

export default function ProductCard({ product, onAddToCart, onViewDetails, onBuyNow, theme }: ProductCardProps) {
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const isDark = theme === 'dark';

  return (
    <motion.div
      layoutId={`product-card-${product.id}`}
      id={`product-card-${product.id}`}
      onClick={() => onViewDetails(product)}
      className={`group relative flex flex-col overflow-hidden rounded-3xl border-2 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer ${
        isDark 
          ? 'bg-neutral-900 border-neutral-800 hover:border-neutral-700 shadow-[0_8px_0_0_#171717] hover:shadow-[0_12px_20px_rgba(0,0,0,0.4)]' 
          : 'bg-white border-neutral-200 hover:border-neutral-300 shadow-[0_8px_0_0_#e5e5e5] hover:shadow-[0_12px_20px_rgba(0,0,0,0.1)]'
      }`}
    >
      {/* Discount Badge */}
      {discountPercent > 0 && (
        <span className="absolute top-3 left-3 z-10 px-2.5 py-1 text-[10px] font-sans font-black bg-[#ff5a3c] text-white rounded-xl shadow-md border border-[#ff7a60]">
          {discountPercent}% OFF
        </span>
      )}

      {/* Stock warning status */}
      {product.stock <= 5 && product.stock > 0 && (
        <span className="absolute top-3 right-3 z-10 px-2.5 py-0.5 text-[9px] font-bold bg-amber-500 text-white rounded-lg shadow-sm animate-pulse">
          Only {product.stock} left
        </span>
      )}
      {product.stock === 0 && (
        <span className="absolute top-3 right-3 z-10 px-2.5 py-0.5 text-[9px] font-bold bg-neutral-600 text-white rounded-lg shadow-sm">
          Out of Stock
        </span>
      )}

      {/* Product Image Stage */}
      <div className={`relative aspect-square overflow-hidden ${
        isDark ? 'bg-neutral-850' : 'bg-[#eefcf9]'
      }`}>
        <img
          src={product.images[0]}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Dynamic Green Hover Veil */}
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-350 flex items-center justify-center">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="p-3 bg-white/90 text-emerald-700 rounded-full shadow-lg backdrop-blur-xs"
          >
            <Eye size={20} />
          </motion.div>
        </div>
      </div>

      {/* Product Information Details */}
      <div className="p-4 flex flex-col flex-grow space-y-2.5">
        {/* Category Tag */}
        <div className="flex items-center justify-between text-[10px] uppercase font-black tracking-widest text-[#0f5c4f] dark:text-emerald-400">
          <span>{product.category === 'watch' ? 'Watch' : 'Sunglasses'}</span>
          {product.rating >= 4.8 && (
            <span className="flex items-center gap-0.5 text-amber-500 bg-amber-500/10 dark:bg-amber-500/5 px-1.5 py-0.5 rounded-lg font-bold">
              <Sparkles size={8} /> Highly Rated
            </span>
          )}
        </div>

        {/* Product Title */}
        <h4 className={`font-sans font-extrabold text-xs sm:text-sm leading-snug line-clamp-2 h-9 ${
          isDark ? 'text-white group-hover:text-emerald-400' : 'text-neutral-800 group-hover:text-emerald-600'
        } transition-colors`}>
          {product.name}
        </h4>

        {/* Star Rating Section */}
        <div className="flex items-center gap-1 select-none">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                className="opacity-90"
              />
            ))}
          </div>
          <span className="text-[10px] text-neutral-450 font-bold font-sans">{product.rating}</span>
        </div>

        {/* Footer Area with Price and Actions */}
        <div className="pt-3 border-t dark:border-neutral-800/60 border-neutral-100 flex flex-col space-y-3 mt-auto">
          {/* Price display */}
          <div className="flex items-baseline justify-between select-none">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">ম্মূল্য (Price):</span>
            <div className="flex items-baseline gap-1.5">
              {product.originalPrice && (
                <span className="text-[10.5px] text-neutral-450 line-through">
                  ৳{product.originalPrice.toLocaleString('en-US')}
                </span>
              )}
              <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-sans">
                ৳{product.price.toLocaleString('en-US')}
              </span>
            </div>
          </div>

          {/* Action buttons list */}
          <div className="flex flex-col gap-1.5 sm:grid sm:grid-cols-2 sm:gap-2 text-center" id={`product-card-actions-${product.id}`}>
            {/* Add to Cart 3D Water Bubble Button - Premium Emerald */}
            <button
              id={`add-to-cart-card-${product.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product, 1);
              }}
              disabled={product.stock === 0}
              className={`py-2 px-3 rounded-2xl font-black font-sans text-[11px] flex items-center justify-center gap-1 cursor-pointer select-none transition-all shadow-sm ${
                product.stock === 0
                  ? 'bg-neutral-300 dark:bg-neutral-800 border border-neutral-400 dark:border-neutral-700 text-neutral-400 cursor-not-allowed'
                  : 'bg-gradient-to-b from-[#34d399] via-[#059669] to-[#047857] hover:brightness-110 text-white border border-t-white/50 border-[#6ee7b7] border-b-[4px] border-b-[#022c22] active:border-b-[1px] active:translate-y-[3px]'
              }`}
            >
              <ShoppingCart size={11} />
              <span>Add to Cart</span>
            </button>

            {/* Buy Now Hot 3D Water Bubble Button - Premium Teal/Mint */}
            <button
              id={`buy-now-card-${product.id}`}
              onClick={(e) => {
                e.stopPropagation();
                if (onBuyNow) {
                  onBuyNow(product);
                } else {
                  onAddToCart(product, 1);
                }
              }}
              disabled={product.stock === 0}
              className={`py-2 px-3 rounded-2xl font-black font-sans text-[11px] flex items-center justify-center gap-1 cursor-pointer select-none transition-all shadow-sm ${
                product.stock === 0
                  ? 'bg-neutral-300 dark:bg-neutral-800 border border-neutral-400 dark:border-neutral-700 text-neutral-400 cursor-not-allowed'
                  : 'bg-gradient-to-b from-[#06b6d4] via-[#0d9488] to-[#115e59] hover:brightness-115 text-white border border-t-white/50 border-[#2dd4bf] border-b-[4px] border-b-[#022826] active:border-b-[1px] active:translate-y-[3px]'
              }`}
            >
              <Sparkles size={11} />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

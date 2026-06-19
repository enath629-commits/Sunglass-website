import { Product } from '../types';
import { Star, ShoppingCart, Eye, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
  onViewDetails: (product: Product) => void;
  theme: 'light' | 'dark';
}

export default function ProductCard({ product, onAddToCart, onViewDetails, theme }: ProductCardProps) {
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const isDark = theme === 'dark';

  return (
    <motion.div
      layoutId={`product-card-${product.id}`}
      id={`product-card-${product.id}`}
      onClick={() => onViewDetails(product)}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 cursor-pointer ${
        isDark 
          ? 'bg-neutral-900 border-neutral-800 hover:shadow-emerald-900/5' 
          : 'bg-white border-neutral-100 hover:shadow-emerald-100/30'
      }`}
    >
      {/* Discount Badge */}
      {discountPercent > 0 && (
        <span className="absolute top-3 left-3 z-10 px-2.5 py-1 text-[10px] font-sans font-bold bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg shadow-sm">
          {discountPercent}% OFF
        </span>
      )}

      {/* Stock warning status */}
      {product.stock <= 5 && product.stock > 0 && (
        <span className="absolute top-3 right-3 z-10 px-2 py-0.5 text-[9px] font-semibold bg-amber-550/90 text-white rounded-md backdrop-blur-xs animate-pulse">
          Only {product.stock} left
        </span>
      )}
      {product.stock === 0 && (
        <span className="absolute top-3 right-3 z-10 px-2 py-0.5 text-[9px] font-semibold bg-neutral-600/90 text-white rounded-md backdrop-blur-xs">
          Out of Stock
        </span>
      )}

      {/* Product Image Stage */}
      <div className={`relative aspect-square overflow-hidden ${
        isDark ? 'bg-neutral-850' : 'bg-neutral-50'
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
      <div className="p-4 flex flex-col flex-grow space-y-2">
        {/* Category Tag */}
        <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-emerald-600 dark:text-emerald-400">
          <span>{product.category === 'watch' ? 'Watch' : 'Sunglasses'}</span>
          {product.rating >= 4.8 && (
            <span className="flex items-center gap-0.5 text-amber-500 bg-amber-500/10 dark:bg-amber-500/5 px-1.5 py-0.5 rounded-md">
              <Sparkles size={8} /> Highly Rated
            </span>
          )}
        </div>

        {/* Product Title */}
        <h4 className={`font-sans font-semibold text-sm leading-snug line-clamp-2 ${
          isDark ? 'text-white group-hover:text-emerald-400' : 'text-neutral-800 group-hover:text-emerald-600'
        } transition-colors`}>
          {product.name}
        </h4>

        {/* Star Rating Section */}
        <div className="flex items-center gap-1">
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
          <span className="text-[10px] text-neutral-400 font-semibold">{product.rating}</span>
        </div>

        {/* Footer Area with Price and Actions */}
        <div className="pt-2 flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            {product.originalPrice && (
              <span className="text-xs text-neutral-400 line-through">
                ৳{product.originalPrice.toLocaleString('en-US')}
              </span>
            )}
            <span className="text-sm md:text-base font-bold text-emerald-605 dark:text-emerald-400">
              ৳{product.price.toLocaleString('en-US')}
            </span>
          </div>

          <motion.button
            id={`add-to-cart-${product.id}`}
            whileTap={{ scale: 0.92 }}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product, 1);
            }}
            disabled={product.stock === 0}
            className={`p-2.5 rounded-xl transition-all flex items-center justify-center ${
              product.stock === 0
                ? 'bg-neutral-350 dark:bg-neutral-800 text-neutral-400 border border-neutral-700 cursor-not-allowed'
                : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white hover:border-emerald-600'
            }`}
          >
            <ShoppingCart size={16} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

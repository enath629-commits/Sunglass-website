export type CategoryType = 'sunglass' | 'watch';
export type PaymentMethodType = 'bkash' | 'nagad' | 'rocket' | 'cod';
export type OrderStatusType = 'pending' | 'confirmed' | 'delivered' | 'cancelled';
export type AdminPermissionKey = 'manageProducts' | 'manageOrders' | 'manageBanners' | 'manageChats' | 'manageAdmins';

export interface Product {
  id: string;
  name: string;
  category: CategoryType;
  price: number;
  originalPrice?: number;
  description: string;
  images: string[];
  rating: number;
  stock: number;
  features: string[];
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  shippingAddress: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: PaymentMethodType;
  paymentNumber?: string;
  transactionId?: string;
  status: OrderStatusType;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string; // Could be client sessionId or adminEmail
  senderName: string;
  text: string;
  timestamp: string;
  isFromAdmin: boolean;
  sessionId: string; // Grouped by conversation
}

export interface ChatSession {
  id: string;
  clientName: string;
  clientPhone?: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartNotification {
  id: string;
  userName: string;
  productName: string;
  timestamp: string;
  quantity: number;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  createdAt: string;
}

export interface AdminPermission {
  id: string;
  email: string;
  name: string;
  addedBy: string;
  permissions: {
    manageProducts: boolean;
    manageOrders: boolean;
    manageBanners: boolean;
    manageChats: boolean;
    manageAdmins: boolean;
  };
  createdAt: string;
}

export interface PromoBanner {
  id: string;
  imageUrl: string;
  title: string;
  subtitle?: string;
  badge?: string;
  productId?: string; // Optional link to product detail
}

export interface LandingConfig {
  logoText: string;
  logoIcon: string; // Lucide icon identifier e.g. "Sun" or "Crown"
  heroTitle: string;
  heroSubtitle: string;
  whatsappNumber: string;
  hotlineNumber: string;
  promoTexts: string[];
}

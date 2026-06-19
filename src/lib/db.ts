import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { 
  Product, Review, Order, ChatMessage, ChatSession, 
  AdminPermission, PromoBanner, LandingConfig, CartNotification 
} from '../types';

// Initial Seed Data for Luxury Watches and Sunglasses
const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Royal Oak Precision Chrono',
    category: 'watch',
    price: 18500,
    originalPrice: 22000,
    description: 'অনুভব করুন রাজকীয় আভিজাত্য। এই স্টেইনলেস স্টিল ক্রোনোগ্রাফ ঘড়িটি আপনাকে দিবে এক অদ্বিতীয় ব্যক্তিত্ব। ওয়াটারপ্রুফ বডি, স্ক্র্যাচ-প্রতিরোধী স্যাফায়ার গ্লাস এবং অত্যন্ত নিখুঁত মুভমেন্ট সহ এই ঘড়িটি দীর্ঘস্থায়ী ব্যবহারের নিশ্চয়তা দেয়।',
    images: [
      'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.8,
    stock: 12,
    features: ['পানি-প্রতিরোধী ৩টি ডায়াল ক্রোনোগ্রাফ', 'জাপানিজ কোয়ার্টজ মুভমেন্ট', '২ বছরের অফিশিয়াল ওয়ারেন্টি', 'অ্যান্টি-স্ক্র্যাচ প্রিমিয়াম ডায়াল গ্লাস', 'লাইটওয়েট সলিড চেইন বেল্ট'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'p2',
    name: 'Stealth Black Elite Cruiser',
    category: 'watch',
    price: 9500,
    originalPrice: 12500,
    description: 'যারা আধুনিক এবং স্পোর্টি স্টাইল পছন্দ করেন, তাদের জন্য মেট ব্ল্যাক লাক্সারি ঘড়ি। সিলিকন এবং কার্বন ফাইবার উপাদানের কম্বিনেশন তৈরি করেছে এক অনন্য আভিজাত্য। জিম বা ব্যবসা ক্ষেত্র – সবখানেই মানানসই।',
    images: [
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.6,
    stock: 8,
    features: ['মেট ব্ল্যাক স্পোর্টি স্টাইলিশ বডি', 'কমফোর্টেবল সিলিকন সফট বেল্ট', 'রাতে দেখার জন্য লিওমিনাস লাইট ইন-ডেক্স', 'স্টপ-ওয়াচ অ্যান্ড এলার্ম সুবিধা'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'p3',
    name: 'Vintage Leather Classique',
    category: 'watch',
    price: 13500,
    originalPrice: 16000,
    description: 'খাঁটি লেদারের বেল্ট এবং গোল্ডেন প্লেটেড ডায়ালের চিরসবুজ ক্লাসিক ঘড়ি। করপোরেট মিটিং অথবা যেকোনো জমকালো পারিবারিক অনুষ্ঠানে আপনার রুচির চমৎকার পরিচয় দেবে এই ঘড়িটি।',
    images: [
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.9,
    stock: 5,
    features: ['ইতালিয়ান জেনুইন লেদার হ্যান্ডমেড বেল্ট', '১৮ ক্যারেট গোল্ড-প্লেটেড কালার পলিশ', '১০০ মিটার ওয়াটার রেজিস্ট্যান্স ডিজাইন', 'অটোমেটিক সেলফ-উইন্ডিং মুভমেন্ট'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'p4',
    name: 'Gold Elite Skeleton Automatic',
    category: 'watch',
    price: 24500,
    originalPrice: 29000,
    description: 'ঘড়ির ভেতরের নিখুঁত মেকানিজম বা গিয়ার মুভমেন্ট বাইরে থেকে সরাসরি দেখা যায় এর আকর্ষণীয় কঙ্কাল নকশায়। কোনো ব্যাটারি ছাড়াই হাতের নড়াচড়ায় চলে এই অটোমেটিক প্রিমিয়াম ঘড়িটি।',
    images: [
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 5.0,
    stock: 4,
    features: ['ফুল গোল্ডেন মেটাল বডি অ্যান্ড ডায়াল', 'স্বয়ংক্রিয় ব্যাটারি-বিহীন মেকানিক্যাল গিয়ার', 'স্যাফায়ার ডাবল সাইডেড গ্লাস', 'স্বচ্ছ কঙ্কাল (Skeleton) ডায়াল ডিজাইন'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'p5',
    name: 'Aviator Dark Matte Polarized',
    category: 'sunglass',
    price: 3800,
    originalPrice: 5200,
    description: 'ঝলসানো রোদ অথবা ট্রাভেলিং - সবখানেই আপনার চোখকে ধুলাবালি এবং ক্ষতিকর অতিবেগুনী রশ্মি থেকে শতভাগ সুরক্ষিত রাখতে ব্যবহার করুন এই হাই-এন্ড পোলারাইজড এভিয়েটর সানগ্লাস। এর মেটালিক ফ্রেম দেবে আকর্ষণীয় লুক।',
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1496181130204-755241524eab?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.7,
    stock: 25,
    features: ['১০০% UV400 পোলারাইজড সান প্রোটেকশন', 'লাইটওয়েট মেটাল মেটাক্রিল ফ্রেম', 'অ্যান্টি-গ্লেয়ার ড্রাইভিং স্পেশাল লেন্স', 'সফট সিলিকন নোজ প্যাড'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'p6',
    name: 'Wayfarer Classic Ocean Amber',
    category: 'sunglass',
    price: 4200,
    originalPrice: 5500,
    description: 'ডিজাইন যা কখনো পুরনো হয় না। ঐতিহ্যবাহী ওয়েফেয়ারার ফ্রেম ও আধুনিক অ্যাম্বার কালার শেডের দারুণ কম্বিনেশন। ক্যাজুয়াল আড্ডা থেকে শুরু করে সমুদ্রের তীরে ঘুরাঘুরি – সবখানেই আপনি থাকবেন স্টাইলিশ।',
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.8,
    stock: 18,
    features: ['প্রিমিয়াম অ্যাম্বার টেম্পারড লেন্স টেকনোলজি', 'ফ্লেক্সিবল অ্যাসিটেট লাইটওয়েট ফ্রেম', 'আই-স্টেইন রেডিউসিং ফিল্টার লেন্স', 'স্টাইলিশ সিগনেচার ট্রাভেলার শেপ'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'p7',
    name: 'Clubmaster Retro Tortoise Gold',
    category: 'sunglass',
    price: 4900,
    originalPrice: 6500,
    description: 'রেট্রো ভিন্টেজ লুক পছন্দকারীদের জন্য চমৎকার ক্লাবমাস্টার ডিজাইন। কচ্ছপের খোসার মতো ফ্রেম পেইন্ট এবং সোনালী রিমে জড়ানো প্রিমিয়াম কাচের এই লেন্সটি ফ্যাশন বোদ্ধাদের প্রথম পছন্দ।',
    images: [
      'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.5,
    stock: 10,
    features: ['হাতে পলিশ করা এসিটেট ভিন্টেজ ফ্রেম', '১৮ ক্যারেট গোল্ডেন রিম বর্ডারস', 'এইচডি আল্ট্রা-ক্লিয়ার সেফটি লেন্স', 'প্রতিরক্ষামূলক হার্ড কেস গিফট'],
    createdAt: new Date().toISOString()
  }
];

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'r1',
    productId: 'p1',
    userName: 'আরিয়ান রহমান',
    rating: 5,
    comment: 'অসাধারণ ঘড়ি! যেমন প্রফেশনাল লুক, তেমন ওয়েইট। হাতে পরলে জাস্ট প্রিমিয়াম ভাব আসে। ড্রায়ার প্যাকেজিং এবং ডেলিভারি খুব ফাস্ট ছিল!',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'r2',
    productId: 'p1',
    userName: 'মাহমুদ হাসান',
    rating: 4,
    comment: 'ডিসাইন খুবই পছন্দ হয়েছে। মেটাল বেল্ট নিখুঁত ফিনিশিং। ২ দিনের মধ্যে ঢাকাতে হোম ডেলিভারি পেয়েছি। ধন্যবাদ!',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'r3',
    productId: 'p5',
    userName: 'তাসনিম সুলতানা',
    rating: 5,
    comment: 'বাইক ড্রাইভ করার জন্য এই পোলারাইজড গ্লাসটি সেরা। কড়া রোদেও চোখ অনেক ঠাণ্ডা থাকে। রিকমেন্ডেড!',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'r4',
    productId: 'p6',
    userName: 'ইমতিয়াজ সাজিদ',
    rating: 5,
    comment: 'সানগ্লাসের কোয়ালিটি অনেক জোস ছিল! ফ্রেম অনেক মজবুত ও প্লাস্টিক ফিল হয়না। দাম অনুযায়ী ১০ এ ১০ দেয়া যায়।',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const INITIAL_BANNERS: PromoBanner[] = [
  {
    id: 'b1',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1600&h=600',
    title: 'সামার হট ডিল - লাক্সারি সানগ্লাস কালেকশন',
    subtitle: '১০০% অরিজিনাল পোলারাইজড সানগ্লাস কিনলেই পাচ্ছেন সাথে ৩ বছর গ্যারান্টি অ্যান্ড আকর্ষণীয় লেদার বক্স একদম ফ্রিতে!',
    badge: 'Upto ৪০% অফ'
  },
  {
    id: 'b2',
    imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=1600&h=600',
    title: 'অভিজাত্যের প্রতীক - এক্সক্লুসিভ ঘড়ির উৎসব',
    subtitle: 'নামিদামি ব্র্যান্ডের রয়্যাল মেটালিক ও অটোমেটিক মেকানিক্যাল ওয়াচ কিনুন ঢাকা এবং ঢাকার বাইরে ফ্রি হোম ডেলিভারিতে।',
    badge: 'সেরা উপহার'
  },
  {
    id: 'b3',
    imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1600&h=600',
    title: 'উইকেন্ড ট্রাভেলার ডিল - কম্বো অফার শুরু!',
    subtitle: 'উভয় সানগ্লাস এবং স্টাইলিশ এলিট ওয়াচ একসাথে কিনলেই অতিরিক্ত ১,০০০ টাকার বিশেষ ছাড় উপভোগ করুন।',
    badge: 'স্পেশাল কম্বো অফার'
  }
];

const INITIAL_LANDING_CONFIG: LandingConfig = {
  logoText: 'PREMIUM CHRONO & SHADE',
  logoIcon: 'Crown',
  heroTitle: 'আভিজাত্য ও আধুনিকতার অনন্য মেলবন্ধন',
  heroSubtitle: 'আমাদের প্রিমিয়াম ক্রোনোগ্রাফ ঘড়ি ও ১০০% ইউভি সুরক্ষিত পোলারাইজড সানগ্লাস দিয়ে আপনার ব্যক্তিত্বকে করে তুলুন আকর্ষণীয় ও আভিজাত্যপূর্ণ।',
  whatsappNumber: '+8801712345678',
  hotlineNumber: '+8801911122233',
  promoTexts: [
    '🔥 আজই অর্ডার করলেই পাচ্ছেন সারা বাংলাদেশে ফ্রি ডেলিভারি!',
    '💎 আমাদের প্রতিটি পণ্যের সাথে পাবেন রিটার্ন গ্যারান্টি এবং ফাস্ট হোম কুরিয়ার!',
    '📦 ক্যাশ অন ডেলিভারি (হাতে পণ্য পেয়ে মূল্য পরিশোধ করার সুযোগ)!'
  ],
  deliveryChargeInsideDhaka: 80,
  deliveryChargeOutsideDhaka: 120,
  arrivalsTitle: 'Exclusive Handpicked Designs',
  arrivalsSubtitle: 'LATEST ARRIVALS',
  brandStoryTitle: 'CHRONO & SHADE - Premium Lifestyle Partner',
  brandStorySubtitle: 'Our Craftsmanship',
  brandStoryDescription: 'We believe watches and sunglasses are not merely accessories, but assertions of status and personality. Every chronograph watch and polarized lens is meticulously evaluated by our multi-tier Quality Assurance team. Direct distribution allows us to offer premium products, luxury feels, and flawless utility at unmatched wholesale pricing in the region.',
  themePrimaryColor: '#10b981',
  themeAccentColor: '#f97316'
};

const INITIAL_ADMINS: AdminPermission[] = [
  {
    id: 'adm1',
    email: 'enath629@gmail.com',
    name: 'Super Admin - Enath',
    addedBy: 'System Creator',
    permissions: {
      manageProducts: true,
      manageOrders: true,
      manageBanners: true,
      manageChats: true,
      manageAdmins: true
    },
    createdAt: new Date().toISOString()
  }
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1025',
    userId: 'u2',
    userName: 'নাবিল আহমেদ',
    userEmail: 'nabil@gmail.com',
    userPhone: '01812345678',
    shippingAddress: 'সেক্টর ৪, উত্তরা, ঢাকা',
    items: [
      {
        productId: 'p1',
        name: 'Royal Oak Precision Chrono',
        image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=800',
        price: 18500,
        quantity: 1
      },
      {
        productId: 'p5',
        name: 'Aviator Dark Matte Polarized',
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800',
        price: 3800,
        quantity: 1
      }
    ],
    totalAmount: 22300,
    paymentMethod: 'bkash',
    paymentNumber: '01812345678',
    transactionId: 'BKX93K8S20A',
    status: 'delivered',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'ord-1026',
    userId: 'u3',
    userName: 'ফারজানা ইয়াসমিন',
    userEmail: 'farzana@gmail.com',
    userPhone: '01511223344',
    shippingAddress: 'রোড ১২, ধানমন্ডি, ঢাকা',
    items: [
      {
        productId: 'p6',
        name: 'Wayfarer Classic Ocean Amber',
        image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800',
        price: 4200,
        quantity: 2
      }
    ],
    totalAmount: 8400,
    paymentMethod: 'cod',
    status: 'pending',
    createdAt: new Date(Date.now() - 1 * 12 * 60 * 60 * 1000).toISOString()
  }
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    senderId: 'sess-client-1',
    senderName: 'সাদিকুর রহমান',
    text: 'এই ক্রোনোগ্রাফ ঘড়িটি কি ওয়াটারপ্রুফ?',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    isFromAdmin: false,
    sessionId: 'sess-client-1'
  },
  {
    id: 'm2',
    senderId: 'enath629@gmail.com',
    senderName: 'Super Admin - Enath',
    text: 'হ্যাঁ, সাদিকুর রহমান সাহেব। এটি ১০০ মিটার গভীর পর্যন্ত ওয়াটারপ্রুফ এবং সাঁতার কাটার সময়ও নিশ্চিন্তে ব্যবহার করতে পারবেন। পণ্যের সাথে ২ বছরের অফিসিয়াল ওয়ারেন্টি কার্ড দেওয়া আছে।',
    timestamp: new Date(Date.now() - 28 * 60 * 1000).toISOString(),
    isFromAdmin: true,
    sessionId: 'sess-client-1'
  },
  {
    id: 'm3',
    senderId: 'sess-client-1',
    senderName: 'সাদিকুর রহমান',
    text: 'দারুণ! এটি ঢাকার বাইরে কুরিয়ার সার্ভিসে ক্যাশ অন ডেলিভারি দেওয়া যাবে?',
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    isFromAdmin: false,
    sessionId: 'sess-client-1'
  },
  {
    id: 'm4',
    senderId: 'sess-client-2',
    senderName: 'আফসানা মিমি',
    text: 'সানগ্লাসটি ট্রাই করতে চাই, ডেলিভারির চার্জ কত সারা বাংলাদেশে?',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    isFromAdmin: false,
    sessionId: 'sess-client-2'
  }
];

const INITIAL_NOTIFICATIONS: CartNotification[] = [
  {
    id: 'n1',
    userName: 'রিমন ইসলাম',
    productName: 'Royal Oak Precision Chrono',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    quantity: 1
  },
  {
    id: 'n2',
    userName: 'জান্নাত আরা',
    productName: 'Wayfarer Classic Ocean Amber',
    timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    quantity: 1
  }
];

// Supabase Init State
let supabase: SupabaseClient | null = null;
let isSupabaseActive = false;

// Attempt to load credentials from settings or environments
const loadSupabaseClient = () => {
  try {
    const storedConfig = localStorage.getItem('__SUPABASE_DB_CONFIG__');
    let url = import.meta.env.VITE_SUPABASE_URL || 'https://ujhrwtituovlhcojichc.supabase.co';
    let key = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqaHJ3dGl0dW92bGhjb2ppY2hjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4MDMyODIsImV4cCI6MjA5NzM3OTI4Mn0.cKftW_7loHoENaibeEczuIbNGm5KfiqAbxIBgT9ajpo';

    if (storedConfig) {
      const parsed = JSON.parse(storedConfig);
      if (parsed.url && parsed.key) {
        url = parsed.url;
        key = parsed.key;
      }
    }

    if (url && key && url !== 'YOUR_SUPABASE_URL' && key !== 'YOUR_SUPABASE_KEY') {
      supabase = createClient(url, key);
      isSupabaseActive = true;
      console.log('⚡ Supabase is active and fully connected!');
    } else {
      supabase = null;
      isSupabaseActive = false;
    }
  } catch (e) {
    console.error('Failed to init Supabase client. Defaulting to LocalDB stores.', e);
    supabase = null;
    isSupabaseActive = false;
  }
};

loadSupabaseClient();

// Helper to initialize local stores if they map to nothing
const getLocalStore = <T>(key: string, initial: T): T => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(data) as T;
  } catch {
    return initial;
  }
};

const setLocalStore = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Local storage storage hubs
const KEYS = {
  PRODUCTS: '__db_products_v1__',
  REVIEWS: '__db_reviews_v1__',
  BANNERS: '__db_banners_v1__',
  CONFIG: '__db_config_v1__',
  ADMINS: '__db_admins_v1__',
  ORDERS: '__db_orders_v1__',
  MESSAGES: '__db_chat_messages_v1__',
  NOTIFICATIONS: '__db_cart_notifications_v1__',
  USERS: '__db_users_v2__'
};

// Initialize State
export const initLocalDatabase = () => {
  getLocalStore(KEYS.PRODUCTS, INITIAL_PRODUCTS);
  getLocalStore(KEYS.REVIEWS, INITIAL_REVIEWS);
  getLocalStore(KEYS.BANNERS, INITIAL_BANNERS);
  getLocalStore(KEYS.CONFIG, INITIAL_LANDING_CONFIG);
  getLocalStore(KEYS.ADMINS, INITIAL_ADMINS);
  getLocalStore(KEYS.ORDERS, INITIAL_ORDERS);
  getLocalStore(KEYS.MESSAGES, INITIAL_MESSAGES);
  getLocalStore(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  getLocalStore(KEYS.USERS, [
    {
      uid: 'admin-enath',
      email: 'enath629@gmail.com',
      password: 'adminpassword',
      displayName: 'Admin Enath',
      phoneNumber: '01811122233',
      createdAt: new Date().toISOString()
    }
  ]);
};

initLocalDatabase();

// EXPOSED DB CONTROL LAYER (Seamless Supabase & Local Fallback Router)
export const DB = {
  // Check if Supabase client is live
  isSupabaseConnected: () => {
    return isSupabaseActive;
  },

  // Set explicit config from Settings UI
  saveSupabaseCredentials: (url: string, key: string) => {
    if (url && key) {
      localStorage.setItem('__SUPABASE_DB_CONFIG__', JSON.stringify({ url, key }));
    } else {
      localStorage.removeItem('__SUPABASE_DB_CONFIG__');
    }
    loadSupabaseClient();
    return isSupabaseActive;
  },

  getSupabaseCredentials: () => {
    try {
      const stored = localStorage.getItem('__SUPABASE_DB_CONFIG__');
      if (stored) return JSON.parse(stored);
    } catch {}
    return {
      url: import.meta.env.VITE_SUPABASE_URL || 'https://ujhrwtituovlhcojichc.supabase.co',
      key: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqaHJ3dGl0dW92bGhjb2ppY2hjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4MDMyODIsImV4cCI6MjA5NzM3OTI4Mn0.cKftW_7loHoENaibeEczuIbNGm5KfiqAbxIBgT9ajpo'
    };
  },

  // ----------------------------------------------------------------
  // PRODUCTS
  // ----------------------------------------------------------------
  getProducts: async (): Promise<Product[]> => {
    if (isSupabaseActive && supabase) {
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (error) throw error;
        if (data && data.length > 0) return data as Product[];
      } catch (err) {
        console.warn('Supabase products fetch failed, falling back to LocalDB', err);
      }
    }
    return getLocalStore<Product[]>(KEYS.PRODUCTS, INITIAL_PRODUCTS);
  },

  saveProduct: async (product: Product): Promise<boolean> => {
    const local = getLocalStore<Product[]>(KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const existsIdx = local.findIndex(p => p.id === product.id);
    if (existsIdx > -1) {
      local[existsIdx] = product;
    } else {
      local.push(product);
    }
    setLocalStore(KEYS.PRODUCTS, local);

    if (isSupabaseActive && supabase) {
      try {
        const { error } = await supabase.from('products').upsert(product);
        if (error) throw error;
      } catch (err) {
        console.error('Supabase save product failed', err);
      }
    }
    return true;
  },

  deleteProduct: async (id: string): Promise<boolean> => {
    const local = getLocalStore<Product[]>(KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const filtered = local.filter(p => p.id !== id);
    setLocalStore(KEYS.PRODUCTS, filtered);

    if (isSupabaseActive && supabase) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
      } catch (err) {
        console.error('Supabase delete product failed', err);
      }
    }
    return true;
  },

  // ----------------------------------------------------------------
  // REVIEWS
  // ----------------------------------------------------------------
  getReviews: async (productId?: string): Promise<Review[]> => {
    if (isSupabaseActive && supabase) {
      try {
        let q = supabase.from('reviews').select('*');
        if (productId) {
          q = q.eq('productId', productId);
        }
        const { data, error } = await q;
        if (error) throw error;
        if (data) return data as Review[];
      } catch (err) {
        console.warn('Supabase reviews fetch failed', err);
      }
    }
    const all = getLocalStore<Review[]>(KEYS.REVIEWS, INITIAL_REVIEWS);
    if (productId) {
      return all.filter(r => r.productId === productId);
    }
    return all;
  },

  addReview: async (review: Review): Promise<boolean> => {
    const all = getLocalStore<Review[]>(KEYS.REVIEWS, INITIAL_REVIEWS);
    all.push(review);
    setLocalStore(KEYS.REVIEWS, all);

    // Update aggregate product rating in background
    const products = getLocalStore<Product[]>(KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const p = products.find(prod => prod.id === review.productId);
    if (p) {
      const pReviews = all.filter(r => r.productId === review.productId);
      const totalRating = pReviews.reduce((sum, r) => sum + r.rating, 0);
      p.rating = parseFloat((totalRating / pReviews.length).toFixed(1));
      setLocalStore(KEYS.PRODUCTS, products);
      if (isSupabaseActive && supabase) {
        // Upsert product back in BG
        supabase.from('products').upsert(p).then();
      }
    }

    if (isSupabaseActive && supabase) {
      try {
        const { error } = await supabase.from('reviews').insert(review);
        if (error) throw error;
      } catch (err) {
        console.error('Supabase add review failed', err);
      }
    }
    return true;
  },

  deleteReview: async (id: string): Promise<boolean> => {
    const local = getLocalStore<Review[]>(KEYS.REVIEWS, INITIAL_REVIEWS);
    const filtered = local.filter(r => r.id !== id);
    setLocalStore(KEYS.REVIEWS, filtered);

    if (isSupabaseActive && supabase) {
      try {
        const { error } = await supabase.from('reviews').delete().eq('id', id);
        if (error) throw error;
      } catch (err) {
        console.error('Supabase delete review failed', err);
      }
    }
    return true;
  },

  saveReview: async (review: Review): Promise<boolean> => {
    const local = getLocalStore<Review[]>(KEYS.REVIEWS, INITIAL_REVIEWS);
    const idx = local.findIndex(r => r.id === review.id);
    if (idx > -1) {
      local[idx] = review;
    } else {
      local.push(review);
    }
    setLocalStore(KEYS.REVIEWS, local);

    if (isSupabaseActive && supabase) {
      try {
        const { error } = await supabase.from('reviews').upsert(review);
        if (error) throw error;
      } catch (err) {
        console.error('Supabase save review failed', err);
      }
    }
    return true;
  },

  // ----------------------------------------------------------------
  // BANNERS
  // ----------------------------------------------------------------
  getBanners: async (): Promise<PromoBanner[]> => {
    if (isSupabaseActive && supabase) {
      try {
        const { data, error } = await supabase.from('banners').select('*');
        if (error) throw error;
        if (data && data.length > 0) return data as PromoBanner[];
      } catch (err) {
        console.warn('Supabase banners failed', err);
      }
    }
    return getLocalStore<PromoBanner[]>(KEYS.BANNERS, INITIAL_BANNERS);
  },

  saveBanner: async (banner: PromoBanner): Promise<boolean> => {
    const local = getLocalStore<PromoBanner[]>(KEYS.BANNERS, INITIAL_BANNERS);
    const idx = local.findIndex(b => b.id === banner.id);
    if (idx > -1) local[idx] = banner;
    else local.push(banner);
    setLocalStore(KEYS.BANNERS, local);

    if (isSupabaseActive && supabase) {
      try {
        const { error } = await supabase.from('banners').upsert(banner);
        if (error) throw error;
      } catch (err) {
        console.error('Supabase banner save error', err);
      }
    }
    return true;
  },

  deleteBanner: async (id: string): Promise<boolean> => {
    const local = getLocalStore<PromoBanner[]>(KEYS.BANNERS, INITIAL_BANNERS);
    setLocalStore(KEYS.BANNERS, local.filter(b => b.id !== id));

    if (isSupabaseActive && supabase) {
      try {
        const { error } = await supabase.from('banners').delete().eq('id', id);
        if (error) throw error;
      } catch (err) {
        console.error('Supabase banner delete error', err);
      }
    }
    return true;
  },

  // ----------------------------------------------------------------
  // LANDING CONFIG
  // ----------------------------------------------------------------
  getConfig: async (): Promise<LandingConfig> => {
    if (isSupabaseActive && supabase) {
      try {
        const { data, error } = await supabase.from('landing_config').select('*').limit(1).single();
        if (error) throw error;
        if (data) return data as LandingConfig;
      } catch (err) {
        console.warn('Supabase landing_config fetch failed', err);
      }
    }
    return getLocalStore<LandingConfig>(KEYS.CONFIG, INITIAL_LANDING_CONFIG);
  },

  saveConfig: async (config: LandingConfig): Promise<boolean> => {
    setLocalStore(KEYS.CONFIG, config);
    if (isSupabaseActive && supabase) {
      try {
        const { error } = await supabase.from('landing_config').upsert({ id: 'primary', ...config });
        if (error) throw error;
      } catch (err) {
        console.error('Supabase config save failed', err);
      }
    }
    return true;
  },

  // ----------------------------------------------------------------
  // ORDERS
  // ----------------------------------------------------------------
  getOrders: async (): Promise<Order[]> => {
    if (isSupabaseActive && supabase) {
      try {
        const { data, error } = await supabase.from('orders').select('*');
        if (error) throw error;
        if (data && data.length > 0) return data as Order[];
      } catch (err) {
        console.warn('Supabase orders fetch failed', err);
      }
    }
    return getLocalStore<Order[]>(KEYS.ORDERS, INITIAL_ORDERS);
  },

  createOrder: async (order: Order): Promise<boolean> => {
    const local = getLocalStore<Order[]>(KEYS.ORDERS, INITIAL_ORDERS);
    local.unshift(order); // Put new order at start
    setLocalStore(KEYS.ORDERS, local);

    // Reduce stocks of actual items
    const products = getLocalStore<Product[]>(KEYS.PRODUCTS, INITIAL_PRODUCTS);
    order.items.forEach(item => {
      const p = products.find(pr => pr.id === item.productId);
      if (p) p.stock = Math.max(0, p.stock - item.quantity);
    });
    setLocalStore(KEYS.PRODUCTS, products);

    if (isSupabaseActive && supabase) {
      try {
        const { error } = await supabase.from('orders').insert(order);
        if (error) throw error;
        // Upsert modified products
        for (const item of order.items) {
          const updatedProduct = products.find(pr => pr.id === item.productId);
          if (updatedProduct) {
            await supabase.from('products').upsert(updatedProduct);
          }
        }
      } catch (err) {
        console.error('Supabase order creation failure', err);
      }
    }
    return true;
  },

  updateOrderStatus: async (id: string, status: Order['status']): Promise<boolean> => {
    const local = getLocalStore<Order[]>(KEYS.ORDERS, INITIAL_ORDERS);
    const orderIdx = local.findIndex(o => o.id === id);
    if (orderIdx > -1) {
      local[orderIdx].status = status;
      setLocalStore(KEYS.ORDERS, local);
    }

    if (isSupabaseActive && supabase) {
      try {
        const { error } = await supabase.from('orders').update({ status }).eq('id', id);
        if (error) throw error;
      } catch (err) {
        console.error('Supabase order status update failure', err);
      }
    }
    return true;
  },

  // ----------------------------------------------------------------
  // LIVE CHAT
  // ----------------------------------------------------------------
  getMessages: async (sessionId?: string): Promise<ChatMessage[]> => {
    if (isSupabaseActive && supabase) {
      try {
        let q = supabase.from('messages').select('*');
        if (sessionId) {
          q = q.eq('sessionId', sessionId);
        }
        const { data, error } = await q.order('timestamp', { ascending: true });
        if (error) throw error;
        if (data) return data as ChatMessage[];
      } catch (err) {
        console.warn('Supabase load messages failed', err);
      }
    }

    const all = getLocalStore<ChatMessage[]>(KEYS.MESSAGES, INITIAL_MESSAGES);
    if (sessionId) {
      return all.filter(m => m.sessionId === sessionId);
    }
    return all.sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  },

  sendMessage: async (msg: ChatMessage): Promise<boolean> => {
    const all = getLocalStore<ChatMessage[]>(KEYS.MESSAGES, INITIAL_MESSAGES);
    all.push(msg);
    setLocalStore(KEYS.MESSAGES, all);

    if (isSupabaseActive && supabase) {
      try {
        const { error } = await supabase.from('messages').insert(msg);
        if (error) throw error;
      } catch (err) {
        console.error('Supabase send message failure', err);
      }
    }
    return true;
  },

  getChatSessions: async (): Promise<ChatSession[]> => {
    // Collect sessions from messages
    const msgs = getLocalStore<ChatMessage[]>(KEYS.MESSAGES, INITIAL_MESSAGES);
    const sessionMap: { [id: string]: ChatSession } = {};

    msgs.forEach(m => {
      if (!sessionMap[m.sessionId]) {
        sessionMap[m.sessionId] = {
          id: m.sessionId,
          clientName: m.isFromAdmin ? 'গ্রাহক (Chat)' : m.senderName,
          lastMessageAt: m.timestamp,
          unreadCount: 0
        };
      } else {
        if (!m.isFromAdmin) {
          sessionMap[m.sessionId].clientName = m.senderName;
        }
        if (new Date(m.timestamp).getTime() > new Date(sessionMap[m.sessionId].lastMessageAt).getTime()) {
          sessionMap[m.sessionId].lastMessageAt = m.timestamp;
        }
      }
    });

    // Unread counts (messages where isFromAdmin===false and other criteria can be checked, simple demo)
    return Object.values(sessionMap).sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
  },

  // ----------------------------------------------------------------
  // ADMIN PERMISSIONS
  // ----------------------------------------------------------------
  getAdmins: async (): Promise<AdminPermission[]> => {
    if (isSupabaseActive && supabase) {
      try {
        const { data, error } = await supabase.from('admins').select('*');
        if (error) throw error;
        if (data && data.length > 0) return data as AdminPermission[];
      } catch (err) {
        console.warn('Supabase admins list load failed', err);
      }
    }
    return getLocalStore<AdminPermission[]>(KEYS.ADMINS, INITIAL_ADMINS);
  },

  saveAdmin: async (admin: AdminPermission): Promise<boolean> => {
    const local = getLocalStore<AdminPermission[]>(KEYS.ADMINS, INITIAL_ADMINS);
    const idx = local.findIndex(a => a.id === admin.id || a.email.toLowerCase() === admin.email.toLowerCase());
    if (idx > -1) {
      local[idx] = { ...local[idx], ...admin };
    } else {
      local.push(admin);
    }
    setLocalStore(KEYS.ADMINS, local);

    if (isSupabaseActive && supabase) {
      try {
        const { error } = await supabase.from('admins').upsert(admin);
        if (error) throw error;
      } catch (err) {
        console.error('Supabase admin permission save error', err);
      }
    }
    return true;
  },

  deleteAdmin: async (id: string): Promise<boolean> => {
    const local = getLocalStore<AdminPermission[]>(KEYS.ADMINS, INITIAL_ADMINS);
    const filtered = local.filter(a => a.id !== id);
    setLocalStore(KEYS.ADMINS, filtered);

    if (isSupabaseActive && supabase) {
      try {
        const { error } = await supabase.from('admins').delete().eq('id', id);
        if (error) throw error;
      } catch (err) {
        console.error('Supabase delete admin error', err);
      }
    }
    return true;
  },

  // ----------------------------------------------------------------
  // CART NOTIFICATIONS (REALTIME ACTIVITY VISUALIZER FOR ADMINS)
  // ----------------------------------------------------------------
  getCartNotifications: (): CartNotification[] => {
    return getLocalStore<CartNotification[]>(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  },

  addCartNotification: (userName: string, productName: string, quantity: number) => {
    const local = getLocalStore<CartNotification[]>(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const newNotif: CartNotification = {
      id: 'notif-' + Math.random().toString(36).substring(2, 9),
      userName,
      productName,
      quantity,
      timestamp: new Date().toISOString()
    };
    local.unshift(newNotif);
    // Keep last 40 only
    if (local.length > 40) local.pop();
    setLocalStore(KEYS.NOTIFICATIONS, local);
    return newNotif;
  },

  // USER AUTH SYSTEM
  getUsers: async (): Promise<any[]> => {
    const local = getLocalStore<any[]>(KEYS.USERS, []);
    if (isSupabaseActive && supabase) {
      try {
        const { data, error } = await supabase.from('users').select('*');
        if (!error && data) {
          // Merge local storage users with Supabase users, removing duplicates by email
          const merged = [...data];
          local.forEach((lu: any) => {
            const exists = merged.some(
              (su: any) => su.email?.toLowerCase() === lu.email?.toLowerCase()
            );
            if (!exists) {
              merged.push(lu);
            }
          });
          return merged;
        }
        console.warn('Supabase users fetch failed, falling back to LocalDB', error);
      } catch (err) {
        console.warn('Supabase users fetch failed, falling back to LocalDB', err);
      }
    }
    return local;
  },

  registerUser: async (user: any): Promise<{ success: boolean; error?: string }> => {
    const emailLower = user.email.toLowerCase();
    const allUsers = await DB.getUsers();

    // Check if email already registered
    if (allUsers.some((u: any) => u.email.toLowerCase() === emailLower)) {
      return { success: false, error: 'এই ইমেইল ঠিকানা দিয়ে ইতিপূর্বে অ্যাকাউন্ট খোলা হয়েছে!' };
    }

    // Prepare complete user record with both uid and id populated to prevent schema mismatch
    const augmentedUser = {
      ...user,
      id: user.id || user.uid || 'usr-' + Math.random().toString(36).substring(2, 9),
      uid: user.uid || user.id || 'usr-' + Math.random().toString(36).substring(2, 9)
    };

    // Save to local list
    const local = getLocalStore<any[]>(KEYS.USERS, []);
    local.push(augmentedUser);
    setLocalStore(KEYS.USERS, local);

    // Save to Supabase if active
    if (isSupabaseActive && supabase) {
      try {
        // Build clean insert payload containing both id (for SQL primary key) and uid (for app compatibility)
        const payload = {
          id: augmentedUser.id,
          uid: augmentedUser.uid,
          email: augmentedUser.email,
          password: augmentedUser.password,
          displayName: augmentedUser.displayName,
          phoneNumber: augmentedUser.phoneNumber,
          createdAt: augmentedUser.createdAt
        };
        const { error } = await supabase.from('users').insert(payload);
        if (error) {
          console.error('Supabase user registration failed', error);
        }
      } catch (err) {
        console.error('Supabase user registration failed exception', err);
      }
    }

    return { success: true };
  },

  verifyUser: async (email: string, password: string): Promise<any | null> => {
    const emailLower = email.toLowerCase();
    const all = await DB.getUsers();
    
    const matched = all.find(
      (u: any) => u.email.toLowerCase() === emailLower && u.password === password
    );

    if (matched) {
      // return clear user without exposing password field
      const { password: _, ...clean } = matched;
      return {
        ...clean,
        uid: clean.uid || clean.id,
        id: clean.id || clean.uid
      };
    }
    return null;
  },

  // Clean DB back to default setup if wanted
  resetToDefaults: () => {
    setLocalStore(KEYS.PRODUCTS, INITIAL_PRODUCTS);
    setLocalStore(KEYS.REVIEWS, INITIAL_REVIEWS);
    setLocalStore(KEYS.BANNERS, INITIAL_BANNERS);
    setLocalStore(KEYS.CONFIG, INITIAL_LANDING_CONFIG);
    setLocalStore(KEYS.ADMINS, INITIAL_ADMINS);
    setLocalStore(KEYS.ORDERS, INITIAL_ORDERS);
    setLocalStore(KEYS.MESSAGES, INITIAL_MESSAGES);
    setLocalStore(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    setLocalStore(KEYS.USERS, [
      {
        uid: 'admin-enath',
        email: 'enath629@gmail.com',
        password: 'adminpassword',
        displayName: 'Admin Enath',
        phoneNumber: '01811122233',
        createdAt: new Date().toISOString()
      }
    ]);
    loadSupabaseClient();
  }
};

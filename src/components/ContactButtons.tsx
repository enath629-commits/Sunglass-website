import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, Phone, X, Send, Sparkles, Check, 
  HelpCircle, ShieldCheck, CheckCheck, Headphones, Image, Paperclip 
} from 'lucide-react';
import { ChatMessage, User } from '../types';
import { DB } from '../lib/db';

interface ContactButtonsProps {
  currentUser: User | null;
  theme: 'light' | 'dark';
  whatsappNumber: string;
  hotlineNumber: string;
}

export default function ContactButtons({ 
  currentUser, theme, whatsappNumber, hotlineNumber 
}: ContactButtonsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const cleanWhatsappLink = `https://wa.me/${whatsappNumber.replace(/\+/g, '').replace(/\s/g, '')}`;
  const isDark = theme === 'dark';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3" id="floating-contact-panel">
      
      {/* Floating Buttons Tray */}
      <div className="flex flex-col gap-2 items-end">
        
        {/* Child items container expanding upward */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 15 }}
              className="flex flex-col gap-2 items-end mb-1"
              id="sub-contact-actions"
            >
              {/* Call element */}
              <motion.a
                id="contact-call-btn"
                href={`tel:${hotlineNumber}`}
                className="flex items-center gap-2 p-3 bg-gradient-to-b from-[#ff7a60] via-[#ff5a3c] to-[#e03a1d] border border-t-white/50 border-[#ff8a74] border-b-[4px] active:border-b-[1px] active:translate-y-[3px] text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all text-xs font-black shadow-orange-500/20 text-decoration-none"
                whileHover={{ y: -2 }}
              >
                <span className="bg-black/20 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide">Hotline</span>
                <span>Call Now</span>
                <Phone size={15} />
              </motion.a>

              {/* WhatsApp direct element */}
              <motion.a
                id="contact-whatsapp-btn"
                href={cleanWhatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-gradient-to-b from-emerald-500 via-emerald-600 to-emerald-700 border border-t-white/50 border-emerald-400 border-b-[4px] active:border-b-[1px] active:translate-y-[3px] text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all text-xs font-black shadow-emerald-500/10 text-decoration-none"
                whileHover={{ y: -2 }}
              >
                <span className="bg-black/20 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide font-sans">WhatsApp</span>
                <span>Message Us</span>
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.197-.242-.584-.487-.506-.669-.516-.174-.007-.371-.012-.568-.012-.197 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </motion.a>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Master Floating Menu Switch Button */}
        <div className="flex items-center">
          <motion.button
            id="contact-menu-trigger"
            onClick={() => setIsOpen(!isOpen)}
            className="w-14 h-14 rounded-full bg-gradient-to-b from-[#14b8a6] via-[#0d9488] to-[#0f766e] border border-t-white/40 border-[#2dd4bf] border-b-[5px] active:border-b-[1.5px] text-white shadow-xl hover:shadow-teal-500/30 flex items-center justify-center transition-all cursor-pointer border-white/10 focus:outline-none relative group"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            title="যোগাযোগ করুন (WhatsApp & Hotline)"
          >
            {/* Pulsing Aura Rings */}
            {!isOpen && (
              <>
                <span className="absolute inset-0 rounded-full bg-emerald-500/30 animate-pulse -z-10" />
                <span className="absolute -inset-1.5 rounded-full bg-emerald-500/10 animate-ping -z-10 opacity-75" />
              </>
            )}

            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -45, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 45, opacity: 0 }}
                >
                  <X size={22} className="stroke-[2.5]" />
                </motion.div>
              ) : (
                <motion.div
                  key="chat"
                  initial={{ rotate: 45, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -45, opacity: 0 }}
                  className="relative flex items-center justify-center"
                >
                  <Phone size={22} className="stroke-[2.2] animate-bounce-slow text-white" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

      </div>
    </div>
  );
}

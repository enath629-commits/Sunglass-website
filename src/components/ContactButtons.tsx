import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, Phone, X, Send, Sparkles, Check, 
  HelpCircle, ShieldCheck, CheckCheck, Headphones 
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
  const [showMessenger, setShowMessenger] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [userName, setUserName] = useState('');
  const [isVisitorSetup, setIsVisitorSetup] = useState(false);
  const [visitorNameInput, setVisitorNameInput] = useState('');
  const [visitorPhoneInput, setVisitorPhoneInput] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize Session ID on mount
  useEffect(() => {
    let sess = localStorage.getItem('__chat_session_id__');
    if (!sess) {
      sess = 'sess-client-' + Math.random().toString(36).substring(2, 11);
      localStorage.setItem('__chat_session_id__', sess);
    }
    setSessionId(sess);

    const savedVisitorName = localStorage.getItem('__chat_visitor_name__');
    if (savedVisitorName) {
      setUserName(savedVisitorName);
      setIsVisitorSetup(true);
    }
  }, []);

  // Update Username if user logs in
  useEffect(() => {
    if (currentUser) {
      setUserName(currentUser.displayName);
      setIsVisitorSetup(true);
    }
  }, [currentUser]);

  // Loading existing message history & Polling for Real-Time admin responses
  useEffect(() => {
    if (!sessionId || !showMessenger) return;

    let active = true;
    const fetchChatMessages = async () => {
      const msgs = await DB.getMessages(sessionId);
      if (active) {
        setMessages(msgs);
      }
    };

    fetchChatMessages();
    const interval = setInterval(fetchChatMessages, 2500); // Poll every 2.5s for snappy updates

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [sessionId, showMessenger]);

  // Scroll to bottom on updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showMessenger, isVisitorSetup]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !sessionId) return;

    const newMsg: ChatMessage = {
      id: 'msg-' + Math.random().toString(36).substring(2, 9),
      senderId: sessionId,
      senderName: userName || 'Anonymous Guest',
      text: inputText.trim(),
      timestamp: new Date().toISOString(),
      isFromAdmin: false,
      sessionId: sessionId
    };

    const ok = await DB.sendMessage(newMsg);
    if (ok) {
      setMessages((prev) => [...prev, newMsg]);
      setInputText('');
    }
  };

  const handleVisitorRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorNameInput.trim()) return;

    const finalName = visitorNameInput.trim();
    localStorage.setItem('__chat_visitor_name__', finalName);
    if (visitorPhoneInput) {
      localStorage.setItem('__chat_visitor_phone__', visitorPhoneInput);
    }
    setUserName(finalName);
    setIsVisitorSetup(true);
  };

  const cleanWhatsappLink = `https://wa.me/${whatsappNumber.replace(/\+/g, '').replace(/\s/g, '')}`;
  const isDark = theme === 'dark';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3" id="floating-contact-panel">
      
      {/* Expanded Messenger Dialog box */}
      <AnimatePresence>
        {showMessenger && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className={`w-[320px] sm:w-[360px] h-[450px] shadow-2xl rounded-2xl border overflow-hidden flex flex-col mb-2 z-50 ${
              isDark 
                ? 'bg-neutral-900 border-neutral-800' 
                : 'bg-white border-neutral-100'
            }`}
            id="chat-messenger-box"
          >
            {/* Messenger Header with Status */}
            <div className="p-4 bg-gradient-to-r from-emerald-650 to-green-500 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="relative w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-sans font-bold">
                  CS
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-emerald-600 rounded-full animate-ping" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-emerald-600 rounded-full" />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-xs sm:text-sm">Live Chat Assistant</h4>
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] text-emerald-100 font-light">Admin is online to assist you</span>
                  </div>
                </div>
              </div>
              <button
                id="close-messenger-btn"
                onClick={() => setShowMessenger(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer flex items-center justify-center gap-1 text-xs"
                title="Close chat"
              >
                <span className="hidden sm:inline font-sans text-[10px]">Close</span>
                <X size={18} />
              </button>
            </div>

            {/* Messenger Body Workspace */}
            <div className={`flex-grow overflow-y-auto p-4 space-y-3 flex flex-col ${
              isDark ? 'bg-neutral-950/80' : 'bg-neutral-50/50'
            }`} id="messenger-body-scroller">
              
              {!isVisitorSetup ? (
                /* Prompt Guest Visitors to identify name/phone before chat */
                <form onSubmit={handleVisitorRegister} className="my-auto space-y-3 p-2 text-center" id="visitor-setup-form">
                  <div className="mx-auto w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-1">
                    <Sparkles size={20} />
                  </div>
                  <div className="space-y-1">
                    <h5 className={`font-semibold text-xs sm:text-sm ${isDark ? 'text-white' : 'text-neutral-800'}`}>
                      Start Conversation
                    </h5>
                    <p className="text-[10px] sm:text-xs text-neutral-400 max-w-xs leading-normal">
                      Please enter your name and mobile number to speak with our support representative.
                    </p>
                  </div>

                  <div className="space-y-2 text-left">
                    <input
                      type="text"
                      required
                      value={visitorNameInput}
                      onChange={(e) => setVisitorNameInput(e.target.value)}
                      placeholder="Your Name (e.g. John Doe)*"
                      className={`w-full p-2.5 rounded-xl text-xs border focus:outline-none transition-all ${
                        isDark 
                          ? 'bg-neutral-850 border-neutral-800 text-white placeholder-neutral-500 focus:border-emerald-500' 
                          : 'bg-white border-neutral-250 text-neutral-800 placeholder-neutral-400 focus:border-emerald-600'
                      }`}
                    />
                    <input
                      type="tel"
                      value={visitorPhoneInput}
                      onChange={(e) => setVisitorPhoneInput(e.target.value)}
                      placeholder="Mobile Number (e.g. +88017xxxxxxxx)"
                      className={`w-full p-2.5 rounded-xl text-xs border focus:outline-none transition-all ${
                        isDark 
                          ? 'bg-neutral-850 border-neutral-800 text-white placeholder-neutral-500 focus:border-emerald-500' 
                          : 'bg-white border-neutral-250 text-neutral-800 placeholder-neutral-400 focus:border-emerald-600'
                      }`}
                    />
                  </div>

                  <button
                    id="submit-visitor-btn"
                    type="submit"
                    className="w-full mt-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-emerald-650 to-green-500 hover:brightness-110 active:scale-95 cursor-pointer transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Start Chatting</span>
                    <MessageSquare size={14} />
                  </button>
                </form>
              ) : (
                /* Connected Chat Log Workspace */
                <>
                  {/* Default Welcome Prompt message */}
                  <div className="flex gap-2.5 max-w-[85%]">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] overflow-hidden flex-shrink-0 font-sans font-bold">
                      A
                    </div>
                    <div className={`p-3 rounded-2xl rounded-tl-none text-xs leading-normal ${
                      isDark ? 'bg-neutral-850 text-neutral-200' : 'bg-white border border-neutral-200 text-neutral-700 shadow-xs'
                    }`}>
                      Hello <b>{userName}</b>! Welcome to Chrono & Shade. How can we help you today with premium watches and lifestyle sunglasses?
                    </div>
                  </div>

                  {/* Rendered dialog thread */}
                  {messages.map((msg) => {
                    const isOwn = msg.senderId === sessionId || !msg.isFromAdmin;
                    return (
                      <div
                        key={msg.id}
                        className={`flex gap-2.5 max-w-[82%] ${isOwn ? 'self-end flex-row-reverse' : ''}`}
                        id={`chat-msg-${msg.id}`}
                      >
                        {!isOwn && (
                          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white flex items-center justify-center text-[10px] overflow-hidden flex-shrink-0 font-sans font-semibold">
                            AD
                          </div>
                        )}
                        <div className={`p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                          isOwn
                            ? 'bg-gradient-to-tr from-emerald-600 to-green-500 text-white rounded-tr-none'
                            : isDark ? 'bg-neutral-850 text-neutral-200 rounded-tl-none' : 'bg-white border border-neutral-200 text-neutral-700 rounded-tl-none shadow-xs'
                        }`}>
                          <p>{msg.text}</p>
                          <span className={`text-[8px] block text-right mt-1 font-sans ${
                            isOwn ? 'text-white/70' : 'text-neutral-400'
                          }`}>
                            {new Date(msg.timestamp).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={chatEndRef} />
                </>
              )}
            </div>

            {/* Messenger Footer Form */}
            {isVisitorSetup && (
              <form onSubmit={handleSendMessage} className={`p-3 border-t flex gap-2 ${
                isDark ? 'border-neutral-800 bg-neutral-900' : 'border-neutral-100 bg-white'
              }`} id="chat-input-form">
                <input
                  type="text"
                  required
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your message here..."
                  className={`flex-grow px-3 py-2 rounded-xl text-xs border focus:outline-none transition-all ${
                    isDark 
                      ? 'bg-neutral-850 border-neutral-800 text-white placeholder-neutral-500 focus:border-emerald-500' 
                      : 'bg-neutral-50 border-neutral-200 text-neutral-805 placeholder-neutral-400 focus:border-emerald-600 focus:bg-white'
                  }`}
                />
                <button
                  id="send-chat-btn"
                  type="submit"
                  className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-650 to-green-500 text-white hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
                >
                  <Send size={15} />
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>

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
                className="flex items-center gap-2 p-3 bg-gradient-to-r from-emerald-605 to-green-500 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all text-xs font-semibold"
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
                className="flex items-center gap-2 p-3 bg-emerald-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all text-xs font-semibold"
                whileHover={{ y: -2 }}
              >
                <span className="bg-black/20 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide font-sans">WhatsApp</span>
                <span>Message Us</span>
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.197-.242-.584-.487-.506-.669-.516-.174-.007-.371-.012-.568-.012-.197 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </motion.a>

              {/* Chat trigger */}
              <motion.button
                id="chat-messenger-trigger"
                onClick={() => {
                  setShowMessenger(true);
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 p-3 bg-gradient-to-r from-emerald-650 to-green-500 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all text-xs font-semibold cursor-pointer"
                whileHover={{ y: -2 }}
              >
                <span className="bg-black/20 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide font-sans">Live Chat</span>
                <span>Open Chat</span>
                <MessageSquare size={15} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Master Floating Menu Switch Button */}
        <div className="flex items-center">
          <motion.button
            id="contact-menu-trigger"
            onClick={() => setIsOpen(!isOpen)}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-green-550 text-white shadow-xl hover:shadow-emerald-500/20 flex items-center justify-center transition-all cursor-pointer border border-white/10 focus:outline-none relative group"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            title="যোগাযোগ ও লাইভ চ্যাট"
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
                  <MessageSquare size={24} className="stroke-[2.2] animate-bounce-slow text-white" />
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

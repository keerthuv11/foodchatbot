import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  IndianRupee,
  ShoppingBag,
  ArrowRight,
  Plus,
  Scale
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FoodItem } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  recommendedFoods?: FoodItem[];
  budgetDetected?: number;
}

export const AIChatDrawer: React.FC<{ isFullPage?: boolean }> = ({ isFullPage = false }) => {
  const {
    isAIChatOpen,
    setIsAIChatOpen,
    addToCart,
    cart,
    user,
    setSelectedFoodItem,
    navigate
  } = useApp();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: `Namaste ${user.name ? user.name.split(' ')[0] : 'there'}! 🙏 I'm your **BudgetBite AI** food concierge.\n\nTell me: **What is your budget**, what are you craving, or how many people are eating?`,
      timestamp: 'Just now',
      recommendedFoods: []
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeakingEnabled, setIsSpeakingEnabled] = useState(false);
  const [compareItems, setCompareItems] = useState<FoodItem[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Voice recognition setup (Web Speech API)
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN'; // Indian English

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
        // Automatically send after voice capture
        handleSend(transcript);
      };

      recognition.onerror = (e: any) => {
        console.warn('Voice recognition error:', e);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Voice recognition is not supported in this browser. Please type your query.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Recognition start failed:', err);
      }
    }
  };

  // Text-to-speech helper
  const speakText = (text: string) => {
    if (!isSpeakingEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_~`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-IN';
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (customText?: string) => {
    const query = customText || inputMessage;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Call server-side /api/chat
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          cartItems: cart,
          userDietary: user.dietaryPreference
        })
      });

      const data = await response.json();

      if (data.success) {
        const aiMsg: Message = {
          id: 'ai-' + Date.now(),
          sender: 'ai',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          recommendedFoods: data.recommendedFoods || [],
          budgetDetected: data.budgetDetected
        };

        setMessages((prev) => [...prev, aiMsg]);
        speakText(data.reply);
      } else {
        throw new Error(data.message || 'AI request failed');
      }
    } catch (err) {
      console.warn('Chat request failed, providing local assistance:', err);
      const fallbackAiMsg: Message = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: `I've analyzed your request: "${query}". Based on your budget, I recommend exploring our top-value specials!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendedFoods: []
      };
      setMessages((prev) => [...prev, fallbackAiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    'Dinner under ₹200',
    'Best Biryani under ₹300',
    'Pure Veg Thali under ₹150',
    'Meal for 2 under ₹400',
    'Snacks under ₹100'
  ];

  const handleAddToCompare = (item: FoodItem) => {
    if (compareItems.find((ci) => ci.id === item.id)) {
      setCompareItems((prev) => prev.filter((ci) => ci.id !== item.id));
    } else {
      if (compareItems.length >= 2) {
        setCompareItems([compareItems[1], item]);
      } else {
        setCompareItems((prev) => [...prev, item]);
      }
      setShowCompareModal(true);
    }
  };

  if (!isAIChatOpen && !isFullPage) return null;

  const content = (
    <div className={`flex flex-col h-full bg-stone-50 ${isFullPage ? 'max-w-4xl mx-auto rounded-3xl border border-stone-200 shadow-xl overflow-hidden' : ''}`}>
      {/* Drawer Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-xs">
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-base tracking-tight">BudgetBite AI Assistant</h2>
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 text-[10px] font-bold border border-emerald-300/30">
                Online
              </span>
            </div>
            <p className="text-xs text-emerald-100 font-medium">
              Tell us your budget. We&apos;ll find your best meal.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Voice Speech Output Toggle */}
          <button
            onClick={() => setIsSpeakingEnabled(!isSpeakingEnabled)}
            className={`p-2 rounded-lg transition ${
              isSpeakingEnabled ? 'bg-amber-400 text-stone-950 font-bold' : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title={isSpeakingEnabled ? 'Mute AI Voice' : 'Enable AI Voice Response'}
          >
            {isSpeakingEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {!isFullPage && (
            <button
              onClick={() => setIsAIChatOpen(false)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
              title="Close Chat"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Chat Messages List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-emerald-600 text-white rounded-br-xs shadow-xs'
                  : 'bg-white text-stone-800 border border-stone-200/80 rounded-bl-xs shadow-xs'
              }`}
            >
              <div className="whitespace-pre-line font-normal">{msg.text}</div>

              {/* If AI recommended foods */}
              {msg.recommendedFoods && msg.recommendedFoods.length > 0 && (
                <div className="mt-4 pt-3 border-t border-stone-100 space-y-2.5">
                  <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    Top Value Matches:
                  </p>
                  <div className="grid grid-cols-1 gap-2.5">
                    {msg.recommendedFoods.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-2.5 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-emerald-50/40 transition"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 rounded-lg object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-stone-900 text-xs truncate">
                            {item.name}
                          </h4>
                          <p className="text-[11px] text-stone-500 truncate">
                            {item.restaurantName} • {item.rating}★
                          </p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-xs font-black text-stone-950">
                              ₹{item.finalPrice}
                            </span>
                            {item.price > item.finalPrice && (
                              <span className="text-[10px] text-stone-400 line-through">
                                ₹{item.price}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col gap-1 shrink-0">
                          <button
                            onClick={() => addToCart(item, 1)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-xs"
                          >
                            <Plus className="w-3 h-3" />
                            Add
                          </button>
                          <button
                            onClick={() => handleAddToCompare(item)}
                            className="px-2 py-0.5 rounded-md border border-stone-300 hover:bg-stone-200 text-stone-700 text-[10px] font-semibold"
                          >
                            Compare
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <span
                className={`block text-[10px] mt-2 font-medium ${
                  msg.sender === 'user' ? 'text-emerald-100 text-right' : 'text-stone-400'
                }`}
              >
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-stone-200 w-fit text-xs text-stone-600 shadow-xs">
            <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
            <span>BudgetBite AI is crunching menus & finding your best meal...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Chips */}
      <div className="px-4 py-2 bg-white/80 border-t border-stone-200/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-black uppercase text-stone-400 whitespace-nowrap">
          Try Asking:
        </span>
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleSend(prompt)}
            className="px-3 py-1 rounded-full bg-stone-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 text-stone-700 text-xs font-semibold whitespace-nowrap border border-stone-200 transition"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box with Voice Mic */}
      <div className="p-4 bg-white border-t border-stone-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          {/* Voice Input Button */}
          <button
            type="button"
            onClick={toggleListening}
            className={`p-2.5 rounded-xl border transition flex items-center justify-center shrink-0 ${
              isListening
                ? 'bg-rose-600 text-white border-rose-700 animate-pulse'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200'
            }`}
            title={isListening ? 'Listening... Tap to stop' : 'Tap to speak your budget query'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            placeholder={
              isListening ? 'Listening to your voice...' : 'Tell us your budget e.g., "Dinner under ₹250"'
            }
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:border-emerald-600 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold transition shrink-0 shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {isListening && (
          <p className="text-[11px] text-rose-600 font-bold mt-2 animate-pulse flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-600"></span>
            Listening... Say something like &ldquo;Biryani under 200 rupees for 2 people&rdquo;
          </p>
        )}
      </div>

      {/* Comparison Modal */}
      {showCompareModal && compareItems.length >= 2 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-5 max-w-lg w-full shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-extrabold text-base text-stone-900 flex items-center gap-2">
                <Scale className="w-5 h-5 text-emerald-600" />
                Value Comparison Matrix
              </h3>
              <button
                onClick={() => setShowCompareModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {compareItems.map((item, idx) => (
                <div key={item.id} className="p-3.5 rounded-2xl border border-stone-200 bg-stone-50 space-y-2">
                  <span className="text-[10px] font-black uppercase text-emerald-700">
                    Option {idx + 1}
                  </span>
                  <img src={item.image} alt={item.name} className="w-full h-24 object-cover rounded-xl" />
                  <h4 className="font-bold text-xs text-stone-900">{item.name}</h4>
                  <div className="text-xs">
                    <span className="font-extrabold text-stone-950 text-sm">₹{item.finalPrice}</span>
                    <span className="text-[11px] text-stone-400 line-through ml-1">₹{item.price}</span>
                  </div>
                  <div className="text-[11px] text-stone-600 space-y-0.5">
                    <p>Rating: <strong className="text-amber-700">{item.rating}★</strong></p>
                    <p>Portion: {item.portionSize}</p>
                    <p>Prep: {item.prepTimeMins} mins</p>
                  </div>
                  <button
                    onClick={() => {
                      addToCart(item, 1);
                      setShowCompareModal(false);
                    }}
                    className="w-full py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700"
                  >
                    Select & Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (isFullPage) {
    return content;
  }

  // Slide-over Drawer for global usage
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div
        className="w-full max-w-md h-full bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {content}
      </div>
    </div>
  );
};

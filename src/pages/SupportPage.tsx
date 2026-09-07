import React, { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Sparkles,
  Phone,
  Mail,
  ShieldCheck,
  Send
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SupportPage: React.FC = () => {
  const { supportTickets, createSupportTicket, setIsAIChatOpen, orders } = useApp();

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [ticketCategory, setTicketCategory] = useState<string>('Order Delivery');
  const [ticketSubject, setTicketSubject] = useState<string>('');
  const [ticketMessage, setTicketMessage] = useState<string>('');
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [ticketSuccess, setTicketSuccess] = useState<boolean>(false);

  const faqs = [
    {
      q: 'How does the BudgetBite AI recommendation engine work?',
      a: 'Our algorithmic scoring engine weighs 5 critical parameters: Budget Fit (optimizing price-to-budget ratios), Customer Ratings (FSSAI verified ratings), Portion Generosity (serves count), Active Discounts, and Kitchen Hygiene scores. Dishes with the best combination receive the "BEST VALUE" badge.'
    },
    {
      q: 'Why are all prices strictly in Indian Rupees (₹ / INR)?',
      a: 'BudgetBite AI is custom-built specifically for Indian food lovers, college students, working professionals, and families. All vendor integrations, menu prices, taxes, and payment gateways strictly operate in Indian Rupees (₹) with zero currency conversion fees.'
    },
    {
      q: 'How do refunds work if I cancel an order?',
      a: 'If you cancel an order before the rider has picked up your food, 100% of your payment is refunded instantly to your original source (UPI, Card, or Net Banking) within 15 minutes.'
    },
    {
      q: 'Can I order Jain or 100% Pure Vegetarian food?',
      a: 'Yes! Filter dishes using our "Pure Veg" or "Jain" toggle. Jain food is prepared strictly without root vegetables (no onion, garlic, potatoes) by verified kitchen partners.'
    },
    {
      q: 'What is the standard delivery fee?',
      a: 'Orders above ₹199 enjoy FREE delivery across our verified restaurant network. Orders below ₹199 carry a nominal delivery fee of ₹25.'
    }
  ];

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) return;

    createSupportTicket(ticketCategory, ticketSubject, ticketMessage, selectedOrderId || undefined);
    setTicketSuccess(true);
    setTicketSubject('');
    setTicketMessage('');
    setTimeout(() => setTicketSuccess(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight flex items-center gap-2">
          <HelpCircle className="w-7 h-7 text-emerald-600" />
          Help & Customer Support
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          24/7 assistance for food orders, payments, refunds, and dietary queries
        </p>
      </div>

      {/* AI Assistant Banner */}
      <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-black text-sm text-stone-900">Need Immediate Help?</h3>
            <p className="text-xs text-stone-600">
              Ask our conversational AI assistant for instant order updates and troubleshooting.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAIChatOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition shrink-0"
        >
          Chat with AI Concierge
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* FAQs */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-lg font-black text-stone-900">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={faq.q}
                  className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-stone-900 hover:bg-stone-50 transition"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-stone-600 leading-relaxed border-t border-stone-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Raise Ticket Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
            <h2 className="text-base font-extrabold text-stone-900">Create Support Ticket</h2>

            {ticketSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-900 text-xs font-bold border border-emerald-200">
                Ticket submitted successfully! We will get back to you shortly.
              </div>
            )}

            <form onSubmit={handleSubmitTicket} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-stone-700">Issue Category</label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-hidden"
                >
                  <option value="Order Delivery">Order Delivery Status</option>
                  <option value="Food Quality">Food Quality & Taste</option>
                  <option value="Refund & Billing">Refund / Payment Issue</option>
                  <option value="Missing Item">Missing Dishes / Items</option>
                  <option value="Dietary Notice">Dietary / Allergen Query</option>
                  <option value="General Feedback">General Feedback</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700">Related Order (Optional)</label>
                <select
                  value={selectedOrderId}
                  onChange={(e) => setSelectedOrderId(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-hidden"
                >
                  <option value="">None / General</option>
                  {orders.map((o) => (
                    <option key={o.id} value={o.id}>
                      #{o.id} - {o.restaurantName} (₹{o.total})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700">Subject</label>
                <input
                  type="text"
                  placeholder="e.g. Rice portion was smaller than expected"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-stone-200 text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700">Description</label>
                <textarea
                  rows={3}
                  placeholder="Provide more details to help our executive assist you faster..."
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  className="w-full mt-1 p-3 rounded-xl border border-stone-200 text-xs"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Submit Support Ticket
              </button>
            </form>
          </div>

          {/* Past Tickets */}
          {supportTickets.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                My Support History ({supportTickets.length})
              </h3>
              {supportTickets.map((t) => (
                <div key={t.id} className="p-4 rounded-2xl border border-stone-200 bg-white space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono font-bold text-stone-400">#{t.id}</span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                        t.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-stone-900">{t.subject}</h4>
                  <p className="text-xs text-stone-500">{t.message}</p>
                  {t.response && (
                    <div className="p-2.5 rounded-xl bg-stone-50 text-[11px] text-stone-700 border border-stone-100">
                      <strong>Executive Response:</strong> {t.response}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { User, Phone, Mail, Sparkles, IndianRupee, Shield, Check, Save } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DietaryType } from '../types';
import karthikaAvatar from '../assets/images/karthika_avatar_1788505371904.jpg';

export const ProfilePage: React.FC = () => {
  const { user, updateUserProfile, orders } = useApp();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [profilePic, setProfilePic] = useState(user.profilePic || karthikaAvatar);
  const [dietary, setDietary] = useState<DietaryType>(user.dietaryPreference);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Total ₹ saved calculation
  const totalSaved = orders.reduce((acc, o) => acc + (o.discount || 0), 450);
  const totalOrdersCount = orders.length;

  const AVATAR_OPTIONS = [
    {
      label: 'Karthika',
      url: karthikaAvatar
    },
    {
      label: 'Girl Avatar 1',
      url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
    },
    {
      label: 'Girl Avatar 2',
      url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
    },
    {
      label: 'Girl Avatar 3',
      url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
    }
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      email,
      phone,
      profilePic,
      dietaryPreference: dietary
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
          My Account & Preferences
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Manage your personal details, dietary constraints, and view savings metrics
        </p>
      </div>

      {/* Savings Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-emerald-50 border border-emerald-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Total ₹ Saved
            </span>
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-950 font-sans mt-2">
            ₹{totalSaved}
          </p>
          <p className="text-[11px] text-emerald-700 mt-0.5">Through BudgetBite AI algorithmic discounts</p>
        </div>

        <div className="p-5 rounded-3xl bg-stone-50 border border-stone-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">
              Total Orders
            </span>
            <Shield className="w-4 h-4 text-stone-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-stone-900 mt-2">
            {totalOrdersCount}
          </p>
          <p className="text-[11px] text-stone-500 mt-0.5">Delivered fresh & on time</p>
        </div>

        <div className="p-5 rounded-3xl bg-amber-50 border border-amber-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
              Loyalty Tier
            </span>
            <Sparkles className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-950 mt-2">
            Bite Gold 🥇
          </p>
          <p className="text-[11px] text-amber-700 mt-0.5">Free delivery on orders above ₹199</p>
        </div>
      </div>

      {/* Profile Edit Form */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Avatar Preview & Selection */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-6 border-b border-stone-100">
            <img
              src={profilePic}
              alt={name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
            />
            <div className="space-y-2">
              <div>
                <h3 className="font-bold text-sm text-stone-900">Profile Photo</h3>
                <p className="text-xs text-stone-500">Choose your avatar:</p>
              </div>
              <div className="flex items-center gap-2">
                {AVATAR_OPTIONS.map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setProfilePic(opt.url)}
                    className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition ${
                      profilePic === opt.url
                        ? 'border-emerald-600 ring-2 ring-emerald-300 scale-105'
                        : 'border-stone-200 hover:border-stone-300 opacity-80'
                    }`}
                  >
                    <img src={opt.url} alt={opt.label} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:border-emerald-600"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:border-emerald-600"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Mobile Number (India)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:border-emerald-600"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Default Dietary Preference
              </label>
              <div className="flex gap-2">
                {(['ALL', 'VEG', 'NON_VEG', 'JAIN'] as DietaryType[]).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDietary(d)}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition ${
                      dietary === d
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {d === 'ALL' ? 'All' : d === 'VEG' ? 'Pure Veg' : d === 'NON_VEG' ? 'Non-Veg' : 'Jain'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
            {savedSuccess ? (
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <Check className="w-4 h-4" /> Preferences saved!
              </span>
            ) : (
              <span className="text-xs text-stone-400">Updates sync in real-time</span>
            )}

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

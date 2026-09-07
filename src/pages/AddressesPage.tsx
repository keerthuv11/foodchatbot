import React, { useState } from 'react';
import { MapPin, Plus, Trash2, CheckCircle2, Home, Briefcase } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AddressesPage: React.FC = () => {
  const { addresses, addAddress, deleteAddress, setDefaultAddress } = useApp();

  const [isAdding, setIsAdding] = useState(false);
  const [label, setLabel] = useState<'HOME' | 'WORK' | 'OTHER'>('HOME');
  const [street, setStreet] = useState('');
  const [area, setArea] = useState('Indiranagar');
  const [city, setCity] = useState('Bengaluru');
  const [pincode, setPincode] = useState('560038');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!street.trim()) return;
    addAddress({
      label,
      street,
      area,
      city,
      pincode,
      isDefault: addresses.length === 0
    });
    setStreet('');
    setIsAdding(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Saved Delivery Addresses
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage your Home, Work, and other frequent meal delivery spots
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition"
        >
          <Plus className="w-4 h-4" /> Add Address
        </button>
      </div>

      {isAdding && (
        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-md animate-in fade-in space-y-4">
          <h3 className="font-extrabold text-sm text-stone-900">Add New Address</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2">
              {(['HOME', 'WORK', 'OTHER'] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLabel(l)}
                  className={`flex-1 py-1.5 rounded-xl border text-xs font-bold transition ${
                    label === l ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-stone-50 text-stone-700'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Flat / Building / Street Address"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border text-xs text-stone-900"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Area / Locality"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border text-xs text-stone-900"
                required
              />
              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border text-xs text-stone-900"
                required
              />
              <input
                type="text"
                placeholder="Pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border text-xs text-stone-900"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 rounded-xl border text-xs font-bold text-stone-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
              >
                Save Address
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`p-5 rounded-3xl bg-white border transition shadow-xs flex flex-col justify-between space-y-4 ${
              addr.isDefault ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-stone-200'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800 text-xs font-black uppercase">
                  {addr.label === 'HOME' && <Home className="w-3.5 h-3.5 text-emerald-600" />}
                  {addr.label === 'WORK' && <Briefcase className="w-3.5 h-3.5 text-amber-600" />}
                  {addr.label}
                </span>
                {addr.isDefault && (
                  <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Default Address
                  </span>
                )}
              </div>

              <p className="font-bold text-stone-900 text-sm">{addr.street}</p>
              <p className="text-xs text-stone-500 mt-1">
                {addr.area}, {addr.city} - {addr.pincode}
              </p>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              {!addr.isDefault ? (
                <button
                  onClick={() => setDefaultAddress(addr.id)}
                  className="font-bold text-emerald-700 hover:underline"
                >
                  Set as Default
                </button>
              ) : (
                <span className="text-stone-400">Primary delivery spot</span>
              )}

              {addresses.length > 1 && (
                <button
                  onClick={() => deleteAddress(addr.id)}
                  className="text-stone-400 hover:text-rose-600 p-1 transition"
                  title="Delete Address"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

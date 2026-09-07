import React, { useState } from 'react';
import {
  MapPin,
  CreditCard,
  CheckCircle,
  Plus,
  ShieldCheck,
  ArrowRight,
  Smartphone,
  Banknote,
  Building,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Address, PaymentMethod } from '../types';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartTotals,
    addresses,
    addAddress,
    placeOrder,
    navigate
  } = useApp();

  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    addresses.find((a) => a.isDefault)?.id || addresses[0]?.id || ''
  );
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('UPI');
  const [upiProvider, setUpiProvider] = useState<string>('gpay');
  const [upiIdInput, setUpiIdInput] = useState<string>('user@okaxis');
  const [deliveryNote, setDeliveryNote] = useState<string>('');
  const [isPlacing, setIsPlacing] = useState<boolean>(false);

  // Add Address Modal state
  const [isAddingAddress, setIsAddingAddress] = useState<boolean>(false);
  const [newAddrType, setNewAddrType] = useState<'HOME' | 'WORK' | 'OTHER'>('HOME');
  const [newStreet, setNewStreet] = useState<string>('');
  const [newArea, setNewArea] = useState<string>('Koramangala');
  const [newCity, setNewCity] = useState<string>('Bengaluru');
  const [newPincode, setNewPincode] = useState<string>('560034');

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-sm font-semibold text-stone-600">Your cart is empty.</p>
        <button
          onClick={() => navigate('explore')}
          className="mt-4 px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl"
        >
          Explore Food
        </button>
      </div>
    );
  }

  const selectedAddress =
    addresses.find((a) => a.id === selectedAddressId) || addresses[0];

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet.trim()) return;
    addAddress({
      label: newAddrType,
      street: newStreet,
      area: newArea,
      city: newCity,
      pincode: newPincode,
      isDefault: false
    });
    setIsAddingAddress(false);
    setNewStreet('');
  };

  const handleConfirmOrder = async () => {
    if (!selectedAddress) {
      alert('Please select or add a delivery address');
      return;
    }

    setIsPlacing(true);
    try {
      const order = await placeOrder(selectedPaymentMethod, selectedAddress);
      navigate('track-order', { orderId: order.id });
    } catch (err) {
      console.error(err);
    } finally {
      setIsPlacing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('cart')}
          className="p-2 rounded-xl text-stone-600 hover:bg-stone-100 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Checkout & Payment
          </h1>
          <p className="text-xs text-stone-500">
            Finalize delivery address and secure payment in Indian Rupees (₹)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: Address & Payment steps */}
        <div className="lg:col-span-8 space-y-6">
          {/* STEP 1: Select Delivery Address */}
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                1. Select Delivery Address
              </h2>
              <button
                onClick={() => setIsAddingAddress(true)}
                className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add New Address
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {addresses.map((addr) => {
                const isSelected = addr.id === selectedAddressId;
                return (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-500'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-800 text-[10px] font-black uppercase">
                        {addr.label}
                      </span>
                      {isSelected && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <p className="text-xs font-bold text-stone-900">{addr.street}</p>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {addr.area}, {addr.city} - {addr.pincode}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Delivery instructions */}
            <div className="pt-2">
              <input
                type="text"
                placeholder="Delivery instructions (e.g. Leave with security, call upon arrival)"
                value={deliveryNote}
                onChange={(e) => setDeliveryNote(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-hidden focus:border-emerald-600"
              />
            </div>
          </div>

          {/* STEP 2: Select Payment Method (Strictly Indian UPI, Cards, NetBanking, COD) */}
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 space-y-5">
            <h2 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              2. Select Payment Method
            </h2>

            <div className="space-y-3">
              {/* UPI Option */}
              <div
                onClick={() => setSelectedPaymentMethod('UPI')}
                className={`p-4 rounded-2xl border cursor-pointer transition ${
                  selectedPaymentMethod === 'UPI'
                    ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-500'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xs">
                      UPI
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-stone-900">
                        Instant UPI (Google Pay, PhonePe, Paytm, QR)
                      </h4>
                      <p className="text-[11px] text-stone-500">Fastest checkout with 0% extra fee</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    checked={selectedPaymentMethod === 'UPI'}
                    onChange={() => setSelectedPaymentMethod('UPI')}
                    className="w-4 h-4 text-emerald-600"
                  />
                </div>

                {selectedPaymentMethod === 'UPI' && (
                  <div className="mt-4 pt-3 border-t border-emerald-200/60 space-y-3">
                    <div className="flex gap-2">
                      {['gpay', 'phonepe', 'paytm', 'bhim'].map((prov) => (
                        <button
                          key={prov}
                          type="button"
                          onClick={() => setUpiProvider(prov)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition border ${
                            upiProvider === prov
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-white text-stone-700 border-stone-200'
                          }`}
                        >
                          {prov}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="yourname@upi or mobile number"
                      value={upiIdInput}
                      onChange={(e) => setUpiIdInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs"
                    />
                  </div>
                )}
              </div>

              {/* Credit / Debit Card Option */}
              <div
                onClick={() => setSelectedPaymentMethod('CARD')}
                className={`p-4 rounded-2xl border cursor-pointer transition ${
                  selectedPaymentMethod === 'CARD'
                    ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-500'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-6 h-6 text-stone-700" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-stone-900">
                        Credit / Debit Card (RuPay, Visa, Mastercard)
                      </h4>
                      <p className="text-[11px] text-stone-500">All Indian bank cards supported</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    checked={selectedPaymentMethod === 'CARD'}
                    onChange={() => setSelectedPaymentMethod('CARD')}
                    className="w-4 h-4 text-emerald-600"
                  />
                </div>

                {selectedPaymentMethod === 'CARD' && (
                  <div className="mt-4 pt-3 border-t border-emerald-200/60 space-y-2.5">
                    <input
                      type="text"
                      placeholder="Card Number (e.g. 4532 •••• •••• 8921)"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="px-3 py-2 rounded-xl border border-stone-200 text-xs"
                      />
                      <input
                        type="password"
                        placeholder="CVV"
                        maxLength={3}
                        className="px-3 py-2 rounded-xl border border-stone-200 text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Net Banking */}
              <div
                onClick={() => setSelectedPaymentMethod('NET_BANKING')}
                className={`p-4 rounded-2xl border cursor-pointer transition ${
                  selectedPaymentMethod === 'NET_BANKING'
                    ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-500'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Building className="w-6 h-6 text-stone-700" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-stone-900">Net Banking</h4>
                      <p className="text-[11px] text-stone-500">HDFC, SBI, ICICI, Axis, Kotak</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    checked={selectedPaymentMethod === 'NET_BANKING'}
                    onChange={() => setSelectedPaymentMethod('NET_BANKING')}
                    className="w-4 h-4 text-emerald-600"
                  />
                </div>
              </div>

              {/* Cash on Delivery (COD) */}
              <div
                onClick={() => setSelectedPaymentMethod('COD')}
                className={`p-4 rounded-2xl border cursor-pointer transition ${
                  selectedPaymentMethod === 'COD'
                    ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-500'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Banknote className="w-6 h-6 text-stone-700" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-stone-900">
                        Cash on Delivery (COD)
                      </h4>
                      <p className="text-[11px] text-stone-500">Pay cash or scan QR when food arrives</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    checked={selectedPaymentMethod === 'COD'}
                    onChange={() => setSelectedPaymentMethod('COD')}
                    className="w-4 h-4 text-emerald-600"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Order Summary & Place Order */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 space-y-5">
            <h3 className="font-extrabold text-sm text-stone-900 uppercase tracking-wider">
              Order Summary
            </h3>

            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.cartItemId} className="flex justify-between text-xs">
                  <span className="text-stone-700 truncate max-w-[200px]">
                    {item.quantity}x {item.foodItem.name}
                  </span>
                  <span className="font-bold text-stone-900">
                    ₹{item.calculatedPrice * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-stone-100 space-y-2 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{cartTotals.subtotal}</span>
              </div>
              {cartTotals.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount</span>
                  <span>-₹{cartTotals.discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Partner Fee</span>
                <span>{cartTotals.deliveryFee === 0 ? 'FREE' : `₹${cartTotals.deliveryFee}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & Fees</span>
                <span>₹{cartTotals.taxes + cartTotals.platformFee}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
              <span className="text-sm font-black text-stone-900">Total Payable</span>
              <span className="text-2xl font-black text-stone-950 font-sans">
                ₹{cartTotals.total}
              </span>
            </div>

            <button
              onClick={handleConfirmOrder}
              disabled={isPlacing}
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              {isPlacing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Processing ₹{cartTotals.total}...</span>
                </>
              ) : (
                <>
                  <span>Pay ₹{cartTotals.total} & Place Order</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Safe & 100% Encrypted Payment (INR)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      {isAddingAddress && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 space-y-4">
            <h3 className="font-extrabold text-base text-stone-900">Add New Delivery Address</h3>
            <form onSubmit={handleCreateAddress} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-stone-700">Label</label>
                <div className="flex gap-2 mt-1">
                  {(['HOME', 'WORK', 'OTHER'] as const).map((lbl) => (
                    <button
                      key={lbl}
                      type="button"
                      onClick={() => setNewAddrType(lbl)}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-bold ${
                        newAddrType === lbl ? 'bg-emerald-600 text-white' : 'bg-stone-50'
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700">Flat / House / Street</label>
                <input
                  type="text"
                  placeholder="Flat 402, Sunshine Heights, 1st Main"
                  value={newStreet}
                  onChange={(e) => setNewStreet(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-xs mt-1"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-stone-700">Area</label>
                  <input
                    type="text"
                    value={newArea}
                    onChange={(e) => setNewArea(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-xs mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700">Pincode</label>
                  <input
                    type="text"
                    value={newPincode}
                    onChange={(e) => setNewPincode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-xs mt-1"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingAddress(false)}
                  className="flex-1 py-2.5 rounded-xl border text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

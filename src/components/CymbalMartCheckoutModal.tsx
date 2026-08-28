import React, { useState } from 'react';
import { 
  ShoppingBag, 
  CheckCircle2, 
  Truck, 
  Store, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  DollarSign, 
  AlertCircle, 
  Percent, 
  Users, 
  QrCode, 
  Share2, 
  Calendar,
  X,
  ChevronRight,
  RefreshCw,
  Award
} from 'lucide-react';
import { PartyPlan, ShoppingItem, CymbalMartOrder, ItemSubstitute } from '../types';

interface CymbalMartCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PartyPlan;
  onApplySubstitutions: (swaps: { itemId: string; newCost: number; newName?: string }[]) => void;
  onOrderPlaced: (order: CymbalMartOrder) => void;
}

export const CymbalMartCheckoutModal: React.FC<CymbalMartCheckoutModalProps> = ({
  isOpen,
  onClose,
  plan,
  onApplySubstitutions,
  onOrderPlaced,
}) => {
  const [checkoutStep, setCheckoutStep] = useState<'refine' | 'fulfillment' | 'confirmed'>('refine');
  const [fulfillmentType, setFulfillmentType] = useState<'express_delivery' | 'curbside_pickup' | 'in_store_scan'>('curbside_pickup');
  const [selectedSlot, setSelectedSlot] = useState('Today, 2:00 PM – 4:00 PM (Before Party Kickoff)');
  const [storeBranch, setStoreBranch] = useState('CymbalMart Supercenter #1042 — West Metro');
  const [addressOrBay, setAddressOrBay] = useState('Bay #4 (Host Vehicle)');
  const [guestAdjustment, setGuestAdjustment] = useState<number>(0);
  const [appliedSavingsSwaps, setAppliedSavingsSwaps] = useState<string[]>([]);
  const [confirmedOrder, setConfirmedOrder] = useState<CymbalMartOrder | null>(null);

  if (!isOpen) return null;

  const totalAdults = Number(plan.details.guestCountAdults) || 0;
  const totalKids = Number(plan.details.guestCountKids) || 0;
  const originalGuestTotal = totalAdults + totalKids;
  const adjustedGuestTotal = Math.max(1, originalGuestTotal + guestAdjustment);
  const scaleRatio = adjustedGuestTotal / (originalGuestTotal || 1);

  // Compute live cart subtotal based on scale & applied substitutions
  let subtotal = plan.shoppingList.reduce((sum, item) => {
    let cost = Number(item.actualCost ?? item.estimatedCost) || 0;
    if (appliedSavingsSwaps.includes(item.id) && item.substituteOption) {
      cost = item.substituteOption.cost;
    }
    return sum + (cost * (scaleRatio !== 1 ? (item.category === 'grocery_fresh' || item.category === 'beverages_bar' ? scaleRatio : 1) : 1));
  }, 0);

  const memberDiscount = subtotal * 0.08; // 8% CymbalMart Member Rewards
  const estimatedTax = (subtotal - memberDiscount) * 0.07;
  const deliveryFee = fulfillmentType === 'express_delivery' ? 4.99 : 0.00;
  const finalTotal = subtotal - memberDiscount + estimatedTax + deliveryFee;
  const budgetDiff = plan.details.budgetLimit - finalTotal;

  // Potential brand savings available
  const availableSwaps: { item: ShoppingItem; sub: ItemSubstitute }[] = plan.shoppingList
    .filter(i => i.substituteOption || i.priority === 'optional' || i.estimatedCost > 15)
    .slice(0, 4)
    .map(item => ({
      item,
      sub: item.substituteOption || {
        name: `CymbalMart Brand ${item.name.split('(')[0].trim()}`,
        cost: Math.max(1.99, Math.round(item.estimatedCost * 0.72 * 100) / 100),
        savings: Math.round(item.estimatedCost * 0.28 * 100) / 100,
        reason: 'Switch to CymbalMart Signature Pantry Brand'
      }
    }));

  const handleToggleSwap = (itemId: string) => {
    if (appliedSavingsSwaps.includes(itemId)) {
      setAppliedSavingsSwaps(prev => prev.filter(id => id !== itemId));
    } else {
      setAppliedSavingsSwaps(prev => [...prev, itemId]);
    }
  };

  const handleApplyAllSwaps = () => {
    const allIds = availableSwaps.map(s => s.item.id);
    setAppliedSavingsSwaps(allIds);
  };

  const handleFinalizeOrder = () => {
    const orderNum = `CYMBAL-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: CymbalMartOrder = {
      id: `order-${Date.now()}`,
      orderNumber: orderNum,
      partyTitle: plan.details.title,
      fulfillmentType,
      pickupOrDeliverySlot: selectedSlot,
      storeBranch,
      addressOrBay: fulfillmentType === 'express_delivery' ? '124 Celebration Ave (Front Door)' : addressOrBay,
      subtotal: Math.round(subtotal * 100) / 100,
      memberDiscount: Math.round(memberDiscount * 100) / 100,
      estimatedTax: Math.round(estimatedTax * 100) / 100,
      deliveryFee,
      finalTotal: Math.round(finalTotal * 100) / 100,
      itemsCount: plan.shoppingList.length,
      orderStatus: 'confirmed',
      createdAt: new Date().toISOString(),
      barcode: `||| | |||| | ||||| ${orderNum} |||| | |||`,
      dietaryNotesChecked: true,
    };

    // Apply any swaps to parent plan state
    if (appliedSavingsSwaps.length > 0) {
      const updates = appliedSavingsSwaps.map(swapId => {
        const swapObj = availableSwaps.find(s => s.item.id === swapId);
        return {
          itemId: swapId,
          newCost: swapObj ? swapObj.sub.cost : 0,
          newName: swapObj ? swapObj.sub.name : undefined,
        };
      });
      onApplySubstitutions(updates);
    }

    setConfirmedOrder(newOrder);
    setCheckoutStep('confirmed');
    onOrderPlaced(newOrder);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white px-6 py-4 flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-blue-900 flex items-center justify-center font-black text-xl shadow-xs">
              ✳
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">CymbalMart Express Checkout & Refinement</h2>
                <span className="bg-amber-400/20 text-amber-300 text-[11px] font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
                  CUJ Step 3: Refine & Checkout
                </span>
              </div>
              <p className="text-xs text-blue-100">
                Adjust constraints, verify budget alignment, and finalize fulfillment for {plan.details.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="bg-blue-50/70 px-6 py-2.5 border-b border-blue-100 flex items-center justify-between text-xs font-semibold text-slate-700">
          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
              checkoutStep === 'refine' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
            }`}>
              1
            </span>
            <span className={checkoutStep === 'refine' ? 'text-blue-700 font-bold' : 'text-slate-600'}>
              Refine Constraints & Swaps
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
              checkoutStep === 'fulfillment' ? 'bg-blue-600 text-white' : checkoutStep === 'confirmed' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              2
            </span>
            <span className={checkoutStep === 'fulfillment' ? 'text-blue-700 font-bold' : 'text-slate-600'}>
              Fulfillment & Budget Check
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
              checkoutStep === 'confirmed' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              3
            </span>
            <span className={checkoutStep === 'confirmed' ? 'text-emerald-700 font-bold' : 'text-slate-500'}>
              Order Finalized
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">

          {/* STEP 1: REFINE CONSTRAINTS */}
          {checkoutStep === 'refine' && (
            <div className="space-y-6">
              
              {/* Dietary & Guest Constraint Check */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Dietary & Guest Headcount Constraints</span>
                  </div>
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    {plan.details.dietaryRestrictions.length > 0 ? `${plan.details.dietaryRestrictions.length} Constraints Active` : 'Standard Catering'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                  {plan.details.dietaryRestrictions.map((diet, idx) => (
                    <span key={idx} className="bg-white border border-emerald-300 text-emerald-800 px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {diet} (Verified in items & recipes)
                    </span>
                  ))}
                  {plan.details.dietaryRestrictions.length === 0 && (
                    <span className="text-slate-500 text-xs italic">No strict allergies logged. All standard pantry items included.</span>
                  )}
                </div>

                {/* Headcount Adjuster */}
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <div className="text-xs text-slate-600">
                    <span className="font-semibold text-slate-800">Live RSVP Adjuster:</span> Adjust list quantities for late RSVPs
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setGuestAdjustment(prev => Math.max(-5, prev - 2))}
                      className="w-7 h-7 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-100"
                    >
                      -2
                    </button>
                    <span className="text-xs font-bold text-slate-800 px-2 min-w-[70px] text-center">
                      {adjustedGuestTotal} Guests {guestAdjustment !== 0 && `(${guestAdjustment > 0 ? `+${guestAdjustment}` : guestAdjustment})`}
                    </span>
                    <button
                      onClick={() => setGuestAdjustment(prev => prev + 2)}
                      className="w-7 h-7 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-100"
                    >
                      +2
                    </button>
                  </div>
                </div>
              </div>

              {/* CymbalMart Brand Substitutions to Save Money */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      CymbalMart Smart Value Substitutions
                    </h3>
                    <p className="text-xs text-slate-500">
                      Swap brand-name ingredients for CymbalMart Signature quality products to optimize budget.
                    </p>
                  </div>
                  {availableSwaps.length > 0 && (
                    <button
                      onClick={handleApplyAllSwaps}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 transition-colors"
                    >
                      Apply All Recommended Swaps
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {availableSwaps.map(({ item, sub }) => {
                    const isApplied = appliedSavingsSwaps.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleToggleSwap(item.id)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                          isApplied
                            ? 'bg-emerald-50/80 border-emerald-400 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-700 line-through text-[11px] opacity-75">
                              {item.name} (${item.estimatedCost.toFixed(2)})
                            </span>
                            <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-1.5 py-0.5 rounded-full">
                              Save ${sub.savings.toFixed(2)}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-slate-900">
                            {sub.name}
                          </p>
                          <p className="text-[11px] text-slate-500 italic">
                            {sub.reason}
                          </p>
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-xs font-extrabold text-emerald-700">
                            ${sub.cost.toFixed(2)}
                          </span>
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                            isApplied ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {isApplied ? '✓ Swapped' : 'Click to Swap'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Budget Alignment Summary Banner */}
              <div className={`p-4 rounded-xl border flex items-center justify-between ${
                budgetDiff >= 0 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white ${
                    budgetDiff >= 0 ? 'bg-emerald-600' : 'bg-rose-600'
                  }`}>
                    $
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider">
                      Budget Alignment Status
                    </h4>
                    <p className="text-sm font-semibold">
                      Current Cart: <strong>${finalTotal.toFixed(2)}</strong> / Budget Limit: <strong>${plan.details.budgetLimit.toFixed(2)}</strong>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    budgetDiff >= 0 ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'
                  }`}>
                    {budgetDiff >= 0 ? `Under Budget by $${budgetDiff.toFixed(2)}` : `Over Budget by $${Math.abs(budgetDiff).toFixed(2)}`}
                  </span>
                </div>
              </div>

            </div>
          )}

          {/* STEP 2: FULFILLMENT & FINAL REVIEW */}
          {checkoutStep === 'fulfillment' && (
            <div className="space-y-6">
              
              {/* Select Fulfillment Method */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900">
                  Select CymbalMart Fulfillment Option
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Curbside Pickup */}
                  <div
                    onClick={() => setFulfillmentType('curbside_pickup')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      fulfillmentType === 'curbside_pickup'
                        ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                        <Store className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full">
                        FREE
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900">Curbside Pickup</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Loaded directly into your trunk at CymbalMart dedicated parking bay.
                    </p>
                  </div>

                  {/* Express Delivery */}
                  <div
                    onClick={() => setFulfillmentType('express_delivery')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      fulfillmentType === 'express_delivery'
                        ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                        <Truck className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full">
                        $4.99
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900">Express 2-Hr Delivery</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Temperature-controlled courier delivers right to your party venue doorstep.
                    </p>
                  </div>

                  {/* In-Store Fast Scan */}
                  <div
                    onClick={() => setFulfillmentType('in_store_scan')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      fulfillmentType === 'in_store_scan'
                        ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                        <QrCode className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded-full">
                        Mobile Map
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900">Aisle-Guided In-Store</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Pre-sorted by exact store aisle sequence for a 15-minute speed run.
                    </p>
                  </div>
                </div>
              </div>

              {/* Location & Time Slot Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    CymbalMart Location
                  </label>
                  <select
                    value={storeBranch}
                    onChange={(e) => setStoreBranch(e.target.value)}
                    className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-lg p-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="CymbalMart Supercenter #1042 — West Metro">CymbalMart Supercenter #1042 — West Metro (1.8 miles)</option>
                    <option value="CymbalMart Supercenter #2088 — North Ridge">CymbalMart Supercenter #2088 — North Ridge (3.4 miles)</option>
                    <option value="CymbalMart Express Hub #0512 — Downtown">CymbalMart Express Hub #0512 — Downtown (0.9 miles)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    Fulfillment Window
                  </label>
                  <select
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-lg p-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Today, 2:00 PM – 4:00 PM (Before Party Kickoff)">Today, 2:00 PM – 4:00 PM (2 hrs before kickoff)</option>
                    <option value="Today, 11:00 AM – 1:00 PM (Morning Prep)">Today, 11:00 AM – 1:00 PM (Morning Prep)</option>
                    <option value="Tomorrow, 9:00 AM – 11:00 AM">Tomorrow, 9:00 AM – 11:00 AM</option>
                  </select>
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2.5">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center justify-between">
                  <span>Order Cost Summary ({plan.shoppingList.length} Items)</span>
                  <span className="text-blue-600 font-semibold lowercase">8% member discount applied</span>
                </h4>

                <div className="flex justify-between text-xs text-slate-600">
                  <span>Items Subtotal:</span>
                  <span className="font-semibold text-slate-800">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-xs text-emerald-700 font-semibold">
                  <span className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    CymbalMart Member Savings:
                  </span>
                  <span>-${memberDiscount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-xs text-slate-600">
                  <span>Estimated Tax (7%):</span>
                  <span>${estimatedTax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-xs text-slate-600">
                  <span>Fulfillment Fee:</span>
                  <span className="font-semibold">{deliveryFee === 0 ? 'FREE ($0.00)' : `$${deliveryFee.toFixed(2)}`}</span>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="text-sm font-extrabold text-slate-900">Total Charged:</span>
                    <span className="block text-[11px] text-slate-500">Includes all items, drinks, and decor</span>
                  </div>
                  <span className="text-lg font-black text-blue-700">
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

            </div>
          )}

          {/* STEP 3: ORDER CONFIRMATION */}
          {checkoutStep === 'confirmed' && confirmedOrder && (
            <div className="text-center py-4 space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900">Party Order Confirmed!</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Order <strong>#{confirmedOrder.orderNumber}</strong> has been routed to <strong>{confirmedOrder.storeBranch}</strong>
                </p>
              </div>

              {/* Digital Barcode & Pickup Pass */}
              <div className="max-w-md mx-auto bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="font-bold text-slate-900">{confirmedOrder.partyTitle}</span>
                  <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    {confirmedOrder.fulfillmentType === 'curbside_pickup' ? 'Curbside Bay Ready' : 'Courier Dispatched'}
                  </span>
                </div>

                {/* Simulated Barcode */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 text-center font-mono tracking-widest text-lg font-bold text-slate-800 shadow-xs">
                  {confirmedOrder.barcode}
                  <span className="block text-[10px] text-slate-400 font-sans tracking-normal mt-1">
                    Scan at store terminal or show to curbside attendant
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-left text-xs">
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Time Slot:</span>
                    <strong className="text-slate-800 text-[11px]">{confirmedOrder.pickupOrDeliverySlot}</strong>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">Total Paid:</span>
                    <strong className="text-blue-700 text-[11px]">${confirmedOrder.finalTotal.toFixed(2)}</strong>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-600 max-w-md mx-auto bg-blue-50 text-blue-900 p-3 rounded-xl border border-blue-200 flex items-center gap-2 text-left">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  All items have been marked in your <strong>Host Prep Timeline</strong> so you stay relaxed and on schedule!
                </span>
              </div>
            </div>
          )}

        </div>

        {/* Footer Navigation Controls */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          {checkoutStep === 'refine' && (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Back to Shopping List
              </button>
              <button
                onClick={() => setCheckoutStep('fulfillment')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-colors"
              >
                <span>Continue to Fulfillment & Review</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}

          {checkoutStep === 'fulfillment' && (
            <>
              <button
                onClick={() => setCheckoutStep('refine')}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
              >
                ← Back to Refinements
              </button>
              <button
                id="btn-finalize-cymbalmart-order"
                onClick={handleFinalizeOrder}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 transition-all hover:scale-102 active:scale-98"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Finalize & Place CymbalMart Order (${finalTotal.toFixed(2)})</span>
              </button>
            </>
          )}

          {checkoutStep === 'confirmed' && (
            <div className="w-full flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-colors"
              >
                Done & Return to Dashboard
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

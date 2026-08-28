import React from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  DollarSign, 
  Users, 
  Clock, 
  ArrowRight, 
  Edit3, 
  ShoppingBag, 
  Layers, 
  AlertTriangle,
  Zap,
  Store,
  ShieldCheck,
  Percent
} from 'lucide-react';
import { PartyPlan } from '../types';

interface CUJStepsHeroProps {
  plan: PartyPlan;
  onOpenDefineModal: () => void;
  onOpenCheckoutModal: () => void;
  onAutoAlignBudget: () => void;
  activeTab: string;
  onSelectTab: (tab: 'shopping' | 'drinks' | 'recipes' | 'timeline' | 'budget') => void;
}

export const CUJStepsHero: React.FC<CUJStepsHeroProps> = ({
  plan,
  onOpenDefineModal,
  onOpenCheckoutModal,
  onAutoAlignBudget,
  activeTab,
  onSelectTab,
}) => {
  const totalCost = plan.shoppingList.reduce((sum, i) => sum + (Number(i.actualCost ?? i.estimatedCost) || 0), 0);
  const budgetLimit = plan.details.budgetLimit || 200;
  const isOverBudget = totalCost > budgetLimit;
  const budgetDifference = Math.abs(budgetLimit - totalCost);
  const totalGuests = (Number(plan.details.guestCountAdults) || 0) + (Number(plan.details.guestCountKids) || 0) + (Number(plan.details.guestCountTeens) || 0);

  const completedItemsCount = plan.shoppingList.filter(i => i.checked).length;
  const totalItemsCount = plan.shoppingList.length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-4 no-print">
      {/* CUJ Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
            ✳
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">
                CymbalMart Event Planning & Shopping Journey
              </h2>
              <span className="text-[11px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                Host AI Concierge
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Convert party intent into a curated, budget-aligned shopping cart with 1-click fulfillment.
            </p>
          </div>
        </div>

        {/* Quick Launch Actions */}
        <div className="flex items-center gap-2">
          {isOverBudget && (
            <button
              onClick={onAutoAlignBudget}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition-colors shadow-xs"
              title="Automatically adjust optional items to fit budget"
            >
              <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span>Auto-Align to ${budgetLimit}</span>
            </button>
          )}
          
          <button
            id="btn-cuj-refine-checkout"
            onClick={onOpenCheckoutModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 transition-all hover:scale-102"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Refine & Checkout</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3 Step Interactive CUJ Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        
        {/* TASK 1: DEFINE EVENT */}
        <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200/80 flex flex-col justify-between space-y-2.5 relative group hover:border-blue-300 transition-colors">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-wider uppercase text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-md">
                Task 1: Define Event
              </span>
              <button
                onClick={onOpenDefineModal}
                className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 font-semibold"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            </div>

            <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
              {plan.details.title}
            </h3>

            <div className="text-xs text-slate-600 space-y-1">
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span><strong>{totalGuests}</strong> Guests ({plan.details.guestCountAdults} Adults{plan.details.guestCountKids > 0 ? `, ${plan.details.guestCountKids} Kids` : ''})</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Theme: <strong className="text-slate-800">{plan.details.theme}</strong> ({plan.details.durationHours} hrs)</span>
              </div>
              {plan.details.dietaryRestrictions.length > 0 && (
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
                  <ShieldCheck className="w-3 h-3 shrink-0" />
                  <span className="line-clamp-1">{plan.details.dietaryRestrictions.join(', ')}</span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
            <span className="font-semibold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Event Defined
            </span>
            <button
              onClick={onOpenDefineModal}
              className="text-blue-600 font-bold hover:underline"
            >
              Re-prompt AI →
            </button>
          </div>
        </div>

        {/* TASK 2: REVIEW LIST & BUDGET ALIGNMENT */}
        <div className={`rounded-xl p-3.5 border flex flex-col justify-between space-y-2.5 transition-colors ${
          activeTab === 'shopping' ? 'bg-blue-50/40 border-blue-300 ring-1 ring-blue-400/20' : 'bg-slate-50/80 border-slate-200/80'
        }`}>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-700 bg-slate-200/80 px-2 py-0.5 rounded-md">
                Task 2: Review List
              </span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                isOverBudget ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {isOverBudget ? `+$${budgetDifference.toFixed(0)} Over Limit` : `-$${budgetDifference.toFixed(0)} Under Limit`}
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Budget Alignment
              </h3>
              <span className="text-xs font-mono font-bold text-slate-700">
                ${totalCost.toFixed(2)} / ${budgetLimit.toFixed(2)}
              </span>
            </div>

            {/* Budget Progress Meter */}
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  isOverBudget ? 'bg-rose-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, Math.round((totalCost / budgetLimit) * 100))}%` }}
              />
            </div>

            <p className="text-xs text-slate-500">
              {totalItemsCount} curated items across {Array.from(new Set(plan.shoppingList.map(i => i.store))).length} store sections.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
            <button
              onClick={() => onSelectTab('shopping')}
              className="text-blue-600 font-bold hover:underline flex items-center gap-1"
            >
              <Layers className="w-3 h-3" />
              <span>Review Checklist ({completedItemsCount}/{totalItemsCount})</span>
            </button>
            {isOverBudget && (
              <button
                onClick={onAutoAlignBudget}
                className="text-amber-700 font-bold hover:underline"
              >
                Auto-Align
              </button>
            )}
          </div>
        </div>

        {/* TASK 3: REFINE & CHECKOUT */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50/60 rounded-xl p-3.5 border border-blue-200 flex flex-col justify-between space-y-2.5">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-wider uppercase text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-md">
                Task 3: Refine & Checkout
              </span>
              <span className="text-[10px] font-bold bg-amber-400 text-blue-950 px-1.5 py-0.5 rounded-md">
                CymbalMart Express
              </span>
            </div>

            <h3 className="text-sm font-bold text-slate-900">
              Constraints & Fulfillment
            </h3>

            <p className="text-xs text-slate-600">
              Adjust dietary constraints, apply CymbalMart brand value swaps, and select 2-hr delivery or curbside pickup.
            </p>
          </div>

          <div className="pt-2 border-t border-blue-200/60 flex items-center justify-between">
            <button
              onClick={onOpenCheckoutModal}
              className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors"
            >
              <span>Finalize & Place Order</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

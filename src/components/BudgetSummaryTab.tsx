import React from 'react';
import { 
  DollarSign, 
  PieChart, 
  Sparkles, 
  Lightbulb, 
  Music, 
  TrendingDown, 
  ShoppingBag, 
  Store,
  CheckCircle,
  Tag
} from 'lucide-react';
import { PartyPlan, StoreType, ItemCategory } from '../types';

interface BudgetSummaryTabProps {
  plan: PartyPlan;
}

export const BudgetSummaryTab: React.FC<BudgetSummaryTabProps> = ({ plan }) => {
  const totalEstimated = plan.shoppingList.reduce((sum, i) => sum + (Number(i.estimatedCost) || 0), 0);
  const totalSpent = plan.shoppingList
    .filter(i => i.checked)
    .reduce((sum, i) => sum + (Number(i.actualCost ?? i.estimatedCost) || 0), 0);

  const budgetLimit = plan.details.budgetLimit || 200;
  const isOverBudget = totalEstimated > budgetLimit;
  const remainingBudget = budgetLimit - totalEstimated;

  // Breakdown by store
  const storeSpend: Record<string, number> = {};
  for (const item of plan.shoppingList) {
    storeSpend[item.store] = (storeSpend[item.store] || 0) + (Number(item.estimatedCost) || 0);
  }

  // Breakdown by category
  const categorySpend: Record<string, number> = {};
  for (const item of plan.shoppingList) {
    categorySpend[item.category] = (categorySpend[item.category] || 0) + (Number(item.estimatedCost) || 0);
  }

  const categoryLabels: Record<string, string> = {
    grocery_fresh: '🥑 Grocery & Fresh Food',
    beverages_bar: '🍹 Beverages & Bar',
    decorations_theme: '🎈 Theme & Decorations',
    tableware_disposables: '🍽️ Tableware & Cutlery',
    games_favors: '🎁 Games & Favors',
    equipment_rentals: '🧊 Equipment & Ice',
    other: '📦 Miscellaneous'
  };

  return (
    <div className="space-y-6">
      {/* Top Budget Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Target Budget */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Party Budget Limit</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {plan.details.currency}{budgetLimit.toFixed(2)}
          </div>
          <p className="text-xs text-slate-500 mt-1">Host ceiling target</p>
        </div>

        {/* Estimated Spend */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Est. Shopping</span>
          <div className={`text-2xl font-extrabold mt-1 ${isOverBudget ? 'text-amber-600' : 'text-emerald-600'}`}>
            {plan.details.currency}{totalEstimated.toFixed(2)}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {isOverBudget ? (
              <span className="text-amber-600 font-semibold">
                +{plan.details.currency}{Math.abs(remainingBudget).toFixed(2)} over budget
              </span>
            ) : (
              <span className="text-emerald-600 font-semibold">
                {plan.details.currency}{remainingBudget.toFixed(2)} remaining buffer
              </span>
            )}
          </p>
        </div>

        {/* Checked/Purchased so far */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Actual Spent So Far</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {plan.details.currency}{totalSpent.toFixed(2)}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Across {plan.shoppingList.filter(i => i.checked).length} of {plan.shoppingList.length} items purchased
          </p>
        </div>
      </div>

      {/* Spend Breakdowns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Store Breakdown */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Store className="w-4 h-4 text-rose-500" />
            <span>Estimated Spend by Store</span>
          </h3>

          <div className="space-y-3">
            {Object.entries(storeSpend)
              .sort(([, a], [, b]) => b - a)
              .map(([store, amount]) => {
                const percent = totalEstimated > 0 ? (amount / totalEstimated) * 100 : 0;
                return (
                  <div key={store} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium text-slate-700">
                      <span>{store}</span>
                      <span className="font-bold">
                        {plan.details.currency}{amount.toFixed(2)} ({percent.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-rose-500 rounded-full transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-indigo-500" />
            <span>Spend by Department / Category</span>
          </h3>

          <div className="space-y-3">
            {Object.entries(categorySpend)
              .sort(([, a], [, b]) => b - a)
              .map(([cat, amount]) => {
                const percent = totalEstimated > 0 ? (amount / totalEstimated) * 100 : 0;
                const label = categoryLabels[cat] || cat;
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium text-slate-700">
                      <span>{label}</span>
                      <span className="font-bold">
                        {plan.details.currency}{amount.toFixed(2)} ({percent.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* AI Tips & Vibe Guide Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Money Saving Tips */}
        <div className="bg-emerald-50/70 rounded-2xl p-5 border border-emerald-200/70 space-y-3">
          <h4 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-emerald-600" />
            <span>Budget Optimization Swaps</span>
          </h4>
          <ul className="space-y-2 text-xs text-emerald-900">
            {plan.budgetTips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span className="leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Theme & Decor Ideas */}
        <div className="bg-pink-50/70 rounded-2xl p-5 border border-pink-200/70 space-y-3">
          <h4 className="text-sm font-bold text-pink-950 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-600" />
            <span>Theme & Visual Styling</span>
          </h4>
          <ul className="space-y-2 text-xs text-pink-900">
            {plan.themeAndDecorIdeas.map((idea, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-pink-600 font-bold">•</span>
                <span className="leading-relaxed">{idea}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Playlist & Flow Guide */}
        <div className="bg-purple-50/70 rounded-2xl p-5 border border-purple-200/70 space-y-3">
          <h4 className="text-sm font-bold text-purple-950 flex items-center gap-2">
            <Music className="w-4 h-4 text-purple-600" />
            <span>Music & Atmosphere Guide</span>
          </h4>
          <ul className="space-y-2 text-xs text-purple-900">
            {plan.playlistAndVibeTips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">•</span>
                <span className="leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

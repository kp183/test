import React from 'react';
import { 
  Sparkles, 
  ShoppingBag, 
  PlusCircle, 
  FolderOpen, 
  Printer, 
  MessageSquare, 
  Share2, 
  Users, 
  Clock, 
  DollarSign,
  Mic
} from 'lucide-react';
import { PartyPlan } from '../types';

interface HeaderProps {
  currentPlan: PartyPlan | null;
  onOpenNewPartyModal: () => void;
  onOpenPresetModal: () => void;
  onOpenExportModal: () => void;
  onOpenCheckoutModal: () => void;
  onOpenVoiceControl: () => void;
  onToggleChat: () => void;
  isChatOpen: boolean;
  totalCheckedItems: number;
  totalItems: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentPlan,
  onOpenNewPartyModal,
  onOpenPresetModal,
  onOpenExportModal,
  onOpenCheckoutModal,
  onOpenVoiceControl,
  onToggleChat,
  isChatOpen,
  totalCheckedItems,
  totalItems,
}) => {
  const totalGuests = currentPlan
    ? (Number(currentPlan.details.guestCountAdults) || 0) +
      (Number(currentPlan.details.guestCountKids) || 0) +
      (Number(currentPlan.details.guestCountTeens) || 0)
    : 0;

  const totalCost = currentPlan?.shoppingList.reduce((sum, item) => sum + (Number(item.estimatedCost) || 0), 0) || 0;
  const spentCost = currentPlan?.shoppingList
    .filter(i => i.checked)
    .reduce((sum, item) => sum + (Number(item.actualCost ?? item.estimatedCost) || 0), 0) || 0;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Brand & Active Event Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-amber-300 font-black text-xl shadow-md shadow-blue-500/20">
              ✳
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-blue-700 text-sm tracking-tight">CymbalMart</span>
                <span className="text-slate-300">/</span>
                <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                  {currentPlan ? currentPlan.details.title : 'Party Planner Shopping Agent'}
                </h1>
                {currentPlan && (
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    {currentPlan.details.theme}
                  </span>
                )}
              </div>
              {currentPlan ? (
                <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500 mt-0.5">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    {totalGuests} Guests ({currentPlan.details.guestCountAdults} Adults{currentPlan.details.guestCountKids > 0 ? `, ${currentPlan.details.guestCountKids} Kids` : ''})
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {currentPlan.details.durationHours} Hours
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    Budget: {currentPlan.details.currency}{currentPlan.details.budgetLimit} (Est: {currentPlan.details.currency}{totalCost.toFixed(0)})
                  </span>
                </div>
              ) : (
                <p className="text-xs text-slate-500">CymbalMart AI Event & Smart Grocery Assistant</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center flex-wrap gap-2">
            <button
              id="btn-open-new-party"
              onClick={onOpenNewPartyModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Define Party</span>
            </button>

            <button
              id="btn-voice-control"
              onClick={onOpenVoiceControl}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition-all shadow-md shadow-blue-500/20 group"
              title="Voice Control: plan party, add items, and checkout hands-free"
            >
              <Mic className="w-3.5 h-3.5 text-amber-300 group-hover:scale-110 transition-transform" />
              <span>Voice Control</span>
            </button>

            <button
              id="btn-open-presets"
              onClick={onOpenPresetModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <FolderOpen className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Party</span> Templates
            </button>

            <button
              id="btn-header-checkout"
              onClick={onOpenCheckoutModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-md shadow-blue-500/20"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
              <span>Refine & Checkout</span>
            </button>

            <button
              id="btn-export-print"
              onClick={onOpenExportModal}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Print or share shopping list"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Export</span>
            </button>

            <button
              id="btn-toggle-agent-chat"
              onClick={onToggleChat}
              className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isChatOpen
                  ? 'bg-blue-700 text-white shadow-md shadow-blue-500/20'
                  : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>CymbalMart Assistant</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </button>
          </div>
        </div>

        {/* Global Progress Strip */}
        {currentPlan && totalItems > 0 && (
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 gap-4">
            <div className="flex items-center gap-2 flex-1">
              <span className="font-semibold text-slate-700 whitespace-nowrap">
                List Progress:
              </span>
              <div className="flex-1 max-w-xs h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-300 rounded-full"
                  style={{ width: `${Math.min(100, Math.round((totalCheckedItems / totalItems) * 100))}%` }}
                />
              </div>
              <span className="text-slate-500 font-semibold">
                {totalCheckedItems} / {totalItems} items ({Math.round((totalCheckedItems / totalItems) * 100)}%)
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-3 text-xs">
              <span className="text-slate-500">
                Cart Total: <strong className="text-blue-700">{currentPlan.details.currency}{totalCost.toFixed(2)}</strong>
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500">
                Budget: <strong className="text-slate-800">{currentPlan.details.currency}{currentPlan.details.budgetLimit.toFixed(2)}</strong>
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

import React, { useState } from 'react';
import { X, Printer, Copy, Check, Download, Share2, FileText, Store } from 'lucide-react';
import { PartyPlan, StoreType, ShoppingItem } from '../types';

interface PrintExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PartyPlan;
}

export const PrintExportModal: React.FC<PrintExportModalProps> = ({
  isOpen,
  onClose,
  plan
}) => {
  const [copiedText, setCopiedText] = useState(false);

  if (!isOpen) return null;

  // Group items by store
  const itemsByStore = new Map<StoreType, ShoppingItem[]>();
  for (const item of plan.shoppingList) {
    if (!itemsByStore.has(item.store)) {
      itemsByStore.set(item.store, []);
    }
    itemsByStore.get(item.store)!.push(item);
  }

  const generateShareableText = () => {
    let text = `🎉 PARTY SHOPPING CHECKLIST: ${plan.details.title.toUpperCase()}\n`;
    text += `📅 Guests: ${plan.details.guestCountAdults} Adults, ${plan.details.guestCountKids} Kids | Duration: ${plan.details.durationHours} hrs\n`;
    text += `💰 Estimated Budget: ${plan.details.currency}${plan.estimatedTotalCost.toFixed(2)}\n\n`;

    itemsByStore.forEach((items, store) => {
      text += `📍 ${store.toUpperCase()}:\n`;
      items.forEach(item => {
        text += `  [ ${item.checked ? 'X' : ' '} ] ${item.name} — ${item.quantity} ${item.unit} (~${plan.details.currency}${item.estimatedCost.toFixed(2)})\n`;
      });
      text += `\n`;
    });

    if (plan.drinkCalculator) {
      text += `🧊 BEVERAGE CALCULATION:\n`;
      text += `• Total Drinks: ${plan.drinkCalculator.totalEstimatedDrinks}\n`;
      text += `• Ice: ${plan.drinkCalculator.icePounds} lbs (${Math.ceil(plan.drinkCalculator.icePounds / 10)} bags)\n`;
      text += `• Beer: ${plan.drinkCalculator.beerCansBottles} cans | Wine: ${plan.drinkCalculator.wineBottles750ml} bottles\n\n`;
    }

    text += `Generated with Party Planner Shopping Agent.`;
    return text;
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(generateShareableText());
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(plan, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${plan.details.title.toLowerCase().replace(/\s+/g, '-')}-plan.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto no-print">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Export & Share Party Master Plan</h2>
              <p className="text-xs text-slate-500">
                Print a formatted shopping checklist, copy to WhatsApp/iMessage, or export JSON.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <button
            onClick={handlePrint}
            className="p-4 rounded-2xl border border-slate-200 hover:border-slate-400 bg-slate-50 hover:bg-white text-left transition-all group"
          >
            <Printer className="w-5 h-5 text-rose-500 mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-bold text-slate-900">Print / Save PDF</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Clean layout for shopping clipboard</div>
          </button>

          <button
            onClick={handleCopyText}
            className="p-4 rounded-2xl border border-slate-200 hover:border-slate-400 bg-slate-50 hover:bg-white text-left transition-all group"
          >
            {copiedText ? (
              <Check className="w-5 h-5 text-emerald-600 mb-2" />
            ) : (
              <Copy className="w-5 h-5 text-indigo-500 mb-2 group-hover:scale-110 transition-transform" />
            )}
            <div className="text-xs font-bold text-slate-900">
              {copiedText ? 'Copied to Clipboard!' : 'Copy for Messaging'}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Formatted text for WhatsApp or SMS</div>
          </button>

          <button
            onClick={handleDownloadJSON}
            className="p-4 rounded-2xl border border-slate-200 hover:border-slate-400 bg-slate-50 hover:bg-white text-left transition-all group"
          >
            <Download className="w-5 h-5 text-amber-500 mb-2 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-bold text-slate-900">Download Plan (.json)</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Backup or import later</div>
          </button>
        </div>

        {/* Text Preview Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Formatted List Preview:</span>
            <button
              onClick={handleCopyText}
              className="text-rose-600 hover:text-rose-700 font-bold inline-flex items-center gap-1"
            >
              {copiedText ? '✓ Copied' : 'Copy All Text'}
            </button>
          </div>
          <pre className="p-4 bg-slate-900 text-slate-100 rounded-2xl text-xs font-mono max-h-64 overflow-y-auto whitespace-pre-wrap leading-relaxed">
            {generateShareableText()}
          </pre>
        </div>
      </div>
    </div>
  );
};

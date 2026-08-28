import React from 'react';
import { X, Sparkles, FolderOpen, Users, Clock, DollarSign, ArrowRight } from 'lucide-react';
import { SAMPLE_PARTY_PRESETS } from '../data/sampleParties';
import { PartyPlan } from '../types';

interface PresetPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: PartyPlan) => void;
}

export const PresetPickerModal: React.FC<PresetPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto no-print">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Curated Party Templates</h2>
              <p className="text-xs text-slate-500">
                Instantly load complete plans with recipes, drinks math, and store-categorized shopping lists.
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SAMPLE_PARTY_PRESETS.map((preset, idx) => {
            const totalGuests = (preset.details.guestCountAdults || 0) + (preset.details.guestCountKids || 0) + (preset.details.guestCountTeens || 0);

            // Determine if it's Scenario 1, 2, or 3
            let scenarioBadge = null;
            if (preset.id === 'preset-kids-superhero-birthday' || preset.details.eventType?.toLowerCase().includes('kids birthday')) {
              scenarioBadge = 'Scenario 1: Kids Superhero Party (15 Guests)';
            } else if (preset.id === 'preset-corporate-team-building' || preset.details.eventType?.toLowerCase().includes('corporate')) {
              scenarioBadge = 'Scenario 2: Corporate Summit (50 Guests)';
            } else if (preset.id === 'preset-outdoor-garden-wedding' || preset.details.eventType?.toLowerCase().includes('wedding')) {
              scenarioBadge = 'Scenario 3: Outdoor Garden Wedding (100 Guests)';
            }

            return (
              <div
                key={preset.id}
                onClick={() => {
                  onSelectPreset(preset);
                  onClose();
                }}
                className="group p-5 rounded-2xl border border-slate-200 hover:border-blue-500 bg-slate-50/50 hover:bg-white hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  {scenarioBadge && (
                    <div className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 border border-blue-200">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>{scenarioBadge}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-200 text-slate-800">
                      {preset.details.eventType}
                    </span>
                    <span className="text-xs font-bold text-emerald-700">
                      {preset.details.currency}{preset.estimatedTotalCost.toFixed(0)} Est.
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {preset.details.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2">
                    {preset.details.specialRequests || preset.details.theme}
                  </p>

                  <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-slate-400 pt-1">
                    <span className="flex items-center gap-1 font-medium text-slate-600">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      {totalGuests} Guests
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-medium text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {preset.details.durationHours} Hours
                    </span>
                    <span>•</span>
                    <span className="font-medium text-slate-600">{preset.shoppingList.length} Items</span>
                  </div>
                </div>

                <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                  <span>Load this plan</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Users, 
  Clock, 
  DollarSign, 
  Wine, 
  Home, 
  ChefHat, 
  Layers, 
  RefreshCw,
  Zap,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PartyDetails, PartyPlan } from '../types';

interface PartyWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanGenerated: (plan: PartyPlan) => void;
}

const PRESET_IDEAS = [
  { title: 'Summer Backyard BBQ & Lawn Games', theme: 'Smoky BBQ & Craft Beer', guests: 20, type: 'Cookout', budget: 250 },
  { title: 'Chic Parisian Wine & Cheese Soirée', theme: 'French Bistro Elegance', guests: 12, type: 'Cocktail Party', budget: 200 },
  { title: 'Retro 90s Arcade & Pizza Game Night', theme: 'Neon 90s Nostalgia', guests: 15, type: 'Game Night', budget: 180 },
  { title: 'Tropical Tiki Luau & Punch Party', theme: 'Polynesian Island Vibe', guests: 24, type: 'Summer Party', budget: 280 },
  { title: 'Kids Dinosaur Safari Adventure', theme: 'Jurassic Dino Explorer', guests: 16, type: 'Kids Birthday', budget: 190 }
];

const DIETARY_OPTIONS = [
  'Vegetarian Friendly',
  'Vegan Options',
  'Gluten-Free',
  'Strictly Nut-Free',
  'Dairy-Free',
  'Halal Friendly',
  'Kosher Style',
  'Low Carb / Keto'
];

export const PartyWizardModal: React.FC<PartyWizardModalProps> = ({
  isOpen,
  onClose,
  onPlanGenerated
}) => {
  const [formData, setFormData] = useState<PartyDetails>({
    id: '',
    title: 'Autumn Harvest Friendsgiving & Cider Bar',
    eventType: 'Dinner & Social',
    theme: 'Rustic Autumn Harvest',
    guestCountAdults: 14,
    guestCountKids: 2,
    guestCountTeens: 0,
    durationHours: 4,
    budgetLimit: 260,
    currency: '$',
    venue: 'Home Indoor',
    vibe: 'Casual & Relaxed',
    dietaryRestrictions: ['Vegetarian Friendly', 'Gluten-Free'],
    drinkPreference: 'Full Bar (Cocktails + Beer + Wine)',
    specialRequests: 'Warm spiced apple cider station with bourbon option, herb-roasted chicken, butternut squash gratin, and caramel apple dessert.'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingMessages = [
    'Analyzing event vibe, guest count, and duration...',
    'Calculating precise food & beverage ratios...',
    'Assigning items to Costco, Supermarket & Specialty stores...',
    'Curating recipes with scalable ingredient formulas...',
    'Generating host countdown & prep schedule...'
  ];

  const handleApplyPreset = (preset: typeof PRESET_IDEAS[0]) => {
    setFormData(prev => ({
      ...prev,
      title: preset.title,
      theme: preset.theme,
      eventType: preset.type,
      guestCountAdults: preset.guests,
      budgetLimit: preset.budget
    }));
  };

  const handleToggleDiet = (diet: string) => {
    setFormData(prev => {
      const exists = prev.dietaryRestrictions.includes(diet);
      return {
        ...prev,
        dietaryRestrictions: exists
          ? prev.dietaryRestrictions.filter(d => d !== diet)
          : [...prev.dietaryRestrictions, diet]
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoadingStep(0);

    // Rotate loading text
    const interval = setInterval(() => {
      setLoadingStep(prev => (prev + 1) % loadingMessages.length);
    }, 1800);

    try {
      const res = await fetch('/api/generate-party-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ details: formData })
      });

      const data = await res.json();
      clearInterval(interval);

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate party plan');
      }

      onPlanGenerated(data.plan);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
      onClose();
    } catch (err: any) {
      console.error('Error generating party plan:', err);
      alert(`Could not generate party plan: ${err.message || 'Please try again'}`);
    } finally {
      clearInterval(interval);
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto no-print">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">AI Party Master Plan Creator</h2>
              <p className="text-xs text-slate-500">
                Tell us your vision — we'll generate the complete shopping checklist, recipes & timeline.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Loading State Overlay */}
        {isLoading ? (
          <div className="py-12 px-6 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto text-rose-600 animate-pulse">
              <RefreshCw className="w-8 h-8 animate-spin text-rose-500" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Crafting Your Custom Party Plan...</h3>
              <p className="text-xs text-rose-600 font-semibold mt-1 animate-fade-in">
                {loadingMessages[loadingStep]}
              </p>
            </div>
            <div className="max-w-xs mx-auto h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 animate-[shimmer_1.5s_infinite] w-full" />
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Preset Inspiration Chips */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Quick Inspiration Presets
              </label>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {PRESET_IDEAS.map((preset, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="px-3 py-1.5 text-xs font-medium bg-slate-50 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 border border-slate-200 rounded-xl text-slate-700 whitespace-nowrap transition-colors"
                  >
                    ✨ {preset.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Event Title & Theme */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Maya's 30th Birthday Soirée"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Theme / Aesthetic</label>
                <input
                  type="text"
                  value={formData.theme}
                  onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                  placeholder="e.g. Speakeasy Cocktail, Boho Picnic, Disco"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Guest Counts & Duration */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Adults</label>
                <input
                  type="number"
                  min="1"
                  max="150"
                  value={formData.guestCountAdults}
                  onChange={(e) => setFormData({ ...formData, guestCountAdults: Number(e.target.value) || 0 })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kids (Under 12)</label>
                <input
                  type="number"
                  min="0"
                  max="80"
                  value={formData.guestCountKids}
                  onChange={(e) => setFormData({ ...formData, guestCountKids: Number(e.target.value) || 0 })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Duration (Hours)</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  step="0.5"
                  value={formData.durationHours}
                  onChange={(e) => setFormData({ ...formData, durationHours: Number(e.target.value) || 3 })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Budget Limit ($)</label>
                <input
                  type="number"
                  min="20"
                  max="5000"
                  value={formData.budgetLimit}
                  onChange={(e) => setFormData({ ...formData, budgetLimit: Number(e.target.value) || 100 })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none font-semibold text-emerald-700"
                />
              </div>
            </div>

            {/* Venue & Vibe */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Venue Type</label>
                <select
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none bg-white"
                >
                  <option value="Home Indoor">Home Indoor</option>
                  <option value="Backyard / Outdoor">Backyard / Outdoor</option>
                  <option value="Park / Picnic">Park / Picnic</option>
                  <option value="Rented Venue / Hall">Rented Venue / Hall</option>
                  <option value="Office / Workplace">Office / Workplace</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Party Vibe</label>
                <select
                  value={formData.vibe}
                  onChange={(e) => setFormData({ ...formData, vibe: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none bg-white"
                >
                  <option value="Casual & Relaxed">Casual & Relaxed</option>
                  <option value="Lively & High-Energy">Lively & High-Energy</option>
                  <option value="Elegant & Sophisticated">Elegant & Sophisticated</option>
                  <option value="Family & Kid Friendly">Family & Kid Friendly</option>
                  <option value="Budget-Conscious">Budget-Conscious</option>
                  <option value="Gourmet Foodie">Gourmet Foodie</option>
                </select>
              </div>
            </div>

            {/* Drink Preference */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Beverage & Bar Style</label>
              <select
                value={formData.drinkPreference}
                onChange={(e) => setFormData({ ...formData, drinkPreference: e.target.value as any })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none bg-white"
              >
                <option value="Full Bar (Cocktails + Beer + Wine)">Full Bar (Cocktails + Beer + Wine)</option>
                <option value="Beer & Wine + Non-Alcoholic">Beer & Wine + Non-Alcoholic</option>
                <option value="Mocktails & Punch (Non-Alcoholic)">Mocktails & Punch (Non-Alcoholic Only)</option>
                <option value="BYOB + Mixers & Ice">BYOB + Mixers, Seltzers & Ice</option>
                <option value="Family Variety">Family Variety (Kid juices + Adult beer/wine)</option>
              </select>
            </div>

            {/* Dietary Restrictions */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Dietary Preferences & Accommodations
              </label>
              <div className="flex flex-wrap gap-2">
                {DIETARY_OPTIONS.map((diet) => {
                  const selected = formData.dietaryRestrictions.includes(diet);
                  return (
                    <button
                      key={diet}
                      type="button"
                      onClick={() => handleToggleDiet(diet)}
                      className={`px-3 py-1 rounded-xl text-xs font-medium border transition-colors flex items-center gap-1 ${
                        selected
                          ? 'bg-rose-50 border-rose-300 text-rose-700 font-semibold'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {selected && <Check className="w-3 h-3 text-rose-600" />}
                      <span>{diet}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Special Requests */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Specific Menu Ideas or Special Requests (Optional)
              </label>
              <textarea
                rows={2}
                value={formData.specialRequests}
                onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                placeholder="e.g. We want a build-your-own burger bar, s'mores station on the firepit, and signature smoked Old Fashioneds."
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 rounded-xl transition-all shadow-md shadow-rose-500/20 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Generate Party Master Plan</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

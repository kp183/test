import React, { useState, useEffect } from 'react';
import { 
  Wine, 
  Beer, 
  GlassWater, 
  Sparkles, 
  Users, 
  Clock, 
  RefreshCw, 
  Check, 
  AlertCircle, 
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PartyPlan, DrinkCalculatorData, ShoppingItem } from '../types';

interface BeverageCalculatorTabProps {
  plan: PartyPlan;
  onSyncToShoppingList: (drinkData: DrinkCalculatorData, itemsToAddOrUpdate: ShoppingItem[]) => void;
}

export const BeverageCalculatorTab: React.FC<BeverageCalculatorTabProps> = ({
  plan,
  onSyncToShoppingList
}) => {
  const [adults, setAdults] = useState<number>(plan.details.guestCountAdults || 12);
  const [kids, setKids] = useState<number>(plan.details.guestCountKids || 0);
  const [duration, setDuration] = useState<number>(plan.details.durationHours || 3);
  
  // Drink split ratios (percentages)
  const [beerPercent, setBeerPercent] = useState<number>(40);
  const [winePercent, setWinePercent] = useState<number>(30);
  const [cocktailPercent, setCocktailPercent] = useState<number>(20);
  const [nonAlcPercent, setNonAlcPercent] = useState<number>(10);
  const [syncedSuccess, setSyncedSuccess] = useState(false);

  // Auto-calculated numbers
  // Rule of thumb: 1.5 drinks per adult in Hour 1, 1 drink per hour thereafter
  const adultDrinksPerPerson = duration <= 1 ? 1.5 : 1.5 + (duration - 1) * 1.0;
  const totalAdultDrinks = Math.round(adults * adultDrinksPerPerson);
  const totalKidDrinks = Math.round(kids * duration * 1.0); // 1 juice/soda per hour

  // Calculated categories
  const calculatedBeerCans = Math.round((totalAdultDrinks * (beerPercent / 100)));
  const calculatedWineGlasses = Math.round((totalAdultDrinks * (winePercent / 100)));
  const calculatedWineBottles = Math.ceil(calculatedWineGlasses / 5); // 5 glasses per 750ml bottle
  
  const calculatedCocktails = Math.round((totalAdultDrinks * (cocktailPercent / 100)));
  const calculatedLiquorBottles750ml = Math.ceil(calculatedCocktails / 16); // 16 drinks (1.5oz) per 750ml bottle
  const calculatedMixerLiters = Math.ceil((calculatedCocktails * 4) / 33.8); // 4 oz mixer per drink

  const calculatedNonAlc = Math.round((totalAdultDrinks * (nonAlcPercent / 100))) + totalKidDrinks;
  
  // Ice: 1.5 lbs per person total (drinks + chilling in cooler)
  const calculatedIceLbs = Math.ceil((adults + kids) * 1.5);
  const calculatedIceBags10lb = Math.ceil(calculatedIceLbs / 10);
  
  // Cups: 1.5 cups per guest (guests misplace cups)
  const calculatedCups = Math.ceil((adults + kids) * 1.75);

  const handleSyncShopping = () => {
    const drinkSummary: DrinkCalculatorData = {
      totalEstimatedDrinks: totalAdultDrinks + totalKidDrinks,
      beerCansBottles: calculatedBeerCans,
      wineBottles750ml: calculatedWineBottles,
      liquorBottles750ml: calculatedLiquorBottles750ml,
      mixerLiters: calculatedMixerLiters,
      sodaAndNonAlcoholicCans: calculatedNonAlc,
      icePounds: calculatedIceLbs,
      cupsTotal: calculatedCups,
      garnishNotes: `${Math.ceil(adults * 0.75)} Fresh limes/lemons, simple syrup, cocktail cherries`,
      calculationFormula: `${adults} adults × ~${adultDrinksPerPerson.toFixed(1)} drinks + ${kids} kids × ~${duration} drinks = ${totalAdultDrinks + totalKidDrinks} total drinks.`
    };

    // Construct shopping items to sync
    const newItems: ShoppingItem[] = [];

    if (calculatedBeerCans > 0) {
      newItems.push({
        id: `drink-beer-${Date.now()}`,
        name: 'Beer Variety (Craft, Lager & Seltzers)',
        category: 'beverages_bar',
        store: 'Liquor / Beverage Store',
        quantity: calculatedBeerCans,
        unit: 'cans/bottles',
        estimatedCost: Math.round(calculatedBeerCans * 1.25),
        checked: false,
        priority: 'essential',
        notes: `Calculated for ${adults} guests.`
      });
    }

    if (calculatedWineBottles > 0) {
      newItems.push({
        id: `drink-wine-${Date.now()}`,
        name: 'Wine (Red & White 750ml bottles)',
        category: 'beverages_bar',
        store: 'Liquor / Beverage Store',
        quantity: calculatedWineBottles,
        unit: 'bottles (750ml)',
        estimatedCost: calculatedWineBottles * 14,
        checked: false,
        priority: 'essential',
        notes: `~${calculatedWineGlasses} glasses total.`
      });
    }

    if (calculatedLiquorBottles750ml > 0) {
      newItems.push({
        id: `drink-liquor-${Date.now()}`,
        name: 'Base Spirits (Vodka, Tequila, Gin, or Rum)',
        category: 'beverages_bar',
        store: 'Liquor / Beverage Store',
        quantity: calculatedLiquorBottles750ml,
        unit: 'bottles (750ml)',
        estimatedCost: calculatedLiquorBottles750ml * 26,
        checked: false,
        priority: 'essential',
        notes: `For ~${calculatedCocktails} cocktails.`
      });
    }

    if (calculatedMixerLiters > 0) {
      newItems.push({
        id: `drink-mixers-${Date.now()}`,
        name: 'Cocktail Mixers (Club Soda, Tonic, Cranberry, Citrus Juices)',
        category: 'beverages_bar',
        store: 'Supermarket / Grocery',
        quantity: calculatedMixerLiters,
        unit: 'liters',
        estimatedCost: calculatedMixerLiters * 2.5,
        checked: false,
        priority: 'essential'
      });
    }

    if (calculatedNonAlc > 0) {
      newItems.push({
        id: `drink-nonalc-${Date.now()}`,
        name: 'Sparkling Seltzer, Sodas & Juice Packs',
        category: 'beverages_bar',
        store: 'Costco / Wholesale Club',
        quantity: calculatedNonAlc,
        unit: 'cans/juice boxes',
        estimatedCost: Math.round(calculatedNonAlc * 0.70),
        checked: false,
        priority: 'essential',
        notes: 'For non-drinkers and kids.'
      });
    }

    if (calculatedIceLbs > 0) {
      newItems.push({
        id: `drink-ice-${Date.now()}`,
        name: 'Party Ice Bags',
        category: 'beverages_bar',
        store: 'Supermarket / Grocery',
        quantity: calculatedIceBags10lb,
        unit: 'bags (10lb each)',
        estimatedCost: calculatedIceBags10lb * 3.0,
        checked: false,
        priority: 'essential',
        notes: `Total ${calculatedIceLbs} lbs (for cooler chilling + clean drink ice).`
      });
    }

    if (calculatedCups > 0) {
      newItems.push({
        id: `drink-cups-${Date.now()}`,
        name: 'Party Beverage Cups & Drink Markers/Sharpie',
        category: 'tableware_disposables',
        store: 'Party Supply / Dollar Tree',
        quantity: calculatedCups,
        unit: 'cups',
        estimatedCost: 8.50,
        checked: false,
        priority: 'essential',
        notes: 'Provide a metallic sharpie so guests write their name on cups.'
      });
    }

    onSyncToShoppingList(drinkSummary, newItems);
    setSyncedSuccess(true);
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 }
    });
    setTimeout(() => setSyncedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Formulas */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none p-6">
          <Wine className="w-48 h-48" />
        </div>

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Beverage & Ice Science Engine</span>
          </div>

          <h2 className="text-xl font-bold text-white">Smart Drink & Bar Estimator</h2>
          <p className="text-xs sm:text-sm text-indigo-200 max-w-2xl">
            Calculated with the Sommelier & Event standard: <strong>1.5 drinks per adult in Hour 1</strong>, followed by <strong>1 drink per hour</strong>. Plus 1.5 lbs of ice per guest for chilling and serving.
          </p>

          {/* Quick Summary Pill */}
          <div className="pt-2 flex flex-wrap gap-4 text-xs">
            <div className="bg-white/10 backdrop-blur px-3 py-1.5 rounded-xl border border-white/10">
              <span className="text-indigo-300">Total Est. Drinks:</span>{' '}
              <strong className="text-white text-sm font-bold">{totalAdultDrinks + totalKidDrinks} drinks</strong>
            </div>
            <div className="bg-white/10 backdrop-blur px-3 py-1.5 rounded-xl border border-white/10">
              <span className="text-indigo-300">Ice Required:</span>{' '}
              <strong className="text-white text-sm font-bold">{calculatedIceLbs} lbs ({calculatedIceBags10lb} bags)</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Controls & Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Input Parameters */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-5">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" />
            <span>Party Size & Length</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Adult Drinking Guests:</span>
                <span className="text-indigo-600 font-bold">{adults}</span>
              </div>
              <input
                type="range"
                min="2"
                max="80"
                value={adults}
                onChange={(e) => setAdults(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Kids / Non-Alcoholic Guests:</span>
                <span className="text-indigo-600 font-bold">{kids}</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={kids}
                onChange={(e) => setKids(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Party Duration (Hours):</span>
                <span className="text-indigo-600 font-bold">{duration} hrs</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                step="0.5"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Guest Beverage Preference Split
            </h4>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span className="flex items-center gap-1"><Beer className="w-3.5 h-3.5 text-amber-500" /> Beer & Seltzers:</span>
                  <strong>{beerPercent}%</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={beerPercent}
                  onChange={(e) => setBeerPercent(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span className="flex items-center gap-1"><Wine className="w-3.5 h-3.5 text-rose-500" /> Wine (Red/White):</span>
                  <strong>{winePercent}%</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={winePercent}
                  onChange={(e) => setWinePercent(Number(e.target.value))}
                  className="w-full accent-rose-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span className="flex items-center gap-1"><GlassWater className="w-3.5 h-3.5 text-indigo-500" /> Cocktails & Spirits:</span>
                  <strong>{cocktailPercent}%</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={cocktailPercent}
                  onChange={(e) => setCocktailPercent(Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-emerald-500" /> Seltzers / Non-Alc:</span>
                  <strong>{nonAlcPercent}%</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={nonAlcPercent}
                  onChange={(e) => setNonAlcPercent(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSyncShopping}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            {syncedSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Synced to Shopping List!</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Sync Quantities to Shopping List</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Calculated Quantities Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Beer */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-start justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 mb-1">
                  <Beer className="w-4 h-4 text-amber-500" />
                  <span>Beer & Seltzers</span>
                </div>
                <div className="text-2xl font-bold text-slate-900">
                  {calculatedBeerCans} <span className="text-xs font-medium text-slate-500">cans/bottles</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  = ~{Math.ceil(calculatedBeerCans / 12)} × 12-packs or {Math.ceil(calculatedBeerCans / 24)} case(s) of 24
                </p>
              </div>
              <div className="text-right text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                ~${(calculatedBeerCans * 1.25).toFixed(0)}
              </div>
            </div>

            {/* Wine */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-start justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 mb-1">
                  <Wine className="w-4 h-4 text-rose-500" />
                  <span>Wine Bottles (750ml)</span>
                </div>
                <div className="text-2xl font-bold text-slate-900">
                  {calculatedWineBottles} <span className="text-xs font-medium text-slate-500">bottles</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Yields ~{calculatedWineGlasses} glasses ({Math.ceil(calculatedWineBottles / 2)} Red, {Math.floor(calculatedWineBottles / 2)} White/Sparkling)
                </p>
              </div>
              <div className="text-right text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-1 rounded-lg border border-rose-200">
                ~${(calculatedWineBottles * 14).toFixed(0)}
              </div>
            </div>

            {/* Liquor & Spirits */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-start justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 mb-1">
                  <GlassWater className="w-4 h-4 text-indigo-500" />
                  <span>Spirits & Cocktails</span>
                </div>
                <div className="text-2xl font-bold text-slate-900">
                  {calculatedLiquorBottles750ml} <span className="text-xs font-medium text-slate-500">bottles (750ml)</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Serves ~{calculatedCocktails} cocktails (1.5 oz standard pours)
                </p>
              </div>
              <div className="text-right text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-200">
                ~${(calculatedLiquorBottles750ml * 26).toFixed(0)}
              </div>
            </div>

            {/* Non-Alcoholic & Sodas */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-start justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  <span>Seltzers, Sodas & Juices</span>
                </div>
                <div className="text-2xl font-bold text-slate-900">
                  {calculatedNonAlc} <span className="text-xs font-medium text-slate-500">cans/bottles</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Includes kid juices + non-drinking adult refreshments
                </p>
              </div>
              <div className="text-right text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                ~${(calculatedNonAlc * 0.70).toFixed(0)}
              </div>
            </div>

            {/* Ice */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-start justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 mb-1">
                  <span className="text-base">🧊</span>
                  <span>Ice (Cooler & Drink Ice)</span>
                </div>
                <div className="text-2xl font-bold text-slate-900">
                  {calculatedIceLbs} <span className="text-xs font-medium text-slate-500">lbs ({calculatedIceBags10lb} × 10lb bags)</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Rule: 1.5 lbs/person (60% in drink cooler, 40% clean drink bucket)
                </p>
              </div>
              <div className="text-right text-xs font-semibold text-cyan-600 bg-cyan-50 px-2 py-1 rounded-lg border border-cyan-200">
                ~${(calculatedIceBags10lb * 3).toFixed(0)}
              </div>
            </div>

            {/* Cups & Glassware */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-start justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 mb-1">
                  <span className="text-base">🥤</span>
                  <span>Cups / Glassware</span>
                </div>
                <div className="text-2xl font-bold text-slate-900">
                  {calculatedCups} <span className="text-xs font-medium text-slate-500">cups</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  1.75 cups per guest + Sharpie marker for name labeling
                </p>
              </div>
              <div className="text-right text-xs font-semibold text-slate-600 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
                ~$8.50
              </div>
            </div>
          </div>

          {/* Pro Bartender Hosting Secrets */}
          <div className="bg-indigo-50/60 rounded-2xl p-4 border border-indigo-200/70 text-xs text-indigo-950 space-y-2">
            <h4 className="font-bold flex items-center gap-1.5 text-indigo-900">
              <Info className="w-4 h-4 text-indigo-600" />
              <span>Pro Host Bar Setup Tips</span>
            </h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-indigo-900/90">
              <li className="flex items-start gap-1.5">
                <span className="text-indigo-600 font-bold">•</span>
                <span><strong>Pre-Chill Drinks:</strong> Put beers and wines into coolers on ice at least 3 hours before guests arrive.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-indigo-600 font-bold">•</span>
                <span><strong>Clean Ice Bucket:</strong> Keep an insulated ice bucket with tongs exclusively for drinking glasses so guests don't scoop melted cooler ice.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-indigo-600 font-bold">•</span>
                <span><strong>Batching:</strong> Mix pitchers of signature punch without ice, then pour over fresh ice in glasses so it doesn't dilute.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-indigo-600 font-bold">•</span>
                <span><strong>Water Station:</strong> Place a large beverage dispenser with ice water and sliced cucumber/lemons right next to the bar.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

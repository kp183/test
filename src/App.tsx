import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Wine, 
  ChefHat, 
  Calendar, 
  PieChart, 
  Sparkles, 
  Plus, 
  FolderOpen, 
  Check, 
  Printer, 
  MessageSquare, 
  Bot,
  Store,
  Layers,
  Utensils
} from 'lucide-react';
import { Header } from './components/Header';
import { CUJStepsHero } from './components/CUJStepsHero';
import { ShoppingListTab } from './components/ShoppingListTab';
import { BeverageCalculatorTab } from './components/BeverageCalculatorTab';
import { MenuAndRecipesTab } from './components/MenuAndRecipesTab';
import { PrepTimelineTab } from './components/PrepTimelineTab';
import { BudgetSummaryTab } from './components/BudgetSummaryTab';
import { PartyWizardModal } from './components/PartyWizardModal';
import { PresetPickerModal } from './components/PresetPickerModal';
import { PrintExportModal } from './components/PrintExportModal';
import { CymbalMartCheckoutModal } from './components/CymbalMartCheckoutModal';
import { AgentChatDrawer } from './components/AgentChatDrawer';
import { VoiceControlModal } from './components/VoiceControlModal';
import { SAMPLE_PARTY_PRESETS } from './data/sampleParties';
import { PartyPlan, ShoppingItem, StoreType, DrinkCalculatorData, TimelineStep, PartyMenuRecipe, CymbalMartOrder } from './types';
import { Mic, Radio } from 'lucide-react';

type TabType = 'shopping' | 'drinks' | 'recipes' | 'timeline' | 'budget';

export default function App() {
  const [currentPlan, setCurrentPlan] = useState<PartyPlan>(() => {
    const saved = localStorage.getItem('active_party_plan');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved party plan:', e);
      }
    }
    return SAMPLE_PARTY_PRESETS[0];
  });

  const [activeTab, setActiveTab] = useState<TabType>('shopping');
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isPresetOpen, setIsPresetOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isVoiceControlOpen, setIsVoiceControlOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Scenario Loader Handler for testing GSP1383 scenarios
  const handleLoadScenario = (scenarioNumber: 1 | 2 | 3) => {
    let targetPreset: PartyPlan | undefined;
    if (scenarioNumber === 1) {
      targetPreset = SAMPLE_PARTY_PRESETS.find(p => p.id === 'preset-kids-superhero-birthday') || SAMPLE_PARTY_PRESETS[0];
    } else if (scenarioNumber === 2) {
      targetPreset = SAMPLE_PARTY_PRESETS.find(p => p.id === 'preset-corporate-team-building') || SAMPLE_PARTY_PRESETS[1];
    } else if (scenarioNumber === 3) {
      targetPreset = SAMPLE_PARTY_PRESETS.find(p => p.id === 'preset-outdoor-garden-wedding') || SAMPLE_PARTY_PRESETS[2];
    }

    if (targetPreset) {
      setCurrentPlan(targetPreset);
      setActiveTab('shopping');
      showToast(`🎯 Loaded Scenario ${scenarioNumber}: "${targetPreset.details.title}"`);
    }
  };

  // Save to localStorage whenever plan changes
  useEffect(() => {
    if (currentPlan) {
      localStorage.setItem('active_party_plan', JSON.stringify(currentPlan));
    }
  }, [currentPlan]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Auto-Align Budget logic (CUJ Step 2)
  const handleAutoAlignBudget = () => {
    setCurrentPlan(prev => {
      let savedAmount = 0;
      const updatedList = prev.shoppingList.map(item => {
        if (item.substituteOption) {
          const savings = item.estimatedCost - item.substituteOption.cost;
          if (savings > 0) {
            savedAmount += savings;
            return {
              ...item,
              name: item.substituteOption.name,
              estimatedCost: item.substituteOption.cost,
              actualCost: item.substituteOption.cost,
              notes: `${item.notes ? item.notes + ' • ' : ''}Auto-aligned: Swapped to CymbalMart store brand (Saved $${savings.toFixed(2)})`
            };
          }
        }
        return item;
      });

      const newTotal = updatedList.reduce((s, i) => s + (Number(i.actualCost ?? i.estimatedCost) || 0), 0);
      return {
        ...prev,
        shoppingList: updatedList,
        estimatedTotalCost: newTotal,
        updatedAt: new Date().toISOString()
      };
    });

    showToast(`⚡ Auto-aligned budget with CymbalMart Store Brands & Member Rollbacks!`);
  };

  // Apply substitutions from checkout modal
  const handleApplySubstitutions = (swaps: { itemId: string; newCost: number; newName?: string }[]) => {
    setCurrentPlan(prev => {
      const updatedList = prev.shoppingList.map(item => {
        const swap = swaps.find(s => s.itemId === item.id);
        if (swap) {
          return {
            ...item,
            name: swap.newName || item.name,
            estimatedCost: swap.newCost,
            actualCost: swap.newCost,
            notes: `${item.notes ? item.notes + ' • ' : ''}CymbalMart Brand Rollback Applied`
          };
        }
        return item;
      });

      const newTotal = updatedList.reduce((s, i) => s + (Number(i.actualCost ?? i.estimatedCost) || 0), 0);
      return {
        ...prev,
        shoppingList: updatedList,
        estimatedTotalCost: newTotal,
        updatedAt: new Date().toISOString()
      };
    });

    showToast(`Applied brand swaps and cost savings to your party plan!`);
  };

  // Order placed confirmation
  const handleOrderPlaced = (order: CymbalMartOrder) => {
    showToast(`🎉 Order #${order.id.slice(-6)} placed successfully! Ready for pickup/delivery.`);
  };

  // Item Handlers
  const handleToggleItem = (itemId: string) => {
    setCurrentPlan(prev => {
      const updatedList = prev.shoppingList.map(item =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      );
      return { ...prev, shoppingList: updatedList, updatedAt: new Date().toISOString() };
    });
  };

  const handleAddItem = (newItem: Omit<ShoppingItem, 'id'>) => {
    const itemWithId: ShoppingItem = {
      ...newItem,
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
    };

    setCurrentPlan(prev => {
      const updatedList = [itemWithId, ...prev.shoppingList];
      const newTotal = updatedList.reduce((s, i) => s + (Number(i.estimatedCost) || 0), 0);
      return {
        ...prev,
        shoppingList: updatedList,
        estimatedTotalCost: newTotal,
        updatedAt: new Date().toISOString()
      };
    });

    showToast(`Added "${newItem.name}" to shopping list.`);
  };

  const handleDeleteItem = (itemId: string) => {
    setCurrentPlan(prev => {
      const updatedList = prev.shoppingList.filter(i => i.id !== itemId);
      const newTotal = updatedList.reduce((s, i) => s + (Number(i.estimatedCost) || 0), 0);
      return {
        ...prev,
        shoppingList: updatedList,
        estimatedTotalCost: newTotal,
        updatedAt: new Date().toISOString()
      };
    });
  };

  const handleUpdateItem = (itemId: string, updates: Partial<ShoppingItem>) => {
    setCurrentPlan(prev => {
      const updatedList = prev.shoppingList.map(i =>
        i.id === itemId ? { ...i, ...updates } : i
      );
      const newTotal = updatedList.reduce((s, i) => s + (Number(i.estimatedCost) || 0), 0);
      return {
        ...prev,
        shoppingList: updatedList,
        estimatedTotalCost: newTotal,
        updatedAt: new Date().toISOString()
      };
    });
  };

  const handleBulkCheckStore = (store: StoreType, checkState: boolean) => {
    setCurrentPlan(prev => {
      const updatedList = prev.shoppingList.map(item =>
        item.store === store ? { ...item, checked: checkState } : item
      );
      return { ...prev, shoppingList: updatedList, updatedAt: new Date().toISOString() };
    });
    showToast(`${checkState ? 'Marked all' : 'Unchecked all'} items for ${store}.`);
  };

  // CymbalMart Assistant Chat plan modifications applicator with automatic budget recalculation
  const handleApplyPlanModifications = (
    newItems?: ShoppingItem[],
    removedNames?: string[],
    swaps?: { originalName: string; newName: string; category?: string; store?: string; quantity?: string; unit?: string; estimatedCost: number; aisleLocation?: string; notes?: string }[],
    updates?: { nameMatch: string; newQuantity?: string; newEstimatedCost?: number; newNotes?: string }[],
    newRecipe?: PartyMenuRecipe,
    updatedDetails?: any
  ): { previousTotal: number; newTotal: number; budgetLimit: number; variance: number; itemsCount: number; totalSavings?: number } => {
    let budgetCalculation = {
      previousTotal: currentPlan.estimatedTotalCost,
      newTotal: currentPlan.estimatedTotalCost,
      budgetLimit: currentPlan.details.budgetLimit,
      variance: currentPlan.estimatedTotalCost - currentPlan.details.budgetLimit,
      itemsCount: currentPlan.shoppingList.length,
      totalSavings: 0
    };

    setCurrentPlan(prev => {
      const prevTotal = prev.shoppingList.reduce((s, i) => s + (Number(i.actualCost ?? i.estimatedCost) || 0), 0);
      let nextList = [...prev.shoppingList];

      // 1. Handle Removals
      if (removedNames && removedNames.length > 0) {
        const lowerRemovals = removedNames.map(r => r.toLowerCase().trim());
        nextList = nextList.filter(item => {
          const itemNameLower = item.name.toLowerCase();
          return !lowerRemovals.some(rem => itemNameLower.includes(rem) || rem.includes(itemNameLower));
        });
      }

      // 2. Handle Swaps
      if (swaps && swaps.length > 0) {
        nextList = nextList.map(item => {
          const itemLower = item.name.toLowerCase();
          const swapMatch = swaps.find(s => {
            const sLower = s.originalName.toLowerCase().trim();
            return itemLower.includes(sLower) || sLower.includes(itemLower);
          });

          if (swapMatch) {
            return {
              ...item,
              name: swapMatch.newName,
              category: (swapMatch.category as any) || item.category,
              store: (swapMatch.store as any) || item.store,
              quantity: swapMatch.quantity || item.quantity,
              unit: swapMatch.unit || item.unit,
              estimatedCost: swapMatch.estimatedCost,
              actualCost: swapMatch.estimatedCost,
              aisleLocation: swapMatch.aisleLocation || item.aisleLocation,
              notes: swapMatch.notes ? `${item.notes ? item.notes + ' • ' : ''}${swapMatch.notes}` : item.notes,
              isCymbalMartBrand: true
            };
          }
          return item;
        });
      }

      // 3. Handle Item Updates (e.g. quantity / price adjustments)
      if (updates && updates.length > 0) {
        nextList = nextList.map(item => {
          const itemLower = item.name.toLowerCase();
          const updateMatch = updates.find(u => {
            const uLower = u.nameMatch.toLowerCase().trim();
            return itemLower.includes(uLower) || uLower.includes(itemLower);
          });

          if (updateMatch) {
            return {
              ...item,
              quantity: updateMatch.newQuantity ?? item.quantity,
              estimatedCost: updateMatch.newEstimatedCost ?? item.estimatedCost,
              actualCost: updateMatch.newEstimatedCost ?? item.actualCost,
              notes: updateMatch.newNotes ? `${item.notes ? item.notes + ' • ' : ''}${updateMatch.newNotes}` : item.notes
            };
          }
          return item;
        });
      }

      // 4. Handle Additions
      if (newItems && newItems.length > 0) {
        nextList = [...newItems, ...nextList];
      }

      // 5. Handle New Recipe
      let nextRecipes = [...prev.menuRecipes];
      if (newRecipe) {
        nextRecipes = [
          ...nextRecipes,
          {
            ...newRecipe,
            id: `recipe-cymb-${Date.now()}`,
            servings: newRecipe.servings || prev.details.guestCountAdults || 10,
            prepTimeMinutes: newRecipe.prepTimeMinutes || 15,
            instructions: newRecipe.instructions || [],
            dietaryTags: newRecipe.dietaryTags || []
          }
        ];
      }

      // 6. Handle Details Update
      const nextDetails = updatedDetails
        ? { ...prev.details, ...updatedDetails }
        : prev.details;

      // 7. Automatic Budget Recalculation
      const newTotal = nextList.reduce((s, i) => s + (Number(i.actualCost ?? i.estimatedCost) || 0), 0);
      const budgetLimit = Number(nextDetails.budgetLimit) || 0;
      const variance = newTotal - budgetLimit;
      const savings = prevTotal > newTotal ? prevTotal - newTotal : 0;

      budgetCalculation = {
        previousTotal: prevTotal,
        newTotal,
        budgetLimit,
        variance,
        itemsCount: nextList.length,
        totalSavings: savings
      };

      return {
        ...prev,
        details: nextDetails,
        shoppingList: nextList,
        menuRecipes: nextRecipes,
        estimatedTotalCost: newTotal,
        updatedAt: new Date().toISOString()
      };
    });

    showToast(`⚡ CymbalMart Assistant updated list & recalculated budget (${currentPlan.details.currency}${budgetCalculation.newTotal.toFixed(2)})`);
    return budgetCalculation;
  };

  // Drink Calculator sync
  const handleSyncDrinkData = (drinkData: DrinkCalculatorData, newItems: ShoppingItem[]) => {
    setCurrentPlan(prev => {
      const filtered = prev.shoppingList.filter(i => !i.id.startsWith('drink-'));
      const combined = [...newItems, ...filtered];
      const newTotal = combined.reduce((s, i) => s + (Number(i.estimatedCost) || 0), 0);

      return {
        ...prev,
        drinkCalculator: drinkData,
        shoppingList: combined,
        estimatedTotalCost: newTotal,
        updatedAt: new Date().toISOString()
      };
    });

    showToast(`Beverage calculations synced into shopping checklist!`);
  };

  // Recipe ingredients to shopping
  const handleAddRecipeIngredients = (items: Omit<ShoppingItem, 'id'>[]) => {
    const itemsWithIds: ShoppingItem[] = items.map((item, idx) => ({
      ...item,
      id: `recipe-ing-${Date.now()}-${idx}`
    }));

    setCurrentPlan(prev => {
      const updatedList = [...itemsWithIds, ...prev.shoppingList];
      const newTotal = updatedList.reduce((s, i) => s + (Number(i.estimatedCost) || 0), 0);
      return {
        ...prev,
        shoppingList: updatedList,
        estimatedTotalCost: newTotal,
        updatedAt: new Date().toISOString()
      };
    });

    showToast(`Added ${items.length} recipe ingredients to shopping list!`);
  };

  // Timeline handlers
  const handleToggleTimelineStep = (stepId: string) => {
    setCurrentPlan(prev => {
      const updatedTimeline = prev.timeline.map(step =>
        step.id === stepId ? { ...step, completed: !step.completed } : step
      );
      return { ...prev, timeline: updatedTimeline, updatedAt: new Date().toISOString() };
    });
  };

  const handleAddTimelineStep = (newStep: Omit<TimelineStep, 'id' | 'completed'>) => {
    const stepWithId: TimelineStep = {
      ...newStep,
      id: `timeline-custom-${Date.now()}`,
      completed: false
    };

    setCurrentPlan(prev => ({
      ...prev,
      timeline: [...prev.timeline, stepWithId],
      updatedAt: new Date().toISOString()
    }));

    showToast(`Added task to countdown timeline.`);
  };

  const totalChecked = currentPlan?.shoppingList.filter(i => i.checked).length || 0;
  const totalItems = currentPlan?.shoppingList.length || 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Header */}
      <Header
        currentPlan={currentPlan}
        onOpenNewPartyModal={() => setIsWizardOpen(true)}
        onOpenPresetModal={() => setIsPresetOpen(true)}
        onOpenExportModal={() => setIsExportOpen(true)}
        onOpenCheckoutModal={() => setIsCheckoutOpen(true)}
        onOpenVoiceControl={() => setIsVoiceControlOpen(true)}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        isChatOpen={isChatOpen}
        totalCheckedItems={totalChecked}
        totalItems={totalItems}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Scenario Testing & Voice Control Quick Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white rounded-2xl p-3.5 sm:p-4 shadow-lg border border-blue-900/50 flex flex-col md:flex-row md:items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600/40 border border-blue-400/40 flex items-center justify-center text-amber-300 font-bold text-sm shrink-0">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-blue-300">GSP1383 Scenario Testing</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  3 Presets & Hands-Free
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Validate agent across diverse event scales, guest counts, and budget limits.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              id="btn-test-scenario-1"
              onClick={() => handleLoadScenario(1)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-blue-600/80 border border-slate-700 text-slate-200 hover:text-white transition-all shadow-xs"
              title="Scenario 1: Children's Birthday Party (15 guests, Superhero)"
            >
              <span className="text-amber-300 mr-1">1.</span> Kids Birthday (15)
            </button>

            <button
              id="btn-test-scenario-2"
              onClick={() => handleLoadScenario(2)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-blue-600/80 border border-slate-700 text-slate-200 hover:text-white transition-all shadow-xs"
              title="Scenario 2: Corporate Team Building Event (50 guests, Professional)"
            >
              <span className="text-amber-300 mr-1">2.</span> Corporate (50)
            </button>

            <button
              id="btn-test-scenario-3"
              onClick={() => handleLoadScenario(3)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-blue-600/80 border border-slate-700 text-slate-200 hover:text-white transition-all shadow-xs"
              title="Scenario 3: Outdoor Wedding (100 guests, Garden)"
            >
              <span className="text-amber-300 mr-1">3.</span> Wedding (100)
            </button>

            <button
              id="btn-trigger-voice-modal"
              onClick={() => setIsVoiceControlOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white transition-all shadow-md shadow-blue-500/30 flex items-center gap-1.5 group"
            >
              <Mic className="w-3.5 h-3.5 text-amber-300 group-hover:scale-110 transition-transform" />
              <span>Voice Control</span>
            </button>
          </div>
        </div>

        {/* Critical User Journey (CUJ) Workflow Hero */}
        <CUJStepsHero
          plan={currentPlan}
          onOpenDefineModal={() => setIsWizardOpen(true)}
          onOpenCheckoutModal={() => setIsCheckoutOpen(true)}
          onAutoAlignBudget={handleAutoAlignBudget}
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
        />

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-200 no-print">
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-px scrollbar-none">
            <button
              id="tab-shopping"
              onClick={() => setActiveTab('shopping')}
              className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'shopping'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Shopping Checklist</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[11px] font-bold ${
                  activeTab === 'shopping' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {totalChecked}/{totalItems}
              </span>
            </button>

            <button
              id="tab-drinks"
              onClick={() => setActiveTab('drinks')}
              className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'drinks'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Wine className="w-4 h-4" />
              <span>Drink & Bar Math</span>
            </button>

            <button
              id="tab-recipes"
              onClick={() => setActiveTab('recipes')}
              className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'recipes'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <ChefHat className="w-4 h-4" />
              <span>Menu & Recipes</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[11px] font-bold ${
                  activeTab === 'recipes' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {currentPlan.menuRecipes.length}
              </span>
            </button>

            <button
              id="tab-timeline"
              onClick={() => setActiveTab('timeline')}
              className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'timeline'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Host Prep Timeline</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[11px] font-bold ${
                  activeTab === 'timeline' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {currentPlan.timeline.filter(t => t.completed).length}/{currentPlan.timeline.length}
              </span>
            </button>

            <button
              id="tab-budget"
              onClick={() => setActiveTab('budget')}
              className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'budget'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <PieChart className="w-4 h-4" />
              <span>Budget & Atmosphere</span>
            </button>
          </div>
        </div>

        {/* Tab Content Display */}
        <div className="no-print">
          {activeTab === 'shopping' && (
            <ShoppingListTab
              plan={currentPlan}
              onToggleItem={handleToggleItem}
              onAddItem={handleAddItem}
              onDeleteItem={handleDeleteItem}
              onUpdateItem={handleUpdateItem}
              onBulkCheckStore={handleBulkCheckStore}
              onOpenCheckout={() => setIsCheckoutOpen(true)}
              onAutoAlignBudget={handleAutoAlignBudget}
            />
          )}

          {activeTab === 'drinks' && (
            <BeverageCalculatorTab
              plan={currentPlan}
              onSyncToShoppingList={handleSyncDrinkData}
            />
          )}

          {activeTab === 'recipes' && (
            <MenuAndRecipesTab
              plan={currentPlan}
              onAddIngredientsToShopping={handleAddRecipeIngredients}
            />
          )}

          {activeTab === 'timeline' && (
            <PrepTimelineTab
              plan={currentPlan}
              onToggleTimelineStep={handleToggleTimelineStep}
              onAddTimelineStep={handleAddTimelineStep}
            />
          )}

          {activeTab === 'budget' && (
            <BudgetSummaryTab plan={currentPlan} />
          )}
        </div>

        {/* Printable View (Rendered exclusively when printing) */}
        <div className="hidden print:block space-y-6 text-black">
          <div className="border-b-2 border-black pb-4">
            <h1 className="text-2xl font-bold">CymbalMart Party Shopping Plan: {currentPlan.details.title}</h1>
            <p className="text-sm text-gray-700">
              Theme: {currentPlan.details.theme} | Guests: {currentPlan.details.guestCountAdults} Adults, {currentPlan.details.guestCountKids} Kids | Duration: {currentPlan.details.durationHours} hrs
            </p>
            <p className="text-sm text-gray-700">
              Estimated Total: {currentPlan.details.currency}{currentPlan.estimatedTotalCost.toFixed(2)} (Budget Limit: {currentPlan.details.currency}{currentPlan.details.budgetLimit})
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold uppercase tracking-wider">Shopping List by Store / Section</h2>
            {Array.from(
              new Set(currentPlan.shoppingList.map(i => i.store))
            ).map(store => {
              const storeItems = currentPlan.shoppingList.filter(i => i.store === store);
              return (
                <div key={store} className="mb-4">
                  <h3 className="font-bold text-sm bg-gray-100 p-1 border-b border-gray-300">
                    📍 {store} ({storeItems.length} items)
                  </h3>
                  <ul className="text-xs divide-y divide-gray-200 mt-1">
                    {storeItems.map(item => (
                      <li key={item.id} className="py-1 flex justify-between">
                        <span>[  ] {item.name} — {item.quantity} {item.unit} {item.aisleLocation ? `[${item.aisleLocation}]` : ''} {item.notes ? `(${item.notes})` : ''}</span>
                        <span className="font-mono">{currentPlan.details.currency}{item.estimatedCost.toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Floating Hands-Free Actions Bar */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3 no-print">
        <button
          id="btn-fab-voice-control"
          onClick={() => setIsVoiceControlOpen(true)}
          className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full shadow-2xl hover:shadow-blue-500/40 border border-blue-400/40 transition-all duration-300 transform hover:scale-105 group"
          title="Start Hands-Free Voice Control"
        >
          <Mic className="w-5 h-5 text-amber-300 animate-pulse" />
          <div className="flex flex-col items-start text-left">
            <span className="text-xs font-bold">Voice Control</span>
            <span className="text-[10px] text-blue-200">Hands-free planning</span>
          </div>
        </button>

        {!isChatOpen && (
          <button
            id="btn-fab-cymbalmart-assistant"
            onClick={() => setIsChatOpen(true)}
            className="flex items-center gap-2.5 px-4 py-3 bg-slate-950 hover:bg-slate-900 text-white rounded-full shadow-2xl hover:shadow-blue-500/25 border border-slate-700 transition-all duration-300 transform hover:scale-105 group"
          >
            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-amber-300 font-black text-xs shadow-inner">
              ✳
            </div>
            <div className="flex flex-col items-start text-left hidden sm:flex">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-100">
                <span>CymbalMart Assistant</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <div className="text-[10px] text-blue-200">
                {currentPlan.details.currency}{currentPlan.estimatedTotalCost.toFixed(2)} Total • Live Update
              </div>
            </div>
          </button>
        )}
      </div>

      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-slate-900 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200 border border-slate-700 no-print">
          <Check className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals & Drawers */}
      <PartyWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onPlanGenerated={(newPlan) => {
          setCurrentPlan(newPlan);
          setActiveTab('shopping');
          showToast(`Master Plan for "${newPlan.details.title}" ready!`);
        }}
      />

      <PresetPickerModal
        isOpen={isPresetOpen}
        onClose={() => setIsPresetOpen(false)}
        onSelectPreset={(preset) => {
          setCurrentPlan(preset);
          setActiveTab('shopping');
          showToast(`Loaded template: "${preset.details.title}".`);
        }}
      />

      <PrintExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        plan={currentPlan}
      />

      <CymbalMartCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        plan={currentPlan}
        onApplySubstitutions={handleApplySubstitutions}
        onOrderPlaced={handleOrderPlaced}
      />

      <AgentChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        currentPlan={currentPlan}
        onApplyPlanModifications={handleApplyPlanModifications}
        onNavigateToShoppingTab={() => {
          setActiveTab('shopping');
          setIsChatOpen(false);
        }}
      />

      <VoiceControlModal
        isOpen={isVoiceControlOpen}
        onClose={() => setIsVoiceControlOpen(false)}
        currentPlan={currentPlan}
        onApplyPlanModifications={handleApplyPlanModifications}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          setIsVoiceControlOpen(false);
        }}
        onOpenCheckout={() => {
          setIsVoiceControlOpen(false);
          setIsCheckoutOpen(true);
        }}
        onOpenWizard={() => {
          setIsVoiceControlOpen(false);
          setIsWizardOpen(true);
        }}
        onLoadScenario={handleLoadScenario}
        onAlignBudget={handleAutoAlignBudget}
        showToast={showToast}
      />
    </div>
  );
}

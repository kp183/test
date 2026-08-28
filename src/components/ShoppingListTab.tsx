import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Search, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Store, 
  Sparkles, 
  Copy, 
  Check, 
  DollarSign, 
  ShoppingBag, 
  Layers, 
  Info,
  Tag,
  AlertCircle,
  Zap,
  ArrowRight,
  ShieldCheck,
  Percent
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ShoppingItem, StoreType, ItemCategory, PartyPlan } from '../types';

interface ShoppingListTabProps {
  plan: PartyPlan;
  onToggleItem: (itemId: string) => void;
  onAddItem: (item: Omit<ShoppingItem, 'id'>) => void;
  onDeleteItem: (itemId: string) => void;
  onUpdateItem: (itemId: string, updates: Partial<ShoppingItem>) => void;
  onBulkCheckStore: (store: StoreType, checkState: boolean) => void;
  onOpenCheckout?: () => void;
  onAutoAlignBudget?: () => void;
}

const STORE_LIST: StoreType[] = [
  'CymbalMart Supercenter',
  'CymbalMart Grocery & Deli',
  'CymbalMart Beverage & Spirits',
  'CymbalMart Party & Home',
  'Costco / Wholesale Club',
  'Supermarket / Grocery',
  'Liquor / Beverage Store',
  'Party Supply / Dollar Tree',
  'Amazon / Online',
  'Bakery / Specialty Store',
  'Local Market'
];

const CATEGORY_NAMES: Record<ItemCategory, { label: string; icon: string; color: string }> = {
  grocery_fresh: { label: 'Grocery & Fresh', icon: '🥑', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  beverages_bar: { label: 'Beverages & Bar', icon: '🍹', color: 'bg-blue-50 text-blue-800 border-blue-200' },
  decorations_theme: { label: 'Decorations & Theme', icon: '🎈', color: 'bg-pink-50 text-pink-800 border-pink-200' },
  tableware_disposables: { label: 'Tableware & Disposables', icon: '🍽️', color: 'bg-amber-50 text-amber-800 border-amber-200' },
  games_favors: { label: 'Games & Favors', icon: '🎁', color: 'bg-purple-50 text-purple-800 border-purple-200' },
  equipment_rentals: { label: 'Equipment & Hardware', icon: '🧊', color: 'bg-cyan-50 text-cyan-800 border-cyan-200' },
  other: { label: 'Miscellaneous', icon: '📦', color: 'bg-slate-50 text-slate-800 border-slate-200' }
};

export const ShoppingListTab: React.FC<ShoppingListTabProps> = ({
  plan,
  onToggleItem,
  onAddItem,
  onDeleteItem,
  onUpdateItem,
  onBulkCheckStore,
  onOpenCheckout,
  onAutoAlignBudget
}) => {
  const [selectedStore, setSelectedStore] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [copiedStore, setCopiedStore] = useState<string | null>(null);

  // New Item Form State
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<ItemCategory>('grocery_fresh');
  const [newItemStore, setNewItemStore] = useState<StoreType>('CymbalMart Supercenter');
  const [newItemQuantity, setNewItemQuantity] = useState('1');
  const [newItemUnit, setNewItemUnit] = useState('unit');
  const [newItemCost, setNewItemCost] = useState('5.00');
  const [newItemNotes, setNewItemNotes] = useState('');
  const [newItemPriority, setNewItemPriority] = useState<'essential' | 'recommended' | 'optional'>('essential');
  const [newItemAisle, setNewItemAisle] = useState('Aisle 4 • Grocery');

  // Filtered items
  const filteredItems = useMemo(() => {
    return plan.shoppingList.filter((item) => {
      const matchesStore = selectedStore === 'all' || item.store === selectedStore;
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesPriority = selectedPriority === 'all' || item.priority === selectedPriority;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.dietaryTags && item.dietaryTags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchesStore && matchesCategory && matchesPriority && matchesSearch;
    });
  }, [plan.shoppingList, selectedStore, selectedCategory, selectedPriority, searchQuery]);

  // Group items by store
  const itemsByStore = useMemo(() => {
    const map = new Map<StoreType, ShoppingItem[]>();
    for (const item of filteredItems) {
      if (!map.has(item.store)) {
        map.set(item.store, []);
      }
      map.get(item.store)!.push(item);
    }
    return map;
  }, [filteredItems]);

  const totalCost = plan.shoppingList.reduce((sum, item) => sum + (Number(item.actualCost ?? item.estimatedCost) || 0), 0);
  const budgetLimit = plan.details.budgetLimit || 200;
  const isOverBudget = totalCost > budgetLimit;

  const handleToggle = (itemId: string) => {
    onToggleItem(itemId);
    const item = plan.shoppingList.find(i => i.id === itemId);
    if (item && !item.checked) {
      const remainingUnchecked = plan.shoppingList.filter(i => i.id !== itemId && !i.checked);
      if (remainingUnchecked.length === 0) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    onAddItem({
      name: newItemName.trim(),
      category: newItemCategory,
      store: newItemStore,
      quantity: newItemQuantity || '1',
      unit: newItemUnit || 'unit',
      estimatedCost: parseFloat(newItemCost) || 0,
      checked: false,
      notes: newItemNotes.trim(),
      priority: newItemPriority,
      aisleLocation: newItemAisle.trim() || undefined,
      dietaryTags: []
    });

    setNewItemName('');
    setNewItemNotes('');
    setIsAddModalOpen(false);
  };

  const handleCopyStoreList = (store: StoreType, items: ShoppingItem[]) => {
    const text = `🛒 CymbalMart Shopping List: ${store} for "${plan.details.title}":\n` +
      items.map(i => `${i.checked ? '✅' : '⬜'} ${i.name} - ${i.quantity} ${i.unit} (~${plan.details.currency}${Number(i.estimatedCost).toFixed(2)})${i.aisleLocation ? ` [${i.aisleLocation}]` : ''}${i.notes ? ` (${i.notes})` : ''}`).join('\n') +
      `\n\nTotal Est: ${plan.details.currency}${items.reduce((s, i) => s + (Number(i.estimatedCost) || 0), 0).toFixed(2)}`;

    navigator.clipboard.writeText(text);
    setCopiedStore(store);
    setTimeout(() => setCopiedStore(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* CUJ Review & Budget Status Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider bg-blue-500/30 text-blue-300 px-2 py-0.5 rounded-md border border-blue-400/30">
              CUJ Step 2: Review List & Budget Alignment
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              isOverBudget ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            }`}>
              {isOverBudget ? `Over Budget by $${(totalCost - budgetLimit).toFixed(2)}` : `Under Budget by $${(budgetLimit - totalCost).toFixed(2)}`}
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold">
            Curated Shopping List: {plan.details.title}
          </h3>
          <p className="text-xs text-slate-300">
            {plan.shoppingList.length} total items categorized across CymbalMart aisles and wholesale partners.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onAutoAlignBudget && (
            <button
              onClick={onAutoAlignBudget}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-blue-950 transition-colors shadow-xs"
            >
              <Zap className="w-3.5 h-3.5 fill-blue-950" />
              <span>Auto-Align Budget</span>
            </button>
          )}

          {onOpenCheckout && (
            <button
              onClick={onOpenCheckout}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 transition-all hover:scale-102"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              id="shopping-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items, ingredients, aisles..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              id="btn-add-item"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Item</span>
            </button>
          </div>
        </div>

        {/* Store Filter Tabs */}
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Store className="w-3.5 h-3.5 text-blue-600" />
            <span>Filter by Store / Department</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              id="filter-store-all"
              onClick={() => setSelectedStore('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedStore === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              All Sections ({plan.shoppingList.length})
            </button>
            {STORE_LIST.map((store) => {
              const count = plan.shoppingList.filter((i) => i.store === store).length;
              if (count === 0 && selectedStore !== store) return null;
              return (
                <button
                  key={store}
                  id={`filter-store-${store.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  onClick={() => setSelectedStore(store)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    selectedStore === store
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <span>{store}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      selectedStore === store ? 'bg-blue-700 text-blue-100' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Priority and Category Pill Filters */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-semibold text-slate-400 uppercase mr-1">Category:</span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                selectedCategory === 'all' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All
            </button>
            {Object.entries(CATEGORY_NAMES).map(([catKey, catMeta]) => {
              const count = plan.shoppingList.filter((i) => i.category === catKey).length;
              if (count === 0) return null;
              return (
                <button
                  key={catKey}
                  onClick={() => setSelectedCategory(catKey)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
                    selectedCategory === catKey
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{catMeta.icon}</span>
                  <span>{catMeta.label}</span>
                  <span className="text-[10px] opacity-70">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Priority Toggle */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400 font-semibold uppercase text-[11px]">Priority:</span>
            {(['all', 'essential', 'recommended', 'optional'] as const).map(p => (
              <button
                key={p}
                onClick={() => setSelectedPriority(p)}
                className={`px-2 py-0.5 rounded-md capitalize text-xs font-semibold transition-colors ${
                  selectedPriority === p ? 'bg-blue-100 text-blue-800 font-bold' : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Items List Grouped by Store */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No items match your filters</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your store or category filters, or add a custom item to your list.
          </p>
          <button
            onClick={() => {
              setSelectedStore('all');
              setSelectedCategory('all');
              setSelectedPriority('all');
              setSearchQuery('');
            }}
            className="mt-3 inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            Reset all filters
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {Array.from(itemsByStore.entries()).map(([storeName, items]) => {
            const storeCheckedCount = items.filter((i) => i.checked).length;
            const storeTotalCost = items.reduce((s, i) => s + (Number(i.actualCost ?? i.estimatedCost) || 0), 0);
            const allStoreChecked = storeCheckedCount === items.length;

            return (
              <div
                key={storeName}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden"
              >
                {/* Store Header */}
                <div className="bg-slate-50/80 px-4 sm:px-5 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shadow-2xs font-bold">
                      <Store className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <span>{storeName}</span>
                        <span className="text-xs font-normal text-slate-500">
                          ({storeCheckedCount}/{items.length} bought)
                        </span>
                      </h3>
                      <p className="text-xs text-slate-500">
                        Estimated Dept. Total: <strong className="text-slate-700">{plan.details.currency}{storeTotalCost.toFixed(2)}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onBulkCheckStore(storeName, !allStoreChecked)}
                      className="px-2.5 py-1 rounded-md text-xs font-medium bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors"
                    >
                      {allStoreChecked ? 'Uncheck All' : 'Mark All Bought'}
                    </button>
                    <button
                      onClick={() => handleCopyStoreList(storeName, items)}
                      className="px-2.5 py-1 rounded-md text-xs font-medium bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors inline-flex items-center gap-1"
                      title="Copy store list to share"
                    >
                      {copiedStore === storeName ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                          <span>Copy List</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Items in this Store */}
                <div className="divide-y divide-slate-100">
                  {items.map((item) => {
                    const catMeta = CATEGORY_NAMES[item.category] || CATEGORY_NAMES.other;
                    const googleShoppingUrl = `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(item.name)}`;

                    return (
                      <div
                        key={item.id}
                        className={`p-3.5 sm:px-5 flex items-start justify-between gap-3 transition-colors ${
                          item.checked ? 'bg-slate-50/70' : 'hover:bg-slate-50/40'
                        }`}
                      >
                        {/* Checkbox & Details */}
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <button
                            onClick={() => handleToggle(item.id)}
                            className="mt-0.5 text-slate-400 hover:text-blue-600 transition-colors shrink-0 focus:outline-none"
                            aria-label={`Mark ${item.name} as ${item.checked ? 'unbought' : 'bought'}`}
                          >
                            {item.checked ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-300 hover:text-slate-400" />
                            )}
                          </button>

                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex items-baseline flex-wrap gap-2">
                              <span
                                className={`text-sm font-semibold ${
                                  item.checked ? 'text-slate-400 line-through' : 'text-slate-900'
                                }`}
                              >
                                {item.name}
                              </span>
                              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                                {item.quantity} {item.unit}
                              </span>
                              <span className={`text-[10px] px-2 py-0.2 rounded-md border font-medium ${catMeta.color}`}>
                                {catMeta.icon} {catMeta.label}
                              </span>

                              {/* Aisle Location Badge */}
                              <span className="text-[10px] px-2 py-0.2 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-semibold flex items-center gap-1">
                                📍 {item.aisleLocation || (item.category === 'grocery_fresh' ? 'Produce / Deli Section' : item.category === 'beverages_bar' ? 'Aisle 8 • Beverages' : 'Aisle 12 • Party Goods')}
                              </span>

                              {item.priority === 'essential' && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-rose-50 text-rose-700 font-semibold border border-rose-200">
                                  Essential
                                </span>
                              )}
                              {item.priority === 'optional' && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-600 font-medium">
                                  Optional
                                </span>
                              )}
                            </div>

                            {/* Notes & Dietary Tags */}
                            {(item.notes || (item.dietaryTags && item.dietaryTags.length > 0)) && (
                              <div className="flex items-center flex-wrap gap-1.5 text-xs text-slate-500">
                                {item.notes && <span>{item.notes}</span>}
                                {item.dietaryTags?.map((tag) => (
                                  <span
                                    key={tag}
                                    className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium"
                                  >
                                    🌱 {tag}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Bulk Tip or Rollback savings */}
                            {item.bulkTip && (
                              <div className="inline-flex items-center gap-1 text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                                <Sparkles className="w-3 h-3 text-amber-500" />
                                <span><strong>Cymbal Value Tip:</strong> {item.bulkTip}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Price & Actions */}
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <div className="text-sm font-bold text-slate-800">
                              {plan.details.currency}{Number(item.estimatedCost).toFixed(2)}
                            </div>
                            <span className="text-[10px] text-slate-400">Est. Price</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <a
                              href={googleShoppingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                              title="Compare prices on Google Shopping"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                            <button
                              onClick={() => onDeleteItem(item.id)}
                              className="p-1.5 text-slate-300 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" />
              <span>Add Custom Shopping Item</span>
            </h3>

            <form onSubmit={handleAddNewItem} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Item Name *</label>
                <input
                  type="text"
                  required
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="e.g. Sparkling Apple Cider, Marshmallows, Glow Sticks"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Store / Section</label>
                  <select
                    value={newItemStore}
                    onChange={(e) => setNewItemStore(e.target.value as StoreType)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  >
                    {STORE_LIST.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value as ItemCategory)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  >
                    {Object.entries(CATEGORY_NAMES).map(([k, v]) => (
                      <option key={k} value={k}>{v.icon} {v.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Quantity</label>
                  <input
                    type="text"
                    value={newItemQuantity}
                    onChange={(e) => setNewItemQuantity(e.target.value)}
                    placeholder="e.g. 2"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Unit</label>
                  <input
                    type="text"
                    value={newItemUnit}
                    onChange={(e) => setNewItemUnit(e.target.value)}
                    placeholder="e.g. bags, bottles, lbs"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Est. Price ({plan.details.currency})</label>
                  <input
                    type="number"
                    step="0.50"
                    min="0"
                    value={newItemCost}
                    onChange={(e) => setNewItemCost(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Aisle / Department Location</label>
                  <input
                    type="text"
                    value={newItemAisle}
                    onChange={(e) => setNewItemAisle(e.target.value)}
                    placeholder="e.g. Aisle 4 • Condiments"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={newItemPriority}
                    onChange={(e) => setNewItemPriority(e.target.value as 'essential' | 'recommended' | 'optional')}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  >
                    <option value="essential">Essential (Must Have)</option>
                    <option value="recommended">Recommended</option>
                    <option value="optional">Optional / Nice to have</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notes / Brand Preferences</label>
                <input
                  type="text"
                  value={newItemNotes}
                  onChange={(e) => setNewItemNotes(e.target.value)}
                  placeholder="e.g. CymbalMart Brand, gluten-free, or Kirkland"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs"
                >
                  Add to List
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

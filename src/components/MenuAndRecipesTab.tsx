import React, { useState } from 'react';
import { 
  Utensils, 
  Clock, 
  Users, 
  Sparkles, 
  Plus, 
  Check, 
  ChefHat, 
  Flame, 
  BookOpen,
  Wine,
  Tag
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PartyPlan, PartyMenuRecipe, ShoppingItem } from '../types';

interface MenuAndRecipesTabProps {
  plan: PartyPlan;
  onAddIngredientsToShopping: (items: Omit<ShoppingItem, 'id'>[]) => void;
}

export const MenuAndRecipesTab: React.FC<MenuAndRecipesTabProps> = ({
  plan,
  onAddIngredientsToShopping
}) => {
  const [servingScales, setServingScales] = useState<Record<string, number>>({});
  const [addedRecipeIds, setAddedRecipeIds] = useState<Set<string>>(new Set());

  const getScale = (recipeId: string, defaultServings: number) => {
    return servingScales[recipeId] || defaultServings;
  };

  const handleScaleChange = (recipeId: string, newServings: number) => {
    setServingScales(prev => ({
      ...prev,
      [recipeId]: Math.max(1, newServings)
    }));
  };

  const handleAddRecipeIngredientsToShopping = (recipe: PartyMenuRecipe) => {
    const currentServings = getScale(recipe.id, recipe.servings);
    const multiplier = currentServings / recipe.servings;

    const newItems: Omit<ShoppingItem, 'id'>[] = recipe.ingredients.map((ing) => ({
      name: `${ing.item} (for ${recipe.name})`,
      category: recipe.course === 'cocktail_drink' ? 'beverages_bar' : 'grocery_fresh',
      store: recipe.course === 'cocktail_drink' ? 'Liquor / Beverage Store' : 'Supermarket / Grocery',
      quantity: `${ing.amount} (${currentServings} servings)`,
      unit: 'batch portion',
      estimatedCost: 6.00,
      checked: false,
      priority: 'essential',
      notes: `Needed for recipe: ${recipe.name}`,
      dietaryTags: recipe.dietaryTags
    }));

    onAddIngredientsToShopping(newItems);
    setAddedRecipeIds(prev => new Set(prev).add(recipe.id));
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-rose-500" />
            <span>Party Menu & Culinary Master Guide</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Step-by-step recipes, batch prep methods, and scalable serving calculators for your celebration.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            {plan.menuRecipes.length} Curated Recipes
          </span>
        </div>
      </div>

      {/* Recipe Cards */}
      {plan.menuRecipes.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
          <Utensils className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No recipes currently listed in this party plan.</p>
          <p className="text-xs text-slate-400 mt-1">Ask the AI Agent to generate signature recipes or food stations!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {plan.menuRecipes.map((recipe) => {
            const currentServings = getScale(recipe.id, recipe.servings);
            const isAdded = addedRecipeIds.has(recipe.id);

            return (
              <div
                key={recipe.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="p-5 border-b border-slate-100 bg-slate-50/50 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-200">
                          {recipe.course.replace('_', ' ')}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 mt-1.5">{recipe.name}</h3>
                      </div>

                      {/* Scaler */}
                      <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-2 py-1 rounded-xl shadow-2xs">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs font-semibold text-slate-700">{currentServings} Servings</span>
                        <div className="flex items-center ml-1">
                          <button
                            onClick={() => handleScaleChange(recipe.id, currentServings - 2)}
                            className="w-5 h-5 flex items-center justify-center rounded text-xs font-bold text-slate-500 hover:bg-slate-100"
                            title="Decrease servings"
                          >
                            -
                          </button>
                          <button
                            onClick={() => handleScaleChange(recipe.id, currentServings + 2)}
                            className="w-5 h-5 flex items-center justify-center rounded text-xs font-bold text-slate-500 hover:bg-slate-100"
                            title="Increase servings"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{recipe.description}</p>

                    {/* Metadata strip */}
                    <div className="flex items-center flex-wrap gap-3 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        Prep: {recipe.prepTimeMinutes} mins
                      </span>
                      {recipe.cookTimeMinutes && (
                        <span className="flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 text-amber-500" />
                          Cook: {recipe.cookTimeMinutes} mins
                        </span>
                      )}
                      {recipe.dietaryTags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium"
                        >
                          🌱 {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Ingredients & Instructions */}
                  <div className="p-5 space-y-4">
                    {/* Ingredients list */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-rose-500" />
                        <span>Ingredients ({currentServings} servings)</span>
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-700 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                        {recipe.ingredients.map((ing, idx) => (
                          <li key={idx} className="flex items-center justify-between">
                            <span className="font-medium text-slate-800">• {ing.item}</span>
                            <span className="text-slate-500 font-mono text-[11px]">{ing.amount}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Instructions */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <ChefHat className="w-3.5 h-3.5 text-amber-500" />
                        <span>Step-by-Step Method</span>
                      </h4>
                      <ol className="space-y-2 text-xs text-slate-600">
                        {recipe.instructions.map((step, sIdx) => (
                          <li key={sIdx} className="flex items-start gap-2">
                            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                              {sIdx + 1}
                            </span>
                            <span className="leading-relaxed">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Make Ahead Tip */}
                    {recipe.makeAheadTips && (
                      <div className="bg-amber-50/70 rounded-xl p-3 border border-amber-200/70 text-xs text-amber-900 space-y-1">
                        <div className="font-bold flex items-center gap-1 text-amber-800">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span>Make-Ahead Host Tip:</span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-amber-900/90">{recipe.makeAheadTips}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer Action */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    {recipe.ingredients.length} ingredients specified
                  </span>
                  <button
                    onClick={() => handleAddRecipeIngredientsToShopping(recipe)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors shadow-xs"
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Added to Shopping List</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5 text-rose-400" />
                        <span>Add Ingredients to Shopping</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

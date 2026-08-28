import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { generateFallbackPartyPlan, generateFallbackChatResponse } from './server/fallbackGenerator';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy Google GenAI Client
let genAIClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Generate Full Party Plan Endpoint
app.post('/api/generate-party-plan', async (req, res) => {
  const { details } = req.body;
  if (!details) {
    return res.status(400).json({ error: 'Party details are required' });
  }

  const ai = getGenAI();

  if (ai) {
    try {
      const prompt = `You are a world-class professional Event & Party Planner and Smart Shopping Assistant.
Create a comprehensive, realistic, and highly organized Party Master Plan and Shopping Checklist based on the following specifications:

Event Title: ${details.title || 'Special Celebration'}
Event Type: ${details.eventType || 'Party'}
Theme: ${details.theme || 'Celebration'}
Guest Count: ${details.guestCountAdults || 0} Adults, ${details.guestCountKids || 0} Kids, ${details.guestCountTeens || 0} Teens (Total: ${(Number(details.guestCountAdults) || 0) + (Number(details.guestCountKids) || 0) + (Number(details.guestCountTeens) || 0)} guests)
Duration: ${details.durationHours || 3} hours
Budget Limit: ${details.currency || '$'}${details.budgetLimit || 200}
Venue: ${details.venue || 'Home Indoor'}
Vibe: ${details.vibe || 'Fun & Lively'}
Dietary Restrictions: ${(details.dietaryRestrictions || []).join(', ') || 'None specified'}
Drink Preferences: ${details.drinkPreference || 'Variety'}
Special Requests / Host Vision: ${details.specialRequests || 'None'}

Please generate a realistic party plan including:
1. Complete Shopping List categorized into:
   - grocery_fresh
   - beverages_bar
   - decorations_theme
   - tableware_disposables
   - games_favors
   - equipment_rentals
   Assign each item the most logical Store Recommendation from:
   - "CymbalMart Supercenter" (for general bulk, chips, party supplies, soda, paper plates, tableware)
   - "CymbalMart Grocery & Deli" (for fresh produce, meats, deli platters, herbs, bakery)
   - "CymbalMart Beverage & Spirits" (for craft beer, wine, spirits, mixers, seltzers)
   - "CymbalMart Party & Home" (for themed decorations, banners, lighting, ice, coolers)
   - "Costco / Wholesale Club" (for oversized wholesale packs)
   - "Bakery / Specialty Store" (for custom cakes, artisan bread)
   Provide realistic quantity numbers, units, estimated USD cost per line item, priority (essential, recommended, optional), aisle location (e.g. "Aisle 4 • Grocery"), and any bulk tips. Ensure total estimated cost stays reasonably close to or optimizes around the budget limit.

2. Menu & Recipe Cards (2 to 4 key signature recipes or food stations: appetizers, main dish/food bar, dessert, and signature punch/cocktail/mocktail with exact measurements, prep time, step-by-step instructions, and dietary tags).

3. Prep & Host Timeline (Step-by-step chronological countdown tasks from "3-4 Days Before", "1-2 Days Before", "Day of Party (Morning)", "2 Hours Before Guests Arrive", to "Party Kickoff").

4. Drink & Beverage Calculator data:
   - Calculated exact drinks needed for guest count and duration
   - Broken down into beer cans, wine bottles (750ml), liquor bottles (750ml), mixer liters, sodas/non-alcoholic, ice in lbs (crucial: ~1.5 lbs per guest), cups, garnishes.
   - Explain the calculation formula.

5. Theme & Decor Ideas (4-5 concrete creative visual tips).
6. Playlist & Vibe Tips (3-4 tips for lighting, music tempo, host flow).
7. Budget Optimization Tips (3 actionable money-saving shopping swaps).`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are an elite Party Planner and Master Shopper. Always output clean, valid JSON matching the requested structure without markdown wrappers if possible, or standard JSON object.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              themeAndDecorIdeas: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              playlistAndVibeTips: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              budgetTips: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              estimatedTotalCost: { type: Type.NUMBER },
              drinkCalculator: {
                type: Type.OBJECT,
                properties: {
                  totalEstimatedDrinks: { type: Type.INTEGER },
                  beerCansBottles: { type: Type.INTEGER },
                  wineBottles750ml: { type: Type.INTEGER },
                  liquorBottles750ml: { type: Type.INTEGER },
                  mixerLiters: { type: Type.NUMBER },
                  sodaAndNonAlcoholicCans: { type: Type.INTEGER },
                  icePounds: { type: Type.INTEGER },
                  cupsTotal: { type: Type.INTEGER },
                  garnishNotes: { type: Type.STRING },
                  calculationFormula: { type: Type.STRING },
                },
                required: [
                  'totalEstimatedDrinks',
                  'beerCansBottles',
                  'wineBottles750ml',
                  'liquorBottles750ml',
                  'mixerLiters',
                  'sodaAndNonAlcoholicCans',
                  'icePounds',
                  'cupsTotal',
                  'garnishNotes',
                  'calculationFormula',
                ],
              },
              shoppingList: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    category: { type: Type.STRING },
                    store: { type: Type.STRING },
                    quantity: { type: Type.STRING },
                    unit: { type: Type.STRING },
                    estimatedCost: { type: Type.NUMBER },
                    notes: { type: Type.STRING },
                    dietaryTags: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    priority: { type: Type.STRING },
                    aisleLocation: { type: Type.STRING },
                    bulkTip: { type: Type.STRING },
                  },
                  required: ['name', 'category', 'store', 'quantity', 'unit', 'estimatedCost', 'priority'],
                },
              },
              menuRecipes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    course: { type: Type.STRING },
                    servings: { type: Type.INTEGER },
                    prepTimeMinutes: { type: Type.INTEGER },
                    cookTimeMinutes: { type: Type.INTEGER },
                    description: { type: Type.STRING },
                    ingredients: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          item: { type: Type.STRING },
                          amount: { type: Type.STRING },
                        },
                        required: ['item', 'amount'],
                      },
                    },
                    instructions: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    dietaryTags: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    makeAheadTips: { type: Type.STRING },
                  },
                  required: ['name', 'course', 'servings', 'prepTimeMinutes', 'description', 'ingredients', 'instructions', 'dietaryTags'],
                },
              },
              timeline: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    timeframe: { type: Type.STRING },
                    task: { type: Type.STRING },
                    category: { type: Type.STRING },
                    tip: { type: Type.STRING },
                  },
                  required: ['timeframe', 'task', 'category'],
                },
              },
            },
            required: [
              'themeAndDecorIdeas',
              'playlistAndVibeTips',
              'budgetTips',
              'estimatedTotalCost',
              'drinkCalculator',
              'shoppingList',
              'menuRecipes',
              'timeline',
            ],
          },
        },
      });

      const text = response.text;
      if (text) {
        const generatedData = JSON.parse(text);
        const planId = 'party-' + Date.now();
        const finalPlan = {
          id: planId,
          details: {
            ...details,
            id: details.id || planId,
          },
          estimatedTotalCost: generatedData.estimatedTotalCost || 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          themeAndDecorIdeas: generatedData.themeAndDecorIdeas || [],
          playlistAndVibeTips: generatedData.playlistAndVibeTips || [],
          budgetTips: generatedData.budgetTips || [],
          drinkCalculator: generatedData.drinkCalculator,
          shoppingList: (generatedData.shoppingList || []).map((item: any, idx: number) => ({
            id: item.id || `item-${Date.now()}-${idx}`,
            name: item.name,
            category: item.category || 'grocery_fresh',
            store: item.store || 'CymbalMart Supercenter',
            quantity: item.quantity || 1,
            unit: item.unit || 'unit',
            estimatedCost: Number(item.estimatedCost) || 0,
            actualCost: undefined,
            checked: false,
            notes: item.notes || '',
            dietaryTags: item.dietaryTags || [],
            priority: item.priority || 'essential',
            aisleLocation: item.aisleLocation || undefined,
            bulkTip: item.bulkTip || '',
          })),
          menuRecipes: (generatedData.menuRecipes || []).map((rec: any, idx: number) => ({
            id: rec.id || `recipe-${Date.now()}-${idx}`,
            name: rec.name,
            course: rec.course || 'main',
            servings: Number(rec.servings) || details.guestCountAdults || 10,
            prepTimeMinutes: Number(rec.prepTimeMinutes) || 15,
            cookTimeMinutes: rec.cookTimeMinutes ? Number(rec.cookTimeMinutes) : undefined,
            description: rec.description || '',
            ingredients: (rec.ingredients || []).map((ing: any) => ({
              item: ing.item,
              amount: ing.amount,
            })),
            instructions: rec.instructions || [],
            dietaryTags: rec.dietaryTags || [],
            makeAheadTips: rec.makeAheadTips || '',
          })),
          timeline: (generatedData.timeline || []).map((step: any, idx: number) => ({
            id: step.id || `timeline-${Date.now()}-${idx}`,
            timeframe: step.timeframe,
            task: step.task,
            category: step.category || 'Prep & Cooking',
            completed: false,
            tip: step.tip || '',
          })),
        };

        if (!finalPlan.estimatedTotalCost) {
          finalPlan.estimatedTotalCost = finalPlan.shoppingList.reduce(
            (sum: number, item: any) => sum + (Number(item.estimatedCost) || 0),
            0
          );
        }

        return res.json({ success: true, plan: finalPlan });
      }
    } catch (genError: any) {
      console.warn('Gemini API call returned error, using smart fallback planner:', genError.message || genError);
    }
  }

  // Smart deterministic fallback generator
  try {
    const fallbackPlan = generateFallbackPartyPlan(details);
    return res.json({ success: true, plan: fallbackPlan });
  } catch (error: any) {
    console.error('Error in fallback generator:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate party plan' });
  }
});

// Interactive CymbalMart Assistant Chat Endpoint
app.post('/api/agent-chat', async (req, res) => {
  const { message, currentPlan, chatHistory } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const ai = getGenAI();

  if (ai) {
    try {
      const planSummary = currentPlan
        ? `CURRENT PARTY PLAN & SHOPPING LIST:
Title: ${currentPlan.details.title}
Theme: ${currentPlan.details.theme}
Guests: ${currentPlan.details.guestCountAdults} adults, ${currentPlan.details.guestCountKids} kids, ${currentPlan.details.guestCountTeens} teens
Budget Limit: ${currentPlan.details.currency}${currentPlan.details.budgetLimit} (Estimated Total: ${currentPlan.details.currency}${currentPlan.estimatedTotalCost})
Dietary: ${currentPlan.details.dietaryRestrictions?.join(', ') || 'None'}
Venue: ${currentPlan.details.venue}
Drink Option: ${currentPlan.details.drinkPreference}
Shopping Items Count: ${currentPlan.shoppingList.length} items (${currentPlan.shoppingList.filter((i: any) => i.checked).length} checked)
Active Items List:
${currentPlan.shoppingList.map((i: any, idx: number) => `${idx + 1}. [${i.id}] ${i.name} (Qty: ${i.quantity} ${i.unit}, Est: $${i.estimatedCost} at ${i.store}, Aisle: ${i.aisleLocation || 'General'})`).join('\n')}`
        : 'No active plan loaded.';

      const conversationContext = (chatHistory || [])
        .slice(-6)
        .map((m: any) => `${m.sender.toUpperCase()}: ${m.text}`)
        .join('\n');

      const prompt = `You are "CymbalMart Assistant" — the dedicated, friendly, hyper-organized, and budget-smart AI shopping concierge for CymbalMart customers.
Your role is to help customers plan their events, customize their shopping list in real-time, find store brand rollback values, handle dietary swaps, and automatically keep their budget balanced.

${planSummary}

RECENT CONVERSATION:
${conversationContext}

CUSTOMER'S REQUEST:
"${message}"

INSTRUCTIONS FOR CYMBALMART ASSISTANT:
1. Provide a warm, helpful, conversational response in "replyText" addressing the customer directly.
2. If the customer requests any modification to the shopping list or party plan:
   - Adding items (e.g. "Add 2 packs of skewers and ice", "We need vegan dessert", "Add 3 2-liters of ginger ale"):
     Provide "addedItems" with realistic CymbalMart pricing, aisle locations (e.g., "Aisle 4 • Grocery", "Bakery / Deli", "Aisle 8 • Beverages", "Aisle 12 • Party Goods"), store assignments (prefer "CymbalMart Supercenter", "CymbalMart Grocery & Deli", "CymbalMart Beverage & Spirits", or "CymbalMart Party & Home"), and priority.
   - Removing items (e.g. "Remove the beer and wine", "Delete paper cups", "We don't need hot dogs"):
     Provide "removedItemNames" containing exact names or substrings of items to delete.
   - Swapping/Replacing items (e.g. "Swap beef for impossible burgers", "Switch to gluten-free buns"):
     Provide "swappedItems" with originalName and new item details.
   - Updating quantities or budget (e.g. "Double the chips", "Increase budget to $300", "Cut $40 from our budget"):
     Provide "updatedItems" or "updatedDetails".
   - Adding a recipe:
     Provide "newRecipe" with ingredients, portions, and step-by-step prep.
3. In "modifiedSummary", list 1 to 4 clear bullet points summarizing the exact list changes and budget impact (e.g., "Added 2 packs of CymbalMart Brioche Buns (+$6.50)", "Removed 2 cases of craft beer (-$32.00)", "Swapped name-brand salsa for CymbalMart Organic Salsa (Saved $3.20)").
4. If it is purely an informational question or greeting, set actionType to "none". Otherwise set actionType to "modify_plan" or "add_items".`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              replyText: {
                type: Type.STRING,
                description: 'The conversational response message to the customer.',
              },
              actionType: {
                type: Type.STRING,
                enum: ['modify_plan', 'add_items', 'none'],
                description: 'Type of modification to apply to the shopping list.',
              },
              modifiedSummary: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Short list of changes made to the plan and budget.',
              },
              addedItems: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    category: { type: Type.STRING },
                    store: { type: Type.STRING },
                    quantity: { type: Type.STRING },
                    unit: { type: Type.STRING },
                    estimatedCost: { type: Type.NUMBER },
                    aisleLocation: { type: Type.STRING },
                    notes: { type: Type.STRING },
                    dietaryTags: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    priority: { type: Type.STRING },
                    bulkTip: { type: Type.STRING },
                  },
                  required: ['name', 'category', 'store', 'quantity', 'unit', 'estimatedCost', 'priority'],
                },
              },
              removedItemNames: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Names or substrings of items to remove from the shopping list.',
              },
              swappedItems: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    originalName: { type: Type.STRING },
                    newName: { type: Type.STRING },
                    category: { type: Type.STRING },
                    store: { type: Type.STRING },
                    quantity: { type: Type.STRING },
                    unit: { type: Type.STRING },
                    estimatedCost: { type: Type.NUMBER },
                    aisleLocation: { type: Type.STRING },
                    notes: { type: Type.STRING },
                  },
                  required: ['originalName', 'newName', 'estimatedCost'],
                },
              },
              updatedItems: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    nameMatch: { type: Type.STRING },
                    newQuantity: { type: Type.STRING },
                    newEstimatedCost: { type: Type.NUMBER },
                    newNotes: { type: Type.STRING },
                  },
                  required: ['nameMatch'],
                },
              },
              newRecipe: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  course: { type: Type.STRING },
                  servings: { type: Type.INTEGER },
                  prepTimeMinutes: { type: Type.INTEGER },
                  description: { type: Type.STRING },
                  ingredients: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        item: { type: Type.STRING },
                        amount: { type: Type.STRING },
                      },
                      required: ['item', 'amount'],
                    },
                  },
                  instructions: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  dietaryTags: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
              },
              updatedDetails: {
                type: Type.OBJECT,
                properties: {
                  budgetLimit: { type: Type.NUMBER },
                  guestCountAdults: { type: Type.INTEGER },
                  guestCountKids: { type: Type.INTEGER },
                  theme: { type: Type.STRING },
                },
              },
            },
            required: ['replyText', 'actionType'],
          },
        },
      });

      const text = response.text;
      if (text) {
        const data = JSON.parse(text);

        let formattedAddedItems: any[] = [];
        if (data.addedItems && data.addedItems.length > 0) {
          formattedAddedItems = data.addedItems.map((item: any, idx: number) => ({
            id: `cymb-item-${Date.now()}-${idx}`,
            name: item.name,
            category: item.category || 'grocery_fresh',
            store: item.store || 'CymbalMart Supercenter',
            quantity: item.quantity || 1,
            unit: item.unit || 'pack',
            estimatedCost: Number(item.estimatedCost) || 5.0,
            checked: false,
            notes: item.notes || '',
            dietaryTags: item.dietaryTags || [],
            priority: item.priority || 'recommended',
            aisleLocation: item.aisleLocation || 'Aisle 4 • Grocery',
            bulkTip: item.bulkTip || '',
          }));
        }

        return res.json({
          replyText: data.replyText,
          actionType: data.actionType,
          modifiedSummary: data.modifiedSummary || [],
          addedItems: formattedAddedItems,
          removedItemNames: data.removedItemNames || [],
          swappedItems: data.swappedItems || [],
          updatedItems: data.updatedItems || [],
          newRecipe: data.newRecipe || null,
          updatedDetails: data.updatedDetails || null,
        });
      }
    } catch (genError: any) {
      console.warn('Gemini chat returned error, using fallback chat response:', genError.message || genError);
    }
  }

  // Smart fallback chat responder
  try {
    const fallbackResponse = generateFallbackChatResponse(message, currentPlan);
    return res.json(fallbackResponse);
  } catch (error: any) {
    console.error('Error in chat fallback:', error);
    return res.json({
      replyText: `I received your request: "${message}". Your CymbalMart party plan has been updated!`,
      actionType: 'none',
      modifiedSummary: [],
      addedItems: [],
      removedItemNames: [],
      swappedItems: [],
      updatedItems: [],
      newRecipe: null,
      updatedDetails: null,
    });
  }
});

// Vite Middleware & Static Serving Setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Party Planner Shopping Agent server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

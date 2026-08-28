export function generateFallbackPartyPlan(details: any) {
  const title = details.title || 'Celebration Party';
  const eventType = details.eventType || 'Party';
  const theme = details.theme || 'Festive Celebration';
  const adults = Number(details.guestCountAdults) || 10;
  const kids = Number(details.guestCountKids) || 0;
  const teens = Number(details.guestCountTeens) || 0;
  const totalGuests = adults + kids + teens || 10;
  const duration = Number(details.durationHours) || 3;
  const budget = Number(details.budgetLimit) || 200;
  const currency = details.currency || '$';
  const dietary = Array.isArray(details.dietaryRestrictions) ? details.dietaryRestrictions : [];
  const drinkPref = details.drinkPreference || 'Full Bar (Cocktails + Beer + Wine)';
  const lowerTheme = (theme + ' ' + eventType + ' ' + (details.specialRequests || '')).toLowerCase();

  const isTropical = lowerTheme.includes('tropical') || lowerTheme.includes('luau') || lowerTheme.includes('tiki') || lowerTheme.includes('island');
  const isKids = lowerTheme.includes('kid') || lowerTheme.includes('dino') || lowerTheme.includes('superhero') || kids > 5;
  const isCorporate = lowerTheme.includes('corporate') || lowerTheme.includes('summit') || lowerTheme.includes('work') || lowerTheme.includes('office');
  const isWedding = lowerTheme.includes('wedding') || lowerTheme.includes('reception') || lowerTheme.includes('romantic');
  const isBBQ = lowerTheme.includes('bbq') || lowerTheme.includes('grill') || lowerTheme.includes('cookout') || lowerTheme.includes('burger');

  // Drink Calculator
  const isAlcoholic = !drinkPref.includes('Mocktails') && !drinkPref.includes('Non-Alcoholic') && adults > 0;
  const drinksPerGuestPerHour = 1.2;
  const totalEstimatedDrinks = Math.round(totalGuests * duration * drinksPerGuestPerHour);
  
  const beerCans = isAlcoholic ? Math.round(adults * duration * 0.5) : 0;
  const wineBottles = isAlcoholic ? Math.max(2, Math.round((adults * duration * 0.25) / 5)) : 0;
  const liquorBottles = isAlcoholic && drinkPref.includes('Full Bar') ? Math.max(1, Math.round((adults * duration * 0.15) / 16)) : 0;
  const mixerLiters = Math.max(2, Math.round(totalGuests * 0.3));
  const sodaCans = Math.max(12, Math.round(totalGuests * duration * 0.6));
  const icePounds = Math.max(15, Math.round(totalGuests * 1.5));
  const cupsTotal = Math.max(25, Math.round(totalGuests * 2));

  // Base Shopping Items
  const items: any[] = [];
  let currentTotal = 0;

  function addItem(
    name: string,
    category: string,
    store: string,
    quantity: string | number,
    unit: string,
    estimatedCost: number,
    priority: 'essential' | 'recommended' | 'optional' = 'essential',
    aisleLocation: string = 'Aisle 4 • Grocery',
    notes: string = ''
  ) {
    items.push({
      id: `item-${Date.now()}-${items.length + 1}`,
      name,
      category,
      store,
      quantity,
      unit,
      estimatedCost,
      checked: false,
      priority,
      aisleLocation,
      notes
    });
    currentTotal += estimatedCost;
  }

  if (isTropical) {
    addItem('CymbalMart Hawaiian Sweet Slider Buns & Kalua Pulled Pork', 'grocery_fresh', 'CymbalMart Grocery & Deli', Math.ceil(totalGuests / 6), 'bulk party packs', 34.00, 'essential', 'Deli / Prepared Foods', 'Pre-seasoned and ready to warm.');
    addItem('Fresh Golden Pineapples, Mangos & Kiwi Fruit Bowl Tray', 'grocery_fresh', 'CymbalMart Grocery & Deli', Math.ceil(totalGuests / 8), 'large trays', 22.00, 'essential', 'Produce Department', 'Freshly sliced tropical assortment.');
    addItem('Teriyaki Glazed Chicken & Bell Pepper Skewers', 'grocery_fresh', 'CymbalMart Grocery & Deli', Math.ceil(totalGuests / 5), 'party packs (12 skewers)', 28.00, 'essential', 'Meat & Poultry Counter');
    addItem('CymbalMart Tropical Coconut & Passionfruit Sparklers', 'beverages_bar', 'CymbalMart Supercenter', Math.ceil(totalGuests / 8), '12-can packs', 14.00, 'essential', 'Aisle 7 • Beverages');
    addItem('100% Dole Pineapple & Guava Juice Mixers', 'beverages_bar', 'CymbalMart Supercenter', Math.ceil(totalGuests / 10), '64 oz bottles', 9.50, 'essential', 'Aisle 7 • Juices');
    if (isAlcoholic) {
      addItem('Spiced Coconut Rum & Dark Island Rum Duo', 'beverages_bar', 'CymbalMart Beverage & Spirits', 2, 'bottles (750ml)', 36.00, 'essential', 'Aisle 9 • Spirits & Rum');
    }
    addItem('Tropical Hibiscus Floral Garland & Bamboo Table Runners', 'decorations_theme', 'CymbalMart Party & Home', 1, 'party decor bundle', 18.00, 'recommended', 'Aisle 13 • Party Supplies');
    addItem('Tiki Palm Leaf Heavy Duty Compostable Plates & Napkins', 'tableware_disposables', 'CymbalMart Supercenter', Math.ceil(totalGuests / 20), '50-count packs', 12.50, 'essential', 'Aisle 12 • Paper Goods');
    addItem('CymbalMart Party Ice Bags (20 lb bag)', 'beverages_bar', 'CymbalMart Supercenter', Math.ceil(icePounds / 20), '20 lb bags', 9.00, 'essential', 'Front Store Freezers');
  } else if (isKids) {
    addItem('CymbalMart Bakery Custom Themed Cupcake Platter', 'grocery_fresh', 'CymbalMart Grocery & Deli', Math.ceil(totalGuests / 12), '24-count platters', 24.00, 'essential', 'Bakery Counter');
    addItem('Artisan Mini Pizza Sliders & Pretzel Pigs-in-Blanket', 'grocery_fresh', 'CymbalMart Grocery & Deli', Math.ceil(totalGuests / 6), 'party appetizer boxes', 26.00, 'essential', 'Deli / Freezers');
    addItem('Fresh Rainbow Fruit Wands with Honey Yogurt Dip', 'grocery_fresh', 'CymbalMart Grocery & Deli', Math.ceil(totalGuests / 8), 'party platters', 16.00, 'essential', 'Produce Department');
    addItem('Organic 100% Juice Pouches & Sparkling Lemonade', 'beverages_bar', 'CymbalMart Supercenter', Math.ceil(totalGuests / 6), '20-pack cases', 15.00, 'essential', 'Aisle 7 • Juices');
    addItem('Themed Balloons, Banner & Photo Backdrop Kit', 'decorations_theme', 'CymbalMart Party & Home', 1, 'all-in-one party kit', 19.00, 'essential', 'Aisle 13 • Party Themes');
    addItem('Fun Party Favor Bags & Glow Bracelet Packs', 'games_favors', 'CymbalMart Party & Home', Math.ceil(totalGuests / 10), '12-count party packs', 14.00, 'recommended', 'Aisle 13 • Party Favors');
    addItem('Heavy-Duty Party Tableware & Napkins Set', 'tableware_disposables', 'CymbalMart Supercenter', 1, '100-piece combo set', 12.00, 'essential', 'Aisle 12 • Paper Goods');
    addItem('Party Ice (10 lb bag)', 'beverages_bar', 'CymbalMart Supercenter', 2, 'bags', 6.00, 'essential', 'Front Store Freezers');
  } else if (isBBQ) {
    addItem('CymbalMart Angus Ground Beef Patties & Brioche Buns Bundle', 'grocery_fresh', 'CymbalMart Grocery & Deli', Math.ceil(totalGuests / 6), 'party packs (12 burgers + buns)', 32.00, 'essential', 'Meat Department / Bakery');
    addItem('Gourmet Smoky BBQ Ribs / Grilled Chicken Skewers', 'grocery_fresh', 'CymbalMart Grocery & Deli', Math.ceil(totalGuests / 8), 'large catering trays', 36.00, 'essential', 'Deli & Prepared Meats');
    addItem('Homestyle Coleslaw, Potato Salad & Sweet Corn on Cob', 'grocery_fresh', 'CymbalMart Grocery & Deli', Math.ceil(totalGuests / 10), 'family deli tubs', 18.00, 'essential', 'Deli Counter');
    addItem('Craft Soda & Fresh Squeezed Lemonade Gallons', 'beverages_bar', 'CymbalMart Supercenter', Math.ceil(totalGuests / 8), 'gallon jugs + 12-packs', 16.00, 'essential', 'Aisle 7 • Beverages');
    if (isAlcoholic) {
      addItem('Crisp Craft Lager & Summer Ale Variety 24-Pack', 'beverages_bar', 'CymbalMart Beverage & Spirits', Math.ceil(totalGuests / 12), '24-can cases', 29.00, 'essential', 'Aisle 8 • Beer');
    }
    addItem('Checkered Tablecloths & Outdoor Citronella Centerpieces', 'decorations_theme', 'CymbalMart Party & Home', 1, 'outdoor kit', 14.00, 'recommended', 'Aisle 14 • Patio & Home');
    addItem('Heavy-Duty Ribbed Disposable Plates & Cutlery Sets', 'tableware_disposables', 'CymbalMart Supercenter', 1, '100-count set', 11.00, 'essential', 'Aisle 12 • Paper Goods');
    addItem('Party Ice Bags (20 lb bags)', 'beverages_bar', 'CymbalMart Supercenter', Math.ceil(icePounds / 20), '20 lb bags', 9.00, 'essential', 'Front Freezers');
  } else {
    // Default Gourmet Celebration
    addItem('Artisan Charcuterie & Cheese Tasting Board', 'grocery_fresh', 'CymbalMart Grocery & Deli', Math.ceil(totalGuests / 8), 'catering platters', 38.00, 'essential', 'Specialty Cheeses');
    addItem('Gourmet Finger Sandwiches & Wrap Assortment', 'grocery_fresh', 'CymbalMart Grocery & Deli', Math.ceil(totalGuests / 6), 'large platters', 34.00, 'essential', 'Deli Counter');
    addItem('Fresh Garden Salad with Citrus Vinaigrette Bowl', 'grocery_fresh', 'CymbalMart Grocery & Deli', Math.ceil(totalGuests / 10), 'large salad bowls', 16.00, 'essential', 'Produce Department');
    addItem('CymbalMart Sparkling Mineral Waters & Artisanal Teas', 'beverages_bar', 'CymbalMart Supercenter', Math.ceil(totalGuests / 8), 'variety cases', 15.00, 'essential', 'Aisle 7 • Beverages');
    if (isAlcoholic) {
      addItem('Curated Pinot Noir & Crisp Sauvignon Blanc Wine', 'beverages_bar', 'CymbalMart Beverage & Spirits', Math.max(2, Math.ceil(totalGuests / 6)), 'bottles (750ml)', 36.00, 'essential', 'Aisle 9 • Wine');
    }
    addItem('Elegant Bistro Table Centerpieces & Ambient Fairy Lights', 'decorations_theme', 'CymbalMart Party & Home', 1, 'decor kit', 18.00, 'recommended', 'Aisle 13 • Party & Decor');
    addItem('Eco-Friendly Compostable Plates, Glasses & Linen Napkins', 'tableware_disposables', 'CymbalMart Supercenter', 1, 'party pack', 13.50, 'essential', 'Aisle 12 • Paper Goods');
    addItem('Party Ice Bags (20 lb bags)', 'beverages_bar', 'CymbalMart Supercenter', Math.ceil(icePounds / 20), '20 lb bags', 9.00, 'essential', 'Front Freezers');
  }

  // Scale or adjust items to match budget if needed
  const planId = 'party-' + Date.now();
  return {
    id: planId,
    details: {
      ...details,
      id: details.id || planId,
      title,
      eventType,
      theme,
      guestCountAdults: adults,
      guestCountKids: kids,
      guestCountTeens: teens,
      durationHours: duration,
      budgetLimit: budget,
      currency
    },
    estimatedTotalCost: Math.round(currentTotal * 100) / 100,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    themeAndDecorIdeas: [
      `Accentuate the ${theme} vibe with natural botanical elements, colorful table runners, and warm lighting.`,
      `Set up a dedicated beverage bar with chalkboard drink menu and fresh citrus garnishes.`,
      `Use varying tier risers and wooden boards on the buffet station to give food appetizing visual depth.`,
      `Provide a welcoming entrance sign with guest name tags and themed party favors.`
    ],
    playlistAndVibeTips: [
      `Curate an upbeat, ambient background playlist matching the ${theme} aesthetic.`,
      `Time the main buffet or food service ~45 minutes after the first guest arrival.`,
      `Dim harsh overhead lights 30 minutes before kickoff and switch on warm accent lamps.`
    ],
    budgetTips: [
      `Purchase staple chips, paper goods, and sparkling sodas in CymbalMart Great Value store brand for 30% savings.`,
      `Batch signature drinks in large 2-gallon glass dispensers rather than individual single-serve cans.`,
      `Prep fresh fruit skewers and appetizers 3 hours ahead to avoid last-minute rush.`
    ],
    drinkCalculator: {
      totalEstimatedDrinks,
      beerCansBottles: beerCans,
      wineBottles750ml: wineBottles,
      liquorBottles750ml: liquorBottles,
      mixerLiters,
      sodaAndNonAlcoholicCans: sodaCans,
      icePounds,
      cupsTotal,
      garnishNotes: 'Fresh citrus wheels (lemons, limes, oranges), mint sprigs, and cocktail umbrellas.',
      calculationFormula: `${totalGuests} guests × ${duration} hours × ${drinksPerGuestPerHour} drinks/hr = ~${totalEstimatedDrinks} drinks. Ice calculated at 1.5 lbs/guest (${icePounds} lbs).`
    },
    shoppingList: items,
    menuRecipes: [
      {
        id: `rec-${Date.now()}-1`,
        name: isTropical ? 'Signature Island Luau Punch' : 'CymbalMart Celebration Punch',
        course: 'cocktail_drink',
        servings: totalGuests,
        prepTimeMinutes: 10,
        description: `Refreshing signature drink featuring pineapple juice, sparkling citrus soda, passionfruit syrup, and sliced fruit garnishes.`,
        ingredients: [
          { item: '100% Pineapple Juice', amount: '2 bottles (64 oz ea)' },
          { item: 'Sparkling Citrus Soda / Ginger Ale', amount: '3 bottles (2 Liter)' },
          { item: 'Fresh Orange & Lime Slices', amount: '4 whole fruits, sliced' },
          { item: 'Fresh Mint Leaves', amount: '1 bunch' }
        ],
        instructions: [
          'In a 2-gallon beverage dispenser, combine chilled pineapple juice and citrus soda.',
          'Stir gently to blend flavors while maintaining fizz.',
          'Float fresh citrus wheels and mint sprigs on top and serve over ice.'
        ],
        dietaryTags: ['Vegan', 'Gluten-Free', 'Non-Alcoholic'],
        makeAheadTips: 'Chill juices overnight. Add sparkling soda and ice 10 minutes before kickoff.'
      },
      {
        id: `rec-${Date.now()}-2`,
        name: isTropical ? 'Teriyaki Glazed Pineapple Sliders' : 'Artisan Gourmet Party Sliders',
        course: 'main',
        servings: totalGuests,
        prepTimeMinutes: 20,
        cookTimeMinutes: 15,
        description: `Tender, flavorful mini sliders served on sweet bakery buns with savory glaze.`,
        ingredients: [
          { item: 'Bakery Sweet Slider Rolls', amount: `${Math.ceil(totalGuests * 1.5)} rolls` },
          { item: 'Seasoned Pulled Meat / Plant Patties', amount: `${Math.ceil(totalGuests * 0.3)} lbs` },
          { item: 'Savory Glaze Sauce', amount: '1 bottle (16 oz)' },
          { item: 'Crisp Butter Lettuce & Pickles', amount: '1 package each' }
        ],
        instructions: [
          'Warm meat in slow cooker or oven with glaze sauce.',
          'Slice slider rolls in half horizontally.',
          'Assemble sliders with warm meat, fresh lettuce, and toppings.',
          'Arrange neatly on wooden serving platters.'
        ],
        dietaryTags: ['Dairy-Free Available'],
        makeAheadTips: 'Meat can be prepped up to 24 hours in advance and reheated in slow cooker.'
      }
    ],
    timeline: [
      {
        id: `t-${Date.now()}-1`,
        timeframe: '3-4 Days Before',
        task: `Finalize guest RSVP count (${totalGuests}) and review CymbalMart shopping list for any special dietary requests.`,
        category: 'Host Readiness',
        completed: false
      },
      {
        id: `t-${Date.now()}-2`,
        timeframe: '1-2 Days Before',
        task: `Purchase non-perishable pantry items, paper goods, decorations, and party beverages at CymbalMart.`,
        category: 'Shopping',
        completed: false
      },
      {
        id: `t-${Date.now()}-3`,
        timeframe: 'Day of Party (Morning)',
        task: `Pick up fresh bakery items, deli platters, and bags of ice. Chill beer, wine, and mixers.`,
        category: 'Shopping',
        completed: false
      },
      {
        id: `t-${Date.now()}-4`,
        timeframe: '2 Hours Before Guests Arrive',
        task: `Set up decor, table settings, buffet station, and mix the signature party punch.`,
        category: 'Decor & Setup',
        completed: false
      },
      {
        id: `t-${Date.now()}-5`,
        timeframe: 'Party Kickoff',
        task: `Start background music playlist, light accent candles, and welcome your first guests with a cold beverage!`,
        category: 'Host Readiness',
        completed: false
      }
    ]
  };
}

export function generateFallbackChatResponse(message: string, currentPlan: any) {
  const msg = message.toLowerCase();
  const addedItems: any[] = [];
  const removedItemNames: string[] = [];
  const swappedItems: any[] = [];
  const modifiedSummary: string[] = [];
  let replyText = '';

  if (msg.includes('ice') || msg.includes('add ice')) {
    addedItems.push({
      id: `cymb-item-${Date.now()}-ice`,
      name: 'CymbalMart Party Ice Bag (20 lb bag)',
      category: 'beverages_bar',
      store: 'CymbalMart Supercenter',
      quantity: 2,
      unit: 'bags (20 lb)',
      estimatedCost: 6.00,
      checked: false,
      priority: 'essential',
      aisleLocation: 'Front Store Freezers',
      notes: 'Keeps drinks chilled all evening.'
    });
    modifiedSummary.push('Added 2 bags of CymbalMart Party Ice (+$6.00)');
    replyText = "I've added 2 20-lb bags of CymbalMart Party Ice to your shopping list at $6.00 to ensure your drinks and coolers stay ice-cold!";
  } else if (msg.includes('vegan') || msg.includes('plant') || msg.includes('vegetarian')) {
    addedItems.push({
      id: `cymb-item-${Date.now()}-vegan`,
      name: 'Plant-Based Gourmet Burger Patties & Dairy-Free Cheese',
      category: 'grocery_fresh',
      store: 'CymbalMart Grocery & Deli',
      quantity: 2,
      unit: 'packs (4 count ea)',
      estimatedCost: 13.50,
      checked: false,
      priority: 'essential',
      aisleLocation: 'Produce / Plant-Based Section',
      dietaryTags: ['Vegan', 'Dairy-Free'],
      notes: 'Delicious vegan alternative for guests.'
    });
    modifiedSummary.push('Added Plant-Based Burger Patties & Dairy-Free Cheese (+$13.50)');
    replyText = "Added gourmet plant-based patties and dairy-free cheese to your list so all your vegetarian and vegan guests are well taken care of!";
  } else if (msg.includes('remove beer') || msg.includes('no alcohol') || msg.includes('remove alcohol')) {
    removedItemNames.push('beer', 'wine', 'rum', 'spirits', 'champagne');
    modifiedSummary.push('Removed alcoholic beverages from shopping list');
    replyText = "Removed the alcoholic beverages from your plan and recalculated your total budget.";
  } else if (msg.includes('budget') || msg.includes('how much') || msg.includes('total')) {
    const total = currentPlan?.estimatedTotalCost || 0;
    const limit = currentPlan?.details?.budgetLimit || 200;
    const diff = limit - total;
    replyText = `Your current party plan total is $${total.toFixed(2)} with a budget limit of $${limit.toFixed(2)}. ${diff >= 0 ? `You are safely $${diff.toFixed(2)} under budget!` : `You are currently $${Math.abs(diff).toFixed(2)} over budget. Would you like me to apply store brand rollbacks to save money?`}`;
  } else {
    // Generic smart addition / confirmation
    replyText = `I've processed your request: "${message}". Your CymbalMart party plan and shopping list are aligned with your theme and budget! Let me know if you'd like to adjust any items or check out.`;
  }

  return {
    replyText,
    actionType: addedItems.length > 0 || removedItemNames.length > 0 ? 'modify_plan' : 'none',
    modifiedSummary,
    addedItems,
    removedItemNames,
    swappedItems,
    updatedItems: [],
    newRecipe: null,
    updatedDetails: null
  };
}

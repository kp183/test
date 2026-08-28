import { PartyPlan } from '../types';

export const SAMPLE_PARTY_PRESETS: PartyPlan[] = [
  {
    id: 'preset-fiesta-taco-night',
    details: {
      id: 'party-fiesta-1',
      title: 'Cinco de Fiesta Taco & Margarita Bar',
      eventType: 'Dinner & Game Night',
      theme: 'Vibrant Mexican Fiesta',
      guestCountAdults: 16,
      guestCountKids: 4,
      guestCountTeens: 0,
      durationHours: 4,
      budgetLimit: 250,
      currency: '$',
      venue: 'Backyard / Outdoor',
      vibe: 'Lively & High-Energy',
      dietaryRestrictions: ['Vegetarian Option', 'Gluten-Free Friendly (Corn Tortillas)'],
      drinkPreference: 'Full Bar (Cocktails + Beer + Wine)',
      specialRequests: 'Build-your-own taco bar with marinated carne asada, seasoned chicken, and grilled peppers & onions. Fresh guacamole and craft margarita pitcher.'
    },
    estimatedTotalCost: 218.50,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    themeAndDecorIdeas: [
      'Papel picado banners across patio & string fairy lights',
      'Mini succulent pots as table markers & centerpieces',
      'Bright striped serape table runner on food station',
      'Ceramic salsa bowls with wooden spoons for dipping bar'
    ],
    playlistAndVibeTips: [
      'Upbeat Latin Indie, Cumbia, & Fiesta Lounge mix',
      'Setup lawn cornhole or Mexican Loteria bingo game',
      'Pre-chill glassware with chili-lime salt rimming station'
    ],
    budgetTips: [
      'Buy tortillas and tortilla chips at wholesale (Costco) for 40% savings',
      'Make salsa verde and pico de gallo from scratch (cheaper and tastier than jarred)',
      'Use 100% blue agave reposado tequila in 1.75L handle for best value per cocktail'
    ],
    drinkCalculator: {
      totalEstimatedDrinks: 64,
      beerCansBottles: 24,
      wineBottles750ml: 4,
      liquorBottles750ml: 2,
      mixerLiters: 4,
      sodaAndNonAlcoholicCans: 18,
      icePounds: 30,
      cupsTotal: 40,
      garnishNotes: '20 fresh limes (quartered), 1 tub chili-lime seasoning (Tajín), agave nectar',
      calculationFormula: '16 adults × 4 hrs = ~64 drinks total (~1.5 drinks/hr early, 1 drink/hr after). Plus kids lemonade.'
    },
    shoppingList: [
      {
        id: 'item-1',
        name: 'Flank Steak / Skirt Steak (Carne Asada)',
        category: 'grocery_fresh',
        store: 'Costco / Wholesale Club',
        quantity: 4,
        unit: 'lbs',
        estimatedCost: 38.00,
        checked: false,
        priority: 'essential',
        notes: 'Marinate in orange juice, lime juice, cilantro, garlic, cumin, and soy sauce.',
        dietaryTags: ['Gluten-Free']
      },
      {
        id: 'item-2',
        name: 'Boneless Skinless Chicken Thighs',
        category: 'grocery_fresh',
        store: 'Costco / Wholesale Club',
        quantity: 4,
        unit: 'lbs',
        estimatedCost: 16.00,
        checked: false,
        priority: 'essential',
        notes: 'Season with chipotle, smoked paprika, lime, and oregano.',
        dietaryTags: ['Gluten-Free']
      },
      {
        id: 'item-3',
        name: 'Yellow Corn Tortillas (Street Taco Size)',
        category: 'grocery_fresh',
        store: 'Supermarket / Grocery',
        quantity: 60,
        unit: 'count pack',
        estimatedCost: 4.50,
        checked: false,
        priority: 'essential',
        notes: 'Corn is naturally gluten-free; toast lightly on skillet before serving.',
        dietaryTags: ['Gluten-Free', 'Vegetarian']
      },
      {
        id: 'item-4',
        name: 'Flour Tortillas (Fajita size)',
        category: 'grocery_fresh',
        store: 'Supermarket / Grocery',
        quantity: 24,
        unit: 'count',
        estimatedCost: 3.80,
        checked: false,
        priority: 'recommended',
        notes: 'For guests who prefer flour soft tacos.'
      },
      {
        id: 'item-5',
        name: 'Hass Avocados (for fresh Guacamole)',
        category: 'grocery_fresh',
        store: 'Costco / Wholesale Club',
        quantity: 8,
        unit: 'count bag',
        estimatedCost: 8.50,
        checked: false,
        priority: 'essential',
        notes: 'Ensure 6 are ripe and 2 slightly firm to yield creamy chunky guac.',
        dietaryTags: ['Vegan', 'Gluten-Free']
      },
      {
        id: 'item-6',
        name: 'Fresh Cilantro, Limes & Red Onions',
        category: 'grocery_fresh',
        store: 'Supermarket / Grocery',
        quantity: 1,
        unit: 'bundle batch',
        estimatedCost: 6.20,
        checked: false,
        priority: 'essential',
        notes: '3 bunches cilantro, 15 juicy limes, 3 red onions for taco toppings.',
        dietaryTags: ['Vegan']
      },
      {
        id: 'item-7',
        name: 'Cotija Cheese & Shredded Mexican Blend',
        category: 'grocery_fresh',
        store: 'Supermarket / Grocery',
        quantity: 2,
        unit: 'bags (8oz)',
        estimatedCost: 7.00,
        checked: false,
        priority: 'essential',
        notes: 'Crumble cotija fresh on tacos.',
        dietaryTags: ['Vegetarian']
      },
      {
        id: 'item-8',
        name: 'Tortilla Chips (Restaurant Style)',
        category: 'grocery_fresh',
        store: 'Costco / Wholesale Club',
        quantity: 2,
        unit: 'large bags (32oz)',
        estimatedCost: 9.00,
        checked: false,
        priority: 'essential',
        notes: 'High-yield crispy chips for dipping station.',
        bulkTip: 'Costco bags are half the cost per ounce of standard grocery store bags.'
      },
      {
        id: 'item-9',
        name: 'Black Beans & Roasted Sweet Corn',
        category: 'grocery_fresh',
        store: 'Supermarket / Grocery',
        quantity: 4,
        unit: 'cans',
        estimatedCost: 4.80,
        checked: false,
        priority: 'recommended',
        notes: 'Sauteed with cumin and lime as hearty vegetarian filling.',
        dietaryTags: ['Vegan', 'Gluten-Free']
      },
      {
        id: 'item-10',
        name: '100% Blue Agave Blanco/Reposado Tequila',
        category: 'beverages_bar',
        store: 'Liquor / Beverage Store',
        quantity: 1,
        unit: 'handle (1.75L)',
        estimatedCost: 32.00,
        checked: false,
        priority: 'essential',
        notes: 'For signature batch Margaritas (e.g., Espolòn, Kirkland Signature, or Cazadores).'
      },
      {
        id: 'item-11',
        name: 'Mexican Craft Beer (Modelo Especial / Corona)',
        category: 'beverages_bar',
        store: 'Liquor / Beverage Store',
        quantity: 24,
        unit: 'pack cans/bottles',
        estimatedCost: 26.00,
        checked: false,
        priority: 'essential',
        notes: 'Serve chilled in ice cooler with lime wedges.'
      },
      {
        id: 'item-12',
        name: 'Jarritos Mexican Sodas & Sparkling Mineral Water',
        category: 'beverages_bar',
        store: 'Supermarket / Grocery',
        quantity: 16,
        unit: 'bottles/cans',
        estimatedCost: 14.00,
        checked: false,
        priority: 'essential',
        notes: 'Flavors: Mandarin, Tamarind, Lime, plus Topo Chico.'
      },
      {
        id: 'item-13',
        name: 'Party Ice Bags (10 lb)',
        category: 'beverages_bar',
        store: 'Supermarket / Grocery',
        quantity: 3,
        unit: 'bags (10lb)',
        estimatedCost: 8.00,
        checked: false,
        priority: 'essential',
        notes: '2 bags for drink cooler, 1 clean bag for shaker/glass ice.'
      },
      {
        id: 'item-14',
        name: 'Papel Picado Garland & Serape Table Runner',
        category: 'decorations_theme',
        store: 'Party Supply / Dollar Tree',
        quantity: 2,
        unit: 'garland packs',
        estimatedCost: 11.50,
        checked: false,
        priority: 'recommended',
        notes: 'Weatherproof plastic if hanging outdoors.'
      },
      {
        id: 'item-15',
        name: 'Heavy Duty Compostable Plates & Wooden Forks',
        category: 'tableware_disposables',
        store: 'Party Supply / Dollar Tree',
        quantity: 50,
        unit: 'count set',
        estimatedCost: 12.50,
        checked: false,
        priority: 'essential',
        notes: 'Sturdy 9-inch palm leaf or sugarcane plates that do not bend under taco weight.'
      },
      {
        id: 'item-16',
        name: 'Napkins (3-ply) & Heavy Duty Trash Bags',
        category: 'tableware_disposables',
        store: 'Supermarket / Grocery',
        quantity: 1,
        unit: 'pack each',
        estimatedCost: 6.70,
        checked: false,
        priority: 'essential',
        notes: 'Extra napkins are crucial for salsa & tacos!'
      },
      {
        id: 'item-17',
        name: 'Cinnamon Sugar Churro Bites (or Mini Dulce de Leche Tartlets)',
        category: 'grocery_fresh',
        store: 'Bakery / Specialty Store',
        quantity: 24,
        unit: 'pieces',
        estimatedCost: 11.00,
        checked: false,
        priority: 'recommended',
        notes: 'Warm 5 minutes before serving with chocolate dipping sauce.',
        dietaryTags: ['Vegetarian']
      }
    ],
    menuRecipes: [
      {
        id: 'recipe-1',
        name: 'Citrus-Garlic Marinated Carne Asada',
        course: 'main',
        servings: 16,
        prepTimeMinutes: 20,
        cookTimeMinutes: 12,
        description: 'Tender, smoky flank steak with charred edges, sliced thinly across the grain for supreme taco tenderness.',
        ingredients: [
          { item: 'Flank Steak or Skirt Steak', amount: '4 lbs' },
          { item: 'Fresh Orange Juice', amount: '1/2 cup' },
          { item: 'Fresh Lime Juice', amount: '1/3 cup' },
          { item: 'Garlic cloves (minced)', amount: '6 cloves' },
          { item: 'Chopped Cilantro', amount: '1/2 cup' },
          { item: 'Ground Cumin & Smoked Paprika', amount: '1 tbsp each' },
          { item: 'Soy sauce or Tamari', amount: '3 tbsp' },
          { item: 'Olive Oil', amount: '1/4 cup' }
        ],
        instructions: [
          'Whisk orange juice, lime juice, olive oil, soy sauce, garlic, cilantro, and spices together in a large bowl.',
          'Submerge steak in marinade in a zip-top bag; refrigerate 4 to 8 hours (avoid longer than 12h to keep texture perfect).',
          'Preheat grill to high heat (450°F+). Grill steak for 5-6 minutes per side until nicely charred medium-rare (internal temp 130°F).',
          'Rest on cutting board tented with foil for 8 minutes, then slice thinly against the grain.'
        ],
        dietaryTags: ['Gluten-Free (use GF tamari)', 'High Protein'],
        makeAheadTips: 'Make the marinade up to 2 days ahead and store in a jar.'
      },
      {
        id: 'recipe-2',
        name: 'Fresh Guacamole & Roasted Corn Salsa Bar',
        course: 'appetizer',
        servings: 20,
        prepTimeMinutes: 15,
        description: 'Chunky avocado dip with lime, sea salt, diced jalapeño, accompanied by sweet roasted corn with cotija.',
        ingredients: [
          { item: 'Ripe Hass Avocados', amount: '6 large' },
          { item: 'Fresh Limes (juiced)', amount: '3 whole' },
          { item: 'Finely Diced Red Onion', amount: '1/2 cup' },
          { item: 'Jalapeño (seeded & minced)', amount: '1-2 peppers' },
          { item: 'Kosher salt & flaky sea salt', amount: '1.5 tsp' },
          { item: 'Chopped Cilantro', amount: '1/3 cup' }
        ],
        instructions: [
          'Halve avocados, remove pits, and scoop flesh into a molcajete or large wide bowl.',
          'Mash with a potato masher or fork, keeping distinct chunks.',
          'Gently fold in lime juice, salt, onion, jalapeño, and cilantro. Taste and adjust salt and acidity.'
        ],
        dietaryTags: ['Vegan', 'Gluten-Free', 'Dairy-Free'],
        makeAheadTips: 'To prevent browning, press plastic wrap directly against the guacamole surface and store with lime juice on top.'
      },
      {
        id: 'recipe-3',
        name: 'Crowd-Pleaser Craft Agave Margarita Pitcher',
        course: 'cocktail_drink',
        servings: 12,
        prepTimeMinutes: 10,
        description: 'The golden ratio margarita: 2 parts 100% agave tequila, 1 part fresh lime juice, 0.75 part pure agave nectar, splash of orange liqueur.',
        ingredients: [
          { item: 'Blanco or Reposado Tequila', amount: '3 cups (750ml)' },
          { item: 'Fresh Strained Lime Juice', amount: '1.5 cups' },
          { item: 'Agave Nectar', amount: '1 cup' },
          { item: 'Orange Liqueur (Cointreau or Triple Sec)', amount: '1/2 cup' },
          { item: 'Cold Filtered Water', amount: '1 cup (for dilution balance)' },
          { item: 'Tajín and Kosher Salt for rims', amount: '3 tbsp' }
        ],
        instructions: [
          'Combine tequila, fresh lime juice, agave nectar, orange liqueur, and water in a large glass pitcher.',
          'Stir vigorously until agave nectar is fully dissolved and integrated.',
          'Keep chilled in refrigerator. To serve, rim glasses with lime wedge and dip into Tajín-salt blend, fill with ice, and pour margarita.'
        ],
        dietaryTags: ['Gluten-Free', 'Vegetarian'],
        makeAheadTips: 'Can be mixed 24 hours in advance. Stir well before serving.'
      }
    ],
    timeline: [
      {
        id: 't-1',
        timeframe: '3-4 Days Before',
        task: 'Purchase non-perishables, decorations, paper plates, napkins, and tequila handle.',
        category: 'Shopping',
        completed: false,
        tip: 'Check wholesale club first for chips, napkins, and bulk meats.'
      },
      {
        id: 't-2',
        timeframe: '1-2 Days Before',
        task: 'Buy fresh produce (avocados, limes, cilantro) and meats. Mix marinade in jar.',
        category: 'Shopping',
        completed: false,
        tip: 'Choose avocados with slight give so they are peak ripe on party day.'
      },
      {
        id: 't-3',
        timeframe: '1-2 Days Before',
        task: 'Put flank steak and chicken in marinade bags. Clean patio and string lights.',
        category: 'Prep & Cooking',
        completed: false
      },
      {
        id: 't-4',
        timeframe: 'Day of Party (Morning)',
        task: 'Batch-mix Margarita pitcher and refrigerate. Chop onions, cilantro, and limes for topping station.',
        category: 'Beverages',
        completed: false
      },
      {
        id: 't-5',
        timeframe: '2 Hours Before Guests Arrive',
        task: 'Pick up 3 bags of ice. Fill beverage cooler with beers, sodas, and ice. Mash fresh guacamole.',
        category: 'Beverages',
        completed: false,
        tip: 'Keep guacamole covered tightly with plastic film touching surface.'
      },
      {
        id: 't-6',
        timeframe: '2 Hours Before Guests Arrive',
        task: 'Fire up grill. Cook meats, rest, and slice into warm serving platters.',
        category: 'Prep & Cooking',
        completed: false
      },
      {
        id: 't-7',
        timeframe: 'Party Kickoff',
        task: 'Turn on Latin playlist, warm tortillas, uncover taco bar toppings, and pour welcome margaritas!',
        category: 'Host Readiness',
        completed: false
      }
    ]
  },
  {
    id: 'preset-kids-superhero-birthday',
    details: {
      id: 'party-kids-hero',
      title: 'Hero Academy 7th Birthday Party',
      eventType: 'Kids Birthday Party',
      theme: 'Superhero Hero Academy',
      guestCountAdults: 10,
      guestCountKids: 12,
      guestCountTeens: 2,
      durationHours: 3,
      budgetLimit: 220,
      currency: '$',
      venue: 'Home Indoor',
      vibe: 'Family & Kid Friendly',
      dietaryRestrictions: ['Nut-Free (strictly school-safe)', 'Vegetarian Pizza Option'],
      drinkPreference: 'Mocktails & Punch (Non-Alcoholic)',
      specialRequests: 'Superhero obstacle course, DIY Hero Cape decorating, customizable mini pizzas, and Hulk green punch.'
    },
    estimatedTotalCost: 195.00,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    themeAndDecorIdeas: [
      'Red, yellow, and royal blue balloon arch at entryway',
      'Comic book "POW!", "BAM!", "BOOM!" cutout signs on walls',
      'Superhero city skyline photo backdrop made of black posterboards with yellow square windows',
      'Capes and foam hero masks for each child on arrival'
    ],
    playlistAndVibeTips: [
      'Avengers & superhero movie theme tracks + high-energy pop',
      'Obstacle course in backyard/living room with laser yarn escape',
      'Photo booth station with speech bubbles'
    ],
    budgetTips: [
      'Make punch with 2-liter ginger ale and lemon-lime sherbet (looks magical for <$6)',
      'Buy plain satin capes in bulk 12-pack on Amazon with sticker emblems'
    ],
    drinkCalculator: {
      totalEstimatedDrinks: 48,
      beerCansBottles: 0,
      wineBottles750ml: 0,
      liquorBottles750ml: 0,
      mixerLiters: 6,
      sodaAndNonAlcoholicCans: 30,
      icePounds: 20,
      cupsTotal: 35,
      garnishNotes: 'Color-changing straws, superhero shield cupcake toppers',
      calculationFormula: '12 kids + 12 adults/teens × 3 hours = ~48 juices/punch cups & sparkling waters.'
    },
    shoppingList: [
      {
        id: 'k-1',
        name: 'Pre-made Personal Pizza Dough Crusts & Sauce',
        category: 'grocery_fresh',
        store: 'Supermarket / Grocery',
        quantity: 16,
        unit: 'individual crusts',
        estimatedCost: 24.00,
        checked: false,
        priority: 'essential',
        notes: 'Nut-free facility certified crusts.'
      },
      {
        id: 'k-2',
        name: 'Shredded Mozzarella & Mini Pepperonis',
        category: 'grocery_fresh',
        store: 'Costco / Wholesale Club',
        quantity: 2,
        unit: 'large bags',
        estimatedCost: 14.50,
        checked: false,
        priority: 'essential'
      },
      {
        id: 'k-3',
        name: 'Nut-Free Superhero Shield Birthday Cake or Cupcakes',
        category: 'grocery_fresh',
        store: 'Bakery / Specialty Store',
        quantity: 24,
        unit: 'cupcakes',
        estimatedCost: 35.00,
        checked: false,
        priority: 'essential',
        notes: 'Strictly nut-free facility bakery.'
      },
      {
        id: 'k-4',
        name: 'Hero Punch Ingredients (Lemon-Lime Soda + Lime Sherbet)',
        category: 'beverages_bar',
        store: 'Supermarket / Grocery',
        quantity: 3,
        unit: 'bottles + 1 tub',
        estimatedCost: 9.50,
        checked: false,
        priority: 'essential',
        notes: 'Mix right before serving for foaming "Hulk Gamma" effect.'
      },
      {
        id: 'k-5',
        name: 'Juice Boxes (100% Fruit Juice)',
        category: 'beverages_bar',
        store: 'Costco / Wholesale Club',
        quantity: 24,
        unit: 'pack',
        estimatedCost: 11.00,
        checked: false,
        priority: 'essential'
      },
      {
        id: 'k-6',
        name: 'Sparkling Seltzer Water (for parents/adults)',
        category: 'beverages_bar',
        store: 'Costco / Wholesale Club',
        quantity: 24,
        unit: 'can variety pack',
        estimatedCost: 12.00,
        checked: false,
        priority: 'recommended'
      },
      {
        id: 'k-7',
        name: 'Kid Superhero Capes & Masks (12 Pack)',
        category: 'games_favors',
        store: 'Amazon / Online',
        quantity: 1,
        unit: '12-pack set',
        estimatedCost: 22.00,
        checked: false,
        priority: 'essential',
        notes: 'Doubles as party activity and take-home party favor!'
      },
      {
        id: 'k-8',
        name: 'Primary Color Balloon Garland Kit & Comic Cutouts',
        category: 'decorations_theme',
        store: 'Party Supply / Dollar Tree',
        quantity: 1,
        unit: 'kit',
        estimatedCost: 15.00,
        checked: false,
        priority: 'recommended'
      },
      {
        id: 'k-9',
        name: 'Themed Paper Plates, Cups, and Napkins',
        category: 'tableware_disposables',
        store: 'Party Supply / Dollar Tree',
        quantity: 1,
        unit: 'party pack (30ct)',
        estimatedCost: 14.00,
        checked: false,
        priority: 'essential'
      },
      {
        id: 'k-10',
        name: 'Fresh Fruit Skewers (Strawberries, Grapes, Melon)',
        category: 'grocery_fresh',
        store: 'Supermarket / Grocery',
        quantity: 1,
        unit: 'fruit selection batch',
        estimatedCost: 14.00,
        checked: false,
        priority: 'recommended',
        notes: 'Healthy "Hero Energy Swords" on wooden craft sticks with blunt tips.'
      }
    ],
    menuRecipes: [
      {
        id: 'k-rec-1',
        name: 'Gamma Green Foaming Hero Punch',
        course: 'cocktail_drink',
        servings: 24,
        prepTimeMinutes: 5,
        description: 'Vibrant green bubbling punch topped with scoops of lime sherbet that create a delicious frothy cloud.',
        ingredients: [
          { item: 'Lemon-Lime Soda or Sprite (chilled)', amount: '2 bottles (2L)' },
          { item: 'Hawaiian Punch Green Berry Rush or Pineapple Juice', amount: '1 bottle (64oz)' },
          { item: 'Lime Sherbet', amount: '1 tub (1.5 qt)' }
        ],
        instructions: [
          'Pour chilled green berry rush and lemon-lime soda into a clear punch bowl.',
          'Right when kids gather, scoop large rounds of lime sherbet on top.',
          'Watch the exciting bubbling foam rise as the sherbet melts into creamy fizz.'
        ],
        dietaryTags: ['Nut-Free', 'Vegetarian', 'Non-Alcoholic']
      },
      {
        id: 'k-rec-2',
        name: 'Power Shield Personal Pizza Station',
        course: 'main',
        servings: 16,
        prepTimeMinutes: 15,
        cookTimeMinutes: 10,
        description: 'DIY pizza assembly where kids design their own shield with mozzarella, pepperonis, and sliced olives.',
        ingredients: [
          { item: 'Mini personal pizza crusts / naan rounds', amount: '16' },
          { item: 'Pizza sauce', amount: '2 jars' },
          { item: 'Shredded Mozzarella cheese', amount: '4 cups' },
          { item: 'Toppings (mini pepperoni, diced peppers, olives)', amount: 'Assorted bowls' }
        ],
        instructions: [
          'Set out toppings in small bowls along the table.',
          'Let each hero spoon 2 tbsp sauce and top with cheese & designed patterns.',
          'Bake at 425°F for 8-10 minutes until edges are crisp and cheese bubbles.'
        ],
        dietaryTags: ['Nut-Free', 'Vegetarian Options']
      }
    ],
    timeline: [
      {
        id: 'kt-1',
        timeframe: '3-4 Days Before',
        task: 'Order capes and masks pack online. Confirm nut-free bakery cupcake order.',
        category: 'Shopping',
        completed: false
      },
      {
        id: 'kt-2',
        timeframe: '1-2 Days Before',
        task: 'Assemble balloon garland with pump. Prepare comic book signs & game obstacle course props.',
        category: 'Decor & Setup',
        completed: false
      },
      {
        id: 'kt-3',
        timeframe: 'Day of Party (Morning)',
        task: 'Wash and thread fruit skewers. Set up pizza topping bowls.',
        category: 'Prep & Cooking',
        completed: false
      },
      {
        id: 'kt-4',
        timeframe: '2 Hours Before Guests Arrive',
        task: 'Pick up cupcakes from bakery. Chill punch juices in punch bowl.',
        category: 'Shopping',
        completed: false
      },
      {
        id: 'kt-5',
        timeframe: 'Party Kickoff',
        task: 'Hand capes & masks to heroes as they arrive, cue theme music, and start the Hero Training Course!',
        category: 'Host Readiness',
        completed: false
      }
    ]
  },
  {
    id: 'preset-chic-cocktail-tapas',
    details: {
      id: 'party-cocktail-tapas',
      title: 'Sunset Tapas & Craft Cocktail Soirée',
      eventType: 'Cocktail & Hors d’Oeuvres Party',
      theme: 'Modern Mediterranean Sunset',
      guestCountAdults: 14,
      guestCountKids: 0,
      guestCountTeens: 0,
      durationHours: 4,
      budgetLimit: 300,
      currency: '$',
      venue: 'Home Indoor',
      vibe: 'Elegant & Sophisticated',
      dietaryRestrictions: ['Vegetarian Friendly', 'Dairy-Free Options', 'Pescatarian'],
      drinkPreference: 'Full Bar (Cocktails + Beer + Wine)',
      specialRequests: 'Artisanal charcuterie board, smoked salmon crostini, patatas bravas, Spanish Rioja wine, and handcrafted French 75 / Espresso Martinis.'
    },
    estimatedTotalCost: 265.00,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    themeAndDecorIdeas: [
      'Taper candles in brass candleholders & warm amber votives',
      'Olive branch and eucalyptus sprigs down the center of marble/wood boards',
      'Linen cocktail napkins with gold foil edge',
      'Coupe and stemless crystal glassware with botanical garnishes'
    ],
    playlistAndVibeTips: [
      'Bossa nova, chill French house, and acoustic jazz lounge',
      'Soft dim ambient lighting with warm 2700K bulbs',
      'Pre-cut lemon wheels and rosemary sprigs in small glass bowls'
    ],
    budgetTips: [
      'Assemble charcuterie yourself from Trader Joes or Costco for 60% less than pre-made platters',
      'Prosecco or Cava gives identical crisp effervescence to French Champagne at a fraction of the bottle price'
    ],
    drinkCalculator: {
      totalEstimatedDrinks: 56,
      beerCansBottles: 12,
      wineBottles750ml: 6,
      liquorBottles750ml: 2,
      mixerLiters: 3,
      sodaAndNonAlcoholicCans: 12,
      icePounds: 25,
      cupsTotal: 30,
      garnishNotes: 'Fresh rosemary sprigs, brandied cherries, lemon twists, edible flowers',
      calculationFormula: '14 adults × 4 hours = ~56 total drinks (6 bottles wine = 30 glasses, 2 bottles liquor = ~32 cocktails).'
    },
    shoppingList: [
      {
        id: 'ct-1',
        name: 'Artisan Cheeses (Manchego, Triple Cream Brie, Aged Gouda)',
        category: 'grocery_fresh',
        store: 'Supermarket / Grocery',
        quantity: 3,
        unit: 'wedges (7oz)',
        estimatedCost: 22.00,
        checked: false,
        priority: 'essential',
        notes: 'Bring to room temperature 45 mins before guests arrive for best flavor.',
        dietaryTags: ['Vegetarian']
      },
      {
        id: 'ct-2',
        name: 'Cured Meats (Prosciutto di Parma & Spanish Jamón Serrano)',
        category: 'grocery_fresh',
        store: 'Supermarket / Grocery',
        quantity: 2,
        unit: 'packs (4oz)',
        estimatedCost: 15.00,
        checked: false,
        priority: 'essential',
        notes: 'Ribbon delicately on boards.'
      },
      {
        id: 'ct-3',
        name: 'Wild Smoked Salmon & Crème Fraîche',
        category: 'grocery_fresh',
        store: 'Costco / Wholesale Club',
        quantity: 1,
        unit: 'pack (12oz)',
        estimatedCost: 17.50,
        checked: false,
        priority: 'essential',
        notes: 'For dill & caper crostini.'
      },
      {
        id: 'ct-4',
        name: 'Artisan Baguettes & Seeded Crackers',
        category: 'grocery_fresh',
        store: 'Bakery / Specialty Store',
        quantity: 2,
        unit: 'fresh loaves + 1 box',
        estimatedCost: 11.00,
        checked: false,
        priority: 'essential'
      },
      {
        id: 'ct-5',
        name: 'Marcona Almonds, Castlevetrano Olives & Fig Jam',
        category: 'grocery_fresh',
        store: 'Supermarket / Grocery',
        quantity: 3,
        unit: 'jars',
        estimatedCost: 16.00,
        checked: false,
        priority: 'recommended',
        dietaryTags: ['Vegan', 'Gluten-Free']
      },
      {
        id: 'ct-6',
        name: 'Spanish Cava / Italian Prosecco Sparkling Wine',
        category: 'beverages_bar',
        store: 'Liquor / Beverage Store',
        quantity: 4,
        unit: 'bottles (750ml)',
        estimatedCost: 48.00,
        checked: false,
        priority: 'essential',
        notes: 'For French 75s and welcome champagne flutes.'
      },
      {
        id: 'ct-7',
        name: 'Botanical Gin & London Dry (Tanqueray or Hendrick\'s)',
        category: 'beverages_bar',
        store: 'Liquor / Beverage Store',
        quantity: 1,
        unit: 'bottle (750ml)',
        estimatedCost: 30.00,
        checked: false,
        priority: 'essential'
      },
      {
        id: 'ct-8',
        name: 'Spanish Rioja / Tempranillo Red Wine',
        category: 'beverages_bar',
        store: 'Liquor / Beverage Store',
        quantity: 3,
        unit: 'bottles (750ml)',
        estimatedCost: 39.00,
        checked: false,
        priority: 'essential'
      },
      {
        id: 'ct-9',
        name: 'Taper Candles & Linen Cocktail Napkins',
        category: 'decorations_theme',
        store: 'Amazon / Online',
        quantity: 1,
        unit: 'box',
        estimatedCost: 18.00,
        checked: false,
        priority: 'recommended'
      },
      {
        id: 'ct-10',
        name: 'Premium Cocktail Ice & Lemon Twists',
        category: 'beverages_bar',
        store: 'Supermarket / Grocery',
        quantity: 2,
        unit: 'bags',
        estimatedCost: 7.50,
        checked: false,
        priority: 'essential'
      }
    ],
    menuRecipes: [
      {
        id: 'ct-rec-1',
        name: 'Smoked Salmon & Herbed Crème Fraîche Crostini',
        course: 'appetizer',
        servings: 14,
        prepTimeMinutes: 15,
        description: 'Crisp toasted baguette slices topped with lemon-dill crème fraîche, ribbons of silky smoked salmon, capers, and fresh pepper.',
        ingredients: [
          { item: 'French Baguette (sliced diagonally 1/2 inch)', amount: '1 loaf' },
          { item: 'Crème Fraîche', amount: '1 cup' },
          { item: 'Fresh Dill (chopped) & Lemon zest', amount: '2 tbsp + 1 lemon' },
          { item: 'Wild Smoked Salmon', amount: '8 oz' },
          { item: 'Nonpareil Capers (drained)', amount: '2 tbsp' }
        ],
        instructions: [
          'Brush baguette slices lightly with olive oil and toast at 400°F for 6 minutes until golden.',
          'Whisk crème fraîche with lemon zest, lemon juice, chopped dill, pinch of sea salt.',
          'Spread 1 tbsp herbed cream onto each crostini, drape with smoked salmon, and garnish with capers and a dill frond.'
        ],
        dietaryTags: ['Pescatarian']
      }
    ],
    timeline: [
      {
        id: 'ctt-1',
        timeframe: '3-4 Days Before',
        task: 'Purchase wine, gin, glassware, and candles.',
        category: 'Shopping',
        completed: false
      },
      {
        id: 'ctt-2',
        timeframe: '1-2 Days Before',
        task: 'Purchase cheeses, cured meats, fresh herbs, and lemons. Make simple syrup for cocktails.',
        category: 'Shopping',
        completed: false
      },
      {
        id: 'ctt-3',
        timeframe: 'Day of Party (Morning)',
        task: 'Slice and toast crostini baguettes; store in airtight tin. Prepare olive and almond bowls.',
        category: 'Prep & Cooking',
        completed: false
      },
      {
        id: 'ctt-4',
        timeframe: '2 Hours Before Guests Arrive',
        task: 'Arrange charcuterie and cheese boards so cheeses soften to ideal serving temperature. Chill sparkling wines.',
        category: 'Prep & Cooking',
        completed: false
      },
      {
        id: 'ctt-5',
        timeframe: 'Party Kickoff',
        task: 'Light candles, queue Mediterranean lounge music, and greet guests with a sparkling cocktail!',
        category: 'Host Readiness',
        completed: false
      }
    ]
  },
  {
    id: 'preset-corporate-team-building',
    details: {
      id: 'party-corp-50',
      title: 'Annual Corporate Summit & Team Mixer',
      eventType: 'Corporate Team Building Event',
      theme: 'Professional & Contemporary',
      guestCountAdults: 50,
      guestCountKids: 0,
      guestCountTeens: 0,
      durationHours: 4,
      budgetLimit: 750,
      currency: '$',
      venue: 'Office / Workplace',
      vibe: 'Elegant & Sophisticated',
      dietaryRestrictions: ['Vegetarian Options', 'Gluten-Free Options', 'Halal-Friendly'],
      drinkPreference: 'Beer & Wine + Non-Alcoholic',
      specialRequests: 'Gourmet wrap and slider platters, high-end charcuterie, sparkling waters, barista coffee bar setup, corporate branded napkins and name tags.'
    },
    estimatedTotalCost: 685.00,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    themeAndDecorIdeas: [
      'Minimalist corporate branded table runners with succulent centerpieces',
      'Professional badge and lanyard welcome station',
      'Interactive whiteboard collaboration wall with breakout prompts',
      'Acoustic ambient sound dampeners and elegant soft uplighting'
    ],
    playlistAndVibeTips: [
      'Upbeat lo-fi beats, ambient instrumental jazz, and modern indie instrumentals',
      'Structured 45-minute icebreaker challenge followed by casual networking'
    ],
    budgetTips: [
      'Order bakery slider bundles and sandwich wrap trays at CymbalMart wholesale club rates',
      'Provide curated wine/beer flight selections rather than an open liquor bar for significant budget control'
    ],
    drinkCalculator: {
      totalEstimatedDrinks: 180,
      beerCansBottles: 48,
      wineBottles750ml: 16,
      liquorBottles750ml: 0,
      mixerLiters: 12,
      sodaAndNonAlcoholicCans: 72,
      icePounds: 60,
      cupsTotal: 100,
      garnishNotes: 'Lemon wheels, mint sprigs, fresh cold brew with oat milk & almond milk dispensers',
      calculationFormula: '50 adults × 4 hours = ~180 drinks (beer, wine, cold brew, sparkling water).'
    },
    shoppingList: [
      {
        id: 'corp-1',
        name: 'CymbalMart Artisan Wrap & Sandwich Platter (Turkey, Roast Beef, Roasted Veggie)',
        category: 'grocery_fresh',
        store: 'CymbalMart Supercenter',
        quantity: 4,
        unit: 'large platters (12-14 servings ea)',
        estimatedCost: 160.00,
        checked: false,
        priority: 'essential',
        notes: 'Includes vegetarian and gluten-free wrapped options.',
        isCymbalMartBrand: true,
        aisleLocation: 'Deli / Catering Counter'
      },
      {
        id: 'corp-2',
        name: 'Gourmet Charcuterie & Cheese Catering Board (Aged Cheddar, Brie, Cured Salami, Grapes)',
        category: 'grocery_fresh',
        store: 'CymbalMart Supercenter',
        quantity: 3,
        unit: 'catering boards',
        estimatedCost: 95.00,
        checked: false,
        priority: 'essential',
        notes: 'Pre-sliced and garnished with rosemary and fig jam.',
        isCymbalMartBrand: true,
        aisleLocation: 'Deli / Specialty Cheeses'
      },
      {
        id: 'corp-3',
        name: 'CymbalMart Fresh Fruit & Berry Skewer Trays',
        category: 'grocery_fresh',
        store: 'CymbalMart Supercenter',
        quantity: 3,
        unit: 'trays (20 count ea)',
        estimatedCost: 45.00,
        checked: false,
        priority: 'recommended',
        isCymbalMartBrand: true,
        aisleLocation: 'Produce Department'
      },
      {
        id: 'corp-4',
        name: 'Curated Craft IPA & Crisp Lager Variety Pack',
        category: 'beverages_bar',
        store: 'CymbalMart Supercenter',
        quantity: 2,
        unit: '24-packs (cans)',
        estimatedCost: 64.00,
        checked: false,
        priority: 'essential',
        aisleLocation: 'Aisle 8 • Beer & Cider'
      },
      {
        id: 'corp-5',
        name: 'Chardonnay & Cabernet Sauvignon Reserve Wine',
        category: 'beverages_bar',
        store: 'CymbalMart Supercenter',
        quantity: 16,
        unit: 'bottles (750ml)',
        estimatedCost: 144.00,
        checked: false,
        priority: 'essential',
        notes: '8 White, 8 Red for balanced corporate preference.',
        aisleLocation: 'Aisle 9 • Fine Wine'
      },
      {
        id: 'corp-6',
        name: 'San Pellegrino Sparkling Mineral Waters & LaCroix Variety',
        category: 'beverages_bar',
        store: 'CymbalMart Supercenter',
        quantity: 3,
        unit: '24-can cases',
        estimatedCost: 36.00,
        checked: false,
        priority: 'essential',
        aisleLocation: 'Aisle 7 • Beverages'
      },
      {
        id: 'corp-7',
        name: 'Cold Brew Coffee Keg / Gallon Jugs & Barista Oat Milk',
        category: 'beverages_bar',
        store: 'CymbalMart Supercenter',
        quantity: 4,
        unit: 'gallon jugs + 3 cartons',
        estimatedCost: 42.00,
        checked: false,
        priority: 'recommended',
        aisleLocation: 'Aisle 3 • Dairy & Coffee'
      },
      {
        id: 'corp-8',
        name: 'Professional Linen-Feel Plates, Silverware & Napkins Set',
        category: 'tableware_disposables',
        store: 'CymbalMart Supercenter',
        quantity: 2,
        unit: '100-count premium kits',
        estimatedCost: 48.00,
        checked: false,
        priority: 'essential',
        notes: 'Matte black & silver heavy-duty compostable flatware.',
        aisleLocation: 'Aisle 12 • Party & Paper'
      },
      {
        id: 'corp-9',
        name: 'Custom Professional Name Badges & Lanyards (50 pack)',
        category: 'decorations_theme',
        store: 'CymbalMart Supercenter',
        quantity: 1,
        unit: '50-pack kit',
        estimatedCost: 21.00,
        checked: false,
        priority: 'recommended',
        aisleLocation: 'Aisle 15 • Office Supplies'
      },
      {
        id: 'corp-10',
        name: 'Party Ice Bags (20 lb bags)',
        category: 'beverages_bar',
        store: 'CymbalMart Supercenter',
        quantity: 3,
        unit: 'bags (20lb)',
        estimatedCost: 30.00,
        checked: false,
        priority: 'essential',
        aisleLocation: 'Front Store Freezers'
      }
    ],
    menuRecipes: [
      {
        id: 'corp-rec-1',
        name: 'Executive Cold Brew Citrus Spritz',
        course: 'cocktail_drink',
        servings: 50,
        prepTimeMinutes: 10,
        description: 'Refreshing energizing mocktail with rich cold brew, blood orange sparkling tonic, and rosemary garnish.',
        ingredients: [
          { item: 'Concentrated Cold Brew Coffee', amount: '1.5 gallons' },
          { item: 'Blood Orange Sparkling Tonic Water', amount: '12 bottles (1L)' },
          { item: 'Fresh Rosemary Sprigs', amount: '50 sprigs' }
        ],
        instructions: [
          'Fill highball tumbler with ice cubes.',
          'Pour 3 oz cold brew, top with 4 oz blood orange tonic.',
          'Slap fresh rosemary sprig between palms to release oils and garnish.'
        ],
        dietaryTags: ['Vegan', 'Gluten-Free', 'Non-Alcoholic']
      }
    ],
    timeline: [
      {
        id: 'corp-t1',
        timeframe: '3-4 Days Before',
        task: 'Confirm final attendee headcount (50) and catering platter orders with CymbalMart deli.',
        category: 'Host Readiness',
        completed: false
      },
      {
        id: 'corp-t2',
        timeframe: '1-2 Days Before',
        task: 'Print name badges, check AV equipment, microphones, and presentation slides.',
        category: 'Decor & Setup',
        completed: false
      },
      {
        id: 'corp-t3',
        timeframe: 'Day of Party (Morning)',
        task: 'Pick up fresh sandwich wrap trays, charcuterie boards, and chilled beverages from CymbalMart.',
        category: 'Shopping',
        completed: false
      },
      {
        id: 'corp-t4',
        timeframe: '2 Hours Before Guests Arrive',
        task: 'Arrange beverage and coffee stations, uncork initial wine bottles, and set out name badge table.',
        category: 'Beverages',
        completed: false
      }
    ]
  },
  {
    id: 'preset-outdoor-garden-wedding',
    details: {
      id: 'party-wedding-100',
      title: 'Botanical Garden Outdoor Wedding Reception',
      eventType: 'Wedding Reception',
      theme: 'Garden / Outdoor Romantic',
      guestCountAdults: 90,
      guestCountKids: 6,
      guestCountTeens: 4,
      durationHours: 6,
      budgetLimit: 2500,
      currency: '$',
      venue: 'Backyard / Outdoor',
      vibe: 'Elegant & Sophisticated',
      dietaryRestrictions: ['Vegetarian Options', 'Gluten-Free Options', 'Dairy-Free Options'],
      drinkPreference: 'Full Bar (Cocktails + Beer + Wine)',
      specialRequests: 'Weather protection pop-up canopies, outdoor garden seating cushions, patio heaters/misting fans, champagne toast, and midnight s’mores fire pit bar.'
    },
    estimatedTotalCost: 2180.00,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    themeAndDecorIdeas: [
      'Warm white bistro fairy string lights draped across timber pergolas',
      'Weather protection canopies and sheer ivory drape arches',
      'Lush eucalyptus garlands, white garden roses, and brass hurricane lanterns',
      'Cozy outdoor lounge furniture vignettes with soft plush throw blankets'
    ],
    playlistAndVibeTips: [
      'Acoustic strings & modern cello covers during cocktail hour, live upbeat band for evening dancing',
      'Sunset champagne toast timed with golden hour photography'
    ],
    budgetTips: [
      'Source bulk garden roses and greenery from CymbalMart Floral Wholesale for 50% savings over traditional boutique florists',
      'Pre-batch signature bride and groom cocktails in beverage dispensers to streamline bar service and eliminate liquor waste'
    ],
    drinkCalculator: {
      totalEstimatedDrinks: 450,
      beerCansBottles: 96,
      wineBottles750ml: 48,
      liquorBottles750ml: 12,
      mixerLiters: 24,
      sodaAndNonAlcoholicCans: 120,
      icePounds: 150,
      cupsTotal: 250,
      garnishNotes: 'Edible orchid flowers, dehydrated citrus wheels, fresh garden mint, champagne flutes',
      calculationFormula: '100 guests × 6 hours = ~450 drinks (48 wine bottles = 240 glasses, 20 champagne toast bottles = 120 flutes, 96 beers, craft cocktails).'
    },
    shoppingList: [
      {
        id: 'wed-1',
        name: 'French Brut Champagne (for Grand Toast & Welcome Flutes)',
        category: 'beverages_bar',
        store: 'CymbalMart Supercenter',
        quantity: 24,
        unit: 'bottles (750ml)',
        estimatedCost: 380.00,
        checked: false,
        priority: 'essential',
        notes: 'Chilled on ice buckets with gold ribbon accents.',
        aisleLocation: 'Aisle 9 • Fine Champagne'
      },
      {
        id: 'wed-2',
        name: 'Curated Sonoma Pinot Noir & Napa Sauvignon Blanc',
        category: 'beverages_bar',
        store: 'CymbalMart Supercenter',
        quantity: 48,
        unit: 'bottles (750ml)',
        estimatedCost: 520.00,
        checked: false,
        priority: 'essential',
        notes: '24 Red, 24 White for dinner table carafes.',
        aisleLocation: 'Aisle 9 • Fine Wine'
      },
      {
        id: 'wed-3',
        name: 'Outdoor Weather-Resistant Pop-Up Canopy & Sidewalls (10x20 ft)',
        category: 'decorations_theme',
        store: 'CymbalMart Supercenter',
        quantity: 2,
        unit: 'heavy duty canopy kits',
        estimatedCost: 260.00,
        checked: false,
        priority: 'essential',
        notes: 'Essential for rain & sun UV protection over buffet and cake station.',
        isCymbalMartBrand: true,
        aisleLocation: 'Aisle 16 • Outdoor & Patio'
      },
      {
        id: 'wed-4',
        name: 'Garden Lawn Seating Cushions & Cozy Fleece Throw Blankets',
        category: 'decorations_theme',
        store: 'CymbalMart Supercenter',
        quantity: 20,
        unit: 'packs (cushions + blankets)',
        estimatedCost: 190.00,
        checked: false,
        priority: 'essential',
        notes: 'For outdoor lawn lounge area during cool evening breeze.',
        isCymbalMartBrand: true,
        aisleLocation: 'Aisle 14 • Home & Living'
      },
      {
        id: 'wed-5',
        name: 'Artisan Grilled Salmon & Beef Tenderloin Catering Stations',
        category: 'grocery_fresh',
        store: 'CymbalMart Supercenter',
        quantity: 1,
        unit: '100-serving catered buffet package',
        estimatedCost: 450.00,
        checked: false,
        priority: 'essential',
        notes: 'Includes rosemary roasted fingerling potatoes and grilled asparagus.',
        isCymbalMartBrand: true,
        aisleLocation: 'Deli / Catering'
      },
      {
        id: 'wed-6',
        name: '3-Tier Gluten-Free Vanilla Bean & Raspberry Wedding Cake',
        category: 'grocery_fresh',
        store: 'CymbalMart Supercenter',
        quantity: 1,
        unit: '3-tier custom wedding cake (100 servings)',
        estimatedCost: 175.00,
        checked: false,
        priority: 'essential',
        notes: 'Decorated with fresh eucalyptus and ivory buttercream.',
        isCymbalMartBrand: true,
        aisleLocation: 'Bakery Department'
      },
      {
        id: 'wed-7',
        name: 'Midnight S’mores Fire Pit Kit (Gourmet Marshmallows, Ghirardelli Chocolate, Graham Crackers, Roasting Sticks)',
        category: 'grocery_fresh',
        store: 'CymbalMart Supercenter',
        quantity: 6,
        unit: 'party bundles',
        estimatedCost: 65.00,
        checked: false,
        priority: 'recommended',
        notes: 'Late-night guest favorite around the lawn fire pit.',
        isCymbalMartBrand: true,
        aisleLocation: 'Aisle 5 • Snacks & Candy'
      },
      {
        id: 'wed-8',
        name: 'Bistro Warm Fairy String Lights (100 ft commercial outdoor)',
        category: 'decorations_theme',
        store: 'CymbalMart Supercenter',
        quantity: 3,
        unit: '100ft sets',
        estimatedCost: 75.00,
        checked: false,
        priority: 'recommended',
        aisleLocation: 'Aisle 16 • Patio Lighting'
      },
      {
        id: 'wed-9',
        name: 'Crystal-Cut Recyclable Champagne Flutes & Dinner Plates',
        category: 'tableware_disposables',
        store: 'CymbalMart Supercenter',
        quantity: 150,
        unit: 'premium place setting sets',
        estimatedCost: 65.00,
        checked: false,
        priority: 'essential',
        aisleLocation: 'Aisle 12 • Party & Paper'
      }
    ],
    menuRecipes: [
      {
        id: 'wed-rec-1',
        name: 'Elderflower Botanical French 75',
        course: 'cocktail_drink',
        servings: 100,
        prepTimeMinutes: 15,
        description: 'Signature bridal cocktail featuring botanical gin, St. Germain elderflower liqueur, fresh lemon juice, topped with chilled champagne.',
        ingredients: [
          { item: 'Artisanal Botanical Gin', amount: '6 bottles (750ml)' },
          { item: 'Elderflower Liqueur (St. Germain)', amount: '3 bottles (750ml)' },
          { item: 'Fresh Lemon Juice', amount: '1.5 gallons' },
          { item: 'French Brut Champagne', amount: '12 chilled bottles' },
          { item: 'Edible Orchid Flowers & Lemon Ribbons', amount: '100 count' }
        ],
        instructions: [
          'Pre-mix gin, elderflower liqueur, and lemon juice in glass carafes.',
          'Pour 2 oz of base mixture into each chilled champagne flute.',
          'Top with 3 oz chilled brut champagne and garnish with floating edible flower.'
        ],
        dietaryTags: ['Gluten-Free', 'Vegetarian']
      }
    ],
    timeline: [
      {
        id: 'wed-t1',
        timeframe: '3-4 Days Before',
        task: 'Confirm delivery schedule for canopy tents, outdoor lounge furniture, and Champagne cases.',
        category: 'Host Readiness',
        completed: false
      },
      {
        id: 'wed-t2',
        timeframe: '1-2 Days Before',
        task: 'Inspect lawn pavilion, set up fairy lighting, and test audio microphone system for toasts.',
        category: 'Decor & Setup',
        completed: false
      },
      {
        id: 'wed-t3',
        timeframe: 'Day of Party (Morning)',
        task: 'Set up pop-up canopies, buffet warming chafers, outdoor lawn cushions, and floral table runners.',
        category: 'Decor & Setup',
        completed: false
      },
      {
        id: 'wed-t4',
        timeframe: '2 Hours Before Guests Arrive',
        task: 'Chill Champagne and wine bottles in galvanized ice troughs. Receive 3-tier wedding cake.',
        category: 'Beverages',
        completed: false
      },
      {
        id: 'wed-t5',
        timeframe: 'Party Kickoff',
        task: 'Distribute crystal champagne flutes for golden hour toast, cue first dance, and light evening s’mores fire pit.',
        category: 'Host Readiness',
        completed: false
      }
    ]
  }
];

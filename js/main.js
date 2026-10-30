"use strict";
// Hiya to whomever is reading this. This is a mod for Progress Knight 2.0 that was slop code modified by me~ <3
// I am going to try to leave notes because the original file didn't explain anything. Since I am using this
// as a learning experience, I will document what I find here for anyone else who wants to play with the code.
//
// uh just a heads up, I kinda don't know what I am doing or what I am messing with so keep that in mind~ :3
// Test
var gameData = {
    taskData: {},
    itemData: {},
    coins: 0,
    days: 365 * 18,
    evil: 0,
    essence: 0,
    paused: false,
    timeWarpingEnabled: false,
    rebirthOneCount: 0,
    rebirthTwoCount: 0,
    rebirthThreeCount: 0,
    currentJob: null,
    currentSkill: null,
    currentProperty: null,
    currentMisc: null,
    settings: {
        stickySidebar: true,
    },
};
var tempData = {};
var skillWithLowestMaxXp = null;
const autoPromoteElement = document.getElementById('autoPromote');
const autoLearnElement = document.getElementById('autoLearn');
const updateSpeed = 20;
const baseLifespan = 365 * 84;
const baseGameSpeed = 4;
const permanentUnlocks = [
    'Scheduling',
    'Shop',
    'Automation',
    'Quick task display',
];
const jobBaseData = {
    'Scrounger': {
        name: 'Scrounger',
        maxXp: 50,
        income: 5,
    },
    'Catnip Farmer': { name: 'Catnip Farmer', maxXp: 100, income: 10 },
    'Maid': {
        name: 'Maid',
        maxXp: 200,
        income: 15,
    },
    'Catgirl Cafe Waitress': {
        name: 'Catgirl Cafe Waitress',
        maxXp: 400,
        income: 150,
    },
    'Sushi Chef': {
        name: 'Sushi Chef',
        maxXp: 800,
        income: 300,
    },
    'Business Catgirl': {
        name: 'Business Catgirl',
        maxXp: 1600,
        income: 500,
    },
    'Recruit': {
        name: 'Recruit',
        maxXp: 100,
        income: 15,
    },
    'Paw Patrol': {
        name: 'Paw Patrol',
        maxXp: 1000,
        income: 50,
    },
    'Neko Warrior': {
        name: 'Neko Warrior',
        maxXp: 10000,
        income: 100,
    },
    'Catvalry': {
        name: 'Catvalry',
        maxXp: 100000,
        income: 300,
    },
    'Nya Nya Knight': {
        name: 'Nya Nya Knight',
        maxXp: 1000000,
        income: 1000,
    },
    'Elite Nya Nya Knight': {
        name: 'Elite Nya Nya Knight',
        maxXp: 7500000,
        income: 3000,
    },
    'Divine Neko Warrior': {
        name: 'Divine Neko Warrior',
        maxXp: 40000000,
        income: 5000,
    },
    'Grand Meowarshal': {
        name: 'Grand Meowarshal',
        maxXp: 150000000,
        income: 50000,
    },
    'Pupil': { name: 'Pupil', maxXp: 100000, income: 100 },
    'Apprentice Neko Mage': {
        name: 'Apprentice Neko Mage',
        maxXp: 1000000,
        income: 5000,
    },
    'Adept Neko Mage': {
        name: 'Adept Neko Mage',
        maxXp: 10000000,
        income: 10000,
    },
    'Master Neko Mage': {
        name: 'Master Neko Mage',
        maxXp: 100000000,
        income: 70000,
    },
    'Arch Neko Mage': {
        name: 'Arch Neko Mage',
        maxXp: 10000000000,
        income: 350000,
    },
    'Nekomancer': { name: 'Nekomancer', maxXp: 2000000000000, income: 1000000 },
    'College Administrator': {
        name: 'College Administrator',
        maxXp: 20000000000000,
        income: 10000000,
    },
    'Grandmaster': {
        name: 'Grandmaster',
        maxXp: 9000000000000000,
        income: 60000000,
    },
    'Angel': { name: 'Angel', maxXp: 100000000000000, income: 25000000 },
    'Guardian Angel': {
        name: 'Guardian Angel',
        maxXp: 650000000000000,
        income: 200000000,
    },
    'Archangel': {
        name: 'Archangel',
        maxXp: 18000000000000000,
        income: 600000000,
    },
    'Seraph': { name: 'Seraph', maxXp: 18000000000000000, income: 1200000000 },
    'Divine Wanderer': {
        name: 'Divine Wanderer',
        maxXp: 180000000000000000,
        income: 5000000000,
    },
    'Angelic Spirit': {
        name: 'Angelic Spirit',
        maxXp: 2600000000000000000,
        income: 25000000000,
    },
    'Hevanly Gatekeeper': {
        name: 'Hevanly Gatekeeper',
        maxXp: 28000000000000000000,
        income: 100000000000,
    },
    'Guardian of the Hevans': {
        name: 'Guardian of the Hevans',
        maxXp: 400000000000000000000,
        income: 1000000000000,
    },
    'Galactic Wanderer': {
        name: 'Galactic Wanderer',
        maxXp: 55000000000000000000,
        income: 1000000000000,
    },
    'Celestial Observer': {
        name: 'Celestial Observer',
        maxXp: 51000000000000000000,
        income: 3000000000000,
    },
    'Demipotent': {
        name: 'Demipotent',
        maxXp: 500000000000000000000,
        income: 25000000000000,
    },
    'Demigoddess': {
        name: 'Demigoddess',
        maxXp: 50000000000000000000000,
        income: 215000000000000,
    },
    'Catgirl Goddess': {
        name: 'Catgirl Goddess',
        maxXp: 5000000000000000000000000000,
        income: 25000000000000000,
    },
};
// This appears to be the skill table. Once again, if you rename these variables make sure that you
// update them everywhere else or it will also break the game.
const skillBaseData = {
    'Mindfulness': {
        name: 'Mindfulness',
        maxXp: 100,
        effect: 0.01,
        description: 'Skill XP',
    },
    'Fruitfulness': {
        name: 'Fruitfulness',
        maxXp: 100,
        effect: 0.01,
        description: 'Class/Meowing XP',
    },
    'Meowing': {
        name: 'Meowing',
        maxXp: 100,
        effect: -0.01,
        description: 'Increased Pay/Discount',
    },
    'Pondering': {
        name: 'Pondering',
        maxXp: 100,
        effect: 0.01,
        description: 'Happiness',
    },
    'Courage': {
        name: 'Courage',
        maxXp: 100,
        effect: 0.01,
        description: 'Military Pay',
    },
    'Battle Mewneuvers': {
        name: 'Battle Mewneuvers',
        maxXp: 100,
        effect: 0.01,
        description: 'Military XP',
    },
    'Pouncing': {
        name: 'Pouncing',
        maxXp: 100,
        effect: 0.01,
        description: 'Courage XP',
    },
    'Manya Control': {
        name: 'Manya Control',
        maxXp: 100,
        effect: 0.01,
        description: 'Meowgic Arcanium XP',
    },
    'Feline Essence': {
        name: 'Feline Essence',
        maxXp: 100,
        effect: 0.01,
        description: 'Longer Lifespan',
    },
    'Zoomy Casting': {
        name: 'Zoomy Casting',
        maxXp: 100,
        effect: 0.01,
        description: 'Gamespeed',
    },
    'Astral Body': {
        name: 'Astral Body',
        maxXp: 100,
        effect: 0.0035,
        description: 'Longer lifespan',
    },
    'Temporal Zoomies': {
        name: 'Temporal Zoomies',
        maxXp: 100,
        effect: 0.025,
        description: 'Gamespeed',
    },
    'Coin Transmutation': {
        name: 'Coin Transmutation',
        maxXp: 100,
        effect: 0.0027,
        description: 'T.A.A Pay',
    },
    'Brainwashing': {
        name: 'Brainwashing',
        maxXp: 100,
        effect: -0.01,
        description: 'Reduced Expenses',
    },
    'Absolute Wish': {
        name: 'Absolute Wish',
        maxXp: 100,
        effect: 0.005,
        description: 'Evil Gain',
    },
    'Angelic Amplification': {
        name: 'Angelic Amplification',
        maxXp: 100,
        effect: 0.01,
        description: 'Prismatic Pride XP',
    },
    'Enlightened Mind': {
        name: 'Enlightened Mind',
        maxXp: 100,
        effect: 0.0006,
        description: 'Reduced Happiness',
    },
    'Ceaseless Love': {
        name: 'Ceaseless Love',
        maxXp: 100,
        effect: 0.000585,
        description: 'Longer Lifespan',
    },
    'Divine Symbiosis': {
        name: 'Divine Symbiosis',
        maxXp: 100,
        effect: 0.0015,
        description: 'Ability XP',
    },
    'Prismatic Embodiment': {
        name: 'Prismatic Embodiment',
        maxXp: 100,
        effect: 0.0025,
        description: 'Evil Gain',
    },
    'Abyss Manipulation': {
        name: 'Abyss Manipulation',
        maxXp: 100,
        effect: -0.01,
        description: 'Reduced Expenses',
    },
    'Cosmic Longevity': {
        name: 'Cosmic Longevity',
        maxXp: 100,
        effect: 0.0015,
        description: 'Longer Lifespan',
    },
    'Eternal Recollection': {
        name: 'Eternal Recollection',
        maxXp: 100,
        effect: 0.00065,
        description: 'Max Lvl Multiplier',
    },
    'Spectrial Ruminator': {
        name: 'Spectrial Ruminator',
        maxXp: 100,
        effect: 0.01,
        description: 'Essence Gain',
    },
    'Eternal Tinkerer': {
        name: 'Eternal Tinkerer',
        maxXp: 100,
        effect: -0.01,
        description: 'Reduced Expenses',
    },
    'Adorable Allure': {
        name: 'Adorable Allure',
        maxXp: 100,
        effect: 0.01,
        description: 'All XP',
    },
    'Fluff Ascension': {
        name: 'Fluff Ascension',
        maxXp: 100,
        effect: 0.01,
        description: 'Cuteness Gain',
    },
    'Weaponized Cuteness': {
        name: 'Weaponized Cuteness',
        maxXp: 100,
        effect: -0.01,
        description: 'Reduced Expenses',
    },
    'Unworldly Adorablness': {
        name: 'Unworldly Adorablness',
        maxXp: 100,
        effect: 0.01,
        description: 'All XP',
    },
    'Sacred Plushie Ritual': {
        name: 'Sacred Plushie Ritual',
        maxXp: 100,
        effect: 0.01,
        description: 'Cuteness Gain',
    },
    'Midas Paw': {
        name: 'Midas Paw',
        maxXp: 100,
        effect: 0.002,
        description: 'Class Pay',
    },
    'Sacred Knowledge': {
        name: 'Sacred Knowledge',
        maxXp: 100,
        effect: 0.003,
        description: 'Class XP',
    },
    'Celestial Influence': {
        name: 'Celestial Influence',
        maxXp: 100,
        effect: 0.0028,
        description: 'All XP',
    },
    'Zoomy Looper': {
        name: 'Zoomy Looper',
        maxXp: 100,
        effect: 0.001,
        description: 'Gamespeed',
    },
    'Cutie Incarnate': {
        name: 'Cutie Incarnate',
        maxXp: 100,
        effect: 0.0004,
        description: 'Ability XP',
    },
    'Yin Yang': {
        name: 'Yin Yang',
        maxXp: 100,
        effect: 0.02,
        description: 'Pride + Cuteness Gain',
    },
    'Parallel Universe': {
        name: 'Parallel Universe',
        maxXp: 100,
        effect: 0.02,
        description: 'All XP',
    },
    'Higher Dimensions': {
        name: 'Higher Dimensions',
        maxXp: 100,
        effect: 0.001,
        description: 'Longer Lifespan',
    },
    'Epiphany': {
        name: 'Epiphany',
        maxXp: 100,
        effect: 0.012,
        description: 'Galactic Council XP',
    },
};
// This is the start of the shopping tab page/table thingy. This first part is the "properties" section.
// ... at the risk of repeating myself too often. Make sure you update everything everywhere~ heh~ <3
const itemBaseData = {
    'Stray': { name: 'Stray', expense: 0, effect: 1 },
    'Tattered Sheets': { name: 'Tattered Sheets', expense: 15, effect: 1.4 },
    'Makeshift Cat Tree': {
        name: 'Makeshift Cat Tree',
        expense: 100,
        effect: 2,
    },
    'Apartment': { name: 'Apartment', expense: 750, effect: 3.5 },
    'House': { name: 'House', expense: 3000, effect: 6 },
    'Large House': { name: 'Large House', expense: 25000, effect: 12 },
    'Small Palace': { name: 'Small Palace', expense: 300000, effect: 25 },
    'Grand Palace': { name: 'Grand Palace', expense: 5000000, effect: 60 },
    'Town Ruler': { name: 'Town Ruler', expense: 35000000, effect: 120 },
    'Catgirl City Ruler': {
        name: 'Catgirl City Ruler',
        expense: 1100000000,
        effect: 500,
    },
    'Nyation Ruler': {
        name: 'Nyation Ruler',
        expense: 13000000000,
        effect: 1200,
    },
    'Yarn Dimension': {
        name: 'Yarn Dimension',
        expense: 49000000000,
        effect: 5000,
    },
    'Void Realm': { name: 'Void Realm', expense: 121000000000, effect: 15000 },
    'Void Universe': {
        name: 'Void Universe',
        expense: 2000000000000,
        effect: 30000,
    },
    'Astral Realm': {
        name: 'Astral Realm',
        expense: 160000000000000,
        effect: 150000,
    },
    'Galactic Throne': {
        name: 'Galactic Throne',
        expense: 5000000000000000,
        effect: 300000,
    },
    // This is the start of the items table in the shopping tab.
    'Diary': {
        name: 'Diary',
        expense: 10,
        effect: 1.5,
        description: 'Skill XP',
    },
    'Weighted Yarnballs': {
        name: 'Weighted Yarnballs',
        expense: 50,
        effect: 1.5,
        description: 'Courage XP',
    },
    'Personal Assistant': {
        name: 'Personal Assistant',
        expense: 200,
        effect: 2,
        description: 'Class/Meowing XP',
    },
    'Steel Claws': {
        name: 'Steel Claws',
        expense: 1000,
        effect: 2,
        description: 'Military XP',
    },
    'Catgirl Maid': {
        name: 'Catgirl Maid',
        expense: 7500,
        effect: 1.5,
        description: 'Happiness',
    },
    'Transmatic Gem': {
        name: 'Transmatic Gem',
        expense: 50000,
        effect: 3,
        description: 'Catgirl Magic XP',
    },
    'Fancy Chevrette': {
        name: 'Fancy Chevrette',
        expense: 1000000,
        effect: 2,
        description: 'Skill XP',
    },
    'Library': {
        name: 'Library',
        expense: 10000000,
        effect: 2,
        description: 'Skill XP',
    },
    'Observatory': {
        name: 'Observatory',
        expense: 140000000,
        effect: 5,
        description: 'Catgirl Magic XP',
    },
    "Mind's Eye": {
        name: "Mind's Eye",
        expense: 3250000000,
        effect: 10,
        description: 'Catgirl Fundamentals XP',
    },
    'Angelic Sapphire': {
        name: 'Angelic Sapphire',
        expense: 28050000000,
        effect: 3,
        description: 'Prismatic Pride XP',
    },
    'Nyanimite Armor': {
        name: 'Nyanimite Armor',
        expense: 197050000000,
        effect: 3,
        description: 'Prismatic Pride XP',
    },
    'Etheral Claws': {
        name: 'Etheral Claws',
        expense: 502050000000,
        effect: 3,
        description: 'Skill XP',
    },
    'Nyanic Wand': {
        name: 'Nyanic Wand',
        expense: 1202050000000,
        effect: 3,
        description: 'Prismatic Pride XP',
    },
    'Crown of Hearts': {
        name: 'Crown of Hearts',
        expense: 25002050000000,
        effect: 3,
        description: 'Prismatic Pride XP',
    },
    'Robes of Transcendance': {
        name: 'Robes of Transcendance',
        expense: 300002050000000,
        effect: 5,
        description: 'Galactic Council XP',
    },
    'Prismatic Heart': {
        name: 'Prismatic Heart',
        expense: 18500002050000000,
        effect: 3,
        description: 'Skill XP',
    },
    'Throne of the Divines': {
        name: 'Throne of the Divines',
        expense: 200500002050000000,
        effect: 5,
        description: 'Happiness',
    },
};
// Here is where the game organizes the classes and skills. So you write them in order. If you want the order
// to be different I think that is possible. I'll mess with it later and update this note.
const jobCategories = {
    'Catgirl Work': [
        'Scrounger',
        'Catnip Farmer',
        'Maid',
        'Catgirl Cafe Waitress',
        'Sushi Chef',
        'Business Catgirl',
    ],
    'The Mewarine Corps': [
        'Recruit',
        'Paw Patrol',
        'Neko Warrior',
        'Catvalry',
        'Nya Nya Knight',
        'Elite Nya Nya Knight',
        'Divine Neko Warrior',
        'Grand Meowarshal',
    ],
    'Meowgic Arcanium': [
        'Pupil',
        'Apprentice Neko Mage',
        'Adept Neko Mage',
        'Master Neko Mage',
        'Arch Neko Mage',
        'Nekomancer',
        'College Administrator',
        'Grandmaster',
    ],
    'Angelic Realm': [
        'Angel',
        'Guardian Angel',
        'Archangel',
        'Seraph',
        'Divine Wanderer',
        'Angelic Spirit',
        'Hevanly Gatekeeper',
        'Guardian of the Hevans',
    ],
    'Galactic Council': [
        'Galactic Wanderer',
        'Celestial Observer',
        'Demipotent',
        'Demigoddess',
        'Catgirl Goddess',
    ],
};
const skillCategories = {
    'Catgirl Fundmentals': [
        'Mindfulness',
        'Fruitfulness',
        'Meowing',
        'Pondering',
    ],
    'Combat': ['Courage', 'Battle Mewneuvers', 'Pouncing'],
    'Catgirl Magic': [
        'Manya Control',
        'Feline Essence',
        'Zoomy Casting',
        'Astral Body',
        'Temporal Zoomies',
        'Coin Transmutation',
        'Brainwashing',
    ],
    'Cutie Magic': [
        'Adorable Allure',
        'Fluff Ascension',
        'Weaponized Cuteness',
        'Unworldly Adorablness',
        'Sacred Plushie Ritual',
        'Midas Paw',
        'Sacred Knowledge',
        'Celestial Influence',
        'Zoomy Looper',
        'Cutie Incarnate',
    ],
    'Angelic Power': [
        'Absolute Wish',
        'Angelic Amplification',
        'Enlightened Mind',
        'Ceaseless Love',
        'Divine Symbiosis',
        'Prismatic Embodiment',
        'Abyss Manipulation',
    ],
    'Celestial Powers': [
        'Cosmic Longevity',
        'Eternal Recollection',
        'Spectrial Ruminator',
        'Eternal Tinkerer',
    ],
    'Almightiness': [
        'Yin Yang',
        'Parallel Universe',
        'Higher Dimensions',
        'Epiphany',
    ],
};
const itemCategories = {
    Properties: [
        'Stray',
        'Tattered Sheets',
        'Makeshift Cat Tree',
        'Apartment',
        'House',
        'Large House',
        'Small Palace',
        'Grand Palace',
        'Town Ruler',
        'Catgirl City Ruler',
        'Nyation Ruler',
        'Yarn Dimension',
        'Void Realm',
        'Void Universe',
        'Astral Realm',
        'Galactic Throne',
    ],
    Items: [
        'Diary',
        'Weighted Yarnballs',
        'Personal Assistant',
        'Steel Claws',
        'Catgirl Maid',
        'Transmatic Gem',
        'Fancy Chevrette',
        'Library',
        'Observatory',
        "Mind's Eye",
        'Angelic Sapphire',
        'Nyanimite Armor',
        'Etheral Claws',
        'Nyanic Wand',
        'Crown of Hearts',
        'Robes of Transcendance',
        'Prismatic Heart',
        'Throne of the Divines',
    ],
};
// Here is where you update the header row colors. Its does wierd things when you use hex colors. I will probably update this
// to all RGB later which is easier for me to program. Maybe... we'll see~ lol
// On a serious note, if you don't write the hex in properly you will break the header color and it will display nothing~ :3
const headerRowColors = {
    'Catgirl Work': 'rgb(228, 162, 236)',
    'The Mewarine Corps': 'rgb(204, 16, 31)',
    'Meowgic Arcanium': 'rgb(28, 191, 255)',
    'Angelic Realm': 'rgb(118, 43, 145)',
    'Galactic Council': 'rgb(213, 192, 16)',
    'Catgirl Fundmentals': 'rgb(228, 162, 236)',
    'Combat': 'rgb(204, 16, 31)',
    'Catgirl Magic': 'rgb(28, 191, 255)',
    'Cutie Magic': 'rgb(179, 124, 209)',
    'Almightiness': 'rgb(24, 210, 217)',
    'Angelic Power': 'rgb(118, 43, 145)',
    'Celestial Powers': 'rgb(213, 192, 16)',
    'Properties': 'rgb(33, 158, 188)',
    'Items': 'rgb(127, 134, 0)',
};
// When you over your mouse over the different classes and items in the game this little word bubble will pop up.
// This is where you modify those messages on screen. Have with it. I certainly did~ :3
const tooltips = {
    //Common work (Catgirl Work)
    'Scrounger': 'Meow and beg day and night for a couple of copper coins. It feels like you are at the brink of death each day.',
    'Catnip Farmer': "Plow the fields and grow the catnip for the local cat folks. It's not much but it's honest work.",
    'Maid': 'Work for a demanding master keeping their house clean and cooking them three square meals a day. A stressful and still a poor paying job.',
    'Catgirl Cafe Waitress': 'Make coffee and tea for the local business catfolks. The pay is quite meager but its better than being a maid.',
    'Sushi Chef': 'Make delecious sushi rolls for the local business catfolks. A respectable and fun job for any catgirl.',
    'Business Catgirl': 'Travel from town to town opening your laptop and mashing keys randomly. The job pays decently well and you get to be the boss.',
    //Military (The Mewarine Corps)
    'Recruit': 'Learn the basics of pouncing and slashing with your claws. Dangerous training for low pay but every catgirl warrior starts somewhere.',
    'Paw Patrol': 'Put your life on the line to battle with enemy puppygirls. A courageous, respectable job but you are still a nobody in the grand scheme of things.',
    'Neko Warrior': 'More experienced and useful than the average Paw Patrol Catfolk, take out the enemy puppygirls in battle with your catgirl prowess. The pay is not that bad but the glory is better.',
    'Catvalry': 'By proving your skills with your claws, you were appointed to lead a small group of stealth catgirls to ambush enemy puppygirls by surpise.',
    'Nya Nya Knight': 'Slash and claw through enemy puppygirls with ease, while covered in steel from head to toe. A decently paying and very respectable job.',
    'Elite Nya Nya Knight': 'Utilising your unmatched combat ability, defeat enemy puppygirls effortlessly. Most catgirls in the military would never be able to acquire a title such as this.',
    'Divine Neko Warrior': 'Obliterate squadrons of enemy puppygirls in one go with extraordinary catlike proficiency, while equipped with magically imbued claws. Such a feared catgirl on the battlefield is highly respected and paid extremely well.',
    'Grand Meowarshal': 'Feared by all puppygirl nations, obliterate entire armies of puppygirls in a blink of an eye. Roughly every century, only one Divine Neko Warrior is worthy of receiving such a legendary title.',
    //The Arcane Association (Meowgic Arcanium)
    'Pupil': 'Study the theory of mana and practice basic catgirl spells. There is minor pay to cover living costs, however, this is a necessary stage in becoming a Neko Mage.',
    'Apprentice Neko Mage': 'Under the supervision of a skilled mage, perform basic spells against enemies in battle. Generous pay will be provided to cover living costs.',
    'Adept Neko Mage': 'Turn the tides of battle through casting intermediate spells and mentor other apprentices. The pay for this particular job is extremely high.',
    'Master Neko Mage': 'Utilise advanced spells to ravage and destroy entire legions of enemy soldiers. Only a small percentage of mages deserve to attain this role and are rewarded with an insanely high pay.',
    'Arch Neko Mage': 'Blessed with unparalleled talent, perform unbelievable feats with magic at will. It is said that an archamge has enough destructive power to wipe an empire off the map.',
    'Nekomancer': 'Specialize in harnessing temporal zoomy energies that alter the flow of time with supernatural divinations and otherwordly expertise.',
    'College Administrator': 'Spend your days administrating Meowgic Arcanium and investigate the concepts of forbidden catgirl magic. The Administrator receives ludicrous amounts of pay daily.',
    'Grandmaster': 'You wield truly unlimited power as a mortal, making you nearly unstoppable. By ruling with a heart of gold, everyone in the Catgirl College obeys your lessons & commands.',
    //Prismatic Pride
    'Angel': 'Inspired by prismatic light, you are slowly turning into something new the rest of eternity... Can you resist it, or will it consume you forever?',
    'Guardian Angel': 'Each day you are discovering more and more of your power, can you hold on to your humanity for a bit longer, or will you continue the path forward?',
    'Archangel': 'You become an inquisitive creature that studies and nutures all life around you.',
    'Seraph': 'A being of unimaginable power, you beging to become aware of what is beyond...',
    'Divine Wanderer': 'Travel the realm in search of all meaning. Spending your time reflecting upon the many lives you have lived and the mortals you find yourself with.',
    'Angelic Spirit': 'There are few who may tread the paths between worlds, these powers grant you an ability to generate fields of divine energy that heal all living things.',
    'Hevanly Gatekeeper': 'You have taken command of the divine gateway, helping guide lost souls to their next lives.',
    'Guardian of the Hevans': 'Protector of all Angels and mortals, a vast canvas of pure light and nothingness, nothing will escape your divine watch.',
    //Galactic Council (End Game Classes)
    'Galactic Wanderer': 'With the powers bestowed upon you by an unknown entity you wander around, visiting places revered and feared in search of answers.',
    'Celestial Observer': 'Extremely powerful being with tremedous telekinetic powers and the ability to rearrange the molecular structure of matter and energy, even up to cosmic scale.',
    'Demipotent': 'A nigh-omnipotent cosmological entity, with vast matter and energy manipulation abilities that help you push the boundaries of the Universe itself.',
    'Demigoddess': 'Primordial being that predate the universe, involved with the creation of life and powerful beyond mortal comprehension, existing as myths to the oldest species in the universe.',
    'Catgirl Goddess': 'You have become the catgirl creator of everything, a literal god in control of all aspects of the universe. Perhaps maybe you always were a god? Maybe you had simply lost your way or choose to be a mortal for a short time. No matter how it happend or what led you here, you sit upon your throne overseeing the entire universe until the end of time.',
    //Fundamentals (Catgirl Fundamentals)
    'Mindfulness': 'Improve your learning speed by learning to pay more attention to stuffs.',
    'Fruitfulness': 'Learn to randomly bat things around less at work and receive more job experience per day.',
    'Meowing': 'Study the tricks of the being an adorable and persuasive catgirl to lower any type of expense.',
    'Pondering': 'Fill your mind with peace and tranquility to tap into greater happiness from within.',
    //Combat
    'Courage': 'Channel your inner catgirl and become more brave and strong through training. Couragous catgirls are paid more in The Mewarine Corps.',
    'Battle Mewneuvers': 'Create and revise pouncing strategies, improving experience gained in The Mewarine Corps.',
    'Pouncing': 'Strengthen your endurance through habit and repetition, making you feel more courage throughout your body.',
    //Magic (Catgirl Magic)
    'Manya Control': 'Strengthen your mana channels throughout your body, aiding you in becoming a more powerful magical user.',
    'Feline Essence': 'Lengthen your lifespan through the means of forbidden catgirl magic. Could this be the key to the immortality you seek?',
    'Zoomy Casting': 'Bend space and time through forbidden catgirl magic, speeding up both your physical skills and quickining your learning processes.',
    'Astral Body': 'Lengthen your lifespan drastically beyond comprehension by harnessing ethereal catgirl energy. Perhaps this could be the answer you are looking for...',
    'Temporal Zoomies': 'Run so fast you create your own pocket dimension where centuries go by in mere seconds.',
    'Coin Transmutation': 'As the highest ranking member of the Catgirl Magic College, gain access forbidden transmutation spells to gain additional funds to further your skills and research.',
    'Brainwashing': 'A technique designed to manipulate human thought and action against their desire.',
    //Dark magic - Evil Required (The code will refer to this as "evil" but mine is Cuteness)
    'Adorable Allure': 'Surround yourself with an irresistible aura of cuteness, convincing others to teach you any job or skill with ease.',
    'Fluff Ascension': 'Through the means of magic you have learned to improve the softness of your fur, improving your cuteness gains between rebirths.',
    'Weaponized Cuteness': 'Emit an overwhelmingly adorable aura that leaves merchants powerless to resist giving you heavy discounts.',
    'Unworldly Adorablness': "A mere catgirl body isn't enough to fit your adorable potential. Focus your energy to transform into a creature of unfathonamble cuteness and gain additional experience to all your skills.",
    'Sacred Plushie Ritual': 'Perform a sacred ritual with your plushies allowing you to harness their energy to gain more cuteness between rebiths.',
    'Midas Paw': 'Through the means of cutie magic, coins magically multiply when they touch your hands, giving you more earnings from work.',
    'Sacred Knowledge': 'Sealed for a very long time in an ancient ruin, you utilized these forbidden texts for your own personal gain.',
    'Celestial Influence': 'Tapping into the powers of the pure good while combining them with cuteness grants you an ulimited potential.',
    'Zoomy Looper': 'Focus your magical cutie energy to enhance your speed even further, giving you nearly unlimited control over time itself.',
    'Cutie Incarnate': 'You have became the essence of adorablness. No other creature could ever possibly attain this level of cuteness.',
    //Void Manipulation (Ughhh not a void thing. Why so dark? Anyways... angel something idk yet...)
    'Absolute Wish': 'The power to fulfill absolutely any and all wishes without any limitations.',
    'Angelic Amplification': 'You surrender yourself to the good, making it easier to take control of you.',
    'Enlightened Mind': 'In a trance like state, you feel the divines healing soul and reflecting upon your thoughts, perception, memories, emotions and personality.',
    'Ceaseless Love': 'Learn to understand and love creatures of all shapes, sizes and types and help guide them to their path towards happiness',
    'Divine Symbiosis': 'A symbiotic relationship that helps you become one with the divines.',
    'Prismatic Embodiment': 'If thou gaze long into an abyss, the abyss will also gaze into thee.',
    'Abyss Manipulation': 'Allows you to shape your own reality within the Void itself.',
    //Celestial Powers - Endgame
    'Cosmic Longevity': 'You have seen it all, from the very beginning to the very end.',
    'Eternal Recollection': 'Being able to exist in multiple parallel timelines and manipulating you parallel selves, influencing their lives as you see fit.',
    'Spectrial Ruminator': 'Exploit the unlimited potential of multiverse energies and collect its resources.',
    'Eternal Tinkerer': 'Absolute power corrupts absolutely.',
    //Almightiness (I forgot what these skills do again and will update them later lol)
    'Yin Yang': 'Born from chaos when the universe was first created, believed to exist in harmony, balancing evil and good.',
    'Parallel Universe': "Self-contained plane of existence, co-existing with one's own, helping you restore fragments of your forgotten power.",
    'Higher Dimensions': 'By possesing the power to partially alter the laws of physics and transceding lower dimensional spaces, your existence becomes never-ending.',
    'Epiphany': 'You become one with everything.',
    //Properties
    'Stray': 'Sleep on the uncomfortable, filthy streets while being chased away by the locals every night. It cannot get any worse than this.',
    'Tattered Sheets': 'A thin sheet of tattered cloth bunched into a ball to make a soft place to sleep. Horrible living conditions but at least you have something soft to rest on.',
    'Makeshift Cat Tree': "Shabby logs and dirty carpet stuck together with something you hope is glue. Much warmer and safer than sheets, however, the stench from that glue isn't very pleasant.",
    'Apartment': 'A very small but suitable space for any creature. Provides decent living conditions for a fair price.',
    'House': 'A building formed from stone bricks and sturdy timber, which contains a few rooms. Although quite expensive, it is a comfortable abode.',
    'Large House': 'Much larger than a regular house, which boasts even more rooms and multiple floors. The building is quite spacious but comes with a hefty price tag.',
    'Small Palace': 'A very rich and meticulously built structure rimmed with fine metals such as silver. Extremely high expenses to maintain for a lavish lifestyle.',
    'Grand Palace': 'A grand residence completely composed of gold and silver. Provides the utmost luxurious and comfortable living conditions possible for a insane price.',
    'Town Ruler': 'Your fame and wealth gives you power to rule your very own catgirl community in your small town, owning multiple establishments.',
    'Catgirl City Ruler': 'As the highest ranking official, you manage and oversee everything that happens in Catgirl City and live in a luxurious manor, while your pay is astronomical, so are your expenses.',
    'Nyation Ruler': 'You reign as supreme catgirl over the whole nation and live inside the grand palace, while your riches and power may plentiful, running an entire nyation of is mind bogglingly expensive.',
    'Yarn Dimension': 'A dimension just for you filled with endless balls of yarn and other catgirl toys that can be summoned at will. Maintaining such a powerful illusion comes with unfathomable costs.',
    'Void Realm': 'Unknown how or when the Void realm came into existence, containing elements which don’t exist outside of its dimensional plane are now all to your disposal',
    'Void Universe': 'Predating our own universe, the Void has an ulimited amount of space for your belongings, if you are willing to submit to it.',
    'Astral Realm': 'Beneath personality and ego lays the source of our deep character, our personhood. Here are the psychic senses, our deep mind and emotions, symbols and inner reality.',
    'Galactic Throne': 'You sit on your throne, overseeing the existence itself.',
    //Misc
    'Diary': 'A place to write down all your thoughts and dreams, allowing you to learn a lot more quickly.',
    'Weighted Yarnballs': 'Heavy yarnballs used in strenuous exercise to toughen up and accumulate courage even faster than before. ',
    'Personal Assistant': 'Assists you in completing day to day activities, giving you more time to be productive at work... or pretend too~ :3',
    'Steel Claws': "A fine set of steel claws used to defeat enemy puppgirls even quicker in combat and gain more military experience. Keeping these maintained won't be cheap...",
    'Catgirl Maid': 'Keeps your household clean at all times and also prepares three delicious meals per day, leaving you in a happier, stress-free mood.',
    'Transmatic Gem': 'Embedded with a rare gem that shimmers blue, pink & white, this charm activates more mana channels within your body, enhancing the learning of catgirl magic.',
    'Fancy Chevrette': 'A fancy desk area which provides many fine stationary and equipment designed for furthering your progress in research. Keeping the desk supplied comes with a heavy cost.',
    'Library': 'Stores a collection of books, each containing vast amounts of information from basic life skills to complex catgirl magic spells. The age of some of these tomes is fragile, increasing the costs to store and maintain them properly.',
    'Observatory': 'With new access to wealth comes new opportunities to study. Rent an Observatory for studying terrestrial, marine and celestial events.',
    "Mind's Eye": 'Lets you see memories, remember images, and even see new pictures and ideas.',
    'Angelic Sapphire': 'Helps you shape and manipulate matter, even transmute it and rebuild into anything of your choosing.',
    'Nyanimite Armor': 'Generates an innate armor as a part of you body, which is resistant to attacks, harm or pain.',
    'Etheral Claws': "Forged from void dust and dark matter, can slash through dimensional barriers. It's a weapon of choice for every Void Reaver.",
    'Nyanic Wand': 'When the orb touches non void entities, it instantly disintegrate them. Harnessing its power from Void realm.',
    'Crown of Hearts': 'Purest version of void created material, a teaspoon of it is as heavy as a small planet. ',
    'Robes of Transcendance': 'The most powerful and essential equipment of any Celestial. Acts as a source of infinite power.',
    'Prismatic Heart': 'From the time the universe was born. Can create another small universes.',
    'Throne of the Divines': 'Came into existance long before our universe was created, this strange looking object with no shape radiates unlimited energy.',
};
// Okay so after staring at this for a long time and thinking really hard I have managed to achieve 2 things.
// Smoke coming out of my ears and that this is likely where the code calculates all its multipliers and stuffs.
// What I do know for sure is that messing with this stuff is a sure fire way to break everything. So far
// I only messed with changing basic variables here so far.
const units = [
    '',
    'k',
    'M',
    'B',
    'T',
    'q',
    'Q',
    'Sx',
    'Sp',
    'Oc',
    'Nv',
    'Vg',
    'Uv',
    'Dv',
    'Tv',
    'Qt',
    'Qv',
    'Sv',
    'Oc',
    'Nd',
    'Tg',
    'OMG',
];
const jobTabButton = document.getElementById('jobTabButton');
function getBaseLog(x, y) {
    return Math.log(y) / Math.log(x);
}
function getBindedTaskEffect(taskName) {
    var task = gameData.taskData[taskName];
    return task.getEffect.bind(task);
}
function getBindedItemEffect(itemName) {
    var item = gameData.itemData[itemName];
    return item.getEffect.bind(item);
}
function addMultipliers() {
    for (let taskName in gameData.taskData) {
        var task = gameData.taskData[taskName];
        task.xpMultipliers = [];
        if (task instanceof Job)
            task.incomeMultipliers = [];
        task.xpMultipliers.push(task.getMaxLevelMultiplier.bind(task));
        task.xpMultipliers.push(getHappiness);
        task.xpMultipliers.push(getBindedTaskEffect('Adorable Allure'));
        task.xpMultipliers.push(getBindedTaskEffect('Unworldly Adorablness'));
        task.xpMultipliers.push(getBindedTaskEffect('Celestial Influence'));
        task.xpMultipliers.push(getBindedTaskEffect('Parallel Universe'));
        if (task instanceof Job) {
            task.incomeMultipliers.push(task.getLevelMultiplier.bind(task));
            task.incomeMultipliers.push(getBindedTaskEffect('Midas Paw'));
            task.xpMultipliers.push(getBindedTaskEffect('Fruitfulness'));
            task.xpMultipliers.push(getBindedTaskEffect('Sacred Knowledge'));
            task.xpMultipliers.push(getBindedItemEffect('Personal Assistant'));
        }
        else if (task instanceof Skill) {
            task.xpMultipliers.push(getBindedTaskEffect('Mindfulness'));
            task.xpMultipliers.push(getBindedItemEffect('Diary'));
            task.xpMultipliers.push(getBindedItemEffect('Fancy Chevrette'));
            task.xpMultipliers.push(getBindedItemEffect('Library'));
            task.xpMultipliers.push(getBindedItemEffect('Etheral Claws'));
            task.xpMultipliers.push(getBindedTaskEffect('Divine Symbiosis'));
            task.xpMultipliers.push(getBindedItemEffect('Prismatic Heart'));
            task.xpMultipliers.push(getBindedTaskEffect('Cutie Incarnate'));
        }
        if (jobCategories['Catgirl Work'].includes(task.name)) {
            task.incomeMultipliers.push(getBindedTaskEffect('Meowing'));
            task.xpMultipliers.push(getBindedTaskEffect('Fruitfulness'));
            task.xpMultipliers.push(getBindedItemEffect('Personal Assistant'));
        }
        else if (task.name == 'Meowing') {
            task.xpMultipliers.push(getBindedTaskEffect('Fruitfulness'));
            task.xpMultipliers.push(getBindedItemEffect('Diary'));
            if (jobCategories['The Mewarine Corps'].includes(task.name)) {
                task.incomeMultipliers.push(getBindedTaskEffect('Courage'));
                task.xpMultipliers.push(getBindedTaskEffect('Battle Mewneuvers'));
                task.xpMultipliers.push(getBindedItemEffect('Steel Claws'));
            }
            else if (task.name == 'Courage') {
                task.xpMultipliers.push(getBindedTaskEffect('Pouncing'));
                task.xpMultipliers.push(getBindedItemEffect('Weighted Yarnballs'));
            }
            else if (skillCategories['Catgirl Magic'].includes(task.name)) {
                task.xpMultipliers.push(getBindedItemEffect('Transmatic Gem'));
                task.xpMultipliers.push(getBindedItemEffect('Observatory'));
            }
            else if (skillCategories['Angelic Power'].includes(task.name)) {
                task.xpMultipliers.push(getBindedItemEffect('Angelic Sapphire'));
                task.xpMultipliers.push(getBindedItemEffect('Nyanic Wand'));
            }
            else if (jobCategories['Meowgic Arcanium'].includes(task.name)) {
                task.xpMultipliers.push(getBindedTaskEffect('Manya Control'));
                task.incomeMultipliers.push(getBindedTaskEffect('Coin Transmutation'));
            }
            else if (jobCategories['Angelic Realm'].includes(task.name)) {
                task.xpMultipliers.push(getBindedTaskEffect('Angelic Amplification'));
                task.xpMultipliers.push(getBindedItemEffect('Nyanimite Armor'));
                task.xpMultipliers.push(getBindedItemEffect('Crown of Hearts'));
            }
            else if (jobCategories['Galactic Council'].includes(task.name)) {
                task.xpMultipliers.push(getBindedItemEffect('Robes of Transcendance'));
                task.xpMultipliers.push(getBindedTaskEffect('Epiphany'));
            }
            else if (skillCategories['Cutie Magic'].includes(task.name)) {
                task.xpMultipliers.push(getEvil);
            }
            else if (skillCategories['Almightiness'].includes(task.name)) {
                task.xpMultipliers.push(getEssence);
            }
            else if (skillCategories['Catgirl Fundmentals'].includes(task.name)) {
                task.xpMultipliers.push(getBindedItemEffect("Mind's Eye"));
            }
        }
        if (jobCategories['The Mewarine Corps'].includes(task.name)) {
            task.incomeMultipliers.push(getBindedTaskEffect('Courage'));
            task.xpMultipliers.push(getBindedTaskEffect('Battle Mewneuvers'));
            task.xpMultipliers.push(getBindedItemEffect('Steel Claws'));
        }
        else if (task.name == 'Courage') {
            task.xpMultipliers.push(getBindedTaskEffect('Pouncing'));
            task.xpMultipliers.push(getBindedItemEffect('Weighted Yarnballs'));
        }
        else if (skillCategories['Catgirl Magic'].includes(task.name)) {
            task.xpMultipliers.push(getBindedItemEffect('Transmatic Gem'));
            task.xpMultipliers.push(getBindedItemEffect('Observatory'));
        }
        else if (skillCategories['Angelic Power'].includes(task.name)) {
            task.xpMultipliers.push(getBindedItemEffect('Angelic Sapphire'));
            task.xpMultipliers.push(getBindedItemEffect('Nyanic Wand'));
        }
        else if (jobCategories['Meowgic Arcanium'].includes(task.name)) {
            task.xpMultipliers.push(getBindedTaskEffect('Manya Control'));
            task.incomeMultipliers.push(getBindedTaskEffect('Coin Transmutation'));
        }
        else if (jobCategories['Angelic Realm'].includes(task.name)) {
            task.xpMultipliers.push(getBindedTaskEffect('Angelic Amplification'));
            task.xpMultipliers.push(getBindedItemEffect('Nyanimite Armor'));
            task.xpMultipliers.push(getBindedItemEffect('Crown of Hearts'));
        }
        else if (jobCategories['Galactic Council'].includes(task.name)) {
            task.xpMultipliers.push(getBindedItemEffect('Robes of Transcendance'));
            task.xpMultipliers.push(getBindedTaskEffect('Epiphany'));
        }
        else if (skillCategories['Cutie Magic'].includes(task.name)) {
            task.xpMultipliers.push(getEvil);
        }
        else if (skillCategories['Almightiness'].includes(task.name)) {
            task.xpMultipliers.push(getEssence);
        }
        else if (skillCategories['Catgirl Fundmentals'].includes(task.name)) {
            task.xpMultipliers.push(getBindedItemEffect("Mind's Eye"));
        }
    }
    for (const itemName in gameData.itemData) {
        var item = gameData.itemData[itemName];
        item.expenseMultipliers = [];
        item.expenseMultipliers.push(getBindedTaskEffect('Meowing'));
        item.expenseMultipliers.push(getBindedTaskEffect('Weaponized Cuteness'));
        item.expenseMultipliers.push(getBindedTaskEffect('Brainwashing'));
        item.expenseMultipliers.push(getBindedTaskEffect('Abyss Manipulation'));
        item.expenseMultipliers.push(getBindedTaskEffect('Eternal Tinkerer'));
    }
}
function setCustomEffects() {
    var bargaining = gameData.taskData['Meowing'];
    bargaining.getEffect = function () {
        var multiplier = 1 - getBaseLog(7, bargaining.level + 2) / 10;
        if (multiplier < 0.1) {
            multiplier = 0.1;
        }
        return multiplier;
    };
    var intimidation = gameData.taskData['Weaponized Cuteness'];
    intimidation.getEffect = function () {
        var multiplier = 1 - getBaseLog(7, intimidation.level + 2) / 10;
        if (multiplier < 0.1) {
            multiplier = 0.1;
        }
        return multiplier;
    };
    var brainwashing = gameData.taskData['Brainwashing'];
    brainwashing.getEffect = function () {
        var multiplier = 1 - getBaseLog(7, brainwashing.level + 2) / 10;
        if (multiplier < 0.1) {
            multiplier = 0.1;
        }
        return multiplier;
    };
    var abyssManipulation = gameData.taskData['Abyss Manipulation'];
    abyssManipulation.getEffect = function () {
        var multiplier = 1 - getBaseLog(7, abyssManipulation.level + 2) / 10;
        if (multiplier < 0.1) {
            multiplier = 0.1;
        }
        return multiplier;
    };
    var galacticCommand = gameData.taskData['Eternal Tinkerer'];
    galacticCommand.getEffect = function () {
        var multiplier = 1 - getBaseLog(7, galacticCommand.level + 2) / 10;
        if (multiplier < 0.1) {
            multiplier = 0.1;
        }
        return multiplier;
    };
    var timeWarping = gameData.taskData['Zoomy Casting'];
    timeWarping.getEffect = function () {
        var multiplier = 1 + getBaseLog(13, timeWarping.level + 2);
        return multiplier;
    };
    var immortality = gameData.taskData['Feline Essence'];
    immortality.getEffect = function () {
        var multiplier = 1 + getBaseLog(33, immortality.level + 2);
        return multiplier;
    };
    var unholyRecall = gameData.taskData['Eternal Recollection'];
    unholyRecall.getEffect = function () {
        var multiplier = unholyRecall.level * 0.00065;
        return multiplier;
    };
}
function getHappiness() {
    var meditationEffect = getBindedTaskEffect('Pondering');
    var butlerEffect = getBindedItemEffect('Catgirl Maid');
    var mindseizeEffect = getBindedTaskEffect('Enlightened Mind');
    var multiverseFragment = getBindedItemEffect('Throne of the Divines');
    var happiness = ((meditationEffect() * butlerEffect()) / mindseizeEffect()) *
        multiverseFragment() *
        gameData.currentProperty.getEffect();
    return happiness;
}
function getEvil() {
    return gameData.evil;
}
function getEssence() {
    return gameData.essence;
}
function applyMultipliers(value, multipliers) {
    var finalMultiplier = 1;
    multipliers.forEach(function (multiplierFunction) {
        var multiplier = multiplierFunction();
        finalMultiplier *= multiplier;
    });
    var finalValue = Math.round(value * finalMultiplier);
    return finalValue;
}
function applySpeed(value) {
    let finalValue = (value * getGameSpeed()) / updateSpeed;
    return finalValue;
}
function getEvilGain() {
    var evilControl = gameData.taskData['Fluff Ascension'];
    var bloodMeditation = gameData.taskData['Sacred Plushie Ritual'];
    var absoluteWish = gameData.taskData['Absolute Wish'];
    var oblivionEmbodiment = gameData.taskData['Prismatic Embodiment'];
    var yingYang = gameData.taskData['Yin Yang'];
    var evil = evilControl.getEffect() *
        bloodMeditation.getEffect() *
        absoluteWish.getEffect() *
        oblivionEmbodiment.getEffect() *
        yingYang.getEffect();
    return evil;
}
function getEssenceGain() {
    var essenceControl = gameData.taskData['Yin Yang'];
    var essenceCollector = gameData.taskData['Spectrial Ruminator'];
    var essence = essenceControl.getEffect() * essenceCollector.getEffect();
    return essence;
}
function getGameSpeed() {
    var timeWarping = gameData.taskData['Zoomy Casting'];
    var temporalDimension = gameData.taskData['Temporal Zoomies'];
    var timeLoop = gameData.taskData['Zoomy Looper'];
    var timeWarpingSpeed = gameData.timeWarpingEnabled
        ? timeWarping.getEffect() +
            temporalDimension.getEffect() * timeLoop.getEffect()
        : 1;
    var gameSpeed = baseGameSpeed * +!gameData.paused * +isAlive() * timeWarpingSpeed;
    return gameSpeed;
}
function applyExpenses() {
    var coins = applySpeed(getExpense());
    gameData.coins -= coins;
    if (gameData.coins < 0) {
        goBankrupt();
    }
}
function getExpense() {
    var expense = 0;
    expense += gameData.currentProperty.getExpense();
    for (let misc of gameData.currentMisc) {
        expense += misc.getExpense();
    }
    return expense;
}
function goBankrupt() {
    gameData.coins = 0;
    gameData.currentProperty = gameData.itemData['Stray'];
    gameData.currentMisc = [];
}
function initUI() {
    setStickySidebar(gameData.settings.stickySidebar);
}
function setTab(element, selectedTab) {
    var tabs = Array.prototype.slice.call(document.getElementsByClassName('tab'));
    tabs.forEach(function (tab) {
        tab.style.display = 'none';
    });
    document.getElementById(selectedTab).style.display = 'block';
    var tabButtons = document.getElementsByClassName('tabButton');
    for (let tabButton of tabButtons) {
        tabButton.classList.remove('w3-blue-gray');
    }
    element.classList.add('w3-blue-gray');
}
function setPause() {
    gameData.paused = !gameData.paused;
}
function setTimeWarping() {
    gameData.timeWarpingEnabled = !gameData.timeWarpingEnabled;
}
function setTask(taskName) {
    var task = gameData.taskData[taskName];
    task instanceof Job
        ? (gameData.currentJob = task)
        : (gameData.currentSkill = task);
}
function setProperty(propertyName) {
    var property = gameData.itemData[propertyName];
    gameData.currentProperty = property;
}
function setMisc(miscName) {
    var misc = gameData.itemData[miscName];
    if (gameData.currentMisc.includes(misc)) {
        for (let i = 0; i < gameData.currentMisc.length; i++) {
            if (gameData.currentMisc[i] == misc) {
                gameData.currentMisc.splice(i, 1);
            }
        }
    }
    else {
        gameData.currentMisc.push(misc);
    }
}
function createData(data, baseData) {
    for (const key in baseData) {
        var entity = baseData[key];
        createEntity(data, entity);
    }
}
function createEntity(data, entity) {
    if ('income' in entity) {
        data[entity.name] = new Job(entity);
    }
    else if ('maxXp' in entity) {
        data[entity.name] = new Skill(entity);
    }
    else {
        data[entity.name] = new Item(entity);
    }
    data[entity.name].id = 'row ' + entity.name;
}
function createRequiredRow(categoryName) {
    var requiredRow = document
        .getElementsByClassName('requiredRowTemplate')[0]
        .content.firstElementChild.cloneNode(true);
    requiredRow.classList.add('requiredRow');
    requiredRow.classList.add(removeSpaces(categoryName));
    requiredRow.id = categoryName;
    return requiredRow;
}
function createHeaderRow(templates, categoryType, categoryName) {
    var headerRow = templates.headerRow.content.firstElementChild.cloneNode(true);
    headerRow.getElementsByClassName('category')[0].textContent = categoryName;
    if (categoryType != itemCategories) {
        headerRow.getElementsByClassName('valueType')[0].textContent =
            categoryType == jobCategories ? 'Income/day' : 'Effect';
    }
    headerRow.style.backgroundColor = headerRowColors[categoryName];
    headerRow.style.color = '#ffffff';
    headerRow.classList.add(removeSpaces(categoryName));
    headerRow.classList.add('headerRow');
    return headerRow;
}
function createRow(templates, name, categoryName, categoryType) {
    var row = templates.row.content.firstElementChild.cloneNode(true);
    row.getElementsByClassName('name')[0].textContent = name;
    row.getElementsByClassName('tooltipText')[0].textContent = tooltips[name];
    row.id = 'row ' + name;
    if (categoryType != itemCategories) {
        row.getElementsByClassName('progressBar')[0].onclick = function () {
            setTask(name);
        };
    }
    else {
        row.getElementsByClassName('button')[0].onclick =
            categoryName == 'Properties'
                ? function () {
                    setProperty(name);
                }
                : function () {
                    setMisc(name);
                };
    }
    return row;
}
function createAllRows(categoryType, tableId) {
    var templates = {
        headerRow: document.getElementsByClassName(categoryType == itemCategories
            ? 'headerRowItemTemplate'
            : 'headerRowTaskTemplate')[0],
        row: document.getElementsByClassName(categoryType == itemCategories
            ? 'rowItemTemplate'
            : 'rowTaskTemplate')[0],
    };
    var table = document.getElementById(tableId);
    for (const categoryName in categoryType) {
        var headerRow = createHeaderRow(templates, categoryType, categoryName);
        table.appendChild(headerRow);
        var category = categoryType[categoryName];
        category.forEach(function (name) {
            var row = createRow(templates, name, categoryName, categoryType);
            table.appendChild(row);
        });
        var requiredRow = createRequiredRow(categoryName);
        table.append(requiredRow);
    }
}
function updateQuickTaskDisplay(taskType) {
    var currentTask = taskType == 'job' ? gameData.currentJob : gameData.currentSkill;
    var quickTaskDisplayElement = document.getElementById('quickTaskDisplay');
    var progressBar = quickTaskDisplayElement.getElementsByClassName(taskType)[0];
    progressBar.getElementsByClassName('name')[0].textContent =
        currentTask.name + ' lvl ' + currentTask.level;
    progressBar.getElementsByClassName('progressFill')[0].style.width =
        (currentTask.xp / currentTask.getMaxXp()) * 100 + '%';
}
function updateRequiredRows(data, categoryType) {
    var requiredRows = document.getElementsByClassName('requiredRow');
    for (let requiredRow of requiredRows) {
        var nextEntity = null;
        var category = categoryType[requiredRow.id];
        if (category == null) {
            continue;
        }
        for (let i = 0; i < category.length; i++) {
            var entityName = category[i];
            if (i >= category.length - 1)
                break;
            var requirements = gameData.requirements[entityName];
            if (requirements && i == 0) {
                if (!requirements.isCompleted()) {
                    nextEntity = data[entityName];
                    break;
                }
            }
            var nextIndex = i + 1;
            if (nextIndex >= category.length) {
                break;
            }
            var nextEntityName = category[nextIndex];
            let nextEntityRequirements = gameData.requirements[nextEntityName];
            if (!nextEntityRequirements.isCompleted()) {
                nextEntity = data[nextEntityName];
                break;
            }
        }
        if (nextEntity == null) {
            requiredRow.classList.add('hiddenTask');
        }
        else {
            requiredRow.classList.remove('hiddenTask');
            var requirementObject = gameData.requirements[nextEntity.name];
            var requirements = requirementObject.requirements;
            var coinElement = requiredRow.getElementsByClassName('coins')[0];
            var levelElement = requiredRow.getElementsByClassName('levels')[0];
            var evilElement = requiredRow.getElementsByClassName('evil')[0];
            var essenceElement = requiredRow.getElementsByClassName('essence')[0];
            coinElement.classList.add('hiddenTask');
            levelElement.classList.add('hiddenTask');
            evilElement.classList.add('hiddenTask');
            essenceElement.classList.add('hiddenTask');
            var finalText = '';
            if (data == gameData.taskData) {
                if (requirementObject instanceof EvilRequirement) {
                    evilElement.classList.remove('hiddenTask');
                    evilElement.textContent =
                        format(requirements[0].requirement) + ' cuteness';
                }
                else if (requirementObject instanceof EssenceRequirement) {
                    essenceElement.classList.remove('hiddenTask');
                    essenceElement.textContent =
                        format(requirements[0].requirement) + ' essence';
                }
                else {
                    levelElement.classList.remove('hiddenTask');
                    for (requirement of requirements) {
                        var task = gameData.taskData[requirement.task];
                        if (task.level >= requirement.requirement)
                            continue;
                        var text = ' ' +
                            requirement.task +
                            ' level ' +
                            format(task.level) +
                            '/' +
                            format(requirement.requirement) +
                            ',';
                        finalText += text;
                    }
                    finalText = finalText.substring(0, finalText.length - 1);
                    levelElement.textContent = finalText;
                }
            }
            else if (data == gameData.itemData) {
                coinElement.classList.remove('hiddenTask');
                formatCoins(requirements[0].requirement, coinElement);
            }
        }
    }
}
function updateTaskRows() {
    for (let key in gameData.taskData) {
        var task = gameData.taskData[key];
        var row = document.getElementById('row ' + task.name);
        row.getElementsByClassName('level')[0].textContent = task.level;
        row.getElementsByClassName('xpGain')[0].textContent = format(task.getXpGain());
        row.getElementsByClassName('xpLeft')[0].textContent = format(task.getXpLeft());
        var maxLevel = row.getElementsByClassName('maxLevel')[0];
        maxLevel.textContent = task.maxLevel;
        gameData.rebirthOneCount > 0
            ? maxLevel.classList.remove('hidden')
            : maxLevel.classList.add('hidden');
        var progressFill = row.getElementsByClassName('progressFill')[0];
        progressFill.style.width = (task.xp / task.getMaxXp()) * 100 + '%';
        task == gameData.currentJob || task == gameData.currentSkill
            ? progressFill.classList.add('current')
            : progressFill.classList.remove('current');
        var valueElement = row.getElementsByClassName('value')[0];
        valueElement.getElementsByClassName('income')[0].style.display =
            task instanceof Job;
        valueElement.getElementsByClassName('effect')[0].style.display =
            task instanceof Skill;
        var skipSkillElement = row.getElementsByClassName('skipSkill')[0];
        skipSkillElement.style.display =
            task instanceof Skill && autoLearnElement.checked
                ? 'block'
                : 'none';
        if (task instanceof Job) {
            formatCoins(task.getIncome(), valueElement.getElementsByClassName('income')[0]);
        }
        else {
            valueElement.getElementsByClassName('effect')[0].textContent =
                task.getEffectDescription();
        }
    }
}
function setStickySidebar(sticky) {
    gameData.settings.stickySidebar = sticky;
    settingsStickySidebar.checked = sticky;
    info.style.position = sticky ? 'sticky' : 'initial';
}
function updateItemRows() {
    for (let key in gameData.itemData) {
        var item = gameData.itemData[key];
        var row = document.getElementById('row ' + item.name);
        var button = row.getElementsByClassName('button')[0];
        button.disabled = gameData.coins < item.getExpense();
        var active = row.getElementsByClassName('active')[0];
        var color = itemCategories['Properties'].includes(item.name)
            ? headerRowColors['Properties']
            : headerRowColors['Items'];
        active.style.backgroundColor =
            gameData.currentMisc.includes(item) ||
                item == gameData.currentProperty
                ? color
                : 'white';
        row.getElementsByClassName('effect')[0].textContent =
            item.getEffectDescription();
        formatCoins(item.getExpense(), row.getElementsByClassName('expense')[0]);
    }
}
function updateHeaderRows(categories) {
    for (let categoryName in categories) {
        var className = removeSpaces(categoryName);
        var headerRow = document.getElementsByClassName(className)[0];
        var maxLevelElement = headerRow.getElementsByClassName('maxLevel')[0];
        gameData.rebirthOneCount > 0
            ? maxLevelElement.classList.remove('hidden')
            : maxLevelElement.classList.add('hidden');
        var skipSkillElement = headerRow.getElementsByClassName('skipSkill')[0];
        skipSkillElement.style.display =
            categories == skillCategories && autoLearnElement.checked
                ? 'block'
                : 'none';
    }
}
function updateText() {
    //Sidebar
    document.getElementById('ageDisplay').textContent = daysToYears(gameData.days);
    document.getElementById('dayDisplay').textContent = getDay();
    document.getElementById('lifespanDisplay').textContent =
        daysToYears(getLifespan());
    document.getElementById('pauseButton').textContent = gameData.paused
        ? 'Play'
        : 'Pause';
    formatCoins(gameData.coins, document.getElementById('coinDisplay'));
    setSignDisplay();
    formatCoins(getNet(), document.getElementById('netDisplay'));
    formatCoins(getIncome(), document.getElementById('incomeDisplay'));
    formatCoins(getExpense(), document.getElementById('expenseDisplay'));
    document.getElementById('happinessDisplay').textContent =
        getHappiness().toFixed(1);
    document.getElementById('evilDisplay').textContent =
        gameData.evil.toFixed(1);
    document.getElementById('evilGainDisplay').textContent =
        getEvilGain().toFixed(1);
    document.getElementById('essenceDisplay').textContent =
        gameData.essence.toFixed(1);
    document.getElementById('essenceGainDisplay').textContent =
        getEssenceGain().toFixed(1);
    document.getElementById('timeWarpingDisplay').textContent =
        'x' +
            (gameData.taskData['Zoomy Casting'].getEffect() *
                gameData.taskData['Temporal Zoomies'].getEffect() *
                gameData.taskData['Zoomy Looper'].getEffect()).toFixed(1);
    document.getElementById('timeWarpingButton').textContent =
        gameData.timeWarpingEnabled ? 'Disable warp' : 'Enable warp';
}
function setSignDisplay() {
    var signDisplay = document.getElementById('signDisplay');
    if (getIncome() > getExpense()) {
        signDisplay.textContent = '+';
        signDisplay.style.color = 'green';
    }
    else if (getExpense() > getIncome()) {
        signDisplay.textContent = '-';
        signDisplay.style.color = 'red';
    }
    else {
        signDisplay.textContent = '';
        signDisplay.style.color = 'gray';
    }
}
function getNet() {
    var net = Math.abs(getIncome() - getExpense());
    return net;
}
function hideEntities() {
    for (let key in gameData.requirements) {
        var requirement = gameData.requirements[key];
        var completed = requirement.isCompleted();
        for (let element of requirement.elements) {
            if (completed) {
                element.classList.remove('hidden');
            }
            else {
                element.classList.add('hidden');
            }
        }
    }
}
function createItemData(baseData) {
    for (var item of baseData) {
        gameData.itemData[item.name] =
            'happiness' in item ? new Property(task) : new Misc(task);
        gameData.itemData[item.name].id = 'item ' + item.name;
    }
}
function doCurrentTask(task) {
    task.increaseXp();
    if (task instanceof Job) {
        increaseCoins();
    }
}
function getIncome() {
    var income = 0;
    income += gameData.currentJob.getIncome();
    return income;
}
function increaseCoins() {
    var coins = applySpeed(getIncome());
    gameData.coins += coins;
}
function daysToYears(days) {
    var years = Math.floor(days / 365);
    return years;
}
function getCategoryFromEntityName(categoryType, entityName) {
    for (let categoryName in categoryType) {
        var category = categoryType[categoryName];
        if (category.includes(entityName)) {
            return category;
        }
    }
}
function getNextEntity(data, categoryType, entityName) {
    var category = getCategoryFromEntityName(categoryType, entityName);
    var nextIndex = category.indexOf(entityName) + 1;
    if (nextIndex > category.length - 1)
        return null;
    var nextEntityName = category[nextIndex];
    var nextEntity = data[nextEntityName];
    return nextEntity;
}
function autoPromote() {
    if (!autoPromoteElement.checked)
        return;
    var nextEntity = getNextEntity(gameData.taskData, jobCategories, gameData.currentJob.name);
    if (nextEntity == null)
        return;
    var requirement = gameData.requirements[nextEntity.name];
    if (requirement.isCompleted())
        gameData.currentJob = nextEntity;
}
function checkSkillSkipped(skill) {
    var row = document.getElementById('row ' + skill.name);
    var isSkillSkipped = row.getElementsByClassName('checkbox')[0].checked;
    return isSkillSkipped;
}
function setSkillWithLowestMaxXp() {
    var enabledSkills = [];
    for (skillName in gameData.taskData) {
        var skill = gameData.taskData[skillName];
        var requirement = gameData.requirements[skillName];
        /*
        Getting an autolearn error, and the dev console says there is an uncaught
        TypeError at this line of code below during the requirement.isCompleted() call.
        I think the error is saying that when calling requirement.isCompleted, requirement is undefined.
        This would make sense if I have a skill that doesn't have any unlock requirements, which I think
        is true of Novel Knowledge for table rendering reasons. So the game logic assumes each skill has a requirement
        without actually checking if requirement is non-null.
        */
        if (skill instanceof Skill) {
            //This check on the requirement variable is here to handle the case of a skill
            //having no requirements. By setting requirement equal to Concentration's requirements,
            //we prevent unchecked TypeErrors that have been breaking the auto learn feature.
            // NOTE : FRAGILE FIX
            // This fix will break if the Concentration skill is either removed from the game, renamed, or the requirement is no
            // longer immediately satisfied upon starting a new game.
            // Update: You can "change" the name of the skill but if you mess with this fix too much you absolutely
            // will break the game~ lol
            if (requirement == null) {
                requirement = gameData.requirements['Mindfulness'];
            }
            if (requirement.isCompleted() && !checkSkillSkipped(skill)) {
                enabledSkills.push(skill);
            }
        }
    }
    if (enabledSkills.length == 0) {
        skillWithLowestMaxXp = gameData.taskData['Mindfulness'];
        return;
    }
    enabledSkills.sort((lhs, rhs) => {
        return (lhs.getMaxXp() / lhs.getXpGain() - rhs.getMaxXp() / rhs.getXpGain());
    });
    var skillName = enabledSkills[0].name;
    skillWithLowestMaxXp = gameData.taskData[skillName];
}
function getKeyOfLowestValueFromDict(dict) {
    var values = [];
    for (let key in dict) {
        var value = dict[key];
        values.push(value);
    }
    values.sort(function (a, b) {
        return a - b;
    });
    for (let key in dict) {
        var value = dict[key];
        if (value == values[0]) {
            return key;
        }
    }
}
function autoLearn() {
    if (!autoLearnElement.checked || !skillWithLowestMaxXp)
        return;
    gameData.currentSkill = skillWithLowestMaxXp;
}
function yearsToDays(years) {
    var days = years * 365;
    return days;
}
function getDay() {
    var day = Math.floor(gameData.days - daysToYears(gameData.days) * 365);
    return day;
}
function increaseDays() {
    var increase = applySpeed(1);
    gameData.days += increase;
}
function format(number, decimals = 1) {
    // what tier? (determines SI symbol)
    var tier = (Math.log10(number) / 3) | 0;
    // if zero, we don't need a suffix
    if (tier == 0)
        return number;
    // get suffix and determine scale
    var suffix = units[tier];
    var scale = Math.pow(10, tier * 3);
    // scale the number
    var scaled = number / scale;
    // format number and add suffix
    return scaled.toFixed(decimals) + suffix;
}
// This handles the coins. I figured I'd point that out since it took me forever to find it on my own~ lol
function formatCoins(coins, element) {
    var tiers = ['p', 'g', 's'];
    var colors = {
        p: '#79b9c7',
        g: '#E5C100',
        s: '#a8a8a8',
        c: '#a15c2f',
    };
    var leftOver = coins;
    var i = 0;
    for (var tier of tiers) {
        var x = Math.floor(leftOver / Math.pow(10, (tiers.length - i) * 2));
        var leftOver = Math.floor(leftOver - x * Math.pow(10, (tiers.length - i) * 2));
        var text = coins > 1e9 && i > 0 ? '' : format(String(x), 2) + tier + ' ';
        element.children[i].textContent = x > 0 ? text : '';
        element.children[i].style.color = colors[tier];
        i += 1;
    }
    if ((leftOver == 0 && coins > 0) || coins > 1e9) {
        element.children[3].textContent = '';
        return;
    }
    var text = String(Math.floor(leftOver)) + 'c';
    element.children[3].textContent = text;
    element.children[3].style.color = colors['c'];
}
function getTaskElement(taskName) {
    var task = gameData.taskData[taskName];
    var element = document.getElementById(task.id);
    return element;
}
function getItemElement(itemName) {
    var item = gameData.itemData[itemName];
    var element = document.getElementById(item.id);
    return element;
}
function getElementsByClass(className) {
    var elements = document.getElementsByClassName(removeSpaces(className));
    return elements;
}
function setLightDarkMode() {
    var body = document.getElementById('body');
    body.classList.contains('dark')
        ? body.classList.remove('dark')
        : body.classList.add('dark');
}
function removeSpaces(string) {
    var string = string.replace(/ /g, '');
    return string;
}
function rebirthOne() {
    gameData.rebirthOneCount += 1;
    rebirthReset();
}
function rebirthTwo() {
    gameData.rebirthTwoCount += 1;
    gameData.evil += getEvilGain();
    rebirthReset();
    for (let taskName in gameData.taskData) {
        var task = gameData.taskData[taskName];
        task.maxLevel = 0;
    }
}
function rebirthThree() {
    gameData.rebirthThreeCount += 1;
    if (gameData.essence < 30000) {
        gameData.essence += getEssenceGain();
    }
    else {
        gameData.essence += getEssenceGain() * 1.5;
    }
    gameData.evil = 0;
    var recallEffect = gameData.taskData['Eternal Recollection'].getEffect();
    rebirthReset();
    for (taskName in gameData.taskData) {
        var task = gameData.taskData[taskName];
        task.maxLevel = Math.floor(recallEffect * task.maxLevel);
    }
}
function rebirthReset() {
    setTab(jobTabButton, 'jobs');
    gameData.coins = 0;
    gameData.days = 365 * 18;
    gameData.currentJob = gameData.taskData['Scrounger'];
    gameData.currentSkill = gameData.taskData['Mindfulness'];
    gameData.currentProperty = gameData.itemData['Stray'];
    gameData.currentMisc = [];
    for (let taskName in gameData.taskData) {
        var task = gameData.taskData[taskName];
        if (task.level > task.maxLevel)
            task.maxLevel = task.level;
        task.level = 0;
        task.xp = 0;
    }
    for (let key in gameData.requirements) {
        var requirement = gameData.requirements[key];
        if (requirement.completed && permanentUnlocks.includes(key))
            continue;
        requirement.completed = false;
    }
}
function getLifespan() {
    var immortality = gameData.taskData['Feline Essence'];
    var superImmortality = gameData.taskData['Astral Body'];
    var higherDimensions = gameData.taskData['Higher Dimensions'];
    var abyss = gameData.taskData['Ceaseless Love'];
    var cosmicLongevity = gameData.taskData['Cosmic Longevity'];
    var lifespan = baseLifespan *
        immortality.getEffect() *
        superImmortality.getEffect() *
        abyss.getEffect() *
        cosmicLongevity.getEffect() *
        higherDimensions.getEffect();
    return lifespan;
}
function isAlive() {
    var condition = gameData.days < getLifespan();
    var deathText = document.getElementById('deathText');
    if (!condition) {
        gameData.days = getLifespan();
        deathText.classList.remove('hidden');
    }
    else {
        deathText.classList.add('hidden');
    }
    return condition;
}
function assignMethods() {
    for (let key in gameData.taskData) {
        var task = gameData.taskData[key];
        if (task.baseData.income) {
            task.baseData = jobBaseData[task.name];
            task = Object.assign(new Job(jobBaseData[task.name]), task);
        }
        else {
            task.baseData = skillBaseData[task.name];
            task = Object.assign(new Skill(skillBaseData[task.name]), task);
        }
        gameData.taskData[key] = task;
    }
    for (let key in gameData.itemData) {
        var item = gameData.itemData[key];
        item.baseData = itemBaseData[item.name];
        item = Object.assign(new Item(itemBaseData[item.name]), item);
        gameData.itemData[key] = item;
    }
    for (let key in gameData.requirements) {
        var requirement = gameData.requirements[key];
        if (requirement.type == 'task') {
            requirement = Object.assign(new TaskRequirement(requirement.elements, requirement.requirements), requirement);
        }
        else if (requirement.type == 'coins') {
            requirement = Object.assign(new CoinRequirement(requirement.elements, requirement.requirements), requirement);
        }
        else if (requirement.type == 'age') {
            requirement = Object.assign(new AgeRequirement(requirement.elements, requirement.requirements), requirement);
        }
        else if (requirement.type == 'evil') {
            requirement = Object.assign(new EvilRequirement(requirement.elements, requirement.requirements), requirement);
        }
        else if (requirement.type == 'essence') {
            requirement = Object.assign(new EssenceRequirement(requirement.elements, requirement.requirements), requirement);
        }
        var tempRequirement = tempData['requirements'][key];
        requirement.elements = tempRequirement.elements;
        requirement.requirements = tempRequirement.requirements;
        gameData.requirements[key] = requirement;
    }
    gameData.currentJob = gameData.taskData[gameData.currentJob.name];
    gameData.currentSkill = gameData.taskData[gameData.currentSkill.name];
    gameData.currentProperty = gameData.itemData[gameData.currentProperty.name];
    var newArray = [];
    for (let misc of gameData.currentMisc) {
        newArray.push(gameData.itemData[misc.name]);
    }
    gameData.currentMisc = newArray;
}
function replaceSaveDict(dict, saveDict) {
    for (let key in dict) {
        if (!(key in saveDict)) {
            saveDict[key] = dict[key];
        }
        else if (dict == gameData.requirements) {
            if (saveDict[key].type != tempData['requirements'][key].type) {
                saveDict[key] = tempData['requirements'][key];
            }
        }
    }
    for (let key in saveDict) {
        if (!(key in dict)) {
            delete saveDict[key];
        }
    }
}
function saveGameData() {
    localStorage.setItem('gameDataSave', JSON.stringify(gameData));
}
function loadGameData() {
    var gameDataSave = JSON.parse(localStorage.getItem('gameDataSave'));
    if (gameDataSave !== null) {
        replaceSaveDict(gameData, gameDataSave);
        replaceSaveDict(gameData.requirements, gameDataSave.requirements);
        replaceSaveDict(gameData.taskData, gameDataSave.taskData);
        replaceSaveDict(gameData.itemData, gameDataSave.itemData);
        replaceSaveDict(gameData.settings, gameDataSave.settings);
        gameData = gameDataSave;
    }
    assignMethods();
}
function updateUI() {
    updateTaskRows();
    updateItemRows();
    updateRequiredRows(gameData.taskData, jobCategories);
    updateRequiredRows(gameData.taskData, skillCategories);
    updateRequiredRows(gameData.itemData, itemCategories);
    updateHeaderRows(jobCategories);
    updateHeaderRows(skillCategories);
    updateQuickTaskDisplay('job');
    updateQuickTaskDisplay('skill');
    hideEntities();
    updateText();
}
function update() {
    increaseDays();
    autoPromote();
    autoLearn();
    doCurrentTask(gameData.currentJob);
    doCurrentTask(gameData.currentSkill);
    applyExpenses();
    updateUI();
}
function resetGameData() {
    localStorage.clear();
    location.reload();
}
function importGameData() {
    var importExportBox = document.getElementById('importExportBox');
    var data = JSON.parse(window.atob(importExportBox.value));
    gameData = data;
    saveGameData();
    location.reload();
}
function exportGameData() {
    var importExportBox = document.getElementById('importExportBox');
    importExportBox.value = window.btoa(JSON.stringify(gameData));
}
// Keyboard shortcuts + Loadouts ( courtesy of Pseiko )
function changeTab(direction) {
    var tabs = Array.prototype.slice.call(document.getElementsByClassName('tab'));
    var tabButtons = Array.prototype.slice.call(document.getElementsByClassName('tabButton'));
    var currentTab = 0;
    for (let i in tabs) {
        if (!tabs[i].style.display.includes('none'))
            currentTab = i * 1;
    }
    var targetTab = currentTab + direction;
    targetTab = Math.max(0, targetTab);
    if (targetTab > tabs.length - 1)
        targetTab = 0;
    while (tabButtons[targetTab].style.display.includes('none')) {
        targetTab = targetTab + direction;
        targetTab = Math.max(0, targetTab);
        if (targetTab > tabs.length - 1)
            targetTab = 0;
    }
    button = tabButtons[targetTab];
    setTab(button, tabs[targetTab].id);
}
let loadouts = {};
function saveLoadout(num) {
    loadouts[num] = {
        job: gameData.currentJob.name,
        skill: gameData.currentSkill.name,
        property: gameData.currentProperty.name,
        misc: [],
    };
    for (let i in gameData.currentMisc)
        loadouts[num].misc.push(gameData.currentMisc[i].name);
}
function loadLoadout(num) {
    if (num in loadouts) {
        gameData.currentMisc = [];
        for (let i in loadouts[num].misc)
            setMisc(loadouts[num].misc[i]);
        setProperty(loadouts[num].property);
        setTask(loadouts[num].skill);
        setTask(loadouts[num].job);
    }
    document.getElementById('autoLearn').checked = false;
    document.getElementById('autoPromote').checked = false;
}
window.addEventListener('keydown', function (e) {
    if (e.key == '1' && e.altKey)
        saveLoadout(1);
    if (e.key == '1')
        loadLoadout(1);
    if (e.key == '2' && e.altKey)
        saveLoadout(2);
    if (e.key == '2')
        loadLoadout(2);
    if (e.key == '3' && e.altKey)
        saveLoadout(3);
    if (e.key == '3')
        loadLoadout(3);
    if (e.key == ' ' && !e.repeat) {
        setPause();
        if (e.target == document.body) {
            e.preventDefault();
        }
    }
    if (e.key == 'ArrowRight')
        changeTab(1);
    if (e.key == 'ArrowLeft')
        changeTab(-1);
    if (e.key == 'l' || e.key == 'L')
        document.getElementById('autoLearn').checked =
            !document.getElementById('autoLearn').checked;
    if (e.key == 'p' || e.key == 'P')
        document.getElementById('autoPromote').checked =
            !document.getElementById('autoPromote').checked;
});
// This is the auto-pause function. I want to tinker with this more in the future.
(function () {
    let span = document.createElement('span');
    let div = document.createElement('div');
    div.classList.add('inline');
    div.textContent = 'Auto-pause(Void)';
    span.append(div);
    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('inline');
    checkbox.id = 'autoPause';
    span.append(checkbox);
    document
        .querySelector('span#automation')
        .prepend(document.createElement('br'));
    document.querySelector('span#automation').prepend(span);
    increaseDays = () => {
        var increase = applySpeed(1);
        var autoPause = document.getElementById('autoPause').checked;
        if (gameData.days < 365000 &&
            gameData.days + increase > 365000 &&
            autoPause) {
            gameData.paused = true;
        }
        gameData.days += increase;
    };
})();
//Init
// What I think it does is check that you met the requirements to
// upgrade to another class or make progress. I'm still figuring it out myself...
createAllRows(jobCategories, 'jobTable');
createAllRows(skillCategories, 'skillTable');
createAllRows(itemCategories, 'itemTable');
createData(gameData.taskData, jobBaseData);
createData(gameData.taskData, skillBaseData);
createData(gameData.itemData, itemBaseData);
gameData.currentJob = gameData.taskData['Scrounger'];
gameData.currentSkill = gameData.taskData['Mindfulness'];
gameData.currentProperty = gameData.itemData['Stray'];
gameData.currentMisc = [];
gameData.requirements = {
    //Other
    'Meowgic Arcanium': new TaskRequirement(getElementsByClass('Meowgic Arcanium'), [
        { task: 'Mindfulness', requirement: 200 },
        { task: 'Pondering', requirement: 200 },
    ]),
    'Galactic Council': new AgeRequirement(getElementsByClass('Galactic Council'), [{ requirement: 10000 }]),
    'Angelic Realm': new AgeRequirement(getElementsByClass('Angelic Realm'), [
        { requirement: 1000 },
    ]),
    'Angelic Power': new AgeRequirement(getElementsByClass('Angelic Power'), [
        { requirement: 1000 },
    ]),
    'Celestial Powers': new AgeRequirement(getElementsByClass('Celestial Powers'), [{ requirement: 10000 }]),
    'Cutie Magic': new EvilRequirement(getElementsByClass('Cutie Magic'), [
        { requirement: 1 },
    ]),
    'Almightiness': new EssenceRequirement(getElementsByClass('Almightiness'), [
        { requirement: 1 },
    ]),
    'Shop': new CoinRequirement([document.getElementById('shopTabButton')], [
        {
            requirement: gameData.itemData['Tattered Sheets'].getExpense() * 50,
        },
    ]),
    'Rebirth tab': new AgeRequirement([document.getElementById('rebirthTabButton')], [{ requirement: 25 }]),
    'Rebirth note 1': new AgeRequirement([document.getElementById('rebirthNote1')], [{ requirement: 45 }]),
    'Rebirth note 2': new AgeRequirement([document.getElementById('rebirthNote2')], [{ requirement: 65 }]),
    'Rebirth note 3': new AgeRequirement([document.getElementById('rebirthNote3')], [{ requirement: 200 }]),
    'Rebirth note 4': new AgeRequirement([document.getElementById('rebirthNote4')], [{ requirement: 1000 }]),
    'Rebirth note 4': new AgeRequirement([document.getElementById('rebirthNote4')], [{ requirement: 1000 }]),
    'Rebirth note 5': new AgeRequirement([document.getElementById('rebirthNote5')], [{ requirement: 10000 }]),
    'Rebirth note 6': new TaskRequirement([document.getElementById('rebirthNote6')], [{ task: 'Eternal Recollection', requirement: 1 }]),
    'Evil info': new EvilRequirement([document.getElementById('evilInfo')], [{ requirement: 1 }]),
    'Essence info': new EssenceRequirement([document.getElementById('essenceInfo')], [{ requirement: 1 }]),
    'Time warping info': new TaskRequirement([document.getElementById('timeWarping')], [{ task: 'Adept Neko Mage', requirement: 10 }]),
    'Automation': new AgeRequirement([document.getElementById('automation')], [{ requirement: 1 }]),
    'Quick task display': new AgeRequirement([document.getElementById('quickTaskDisplay')], [{ requirement: 1 }]),
    //Common work
    'Scrounger': new TaskRequirement([getTaskElement('Scrounger')], []),
    'Catnip Farmer': new TaskRequirement([getTaskElement('Catnip Farmer')], [
        { task: 'Mindfulness', requirement: 5 },
        { task: 'Fruitfulness', requirement: 5 },
        { task: 'Scrounger', requirement: 5 },
    ]),
    'Maid': new TaskRequirement([getTaskElement('Maid')], [
        { task: 'Mindfulness', requirement: 15 },
        { task: 'Fruitfulness', requirement: 15 },
        { task: 'Catnip Farmer', requirement: 10 },
    ]),
    'Catgirl Cafe Waitress': new TaskRequirement([getTaskElement('Catgirl Cafe Waitress')], [
        { task: 'Mindfulness', requirement: 20 },
        { task: 'Fruitfulness', requirement: 20 },
        { task: 'Meowing', requirement: 10 },
        { task: 'Maid', requirement: 15 },
    ]),
    'Sushi Chef': new TaskRequirement([getTaskElement('Sushi Chef')], [
        { task: 'Mindfulness', requirement: 30 },
        { task: 'Fruitfulness', requirement: 30 },
        { task: 'Pondering', requirement: 10 },
        { task: 'Catgirl Cafe Waitress', requirement: 20 },
    ]),
    'Business Catgirl': new TaskRequirement([getTaskElement('Business Catgirl')], [
        { task: 'Mindfulness', requirement: 50 },
        { task: 'Fruitfulness', requirement: 50 },
        { task: 'Meowing', requirement: 50 },
        { task: 'Pondering', requirement: 50 },
        { task: 'Sushi Chef', requirement: 25 },
    ]),
    //Military
    'Recruit': new TaskRequirement([getTaskElement('Recruit')], [{ task: 'Courage', requirement: 5 }]),
    'Paw Patrol': new TaskRequirement([getTaskElement('Paw Patrol')], [
        { task: 'Courage', requirement: 20 },
        { task: 'Recruit', requirement: 20 },
    ]),
    'Neko Warrior': new TaskRequirement([getTaskElement('Neko Warrior')], [
        { task: 'Courage', requirement: 40 },
        { task: 'Battle Mewneuvers', requirement: 40 },
        { task: 'Paw Patrol', requirement: 25 },
    ]),
    'Catvalry': new TaskRequirement([getTaskElement('Catvalry')], [
        { task: 'Courage', requirement: 100 },
        { task: 'Battle Mewneuvers', requirement: 100 },
        { task: 'Neko Warrior', requirement: 30 },
    ]),
    'Nya Nya Knight': new TaskRequirement([getTaskElement('Nya Nya Knight')], [
        { task: 'Courage', requirement: 150 },
        { task: 'Battle Mewneuvers', requirement: 150 },
        { task: 'Pouncing', requirement: 100 },
        { task: 'Catvalry', requirement: 35 },
    ]),
    'Elite Nya Nya Knight': new TaskRequirement([getTaskElement('Elite Nya Nya Knight')], [
        { task: 'Courage', requirement: 300 },
        { task: 'Battle Mewneuvers', requirement: 300 },
        { task: 'Pouncing', requirement: 150 },
        { task: 'Nya Nya Knight', requirement: 40 },
    ]),
    'Divine Neko Warrior': new TaskRequirement([getTaskElement('Divine Neko Warrior')], [
        { task: 'Manya Control', requirement: 500 },
        { task: 'Elite Nya Nya Knight', requirement: 45 },
    ]),
    'Grand Meowarshal': new TaskRequirement([getTaskElement('Grand Meowarshal')], [
        { task: 'Manya Control', requirement: 1000 },
        { task: 'Battle Mewneuvers', requirement: 1000 },
        { task: 'Divine Neko Warrior', requirement: 50 },
    ]),
    //The Arcane Association
    'Pupil': new TaskRequirement([getTaskElement('Pupil')], [
        { task: 'Mindfulness', requirement: 200 },
        { task: 'Pondering', requirement: 200 },
    ]),
    'Apprentice Neko Mage': new TaskRequirement([getTaskElement('Apprentice Neko Mage')], [
        { task: 'Manya Control', requirement: 400 },
        { task: 'Pupil', requirement: 30 },
    ]),
    'Adept Neko Mage': new TaskRequirement([getTaskElement('Adept Neko Mage')], [
        { task: 'Manya Control', requirement: 700 },
        { task: 'Apprentice Neko Mage', requirement: 40 },
    ]),
    'Master Neko Mage': new TaskRequirement([getTaskElement('Master Neko Mage')], [
        { task: 'Manya Control', requirement: 1000 },
        { task: 'Adept Neko Mage', requirement: 50 },
    ]),
    'Arch Neko Mage': new TaskRequirement([getTaskElement('Arch Neko Mage')], [
        { task: 'Manya Control', requirement: 1200 },
        { task: 'Master Neko Mage', requirement: 60 },
    ]),
    'Nekomancer': new TaskRequirement([getTaskElement('Nekomancer')], [
        { task: 'Manya Control', requirement: 1500 },
        { task: 'Pondering', requirement: 1500 },
        { task: 'Arch Neko Mage', requirement: 70 },
    ]),
    'College Administrator': new TaskRequirement([getTaskElement('College Administrator')], [
        { task: 'Manya Control', requirement: 2000 },
        { task: 'Fruitfulness', requirement: 2000 },
        { task: 'Nekomancer', requirement: 80 },
    ]),
    'Grandmaster': new TaskRequirement([getTaskElement('Grandmaster')], [
        { task: 'Coin Transmutation', requirement: 3000 },
        { task: 'Mindfulness', requirement: 3000 },
        { task: 'College Administrator', requirement: 90 },
    ]),
    //The Void
    'Angel': new AgeRequirement([getTaskElement('Angel')], [{ task: 'Scrounger', requirement: 1000 }]),
    'Guardian Angel': new TaskRequirement([getTaskElement('Guardian Angel')], [{ task: 'Angel', requirement: 30 }]),
    'Archangel': new TaskRequirement([getTaskElement('Archangel')], [
        { task: 'Brainwashing', requirement: 3000 },
        { task: 'Guardian Angel', requirement: 200 },
    ]),
    'Seraph': new TaskRequirement([getTaskElement('Seraph')], [
        { task: 'Enlightened Mind', requirement: 3000 },
        { task: 'Archangel', requirement: 200 },
    ]),
    'Divine Wanderer': new TaskRequirement([getTaskElement('Divine Wanderer')], [
        { task: 'Temporal Zoomies', requirement: 3400 },
        { task: 'Seraph', requirement: 300 },
    ]),
    'Angelic Spirit': new TaskRequirement([getTaskElement('Angelic Spirit')], [
        { task: 'Angelic Amplification', requirement: 3400 },
        { task: 'Divine Wanderer', requirement: 250 },
    ]),
    'Hevanly Gatekeeper': new TaskRequirement([getTaskElement('Hevanly Gatekeeper')], [
        { task: 'Divine Symbiosis', requirement: 3800 },
        { task: 'Angelic Spirit', requirement: 150 },
    ]),
    'Guardian of the Hevans': new TaskRequirement([getTaskElement('Guardian of the Hevans')], [
        { task: 'Prismatic Embodiment', requirement: 4700 },
        { task: 'Hevanly Gatekeeper', requirement: 750 },
    ]),
    //Galactic Council
    'Galactic Wanderer': new AgeRequirement([getTaskElement('Galactic Wanderer')], [{ task: 'Recruit', requirement: 10000 }]),
    'Celestial Observer': new TaskRequirement([getTaskElement('Celestial Observer')], [
        { task: 'Galactic Wanderer', requirement: 15 },
        { task: 'Cosmic Longevity', requirement: 4000 },
    ]),
    'Demipotent': new TaskRequirement([getTaskElement('Demipotent')], [
        { task: 'Celestial Observer', requirement: 200 },
        { task: 'Eternal Recollection', requirement: 4500 },
    ]),
    'Demigoddess': new TaskRequirement([getTaskElement('Demigoddess')], [
        { task: 'Eternal Tinkerer', requirement: 5000 },
        { task: 'Demipotent', requirement: 1000 },
    ]),
    'Catgirl Goddess': new TaskRequirement([getTaskElement('Catgirl Goddess')], [
        { task: 'Pondering', requirement: 6300 },
        { task: 'Demigoddess', requirement: 1400 },
    ]),
    //Fundamentals
    'Mindfulness': new TaskRequirement([getTaskElement('Mindfulness')], []),
    'Fruitfulness': new TaskRequirement([getTaskElement('Fruitfulness')], [{ task: 'Mindfulness', requirement: 5 }]),
    'Meowing': new TaskRequirement([getTaskElement('Meowing')], [{ task: 'Mindfulness', requirement: 20 }]),
    'Pondering': new TaskRequirement([getTaskElement('Pondering')], [
        { task: 'Mindfulness', requirement: 30 },
        { task: 'Fruitfulness', requirement: 20 },
    ]),
    //Combat
    'Courage': new TaskRequirement([getTaskElement('Courage')], []),
    'Battle Mewneuvers': new TaskRequirement([getTaskElement('Battle Mewneuvers')], [{ task: 'Mindfulness', requirement: 20 }]),
    'Pouncing': new TaskRequirement([getTaskElement('Pouncing')], [
        { task: 'Mindfulness', requirement: 30 },
        { task: 'Courage', requirement: 30 },
    ]),
    //Magic
    'Manya Control': new TaskRequirement([getTaskElement('Manya Control')], [
        { task: 'Mindfulness', requirement: 200 },
        { task: 'Pondering', requirement: 200 },
    ]),
    'Feline Essence': new TaskRequirement([getTaskElement('Feline Essence')], [{ task: 'Apprentice Neko Mage', requirement: 10 }]),
    'Zoomy Casting': new TaskRequirement([getTaskElement('Zoomy Casting')], [{ task: 'Adept Neko Mage', requirement: 10 }]),
    'Astral Body': new TaskRequirement([getTaskElement('Astral Body')], [{ task: 'Arch Neko Mage', requirement: 10 }]),
    'Temporal Zoomies': new TaskRequirement([getTaskElement('Temporal Zoomies')], [{ task: 'Nekomancer', requirement: 25 }]),
    'Coin Transmutation': new TaskRequirement([getTaskElement('Coin Transmutation')], [
        { task: 'Manya Control', requirement: 2500 },
        { task: 'College Administrator', requirement: 100 },
    ]),
    'Brainwashing': new TaskRequirement([getTaskElement('Brainwashing')], [{ task: 'Grandmaster', requirement: 100 }]),
    //Dark magic
    'Adorable Allure': new EvilRequirement([getTaskElement('Adorable Allure')], [{ requirement: 1 }]),
    'Fluff Ascension': new EvilRequirement([getTaskElement('Fluff Ascension')], [{ requirement: 1 }]),
    'Weaponized Cuteness': new EvilRequirement([getTaskElement('Weaponized Cuteness')], [{ requirement: 1 }]),
    'Unworldly Adorablness': new EvilRequirement([getTaskElement('Unworldly Adorablness')], [{ requirement: 20 }]),
    'Sacred Plushie Ritual': new EvilRequirement([getTaskElement('Sacred Plushie Ritual')], [{ requirement: 50 }]),
    'Midas Paw': new EvilRequirement([getTaskElement('Midas Paw')], [{ requirement: 500 }]),
    'Sacred Knowledge': new EvilRequirement([getTaskElement('Sacred Knowledge')], [{ requirement: 5000 }]),
    'Celestial Influence': new EvilRequirement([getTaskElement('Celestial Influence')], [{ requirement: 50000 }]),
    'Zoomy Looper': new EvilRequirement([getTaskElement('Zoomy Looper')], [{ requirement: 2500000 }]),
    'Cutie Incarnate': new EvilRequirement([getTaskElement('Cutie Incarnate')], [{ requirement: 1000000000 }]),
    //Void Manipulation
    'Absolute Wish': new TaskRequirement([getTaskElement('Absolute Wish')], [
        { task: 'Guardian Angel', requirement: 25 },
        { task: 'College Administrator', requirement: 300 },
    ]),
    'Angelic Amplification': new TaskRequirement([getTaskElement('Angelic Amplification')], [
        { task: 'Guardian Angel', requirement: 100 },
        { task: 'Absolute Wish', requirement: 3000 },
    ]),
    'Enlightened Mind': new TaskRequirement([getTaskElement('Enlightened Mind')], [{ task: 'Angelic Amplification', requirement: 3000 }]),
    'Ceaseless Love': new TaskRequirement([getTaskElement('Ceaseless Love')], [
        { task: 'Celestial Influence', requirement: 4000 },
        { task: 'Seraph', requirement: 50 },
    ]),
    'Divine Symbiosis': new TaskRequirement([getTaskElement('Divine Symbiosis')], [
        { task: 'Ceaseless Love', requirement: 3500 },
        { task: 'Angelic Spirit', requirement: 50 },
    ]),
    'Prismatic Embodiment': new TaskRequirement([getTaskElement('Prismatic Embodiment')], [
        { task: 'Adorable Allure', requirement: 4600 },
        { task: 'Hevanly Gatekeeper', requirement: 50 },
    ]),
    'Abyss Manipulation': new TaskRequirement([getTaskElement('Abyss Manipulation')], [
        { task: 'Guardian of the Hevans', requirement: 350 },
        { task: 'Adorable Allure', requirement: 6000 },
        { task: 'Celestial Influence', requirement: 6000 },
    ]),
    //Celestial Powers
    'Cosmic Longevity': new TaskRequirement([getTaskElement('Cosmic Longevity')], [{ task: 'Galactic Wanderer', requirement: 1 }]),
    'Eternal Recollection': new TaskRequirement([getTaskElement('Eternal Recollection')], [
        { task: 'Celestial Observer', requirement: 50 },
        { task: 'Pondering', requirement: 4200 },
        { task: 'Enlightened Mind', requirement: 3000 },
    ]),
    'Spectrial Ruminator': new TaskRequirement([getTaskElement('Spectrial Ruminator')], [
        { task: 'Demipotent', requirement: 500 },
        { task: 'Absolute Wish', requirement: 4900 },
        { task: 'Sacred Knowledge', requirement: 6300 },
    ]),
    'Eternal Tinkerer': new TaskRequirement([getTaskElement('Eternal Tinkerer')], [
        { task: 'Spectrial Ruminator', requirement: 5000 },
        { task: 'Meowing', requirement: 5000 },
    ]),
    //Essence
    'Yin Yang': new EssenceRequirement([getTaskElement('Yin Yang')], [{ requirement: 1 }]),
    'Parallel Universe': new EssenceRequirement([getTaskElement('Parallel Universe')], [{ requirement: 1 }]),
    'Higher Dimensions': new EssenceRequirement([getTaskElement('Higher Dimensions')], [{ requirement: 10000 }]),
    'Epiphany': new EssenceRequirement([getTaskElement('Epiphany')], [{ requirement: 30000 }]),
    //Properties
    'Stray': new CoinRequirement([getItemElement('Stray')], [{ requirement: 0 }]),
    'Tattered Sheets': new CoinRequirement([getItemElement('Tattered Sheets')], [{ requirement: 0 }]),
    'Makeshift Cat Tree': new CoinRequirement([getItemElement('Makeshift Cat Tree')], [
        {
            requirement: gameData.itemData['Makeshift Cat Tree'].getExpense() * 100,
        },
    ]),
    'Apartment': new CoinRequirement([getItemElement('Apartment')], [{ requirement: gameData.itemData['Apartment'].getExpense() * 100 }]),
    'House': new CoinRequirement([getItemElement('House')], [{ requirement: gameData.itemData['House'].getExpense() * 100 }]),
    'Large House': new CoinRequirement([getItemElement('Large House')], [{ requirement: gameData.itemData['Large House'].getExpense() * 100 }]),
    'Small Palace': new CoinRequirement([getItemElement('Small Palace')], [{ requirement: gameData.itemData['Small Palace'].getExpense() * 100 }]),
    'Grand Palace': new CoinRequirement([getItemElement('Grand Palace')], [{ requirement: gameData.itemData['Grand Palace'].getExpense() * 100 }]),
    'Town Ruler': new CoinRequirement([getItemElement('Town Ruler')], [{ requirement: gameData.itemData['Town Ruler'].getExpense() * 100 }]),
    'Catgirl City Ruler': new CoinRequirement([getItemElement('Catgirl City Ruler')], [
        {
            requirement: gameData.itemData['Catgirl City Ruler'].getExpense() * 100,
        },
    ]),
    'Nyation Ruler': new CoinRequirement([getItemElement('Nyation Ruler')], [
        {
            requirement: gameData.itemData['Nyation Ruler'].getExpense() * 100,
        },
    ]),
    'Yarn Dimension': new CoinRequirement([getItemElement('Yarn Dimension')], [
        {
            requirement: gameData.itemData['Yarn Dimension'].getExpense() * 100,
        },
    ]),
    'Void Realm': new CoinRequirement([getItemElement('Void Realm')], [{ requirement: gameData.itemData['Void Realm'].getExpense() * 100 }]),
    'Void Universe': new CoinRequirement([getItemElement('Void Universe')], [
        {
            requirement: gameData.itemData['Void Universe'].getExpense() * 100,
        },
    ]),
    'Astral Realm': new CoinRequirement([getItemElement('Astral Realm')], [{ requirement: gameData.itemData['Astral Realm'].getExpense() * 100 }]),
    'Galactic Throne': new CoinRequirement([getItemElement('Galactic Throne')], [
        {
            requirement: gameData.itemData['Galactic Throne'].getExpense() * 100,
        },
    ]),
    //Misc
    'Diary': new CoinRequirement([getItemElement('Diary')], [{ requirement: 0 }]),
    'Weighted Yarnballs': new CoinRequirement([getItemElement('Weighted Yarnballs')], [
        {
            requirement: gameData.itemData['Weighted Yarnballs'].getExpense() * 100,
        },
    ]),
    'Personal Assistant': new CoinRequirement([getItemElement('Personal Assistant')], [
        {
            requirement: gameData.itemData['Personal Assistant'].getExpense() * 100,
        },
    ]),
    'Steel Claws': new CoinRequirement([getItemElement('Steel Claws')], [{ requirement: gameData.itemData['Steel Claws'].getExpense() * 100 }]),
    'Catgirl Maid': new CoinRequirement([getItemElement('Catgirl Maid')], [{ requirement: gameData.itemData['Catgirl Maid'].getExpense() * 100 }]),
    'Transmatic Gem': new CoinRequirement([getItemElement('Transmatic Gem')], [
        {
            requirement: gameData.itemData['Transmatic Gem'].getExpense() * 100,
        },
    ]),
    'Fancy Chevrette': new CoinRequirement([getItemElement('Fancy Chevrette')], [
        {
            requirement: gameData.itemData['Fancy Chevrette'].getExpense() * 100,
        },
    ]),
    'Library': new CoinRequirement([getItemElement('Library')], [{ requirement: gameData.itemData['Library'].getExpense() * 100 }]),
    'Observatory': new CoinRequirement([getItemElement('Observatory')], [{ requirement: gameData.itemData['Observatory'].getExpense() * 100 }]),
    "Mind's Eye": new CoinRequirement([getItemElement("Mind's Eye")], [{ requirement: gameData.itemData["Mind's Eye"].getExpense() * 100 }]),
    'Angelic Sapphire': new CoinRequirement([getItemElement('Angelic Sapphire')], [
        {
            requirement: gameData.itemData['Angelic Sapphire'].getExpense() * 100,
        },
    ]),
    'Nyanimite Armor': new CoinRequirement([getItemElement('Nyanimite Armor')], [
        {
            requirement: gameData.itemData['Nyanimite Armor'].getExpense() * 100,
        },
    ]),
    'Etheral Claws': new CoinRequirement([getItemElement('Etheral Claws')], [
        {
            requirement: gameData.itemData['Etheral Claws'].getExpense() * 100,
        },
    ]),
    'Nyanic Wand': new CoinRequirement([getItemElement('Nyanic Wand')], [{ requirement: gameData.itemData['Nyanic Wand'].getExpense() * 100 }]),
    'Crown of Hearts': new CoinRequirement([getItemElement('Crown of Hearts')], [
        {
            requirement: gameData.itemData['Crown of Hearts'].getExpense() * 100,
        },
    ]),
    'Robes of Transcendance': new CoinRequirement([getItemElement('Robes of Transcendance')], [
        {
            requirement: gameData.itemData['Robes of Transcendance'].getExpense() *
                100,
        },
    ]),
    'Prismatic Heart': new CoinRequirement([getItemElement('Prismatic Heart')], [
        {
            requirement: gameData.itemData['Prismatic Heart'].getExpense() * 100,
        },
    ]),
    'Throne of the Divines': new CoinRequirement([getItemElement('Throne of the Divines')], [
        {
            requirement: gameData.itemData['Throne of the Divines'].getExpense() *
                100,
        },
    ]),
};
tempData['requirements'] = {};
for (let key in gameData.requirements) {
    var requirement = gameData.requirements[key];
    tempData['requirements'][key] = requirement;
}
loadGameData();
initUI();
setCustomEffects();
addMultipliers();
setTab(jobTabButton, 'jobs');
update();
setInterval(update, 1000 / updateSpeed);
setInterval(saveGameData, 3000);
setInterval(setSkillWithLowestMaxXp, 1000);
//# sourceMappingURL=main.js.map
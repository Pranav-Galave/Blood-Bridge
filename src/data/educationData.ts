export interface CompatibilityProfile {
  bloodGroup: string;
  redCellsCanDonateTo: string[];
  redCellsCanReceiveFrom: string[];
  plasmaCanDonateTo: string[];
  plasmaCanReceiveFrom: string[];
  antigensPresent: string;
  antibodiesInPlasma: string;
  populationPercentageIndia: string;
  specialNotes: string;
}

export const BLOOD_COMPATIBILITY_PROFILES: Record<string, CompatibilityProfile> = {
  'O-': {
    bloodGroup: 'O-',
    redCellsCanDonateTo: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    redCellsCanReceiveFrom: ['O-'],
    plasmaCanDonateTo: ['O-'],
    plasmaCanReceiveFrom: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    antigensPresent: 'None on red blood cells',
    antibodiesInPlasma: 'Anti-A and Anti-B antibodies',
    populationPercentageIndia: '~1.4% (Very Rare)',
    specialNotes: 'Universal Red Blood Cell Donor! In extreme trauma and resuscitation when blood group cannot be tested in time, O- negative PRBCs are used to save lives.',
  },
  'O+': {
    bloodGroup: 'O+',
    redCellsCanDonateTo: ['O+', 'A+', 'B+', 'AB+'],
    redCellsCanReceiveFrom: ['O+', 'O-'],
    plasmaCanDonateTo: ['O+', 'O-'],
    plasmaCanReceiveFrom: ['O+', 'A+', 'B+', 'AB+'],
    antigensPresent: 'Rh (D) antigen only',
    antibodiesInPlasma: 'Anti-A and Anti-B antibodies',
    populationPercentageIndia: '~37.1% (Most Common)',
    specialNotes: 'Highest demand blood group in emergency trauma and general surgeries in India due to high population share.',
  },
  'A+': {
    bloodGroup: 'A+',
    redCellsCanDonateTo: ['A+', 'AB+'],
    redCellsCanReceiveFrom: ['A+', 'A-', 'O+', 'O-'],
    plasmaCanDonateTo: ['A+', 'A-', 'O+', 'O-'],
    plasmaCanReceiveFrom: ['A+', 'AB+'],
    antigensPresent: 'A antigen and Rh (D) antigen',
    antibodiesInPlasma: 'Anti-B antibodies',
    populationPercentageIndia: '~21.7%',
    specialNotes: 'Second most common group. Excellent donor for platelets and packed red cells.',
  },
  'A-': {
    bloodGroup: 'A-',
    redCellsCanDonateTo: ['A-', 'A+', 'AB-', 'AB+'],
    redCellsCanReceiveFrom: ['A-', 'O-'],
    plasmaCanDonateTo: ['A-', 'O-'],
    plasmaCanReceiveFrom: ['A-', 'A+', 'AB-', 'AB+'],
    antigensPresent: 'A antigen only (Rh negative)',
    antibodiesInPlasma: 'Anti-B antibodies',
    populationPercentageIndia: '~0.6% (Extremely Rare)',
    specialNotes: 'Rare negative group. Regular donation by A- donors is critical to maintain buffer reserves.',
  },
  'B+': {
    bloodGroup: 'B+',
    redCellsCanDonateTo: ['B+', 'AB+'],
    redCellsCanReceiveFrom: ['B+', 'B-', 'O+', 'O-'],
    plasmaCanDonateTo: ['B+', 'B-', 'O+', 'O-'],
    plasmaCanReceiveFrom: ['B+', 'AB+'],
    antigensPresent: 'B antigen and Rh (D) antigen',
    antibodiesInPlasma: 'Anti-A antibodies',
    populationPercentageIndia: '~32.5% (Very Common in Western India)',
    specialNotes: 'Very widely needed for ongoing oncology, thalassemia, and orthopedic procedures in Maharashtra.',
  },
  'B-': {
    bloodGroup: 'B-',
    redCellsCanDonateTo: ['B-', 'B+', 'AB-', 'AB+'],
    redCellsCanReceiveFrom: ['B-', 'O-'],
    plasmaCanDonateTo: ['B-', 'O-'],
    plasmaCanReceiveFrom: ['B-', 'B+', 'AB-', 'AB+'],
    antigensPresent: 'B antigen only (Rh negative)',
    antibodiesInPlasma: 'Anti-A antibodies',
    populationPercentageIndia: '~1.8% (Rare)',
    specialNotes: 'Rare blood type. Vital for Rh-negative maternity cases and scheduled surgeries.',
  },
  'AB+': {
    bloodGroup: 'AB+',
    redCellsCanDonateTo: ['AB+'],
    redCellsCanReceiveFrom: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    plasmaCanDonateTo: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    plasmaCanReceiveFrom: ['AB+'],
    antigensPresent: 'Both A and B antigens + Rh (D) antigen',
    antibodiesInPlasma: 'No Anti-A or Anti-B antibodies',
    populationPercentageIndia: '~7.7%',
    specialNotes: 'Universal Red Blood Cell Recipient! Also Universal Plasma Donor—AB+ plasma has no anti-A or anti-B antibodies and can be safely given to any patient.',
  },
  'AB-': {
    bloodGroup: 'AB-',
    redCellsCanDonateTo: ['AB-', 'AB+'],
    redCellsCanReceiveFrom: ['AB-', 'A-', 'B-', 'O-'],
    plasmaCanDonateTo: ['AB-', 'A-', 'B-', 'O-'],
    plasmaCanReceiveFrom: ['AB-', 'AB+'],
    antigensPresent: 'Both A and B antigens (Rh negative)',
    antibodiesInPlasma: 'No Anti-A or Anti-B antibodies',
    populationPercentageIndia: '~0.4% (Rarest of All)',
    specialNotes: 'The rarest blood type in India. Donors are maintained on emergency on-call registries.',
  },
};

export const DONATION_MYTHS_FACTS = [
  {
    myth: 'Donating blood makes you physically weak and reduces your immunity.',
    fact: 'Your body replaces fluid volume within 24–48 hours, and red blood cells within 3 to 4 weeks. It does not reduce your immune defenses; in fact, voluntary donation stimulates bone marrow to produce fresh blood cells.',
  },
  {
    myth: 'You can catch HIV or hepatitis by donating blood.',
    fact: 'Impossible. Every blood collection needle, blood bag, and kit is sterile, manufactured for single-use only, and immediately discarded in biohazard sharps containers. There is zero risk of contracting infections from donating.',
  },
  {
    myth: 'Blood donation is extremely painful and takes hours.',
    fact: 'The actual blood withdrawal takes only 8 to 10 minutes. The initial finger prick and needle insertion feel like a mild pinch for 2 seconds. The total visit, including screening and juice/refreshment, takes about 30–40 minutes.',
  },
  {
    myth: 'Vegetarians cannot donate blood because their hemoglobin is always too low.',
    fact: 'Thousands of healthy vegetarians and vegans donate regularly. Legumes, lentils, spinach, jaggery, nuts, and fortified grains provide ample bioavailable iron.',
  },
  {
    myth: 'People with high blood pressure or diabetes on medication can never donate.',
    fact: 'If your blood pressure is well-controlled (< 160/90 mmHg) and diabetes is controlled by oral diet/tablets without insulin or vascular complications, you are generally eligible after doctor screening.',
  },
];

export const HEMOGLOBIN_GUIDE_DATA = {
  overview:
    'Hemoglobin (Hb) is an iron-rich protein inside red blood cells that binds oxygen in the lungs and transports it throughout every vital organ and tissue in the body. It also carries carbon dioxide back to the lungs for exhalation.',
  normalRanges: [
    { group: 'Adult Men', range: '13.8 – 17.2 g/dL', minForDonation: '12.5 g/dL' },
    { group: 'Adult Women', range: '12.1 – 15.1 g/dL', minForDonation: '12.5 g/dL' },
    { group: 'Pregnant Women', range: '11.0 – 14.0 g/dL', minForDonation: 'Defer during pregnancy' },
    { group: 'Children (6–12 yrs)', range: '11.5 – 15.5 g/dL', minForDonation: 'N/A (Age 18+ required)' },
  ],
  causesOfLowHb: [
    'Iron deficiency anemia (nutritional lack or low absorption)',
    'Chronic or acute blood loss (menorrhagia, ulcers, hemorrhoids)',
    'Vitamin B12 or folic acid deficiency (macrocytic anemia)',
    'Bone marrow disorders or hemolytic conditions',
    'Chronic kidney or inflammatory diseases',
  ],
  dietarySources: [
    {
      category: 'Iron-Rich Plant Foods (Non-Heme)',
      items: ['Spinach, fenugreek (methi), drumstick leaves', 'Jaggery (gur), black raisins, dates, figs', 'Lentils (dal), chickpeas (chana), rajma, soybeans', 'Sesame seeds (til), pumpkin seeds, garden cress (halim)'],
      tip: 'Pair with Vitamin C (lemon juice, amla, oranges) to double iron absorption!',
    },
    {
      category: 'Vitamin B12 & Folate Sources',
      items: ['Milk, curd, paneer, and fortified plant milks', 'Eggs, poultry, and fish', 'Leafy greens, beetroot, peanuts, and whole grains'],
      tip: 'Vitamin B12 is essential for red cell maturation; vegetarians should monitor B12 levels regularly.',
    },
    {
      category: 'Absorption Inhibitors (Avoid with Meals)',
      items: ['Strong black tea and coffee (tannins bind iron)', 'Excess calcium supplements taken at the same meal as iron'],
      tip: 'Wait at least 45 minutes after meals before drinking tea or coffee.',
    },
  ],
  warningSymptoms: [
    'Persistent extreme fatigue, dizziness, or fainting spells',
    'Unusual shortness of breath during routine walking or stair climbing',
    'Unusually pale skin, pale conjunctiva under eyes, or brittle spooned nails (koilonychia)',
    'Rapid or irregular heartbeat (palpitations) at rest',
    'Cold hands and feet or restless legs syndrome',
  ],
};

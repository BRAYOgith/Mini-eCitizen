import { CategoryDefinition, ServiceCategory, PublicService, RequestPriority } from '@/types';

export const KENYA_COUNTIES = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo Marakwet', 'Embu', 'Garissa',
  'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi',
  'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos',
  'Makueni', 'Mandera', 'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a',
  'Nairobi', 'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri', 'Samburu',
  'Siaya', 'Taita Taveta', 'Tana River', 'Tharaka Nithi', 'Trans Nzoia', 'Turkana',
  'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
];

export const KENYA_ADMIN_STRUCTURE: Record<string, Record<string, string[]>> = {
  'Nairobi': {
    'Westlands': ['Kitisuru', 'Parklands/Highridge', 'Karura', 'Kangemi', 'Mountain View'],
    'Dagoretti North': ['Kilimani', 'Kawangware', 'Gatina', 'Kileleshwa', 'Kabiro'],
    'Dagoretti South': ['Mutu-ini', 'Ng\'ando', 'Riruta', 'Uthiru/Ruthimitu', 'Waithaka'],
    'Lang\'ata': ['Karen', 'Nairobi West', 'Mugumo-ini', 'South C', 'Nyayo Highrise'],
    'Kibra': ['Laini Saba', 'Lindi', 'Makina', 'Woodley/Kenyatta Golf Course', 'Sarang\'ombe'],
    'Roysambu': ['Githurai', 'Kahawa West', 'Zimmerman', 'Roysambu', 'Kahawa'],
    'Kasarani': ['Clay City', 'Mwiki', 'Kasarani', 'Njiru', 'Ruai'],
    'Ruaraka': ['Babadogo', 'Utalii', 'Mathare North', 'Lucky Summer', 'Korogocho'],
    'Embakasi South': ['Imara Daima', 'Kwa Njenga', 'Kwa Reuben', 'Pipeline', 'Kware'],
    'Embakasi North': ['Kariobangi North', 'Dandora Area I', 'Dandora Area II', 'Dandora Area III', 'Dandora Area IV'],
    'Embakasi Central': ['Kayole North', 'Kayole Central', 'Kayole South', 'Komarock', 'Matopeni/Spring Valley'],
    'Embakasi East': ['Upper Savanna', 'Lower Savanna', 'Embakasi', 'Utawala', 'Mihango'],
    'Embakasi West': ['Umoja I', 'Umoja II', 'Mowlem', 'Kariobangi South'],
    'Makadara': ['Maringo/Hamza', 'Viwandani', 'Harambee', 'Makongeni'],
    'Kamukunji': ['Pumwani', 'Eastleigh North', 'Eastleigh South', 'Airbase', 'California'],
    'Starehe': ['Nairobi Central', 'Ngara', 'Pangani', 'Ziwani/Kariokor', 'Landimawe', 'Nairobi South'],
    'Mathare': ['Hospital', 'Mabatini', 'Huruma', 'Ngei', 'Mlango Kubwa', 'Kiamaiko']
  },
  'Mombasa': {
    'Mvita': ['Mji wa Kale/Makadara', 'Tudor', 'Tononoka', 'Shimanzi/Ganjoni', 'Majengo'],
    'Nyali': ['Frere Town', 'Ziwa La Ng\'ombe', 'Mkomani', 'Kongowea', 'Kadzandani'],
    'Kisauni': ['Mjambere', 'Junda', 'Bamburi', 'Mwakirunge', 'Mtopanga', 'Magogoni', 'Shanzu'],
    'Changamwe': ['Port Reitz', 'Kipevu', 'Airport', 'Changamwe', 'Chaani'],
    'Jomvu': ['Jomvu Kuu', 'Miritini', 'Mikindani'],
    'Likoni': ['Mtongwe', 'Shika Adabu', 'Bofu', 'Likoni', 'Timbwani']
  },
  'Kiambu': {
    'Thika Town': ['Township', 'Kamenu', 'Hospital', 'Gatuanyaga', 'Ngoliba'],
    'Ruiru': ['Gitothua', 'Biashara', 'Gatongora', 'Kahawa/Sukari', 'Kahawa Wendani', 'Kiuu', 'Mwiki', 'Mwihoko'],
    'Kikuyu': ['Karai', 'Nachu', 'Sigona', 'Kikuyu', 'Kinoo'],
    'Limuru': ['Bibirioni', 'Limuru Central', 'Ndeiya', 'Limuru East', 'Ngecha Tigoni'],
    'Kiambu': ['Ting\'ang\'a', 'Ndumberi', 'Riabai', 'Township'],
    'Juja': ['Murera', 'Theta', 'Juja', 'Witeithie', 'Kalimoni'],
    'Kabete': ['Gitaru', 'Muguga', 'Nyadhuna', 'Kabete', 'Uthiru'],
    'Githunguri': ['Githunguri', 'Githiga', 'Ikinu', 'Ngewa', 'Komothai']
  },
  'Nakuru': {
    'Nakuru Town East': ['Biashara', 'Kivumbini', 'Flamingo', 'Menengai', 'Nakuru East'],
    'Nakuru Town West': ['Barut', 'London', 'Kaptembwo', 'Kapkures', 'Rhoda', 'Shaabab'],
    'Naivasha': ['Biashara', 'Hell\'s Gate', 'Lake View', 'Maiella', 'Mai Mahiu', 'Olkaria', 'Naivasha East'],
    'Molo': ['Mariashoni', 'Elburgon', 'Turi', 'Molo'],
    'Gilgil': ['Gilgil', 'Mwiting\'ithia', 'Elementaita', 'Malewa West', 'Murindat']
  },
  'Kisumu': {
    'Kisumu Central': ['Railways', 'Migosi', 'Shaurimoyo Kaloleni', 'Market Milimani', 'Kondele'],
    'Kisumu East': ['Kajulu', 'Kolwa East', 'Manyatta B', 'Nyalenda A', 'Kolwa Central'],
    'Kisumu West': ['South West Kisumu', 'Central Kisumu', 'Kisumu North', 'West Kisumu'],
    'Nyando': ['East Kano/Wawidhi', 'Awasi/Onjiko', 'Ahero', 'Kabonyo/Kanyagwal', 'Kobura'],
    'Muhoroni': ['Miwani', 'Ombeyi', 'Masogo/Nyang\'oma', 'Chemelil', 'Muhoroni/Koru']
  },
  'Uasin Gishu': {
    'Ainabkoi': ['Kapsoya', 'Kaptagat', 'Ainabkoi/Olare'],
    'Kapseret': ['Simat/Kapseret', 'Kipkenyo', 'Ngeria', 'Megun', 'Langas'],
    'Kesses': ['Racecourse', 'Cheptiret/Kipchamo', 'Tulwet/Chuiyat', 'Tarakwa'],
    'Moiben': ['Tembelio', 'Sergoit', 'Karuna/Meibeki', 'Moiben', 'Kimumu'],
    'Soy': ['Moi\'s Bridge', 'Kapsomba', 'Soy', 'Kuinet/Kapsuswa', 'Ziwa'],
    'Turbo': ['Ngenyilel', 'Tapsagoi', 'Kamagut', 'Kiplombe', 'Kapsaos', 'Huruma']
  },
  'Machakos': {
    'Machakos Town': ['Kalama', 'Mua', 'Mutituni', 'Machakos Central', 'Mumbuni North', 'Muvuti/Kiima-Kimwe'],
    'Mavoko': ['Athi River', 'Kinanie', 'Muthwani', 'Syokimau/Mulolongo'],
    'Kangundo': ['Kangundo North', 'Kangundo Central', 'Kangundo East', 'Kangundo West'],
    'Matungulu': ['Tala', 'Matungulu North', 'Matungulu East', 'Matungulu West', 'Kyeleni'],
    'Yatta': ['Ndalani', 'Matuu', 'Kithimani', 'Ikombe', 'Katangi']
  },
  'Kilifi': {
    'Kilifi North': ['Tezo', 'Sokoni', 'Kibarani', 'Dabaso', 'Matsangoni', 'Watamu', 'Mnarani'],
    'Kilifi South': ['Junju', 'Mwarakaya', 'Shimo la Tewa', 'Chasimba', 'Mtepeni'],
    'Malindi': ['Jilore', 'Kakuyuni', 'Ganda', 'Malindi Town', 'Shella'],
    'Magarini': ['Marafa', 'Magarini', 'Gongoni', 'Adu', 'Garashi', 'Sabaki']
  },
  'Kajiado': {
    'Kajiado North': ['Olkeri', 'Ongata Rongai', 'Nkaimurunya', 'Oloolua', 'Ngong'],
    'Kajiado East': ['Kitengela', 'Sholinke/Oloosirkon', 'Oloyiankalani', 'Kenyawa-Poka', 'Imaroro'],
    'Kajiado Central': ['Purko', 'Ildamat', 'Dalalekutuk', 'Matapato North', 'Matapato South'],
    'Kajiado West': ['Keekonyokie', 'Iloodokilani', 'Magadi', 'Ewuaso Oonkidong\'i', 'Mosiro']
  },
  'Garissa': {
    'Garissa Township': ['Waberi', 'Galbet', 'Township', 'Iftin'],
    'Balambala': ['Balambala', 'Danyere', 'Jara Jara', 'Saka', 'Sankuri'],
    'Lagdera': ['Modogarshi', 'Benane', 'Goreale', 'Maalamin', 'Sabena'],
    'Dadaab': ['Dertu', 'Dadaab', 'Labasigale', 'Damajale', 'Liboi', 'Abakaile']
  },
  'Nyeri': {
    'Nyeri Town': ['Kiganjo/Mathari', 'Rware', 'Gatitu/Muruguru', 'Ruring\'u', 'Kamakwa/Mukaro'],
    'Tetu': ['Dedan Kimathi', 'Wamagana', 'Aguthi-Gaaki'],
    'Kieni': ['Mweiga', 'Narumoru', 'Gakawa', 'Endarasha/Mwiyogo', 'Mugunda'],
    'Mathira': ['Ruguru', 'Magutu', 'Iria-Ini', 'Kirimukuyu', 'Karatina Town']
  },
  'Kakamega': {
    'Lurambi': ['Butsotso East', 'Butsotso South', 'Butsotso Central', 'Sheywe', 'Mahiakalo', 'Shirere'],
    'Mumias West': ['Mumias Central', 'Mumias North', 'Etenje', 'Musanda'],
    'Ikolomani': ['Idakho South', 'Idakho East', 'Idakho North', 'Idakho Central'],
    'Shinyalu': ['Isukha North', 'Isukha Central', 'Isukha South', 'Isukha East']
  },
  'Kisii': {
    'Kitutu Chache South': ['Bogusero', 'Bogeka', 'Nyakoe', 'Kitutu Central', 'Nyatieko'],
    'Nyaribari Chache': ['Bobaracho', 'Kisii Central', 'Keumbu', 'Kiogoro', 'Birongo', 'Ibeno'],
    'Bonchari': ['Bomariba', 'Bogiakumu', 'Bokeira', 'Riana']
  },
  'Murang\'a': {
    'Kiharu': ['Wangu', 'Mugoiri', 'Mbiri', 'Township', 'Murarandia', 'Gaturi'],
    'Maragua': ['Kimorori/Wempa', 'Makuyu', 'Kambiti', 'Kamahuha', 'Ichagaki', 'Nginda'],
    'Kandara': ['Ng\'araria', 'Muruka', 'Kagundu-Ini', 'Gaichanjiru', 'Ithiru', 'Ruchu']
  }
};

export function getSubCountiesForCounty(county: string): string[] {
  if (KENYA_ADMIN_STRUCTURE[county]) {
    return Object.keys(KENYA_ADMIN_STRUCTURE[county]);
  }
  return [
    `${county} Central`,
    `${county} North`,
    `${county} South`,
    `${county} East`,
    `${county} West`
  ];
}

export function getWardsForSubCounty(county: string, subCounty: string): string[] {
  if (KENYA_ADMIN_STRUCTURE[county] && KENYA_ADMIN_STRUCTURE[county][subCounty]) {
    return KENYA_ADMIN_STRUCTURE[county][subCounty];
  }
  return [
    `${subCounty} Ward 1 (Township)`,
    `${subCounty} Ward 2 (Central)`,
    `${subCounty} Ward 3 (Commercial)`,
    `${subCounty} Ward 4 (Residential)`
  ];
}

export const CATEGORY_DEFAULT_HEADLINES: Record<ServiceCategory, string> = {
  STREETLIGHT: 'Faulty / Non-functional Streetlight & Public Lighting Pole',
  WATER: 'Burst Main Pipeline & Severe Clean Water Supply Outage',
  GARBAGE: 'Uncollected Solid Municipal Waste & Illegal Dumping Mound',
  ROAD: 'Dangerous Tarmac Potholes & Degraded Road Surface Hazard',
  SEWERAGE: 'Burst Raw Sewage Mainline & Severe Drainage Overflow',
  PUBLIC_HEALTH: 'Open Wastewater Hazard & Environmental Public Health Risk',
  OTHER: 'Public Community Service Request & Infrastructure Notice'
};

export function calculateSmartSeverity(
  category: ServiceCategory,
  text: string = ''
): {
  priority: RequestPriority;
  label: string;
  department: string;
  estimatedResolutionDays: number;
  reason: string;
} {
  const lower = text.toLowerCase();
  const criticalKeywords = ['fire', 'spark', 'electrocution', 'child', 'hospital', 'collapse', 'toxic', 'poison', 'fatal', 'drowning', 'cholera'];
  const isCriticalTrigger = criticalKeywords.some(k => lower.includes(k));

  if (isCriticalTrigger) {
    return {
      priority: 'EMERGENCY',
      label: 'Emergency (Immediate Intervention)',
      department: 'Disaster Risk Management & Emergency Unit',
      estimatedResolutionDays: 1,
      reason: 'Urgent risk factors detected in description requiring immediate rapid intervention.'
    };
  }

  switch (category) {
    case 'SEWERAGE':
      return {
        priority: 'EMERGENCY',
        label: 'Emergency Severity',
        department: 'County Sewerage & Sanitation Directorate',
        estimatedResolutionDays: 1,
        reason: 'Raw sewage overflow is classified as an immediate biological contamination hazard under Public Health Act (Cap 242).'
      };

    case 'PUBLIC_HEALTH':
      return {
        priority: 'HIGH',
        label: 'High Severity',
        department: 'Directorate of Public Health & Sanitation',
        estimatedResolutionDays: 2,
        reason: 'Disease vector risk requires prioritized on-site inspection within 24 to 48 hours.'
      };

    case 'WATER':
      return {
        priority: 'HIGH',
        label: 'High Severity',
        department: 'Water & Sewerage Operations Company',
        estimatedResolutionDays: 1,
        reason: 'Treated water resource loss and road erosion damage requires urgent valve isolation.'
      };

    case 'ROAD':
      return {
        priority: 'MEDIUM',
        label: 'Medium Severity',
        department: 'Kenya Urban Roads Authority (KURA) & County Transport',
        estimatedResolutionDays: 4,
        reason: 'Pothole repairs are routed to scheduled civil maintenance asphalt patch crews.'
      };

    case 'STREETLIGHT':
      return {
        priority: 'MEDIUM',
        label: 'Medium Severity',
        department: 'Directorate of Public Works & Energy',
        estimatedResolutionDays: 2,
        reason: 'Pedestrian illumination and electrical safety routed to sub-county electrical line team.'
      };

    case 'GARBAGE':
      return {
        priority: 'MEDIUM',
        label: 'Medium Severity',
        department: 'Department of Environment & Waste Management',
        estimatedResolutionDays: 2,
        reason: 'Solid waste refuse collection dispatched on regular municipal truck routing.'
      };

    case 'OTHER':
    default:
      if (lower.includes('flood') || lower.includes('danger') || lower.includes('wire')) {
        return {
          priority: 'HIGH',
          label: 'High Severity',
          department: 'Public Works Rapid Response Desk',
          estimatedResolutionDays: 2,
          reason: 'Escalated priority based on elevated community risk keywords.'
        };
      }
      return {
        priority: 'LOW',
        label: 'Standard Municipal Priority',
        department: 'County Public Service Coordination Desk',
        estimatedResolutionDays: 3,
        reason: 'Standard community service inquiry or infrastructure request.'
      };
  }
}

export const SERVICE_CATEGORIES: CategoryDefinition[] = [
  {
    id: 'STREETLIGHT',
    label: 'Broken Streetlight & Lighting',
    description: 'Report non-functioning, flickering, or physically damaged street lamps and public illumination poles.',
    department: 'Directorate of Public Works & Energy',
    iconName: 'Lightbulb',
    estimatedResolutionDays: 2
  },
  {
    id: 'WATER',
    label: 'Water Leakage & Supply Issue',
    description: 'Report burst main pipelines, water contamination, low water pressure, or persistent municipal water outages.',
    department: 'Water and Sewerage Company',
    iconName: 'Droplet',
    estimatedResolutionDays: 1
  },
  {
    id: 'GARBAGE',
    label: 'Garbage Collection & Waste',
    description: 'Request municipal refuse removal, report missed neighborhood trash pickup or illegal roadside dumping mounds.',
    department: 'Department of Environment & Sanitation',
    iconName: 'Trash2',
    estimatedResolutionDays: 2
  },
  {
    id: 'ROAD',
    label: 'Potholes & Road Surface Damage',
    description: 'Report dangerous potholes, cracked tarmac, missing drainage gratings, or degraded municipal road surfaces.',
    department: 'Kenya Urban Roads Authority / County Transport',
    iconName: 'AlertTriangle',
    estimatedResolutionDays: 4
  },
  {
    id: 'SEWERAGE',
    label: 'Blocked Sewerage & Storm Drainage',
    description: 'Report overflowing sewer lines, blocked drainage culverts causing flooding, or damaged storm drains.',
    department: 'County Sewerage & Sanitation Services',
    iconName: 'Waves',
    estimatedResolutionDays: 1
  },
  {
    id: 'PUBLIC_HEALTH',
    label: 'Public Health Nuisance & Hazards',
    description: 'Report open wastewater hazards, stagnant mosquito breeding pools, or environmental health compliance issues.',
    department: 'Public Health Inspection Directorate',
    iconName: 'ShieldAlert',
    estimatedResolutionDays: 2
  },
  {
    id: 'OTHER',
    label: 'Other Public Service Request',
    description: 'Report other civic issues, damaged parks, fallen branches, noise nuisances, or general municipal needs.',
    department: 'Public Service Coordination Desk',
    iconName: 'HelpCircle',
    estimatedResolutionDays: 3
  }
];

export function getCategoryDefinition(id: ServiceCategory): CategoryDefinition {
  const found = SERVICE_CATEGORIES.find(c => c.id === id);
  if (found) return found;
  return {
    id: 'OTHER',
    label: 'General Municipal Service Request',
    description: 'General community service inquiry or infrastructure report.',
    department: 'Public Service Coordination Desk',
    iconName: 'HelpCircle',
    estimatedResolutionDays: 3
  };
}

export const OFFICIAL_SERVICES: PublicService[] = [
  {
    id: 'dci-good-conduct',
    name: 'Police Clearance Certificate',
    code: 'DCI-PCC-01',
    agencyName: 'Directorate of Criminal Investigations (DCI)',
    agencyCode: 'DCI',
    description: 'Report municipal community safety concerns or request official clearance verification.',
    category: 'PUBLIC_HEALTH',
    categoryLabel: 'Public Safety & Clearance',
    iconName: 'Award',
    statutoryFee: 1050,
    processingDays: 2,
    logoUrl: '/logos/dci.png'
  },
  {
    id: 'ntsa-driving-license',
    name: 'Road Infrastructure & Traffic Safety',
    code: 'NTSA-RDS-01',
    agencyName: 'National Transport and Safety Authority (NTSA)',
    agencyCode: 'NTSA',
    description: 'Report degraded road furniture, potholes, damaged highway guardrails, and traffic light faults.',
    category: 'ROAD',
    categoryLabel: 'Road Infrastructure & Hazards',
    iconName: 'CreditCard',
    statutoryFee: 750,
    processingDays: 3,
    logoUrl: '/logos/ntsa.png'
  },
  {
    id: 'crs-birth-cert',
    name: 'Civil Status & Public Health Registry',
    code: 'CRS-REG-01',
    agencyName: 'Department of Civil Registration (CRS)',
    agencyCode: 'CRS',
    description: 'Register vital events and access community civil status documentation support.',
    category: 'OTHER',
    categoryLabel: 'Civil Registration Services',
    iconName: 'Users',
    statutoryFee: 150,
    processingDays: 1,
    logoUrl: '/logos/crs.png'
  },
  {
    id: 'immigration-passport',
    name: 'Public Pass & Regional Border Clearance',
    code: 'DIS-PAS-01',
    agencyName: 'Department of Immigration Services',
    agencyCode: 'DIS',
    description: 'Access regional travel documentation and cross-county service identification.',
    category: 'OTHER',
    categoryLabel: 'Immigration & Border Services',
    iconName: 'BookOpen',
    statutoryFee: 4550,
    processingDays: 5,
    logoUrl: '/logos/immigration.png'
  },
  {
    id: 'brs-business-name',
    name: 'County Business Licensing & Commercial Refuse',
    code: 'BRS-BN-01',
    agencyName: 'Business Registration Service (BRS)',
    agencyCode: 'BRS',
    description: 'Register enterprise trade names and coordinate municipal commercial refuse collection.',
    category: 'GARBAGE',
    categoryLabel: 'Commercial Waste & Trade Permitting',
    iconName: 'Briefcase',
    statutoryFee: 950,
    processingDays: 1,
    logoUrl: '/logos/brs.png'
  }
];

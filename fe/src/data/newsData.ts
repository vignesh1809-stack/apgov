import newsWater from '../assets/news_water.png';
import newsEducation from '../assets/news_education.png';
import resolvedRoad from '../assets/resolved_road.png';
import resolvedStreetlight from '../assets/resolved_streetlight.png';

export interface NewsItem {
  id: string;
  scope: 'village' | 'constituency';
  category: {
    en: string;
    te: string;
  };
  accentColor: string;
  bgColor: string;
  icon: string;
  readTime: string;
  views: string;
  likes: number;
  date: {
    en: string;
    te: string;
  };
  location: {
    en: string;
    te: string;
  };
  projectStatus: 'Planning' | 'Approved' | 'Execution' | 'Completed';
  budget: string;
  beneficiaries: string;
  title: {
    en: string;
    te: string;
  };
  content: {
    en: string[];
    te: string[];
  };
  quote: {
    author: {
      en: string;
      te: string;
    };
    text: {
      en: string;
      te: string;
    };
  };
  image: string;
}

export const newsData: NewsItem[] = [
  {
    id: 'transformer-replacement',
    scope: 'village',
    category: { en: 'Electricity', te: 'విద్యుత్' },
    accentColor: '#CC9900',
    bgColor: '#fffde7',
    icon: 'ti ti-bolt',
    readTime: '2 min read',
    views: '1,240 reads',
    likes: 185,
    date: { en: '3 hours ago', te: '3 గంటల క్రితం' },
    location: { en: 'Kuppam Town', te: 'కుప్పం టౌన్' },
    projectStatus: 'Approved',
    budget: '₹8.5 Lakhs',
    beneficiaries: '350+ households',
    image: resolvedStreetlight,
    title: {
      en: 'Transformer replacement at Ward 4 tomorrow 9 am — 1 pm power cut',
      te: 'రేపు వార్డు 4లో ట్రాన్స్‌ఫార్మర్ మార్పిడి — ఉదయం 9 నుండి మధ్యాహ్నం 1 గంటల వరకు విద్యుత్ సరఫరా నిలిపివేత'
    },
    content: {
      en: [
        'To resolve recurring low voltage complaints and frequent tripping in Ward 4, the Electricity Department has approved the installation of a brand new high-capacity 250 KVA transformer. The new equipment will replace the aging transformer currently operating at maximum load limits.',
        'Citizens are advised that there will be a scheduled power outage tomorrow from 9:00 AM to 1:00 PM to facilitate the technical installation and safety tests. Power supply will be restored immediately after testing is completed. We request residents to plan accordingly.'
      ],
      te: [
        'వార్డు 4లో పదేపదే తలెత్తుతున్న తక్కువ వోల్టేజ్ సమస్యలు మరియు తరచూ కరెంట్ పోవడాన్ని పరిష్కరించడానికి, విద్యుత్ శాఖ సరికొత్త అధిక-సామర్థ్యం గల 250 KVA ట్రాన్స్‌ఫార్మర్ వ్యవస్థాపనకు ఆమోదం తెలిపింది. ప్రస్తుతం గరిష్ట లోడ్ పరిమితి వద్ద నడుస్తున్న పాత ట్రాన్స్‌ఫార్మర్ స్థానంలో ఈ కొత్త పరికరాలు రానున్నాయి.',
        'సాంకేతిక సంస్థాపన మరియు భద్రతా పరీక్షలను సులభతరం చేయడానికి రేపు ఉదయం 9:00 గంటల నుండి మధ్యాహ్నం 1:00 గంటల వరకు విద్యుత్ సరఫరా నిలిపివేయబడుతుందని పౌరులకు తెలియజేయడమైనది. పరీక్షలు పూర్తయిన వెంటనే విద్యుత్ సరఫరా పునరుద్ధరించబడుతుంది. నివాసితులు దీనికి అనుగుణంగా ప్రణాళిక వేసుకోవాలని కోరుతున్నాము.'
      ]
    },
    quote: {
      author: {
        en: 'Assistant Engineer, Kuppam Power Grid',
        te: 'సహాయక ఇంజనీర్, కుప్పం పవర్ గ్రిడ్'
      },
      text: {
        en: '"This high-capacity replacement will offer long-term voltage stability for over 350 families in Ward 4. We appreciate your cooperation during the 4-hour installation process."',
        te: '"ఈ అధిక-సామర్థ్య మార్పిడి వార్డు 4లోని 350 కి పైగా కుటుంబాలకు దీర్ఘకాలిక వోల్టేజ్ స్థిరత్వాన్ని అందిస్తుంది. ఈ 4 గంటల సంస్థాపన ప్రక్రియలో మీ సహకారానికి ధన్యవాదాలు."'
      }
    }
  },
  {
    id: 'borewell-repair',
    scope: 'village',
    category: { en: 'Water', te: 'నీరు' },
    accentColor: '#16a34a',
    bgColor: '#f0fdf4',
    icon: 'ti ti-droplet',
    readTime: '3 min read',
    views: '2,150 reads',
    likes: 312,
    date: { en: 'Yesterday', te: 'నిన్న' },
    location: { en: 'Kuppam Town', te: 'కుప్పం టౌన్' },
    projectStatus: 'Completed',
    budget: '₹3.2 Lakhs',
    beneficiaries: '1,200+ residents',
    image: newsWater,
    title: {
      en: 'Borewell repair at Ward 4 completed — normal supply restored from today',
      te: 'వార్డు 4లో బోర్‌వెల్ మరమ్మతు పూర్తి — నేటి నుండి సాధారణ సరఫరా పునరుద్ధరణ'
    },
    content: {
      en: [
        'Following complaints of water disruption due to pump blockage, emergency repairs were commissioned at the primary Ward 4 community borewell. A specialized team worked overnight to clean the underground silt and replace the damaged submersible pump motor.',
        'Quality inspection team verified that water pressure and cleanliness indicators are back to optimal levels. Regular piped drinking water supply has been fully restored from this morning.'
      ],
      te: [
        'పంప్ బ్లాకేజ్ వల్ల నీటి సరఫరా నిలిచిపోవడంపై వచ్చిన ఫిర్యాదుల నేపథ్యంలో, వార్డు 4 ప్రాథమిక కమ్యూనిటీ బోర్‌వెల్ వద్ద అత్యవసర మరమ్మతులు ప్రారంభించబడ్డాయి. దెబ్బతిన్న సబ్‌మెర్సిబుల్ పంప్ మోటారును మార్చడానికి మరియు భూగర్భ మట్టిని శుభ్రం చేయడానికి ఒక ప్రత్యేక బృందం రాత్రిపూట పనిచేసింది.',
        'నీటి ఒత్తిడి మరియు పరిశుభ్రత సూచికలు సరైన స్థాయికి చేరుకున్నాయని నాణ్యత తనిఖీ బృందం ధృవీకరించింది. ఈ ఉదయం నుండి సాధారణ పైప్‌లైన్ తాగునీటి సరఫరా పూర్తిగా పునరుద్ధరించబడింది.'
      ]
    },
    quote: {
      author: {
        en: 'Kuppam Municipal Water Works Dept',
        te: 'కుప్పం మున్సిపల్ వాటర్ వర్క్స్ విభాగం'
      },
      text: {
        en: '"We deployed emergency teams immediately upon receiving the grievance. The replacement motor has a 3-year warranty ensuring uninterrupted supply going forward."',
        te: '"ఫిర్యాదు వచ్చిన వెంటనే మేము అత్యవసర బృందాలను రంగంలోకి దించాము. కొత్తగా ఏర్పాటు చేసిన మోటారుకు 3 సంవత్సరాల వారంటీ ఉంది, ఇది నిరంతర సరఫరాను నిర్ధారిస్తుంది."'
      }
    }
  },
  {
    id: 'pothole-patching',
    scope: 'village',
    category: { en: 'Roads', te: 'రహదారులు' },
    accentColor: '#3b82f6',
    bgColor: '#eff6ff',
    icon: 'ti ti-road',
    readTime: '3 min read',
    views: '1,890 reads',
    likes: 245,
    date: { en: '2 days ago', te: '2 రోజుల క్రితం' },
    location: { en: 'Kuppam Town', te: 'కుప్పం టౌన్' },
    projectStatus: 'Execution',
    budget: '₹14.5 Lakhs',
    beneficiaries: 'Daily Commuters',
    image: resolvedRoad,
    title: {
      en: 'Pothole patching on Main Street begins Monday — expect minor delays',
      te: 'సోమవారం నుండి మెయిన్ స్ట్రీట్‌లో గుంతల మరమ్మతులు ప్రారంభం — స్వల్ప ఆలస్యం ఉండవచ్చు'
    },
    content: {
      en: [
        'The local administration has announced the commencement of comprehensive road repairs and pothole patching along the Main Street commercial stretch. Work will cover a 1.8km sector starting from the government hospital junction to the weekly market terminal.',
        'To minimize traffic congestion, repairs will be executed in phases. Heavy commercial transport vehicles are recommended to use bypass routes, and local police will assist in manual traffic direction during morning peak hours.'
      ],
      te: [
        'మెయిన్ స్ట్రీట్ వ్యాపార రహదారి గుండా సమగ్ర రోడ్డు మరమ్మతులు మరియు గుంతల పనులను ప్రారంభించనున్నట్లు స్థానిక యంత్రాంగం ప్రకటించింది. ప్రభుత్వ ఆసుపత్రి జంక్షన్ నుండి వారాంతపు సంత టెర్మినల్ వరకు 1.8 కి.మీ మేర ఈ పనులు సాగనున్నాయి.',
        'ట్రాఫిక్ ఇబ్బందులను తగ్గించడానికి, మరమ్మతులు వివిధ దశల్లో నిర్వహించబడతాయి. భారీ రవాణా వాహనాలు బైపాస్ మార్గాలను ఉపయోగించాలని సూచించడమైనది. ఉదయం వేళల్లో ట్రాఫిక్ క్రమబద్ధీకరణకు స్థానిక పోలీసులు సహాయం అందిస్తారు.'
      ]
    },
    quote: {
      author: {
        en: 'Sub-Divisional Roads Engineer',
        te: 'సబ్ డివిజనల్ రోడ్ల ఇంజనీర్'
      },
      text: {
        en: '"Our target is to complete hot-mix asphalt patching before monsoon rains arrive. We thank local merchants and commuters for their patience."',
        te: '"వర్షాకాలం ప్రారంభం కాకముందే హాట్-మిక్స్ తారు పనులను పూర్తి చేయడమే మా లక్ష్యం. స్థానిక వ్యాపారులు, ప్రయాణికులు సహకరించాలని కోరుతున్నాము."'
      }
    }
  },
  {
    id: 'dengue-awareness',
    scope: 'village',
    category: { en: 'Health', te: 'ఆరోగ్యం' },
    accentColor: '#dc2626',
    bgColor: '#fef2f2',
    icon: 'ti ti-first-aid-kit',
    readTime: '2 min read',
    views: '920 reads',
    likes: 110,
    date: { en: '3 days ago', te: '3 రోజుల క్రితం' },
    location: { en: 'Kuppam Town', te: 'కుప్పం టౌన్' },
    projectStatus: 'Planning',
    budget: '₹1.2 Lakhs',
    beneficiaries: 'Entire Ward',
    image: resolvedRoad, // fallback
    title: {
      en: 'PHC dengue awareness drive this Saturday morning at your ward',
      te: 'ఈ శనివారం ఉదయం మీ వార్డులో పీహెచ్‌సీ డెంగ్యూ అవగాహన कार्यक्रम'
    },
    content: {
      en: [
        'In response to the onset of the seasonal rainy period, the Primary Health Center (PHC) is launching a comprehensive public health and anti-larval sanitation campaign. Healthcare volunteers will conduct door-to-door dry-day checks and distribute educational safety leaflets.',
        'Free distribution of domestic abatement oil and basic mosquito nets will take place from the central community hall. We encourage active participation of youth clubs to clean stagnant water pockets in surrounding streets.'
      ],
      te: [
        'వర్షాకాలం ప్రారంభం కావడంతో, ప్రాథమిక ఆరోగ్య కేంద్రం (PHC) సమగ్ర ప్రజారోగ్య మరియు దోమల నివారణ కార్యక్రమాన్ని ప్రారంభించనుంది. ఆరోగ్య వాలంటీర్లు ఇంటింటికీ తిరిగి అవగాహన కల్పిస్తారు మరియు భద్రతా కరపత్రాలను పంపిణీ చేస్తారు.',
        'స్థానిక కమ్యూనిటీ హాల్ నుండి ఉచిత దోమల నివారణ మందులు మరియు దోమతెరల పంపిణీ జరుగుతుంది. వీధుల్లో నిలిచిన నీటిని తొలగించే పనుల్లో యువజన సంఘాలు చురుగ్గా పాల్గొనాలని కోరుతున్నాము.'
      ]
    },
    quote: {
      author: {
        en: 'Medical Officer, Kuppam PHC',
        te: 'వైద్యాధికారి, కుప్పం పి.హెచ్.సి'
      },
      text: {
        en: '"Prevention is our strongest shield against mosquito-borne infections. Simple acts like maintaining dry containers can protect the whole family."',
        te: '"దోమల ద్వారా వ్యాపించే ఇన్ఫెక్షన్లపై నివారణే మన బలమైన ఆయుధం. మన परिసరాలను పొడిగా ఉంచుకోవడం ద్వారా మొత్తం కుటుంబాన్ని రక్షించుకోవచ్చు."'
      }
    }
  },
  {
    id: 'bypass-repair',
    scope: 'constituency',
    category: { en: 'Infrastructure', te: 'మౌలిక సదుపాయాలు' },
    accentColor: '#CC9900',
    bgColor: '#fffde7',
    icon: 'ti ti-road',
    readTime: '4 min read',
    views: '3,450 reads',
    likes: 540,
    date: { en: '4 hours ago', te: '4 గంటల క్రితం' },
    location: { en: 'Kuppam Bypass', te: 'కుప్పం బైపాస్' },
    projectStatus: 'Execution',
    budget: '₹2.8 Crores',
    beneficiaries: 'Constituency Transit',
    image: resolvedRoad,
    title: {
      en: 'NH-40 bypass road repair begins — completion expected in 2 weeks',
      te: 'ఎన్‌హెచ్-40 బైపాస్ రోడ్డు మరమ్మతులు ప్రారంభం — 2 వారాల్లో పూర్తి కావచ్చు'
    },
    content: {
      en: [
        'National Highway Authority has sanctioned the restructuring and structural repairs of the NH-40 Kuppam Bypass road. The project will reconstruct weak road beds, build reinforced side drains to prevent water logging, and place premium wear-resistant bituminous top coats.',
        'Machinery has been mobilized on site, and foundation strengthening has started. This bypass is crucial for heavy inter-district transport, and the modernization will significantly reduce traffic pressure inside Kuppam town.'
      ],
      te: [
        'జాతీయ రహదారుల సంస్థ ఎన్‌హెచ్-40 కుప్పం బైపాస్ రహదారి పునర్నిర్మాణానికి మరియు నిర్మాణ మరమ్మతులకు అనుమతి ఇచ్చింది. బలహీనమైన రోడ్డు పునాదులను పునర్నిర్మించడం, నీరు నిలవకుండా ఉండటానికి కాంక్రీట్ డ్రైన్లను నిర్మించడం ఈ ప్రాజెక్ట్ యొక్క ముఖ్య ఉద్దేశ్యం.',
        'యంత్రాలు సంఘటనా స్థలానికి చేరుకున్నాయి, పునాదిని బలోపేతం చేసే పనులు ప్రారంభమయ్యాయి. అంతర్-జిల్లా రవాణాకు ఈ బైపాస్ చాలా కీలకం, దీని పూర్తితో కుప్పం పట్టణంలో ట్రాఫిక్ ఒత్తిడి గణనీయంగా తగ్గుతుంది.'
      ]
    },
    quote: {
      author: {
        en: 'Project Director, NHAI',
        te: 'ప్రాజెక్ట్ డైరెక్టర్, ఎన్.హెచ్.ఎ.ఐ'
      },
      text: {
        en: '"With modern bitumastic materials, this bypass will easily handle long-term heavy vehicle load. We target full completion within 15 working days."',
        te: '"ఆధునిక తారు మెటీరియల్స్ ఉపయోగించడం వల్ల, ఈ బైపాస్ భారీ లోడ్‌లను సులభంగా తట్టుకోగలదు. రాబోయే 15 పని దినాలలో ఈ పనులు పూర్తి చేయాలని లక్ష్యంగా పెట్టుకున్నాము."'
      }
    }
  },
  {
    id: 'health-camp',
    scope: 'constituency',
    category: { en: 'Health', te: 'ఆరోగ్యం' },
    accentColor: '#16a34a',
    bgColor: '#f0fdf4',
    icon: 'ti ti-first-aid-kit',
    readTime: '3 min read',
    views: '2,800 reads',
    likes: 420,
    date: { en: 'Yesterday', te: 'నిన్న' },
    location: { en: 'Ramakuppam PHC', te: 'రామకుప్పం పీహెచ్‌సీ' },
    projectStatus: 'Approved',
    budget: '₹4.5 Lakhs',
    beneficiaries: '3,000+ residents',
    image: newsWater, // fallback
    title: {
      en: 'Free health camp at Ramakuppam PHC this Saturday — all residents welcome',
      te: 'ఈ శనివారం రామకుప్పం పీహెచ్‌సీలో ఉచిత ఆరోగ్య శిబిరం — ప్రజలందరికీ ఆమోదం'
    },
    content: {
      en: [
        'A comprehensive multi-specialty free health camp is being organized at the Ramakuppam Primary Health Center on Saturday. Eminent cardiologists, pediatricians, gynecologists, and general physicians from Tirupati Specialty Hospitals will be conducting checkups.',
        'Free diagnostics including blood sugar, blood pressure, ECG, and basic laboratory investigations will be available on the spot. Free medicines will be distributed to patients as prescribed by the medical team.'
      ],
      te: [
        'రామకుప్పం ప్రాథమిక ఆరోగ్య కేంద్రంలో శనివారం సమగ్ర ఉచిత ఆరోగ్య శిబిరం ఏర్పాటు చేయబడింది. తిరుపతి సూపర్ స్పెషాలిటీ ఆసుపత్రుల నుండి నిపుణులైన కార్డియాలజిస్టులు, పీడియాట్రీషియన్లు, గైనకాలజిస్టులు పరీక్షలు నిర్వహిస్తారు.',
        'షుగర్, బీపీ, ఈసీజీ సహా ఉచిత నిర్ధారణ పరీక్షలు ఆన్-ది-స్పాట్ లభిస్తాయి. వైద్య బృందం సూచించిన విధంగా రోగులకు ఉచితంగా మందులు పంపిణీ చేయబడతాయి.'
      ]
    },
    quote: {
      author: {
        en: 'MLA Welfare Coordinator, Kuppam Office',
        te: 'ఎమ్మెల్యే సంక్షేమ సమన్వయకర్త, కుప్పం కార్యాలయం'
      },
      text: {
        en: '"Ensuring quality healthcare reaches every rural household is our priority. I urge all residents of Ramakuppam and nearby villages to utilize this camp."',
        te: '"నాణ్యమైన వైద్య సేవలు ప్రతి గ్రామీణ నివాసికి అందేలా చూడటమే మా ప్రాధాన్యత. రామకుప్పం మరియు సమీప గ్రామాల ప్రజలు ఈ శిబిరాన్ని సద్వినియోగం చేసుకోవాలని కోరుతున్నాము."'
      }
    }
  },
  {
    id: 'school-classrooms',
    scope: 'constituency',
    category: { en: 'Education', te: 'విద్య' },
    accentColor: '#3b82f6',
    bgColor: '#eff6ff',
    icon: 'ti ti-school',
    readTime: '3 min read',
    views: '2,400 reads',
    likes: 385,
    date: { en: '3 days ago', te: '3 రోజుల క్రితం' },
    location: { en: 'Gudupalli Govt School', te: 'గుడుపల్లి ప్రభుత్వ పాఠశాల' },
    projectStatus: 'Completed',
    budget: '₹42 Lakhs',
    beneficiaries: '120+ students',
    image: newsEducation,
    title: {
      en: 'New classrooms inaugurated at Gudupalli Govt School — 120 students benefit',
      te: 'గుడుపల్లి ప్రభుత్వ పాఠశాలలో కొత్త తరగతి గదుల ప్రారంభం — 120 మంది విద్యార్థులకు లబ్ధి'
    },
    content: {
      en: [
        'Under the Nadu-Nedu infrastructure development program, four newly constructed high-end digital classrooms have been inaugurated at the Gudupalli Government High School. Each classroom is equipped with interactive smart boards, dual-desk seating, and modern ceiling acoustics.',
        'The project also renovated the central school laboratory and established a dedicated computers cabin. This initiative will provide local children access to modern learning tools, bridging the digital gap in public education.'
      ],
      te: [
        'నాడు-నేడు మౌలిక వసతుల అభివృద్ధి కార్యక్రమం కింద గుడుపల్లి ప్రభుత్వ ఉన్నత పాఠశాలలో కొత్తగా నిర్మించిన నాలుగు డిజిటల్ తరగతి గదులు ప్రారంభించబడ్డాయి. ప్రతి తరగతి గదిలో ఇంటరాక్టివ్ స్మార్ట్ బోర్డులు, డ్యూయల్-డెస్క్ సీటింగ్ సౌకర్యాలు ఉన్నాయి.',
        'ఈ ప్రాజెక్ట్ కింద పాఠశాల కంప్యూటర్ల ల్యాబ్‌ను కూడా పునర్నిర్మించారు. ఈ చొరవ స్థానిక పిల్లలకు ఆధునిక విద్యా సాధనాలను పరిచయం చేస్తుంది, ప్రభుత్వ విద్యలో డిజిటల్ అంతరాన్ని తగ్గిస్తుంది.'
      ]
    },
    quote: {
      author: {
        en: 'Headmaster, Gudupalli High School',
        te: 'ప్రధానోపాధ్యాయులు, గుడుపల్లి ఉన్నత పాఠశాల'
      },
      text: {
        en: '"Our students are thrilled with these smart learning environments. We have seen a significant rise in attendance and enthusiasm since the launch."',
        te: '"మా విద్యార్థులు ఈ స్మార్ట్ లెర్నింగ్ వాతావరణం పట్ల ఉత్సాహంగా ఉన్నారు. ప్రారంభించినప్పటి నుండి హాజరు శాతం మరియు చదువుపై ఆసక్తి పెరిగాయి."'
      }
    }
  },
  {
    id: 'panchayat-office',
    scope: 'constituency',
    category: { en: 'Development', te: 'అభివృద్ధి' },
    accentColor: '#7c3aed',
    bgColor: '#faf5ff',
    icon: 'ti ti-briefcase',
    readTime: '3 min read',
    views: '1,720 reads',
    likes: 290,
    date: { en: '5 days ago', te: '5 రోజుల క్రితం' },
    location: { en: 'Venkatagirikota mandal', te: 'వెంకటగిరికోట మండలం' },
    projectStatus: 'Completed',
    budget: '₹35 Lakhs',
    beneficiaries: 'Entire Mandal',
    image: resolvedStreetlight, // fallback
    title: {
      en: 'MLA inaugurates new Panchayat office at Venkatagirikota mandal',
      te: 'వెంకటగిరికోట మండలంలో కొత్త పంచాయతీ కార్యాలయాన్ని ప్రారంభించిన ఎమ్మెల్యే'
    },
    content: {
      en: [
        'The MLA office inaugurated the state-of-the-art Gram Panchayat administrative office building at Venkatagirikota Mandal headquarters. The building houses modernized administrative counters, a central village assembly hall, and digital citizen helper kiosks.',
        'This new building will integrate local administrative wings under one roof, facilitating direct processing of land files, ration distribution, pension updates, and municipal certificates.'
      ],
      te: [
        'వెంకటగిరికోట మండల కేంద్రంలో నూతనంగా నిర్మించిన గ్రామ పంచాయతీ పరిపాలన భవనాన్ని ఎమ్మెల్యే కార్యాలయం ప్రారంభించింది. ఈ భవనంలో అత్యాధునిక కౌంటర్లు, గ్రామ సభల కోసం హాల్ మరియు డిజిటల్ పౌర సేవా కేంద్రాలు ఏర్పాటు చేశారు.',
        'ఈ కొత్త భవనం ద్వారా ఒకే చోట అన్ని పరిపాలనా సేవలు లభిస్తాయి, దీనివల్ల భూమి పత్రాలు, రేషన్ పంపిణీ, పింఛన్లు, మున్సిపల్ సర్టిఫికెట్ల మంజూరు సులభతరమవుతుంది.'
      ]
    },
    quote: {
      author: {
        en: 'MLA Office Executive Member',
        te: 'ఎమ్మెల్యే కార్యాలయ కార్యనిర్వాహక సభ్యులు'
      },
      text: {
        en: '"Decentralized, accessible administration is our promise. This digital Panchayat office will save hours of travel time for rural citizens in the mandal."',
        te: '"వికేంద్రీకృత, సులభమైన పరిపాలనే మా వాగ్దానం. ఈ డిజిటల్ పంచాయతీ కార్యాలయం మండలంలోని గ్రామీణ ప్రజల ప్రయాణ సమయాన్ని ఆదా చేస్తుంది."'
      }
    }
  }
];

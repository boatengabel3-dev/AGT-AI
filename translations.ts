export type SupportedLanguage = 
  | 'en'   // English
  | 'tw'   // Twi (Akan)
  | 'ee'   // Ewe (Eʋegbe)
  | 'gaa'  // Ga
  | 'dag'  // Dagbani
  | 'ha'   // Hausa
  | 'yo'   // Yoruba
  | 'sw';  // Swahili

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  region: string;
  greeting: string;
}

export const LANGUAGES: LanguageInfo[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    region: 'Official / All Regions',
    greeting: 'Welcome to AgriTrust AI',
  },
  {
    code: 'tw',
    name: 'Twi (Akan)',
    nativeName: 'Twi / Akan',
    region: 'Ashanti, Bono, Eastern & Central Ghana',
    greeting: 'Akwaaba ba AgriTrust AI mu',
  },
  {
    code: 'ee',
    name: 'Ewe',
    nativeName: 'Eʋegbe',
    region: 'Volta Region & Eastern Border',
    greeting: 'Woezɔ le AgriTrust AI me',
  },
  {
    code: 'gaa',
    name: 'Ga',
    nativeName: 'Ga-Dangme',
    region: 'Greater Accra Region',
    greeting: 'Oobala baa AgriTrust AI mli',
  },
  {
    code: 'dag',
    name: 'Dagbani',
    nativeName: 'Dagbanli',
    region: 'Northern Region & Tamale',
    greeting: 'Maraba ni AgriTrust AI',
  },
  {
    code: 'ha',
    name: 'Hausa',
    nativeName: 'Harshen Hausa',
    region: 'Savannah, Northern Zones & West Africa',
    greeting: 'Barka da zuwa AgriTrust AI',
  },
  {
    code: 'yo',
    name: 'Yoruba',
    nativeName: 'Èdè Yorùbá',
    region: 'Regional West Africa',
    greeting: 'Ẹ ku abọ si AgriTrust AI',
  },
  {
    code: 'sw',
    name: 'Swahili',
    nativeName: 'Kiswahili',
    region: 'East & Central Africa',
    greeting: 'Karibu kwenye AgriTrust AI',
  },
];

export const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // Nav
    'nav.dashboard': 'My Farm Dashboard',
    'nav.marketplace': 'Marketplace',
    'nav.financing': 'Financing & Loans',
    'nav.equipment': 'Machinery Fleet',
    'nav.advisory': 'AI Agronomic Advisory',
    'nav.howItWorks': 'How It Works',
    'nav.signIn': 'Sign In',
    'nav.createAccount': 'Create Account',
    'nav.signOut': 'Sign Out',
    'nav.adminPortal': 'Admin Portal',
    'nav.bankPortal': 'Bank Admin & Credit',
    'nav.fertilizerPortal': 'Fertilizer Admin',
    'nav.machineryPortal': 'Machinery Admin',
    'nav.seedPortal': 'Seed Deals Admin',
    'nav.switchRole': 'Switch Role',

    // Hero & Auth
    'hero.badge': 'Regulated Digital Agricultural Financial Infrastructure · Ghana',
    'hero.title': 'AgriTrust AI Confidential Gateway',
    'hero.subtitle': "West Africa's digital infrastructure uniting commercial banks, input dealers, mechanization providers, and smallholder farmers with confidential role isolation.",
    'auth.adminGroup': 'Admin Portals (Grouped)',
    'auth.farmerPortal': 'Farmer / Producer Portal',
    'auth.googleSignIn': 'Continue with Google Account',
    'auth.googleSignUp': 'Sign up with Google Account',
    'auth.orEmail': 'Or with email',
    'auth.fullName': 'Full Legal Name',
    'auth.phone': 'Phone Number (Ghana MoMo / WhatsApp)',
    'auth.email': 'Email Address',
    'auth.password': 'Password',
    'auth.role': 'Account Role',
    'auth.signInBtn': 'Sign In to AgriTrust',
    'auth.createAccountBtn': 'Complete Account Registration',
    'auth.oneClickLogin': '1-Click Login',
    'auth.welcomeBack': 'Welcome back',
    'auth.openDashboard': 'Open Your Dashboard',

    // Language & Accessibility
    'lang.label': 'Language',
    'lang.accessible': 'Accessible Indigenous Language Support',
    'lang.switchPrompt': 'Choose your native or regional language for simplified farming guidance',
  },

  tw: {
    // Nav
    'nav.dashboard': 'Me Kuayɛ Dwumadie',
    'nav.marketplace': 'Kuafoɔ Dwam',
    'nav.financing': 'Sika Bɔseɛ & Mmoa',
    'nav.equipment': 'Afidie & Ntrakta',
    'nav.advisory': 'Nyansahu & Afotu AI',
    'nav.howItWorks': 'Sɛnea Ɛyɛ Adwuma',
    'nav.signIn': 'Wura Mu',
    'nav.createAccount': 'Kyerɛ Wo Din',
    'nav.signOut': 'Firi Mu',
    'nav.adminPortal': 'Aban Dwumadie',
    'nav.bankPortal': 'Sikakorabea Panyin',
    'nav.fertilizerPortal': 'Adutumi & Dɔteɛ Panyin',
    'nav.machineryPortal': 'Ntrakta Panyin',
    'nav.seedPortal': 'Aba Pa Panyin',
    'nav.switchRole': 'Sesa Dwumadie',

    // Hero & Auth
    'hero.badge': 'Ghana Kuayɛ ne Sikasɛm Akwankyerɛ Titiriw',
    'hero.title': 'AgriTrust AI Kuafoɔ Akwantu Kɛseɛ',
    'hero.subtitle': 'Ghana mfididwuma kɛseɛ a ɛka sikakorabea, adutumi tɔnfoɔ, ntrakta wura ne kuafoɔ nketewa bɔ mu koraa wɔ ahotɔ mu.',
    'auth.adminGroup': 'Adwumayɛfoɔ Mpanyinfoɔ',
    'auth.farmerPortal': 'Kuafoɔ Ahotɔ Bea',
    'auth.googleSignIn': 'Wura mu ne wo Google Account',
    'auth.googleSignUp': 'Kyerɛ wo din ne wo Google Account',
    'auth.orEmail': 'Anaasɛ fa wo email',
    'auth.fullName': 'Wo Din Nyinaa',
    'auth.phone': 'Wo Fon Nɔma (MoMo / WhatsApp)',
    'auth.email': 'Wo Email',
    'auth.password': 'Wo Kokoamsɛm / Password',
    'auth.role': 'Dwuma a Wobɛdi',
    'auth.signInBtn': 'Wura AgriTrust Mu',
    'auth.createAccountBtn': 'Gye Wo Kuafoɔ Kɔntɔ',
    'auth.oneClickLogin': 'Wura Mu Prɛko',
    'auth.welcomeBack': 'Akwaaba bio',
    'auth.openDashboard': 'Bue Wo Kuayɛ Bea',

    // Language
    'lang.label': 'Kasa',
    'lang.accessible': 'Kuafoɔ kasa a ɛyɛ mmerɛ koraa',
    'lang.switchPrompt': 'Paw Twi anaa wo kurom kasa fa yɛ adwuma brɛoo',
  },

  ee: {
    // Nav
    'nav.dashboard': 'Nye Agbledede Dɔwɔƒe',
    'nav.marketplace': 'Asi Gã La',
    'nav.financing': 'Gadzraɖoƒe & Fefu',
    'nav.equipment': 'Mɔ̃wo kple Tractor-wo',
    'nav.advisory': 'AI Aɖaŋuɖola Na Agbledelawo',
    'nav.howItWorks': 'Alekeli Ewɔa Dɔe',
    'nav.signIn': 'Ge Ðe Eme',
    'nav.createAccount': 'Ŋlɔ Ŋkɔ',
    'nav.signOut': 'Do Le Eme',
    'nav.adminPortal': 'Dɔdzikpɔlawo Ƒe Dɔwɔƒe',
    'nav.bankPortal': 'Gadzraɖoƒe Dɔwɔla',
    'nav.fertilizerPortal': 'Anyigbatsɔnu Dzrala',
    'nav.machineryPortal': 'Tractor Dɔwɔla',
    'nav.seedPortal': 'Nuku Dzrala',
    'nav.switchRole': 'Trɔ Dɔwɔƒe',

    // Hero & Auth
    'hero.badge': 'Ghana Agbledede kple Ga-dɔwɔƒewo Ƒe Mɔzɔzɔ Titina',
    'hero.title': 'AgriTrust AI Agbledelawo Ƒe Mɔnu',
    'hero.subtitle': 'Dɔwɔnu si kpena ɖe Ghana agbledela suewo, gadzraɖoƒewo, tractor-wɔlawo kple nuku dzralawo ŋu.',
    'auth.adminGroup': 'Dɔdzikpɔlawo Ƒe Akpa',
    'auth.farmerPortal': 'Agbledelawo Ƒe Akpa',
    'auth.googleSignIn': 'Ge ɖe eme kple Google Account',
    'auth.googleSignUp': 'Ŋlɔ ŋkɔ kple Google Account',
    'auth.orEmail': 'Alo kple wò email',
    'auth.fullName': 'Wò Ŋkɔ Blibo',
    'auth.phone': 'Wò Kaƒomɔ (MoMo / WhatsApp)',
    'auth.email': 'Wò Email',
    'auth.password': 'Wò Nyamenyame Nya',
    'auth.role': 'Dɔ Si Nàwɔ',
    'auth.signInBtn': 'Ge Ðe AgriTrust Eme',
    'auth.createAccountBtn': 'Vu Kɔntɔ Yeye',
    'auth.oneClickLogin': 'Ge Ðe Eme enumake',
    'auth.welcomeBack': 'Woezɔ nàva',
    'auth.openDashboard': 'Ʋu Wò Dɔwɔƒe',

    // Language
    'lang.label': 'Gbe',
    'lang.accessible': 'Gbe vovovowo hena agbledelawo',
    'lang.switchPrompt': 'Tia Eʋegbe alo gbe bubu hena agbledede mɔfiafia',
  },

  gaa: {
    // Nav
    'nav.dashboard': 'Mishi Ŋmɔ Daa',
    'nav.marketplace': 'Jara Kpoo',
    'nav.financing': 'Shika Kɛ Shikahe',
    'nav.equipment': 'Tsɔnei Kɛ Tractor',
    'nav.advisory': 'AI Ŋaawoo Kɛha Ŋmɔtshɛlɔi',
    'nav.howItWorks': 'Bɔ Ni Etsuɔ Nii Ha',
    'nav.signIn': 'Bote Emli',
    'nav.createAccount': 'Ŋmaa Ogbɛi',
    'nav.signOut': 'Je Kpo',
    'nav.adminPortal': 'Niiatsɛmɛi Ahe',
    'nav.bankPortal': 'Shikahe Onukpa',
    'nav.fertilizerPortal': 'Shikpɔŋ Yijemɔ Nɔ Hɔɔlɔ',
    'nav.machineryPortal': 'Tractor Kwɛlɔ',
    'nav.seedPortal': 'Wui Hɔɔlɔ',
    'nav.switchRole': 'Tsake Nitsumɔ',

    // Hero & Auth
    'hero.badge': 'Ghana Ŋmɔtshuulɔi Kɛ Shikatsemei Ayiteŋ Nitsumɔ',
    'hero.title': 'AgriTrust AI Gbɛjianɔtoo',
    'hero.subtitle': 'Nitsumɔ wulu ni kɛ shikahei, adutsumɛi, tractor tsumɛi kɛ ŋmɔtshuulɔi bɔɔ pɛpɛɛpɛ.',
    'auth.adminGroup': 'Niiatsɛmɛi (Admin)',
    'auth.farmerPortal': 'Ŋmɔtshuulɔi Ahe',
    'auth.googleSignIn': 'Bote kɛ Google Account',
    'auth.googleSignUp': 'Ŋmaa ogbɛi kɛ Google Account',
    'auth.orEmail': 'Aloo kɛ email',
    'auth.fullName': 'Ogbɛi Mli',
    'auth.phone': 'Fon Nɔmba (MoMo / WhatsApp)',
    'auth.email': 'Email',
    'auth.password': 'Teemɔŋ Wiemɔ / Password',
    'auth.role': 'Nitsumɔ He',
    'auth.signInBtn': 'Bote AgriTrust Mli',
    'auth.createAccountBtn': 'Gbee Kɔntɔ Naa',
    'auth.oneClickLogin': 'Bote Mli Oya',
    'auth.welcomeBack': 'Oobala baa ekoŋŋ',
    'auth.openDashboard': 'Gbele O-Ŋmɔ Daa',

    // Language
    'lang.label': 'Wiemɔ',
    'lang.accessible': 'Wiemɔi kɛha ŋmɔtshuulɔi fɛɛ',
    'lang.switchPrompt': 'Hala Ga aloo maŋ wiemɔ kɛha ŋaawoo',
  },

  dag: {
    // Nav
    'nav.dashboard': 'N Pukparilim Yaɣili',
    'nav.marketplace': 'Daa Kara',
    'nav.financing': 'Banki Liɣiri Samli',
    'nav.equipment': 'Misin Nima & Tarakta',
    'nav.advisory': 'AI Saawɔra Na Pukpariba',
    'nav.howItWorks': 'Di Tuma Ni Chani Shɛm',
    'nav.signIn': 'Kpɛm Pɔhim Zuɣu',
    'nav.createAccount': 'Sabi A Yuli',
    'nav.signOut': 'Yim Pɔhim Zuɣu',
    'nav.adminPortal': 'Kpamba Yaɣili',
    'nav.bankPortal': 'Banki Kpɛma',
    'nav.fertilizerPortal': 'Takanda Kohira',
    'nav.machineryPortal': 'Tarakta Kpɛma',
    'nav.seedPortal': 'Bimbila Kohira',
    'nav.switchRole': 'Taɣi Tuma Yaɣili',

    // Hero & Auth
    'hero.badge': 'Ghana Pukparilim mini Liɣiri Tuun-titali',
    'hero.title': 'AgriTrust AI Dindɔli',
    'hero.subtitle': 'Pukpariba mini Banki kpamba mini taraktanima laɣimbu pɔhim zuɣu.',
    'auth.adminGroup': 'Kpamba Zaashee',
    'auth.farmerPortal': 'Pukpariba Zaashee',
    'auth.googleSignIn': 'Kpɛm kpariti Google Account',
    'auth.googleSignUp': 'Sabi a yuli kpariti Google Account',
    'auth.orEmail': 'Bee kpariti email',
    'auth.fullName': 'A Yuli Zaasa',
    'auth.phone': 'Talifom Nɔmba (MoMo / WhatsApp)',
    'auth.email': 'Email',
    'auth.password': 'Ashili Yɛltɔɣa',
    'auth.role': 'Tuma Shɛli A Ni Bɔra',
    'auth.signInBtn': 'Kpɛm AgriTrust Puuni',
    'auth.createAccountBtn': 'Kpa Akawunti Palli',
    'auth.oneClickLogin': 'Kpɛm Yomyom',
    'auth.welcomeBack': 'Maraba ni labina',
    'auth.openDashboard': 'Yooi A Pukparilim Yaɣili',

    // Language
    'lang.label': 'Balli',
    'lang.accessible': 'Balli shɛŋa pukpariba ni baŋ soochi',
    'lang.switchPrompt': 'Gaami Dagbanli bee balli shɛli a ni bɔra',
  },

  ha: {
    // Nav
    'nav.dashboard': 'Dandalin Manomi',
    'nav.marketplace': 'Kasuwar Noma',
    'nav.financing': 'Bashi da Kudi daga Banki',
    'nav.equipment': 'Tarakta da Kayan Aiki',
    'nav.advisory': 'Shawarar Noma daga AI',
    'nav.howItWorks': 'Yadda Yake Aiki',
    'nav.signIn': 'Shiga Ciki',
    'nav.createAccount': 'Bude Sabon Asusu',
    'nav.signOut': 'Fita',
    'nav.adminPortal': 'Dandalin Jagora',
    'nav.bankPortal': 'Jami\'in Banki',
    'nav.fertilizerPortal': 'Dillalin Taki',
    'nav.machineryPortal': 'Mai Kayan Tarakta',
    'nav.seedPortal': 'Dillalin Irin Shuka',
    'nav.switchRole': 'Canza Matsayi',

    // Hero & Auth
    'hero.badge': 'Tsarukan Kudi da Noma na Zamani a Ghana',
    'hero.title': 'Kofar AgriTrust AI',
    'hero.subtitle': 'Cibiyar hada manoma, bankuna, masu bayar da tarakta da masu sayar da taki cikin amana da tsaro.',
    'auth.adminGroup': 'Dandalin Masu Gudanarwa (Admin)',
    'auth.farmerPortal': 'Dandalin Manoma',
    'auth.googleSignIn': 'Shiga ta Google Account',
    'auth.googleSignUp': 'Yi rajista ta Google Account',
    'auth.orEmail': 'Ko ta amfani da email',
    'auth.fullName': 'Cikakken Suna',
    'auth.phone': 'Lambar Wayar Salula (MoMo / WhatsApp)',
    'auth.email': 'Adireshin Email',
    'auth.password': 'Kalmar Sirri / Password',
    'auth.role': 'Matsayin Asusu',
    'auth.signInBtn': 'Shiga Cikin AgriTrust',
    'auth.createAccountBtn': 'Kammala Rajista',
    'auth.oneClickLogin': 'Shiga Kai Tsaye',
    'auth.welcomeBack': 'Barka da sake dawowa',
    'auth.openDashboard': 'Bude Dandalinka',

    // Language
    'lang.label': 'Harshe',
    'lang.accessible': 'Taimakon harsunan gida ga manoma',
    'lang.switchPrompt': 'Zabi Hausa ko wani harshe domin saukin fahimta',
  },

  yo: {
    // Nav
    'nav.dashboard': 'Ibùdó Àgbẹ̀ Mi',
    'nav.marketplace': 'Ọjà Àgbẹ̀',
    'nav.financing': 'Ètò Ìnáwó & Àwìn Ilé-Ìfowópamọ́',
    'nav.equipment': 'Àwọn Ẹ̀rọ & Tiraktọ',
    'nav.advisory': 'Ìmọ̀ràn Àgbẹ̀ AI',
    'nav.howItWorks': 'Bí Ó Ṣe Ń Ṣiṣẹ́',
    'nav.signIn': 'Wọlé',
    'nav.createAccount': 'Ṣẹ̀dá Àkántì',
    'nav.signOut': 'Jáde',
    'nav.adminPortal': 'Ibùdó Alábòójútó',
    'nav.bankPortal': 'Oṣiṣẹ́ Ilé-Ìfowópamọ́',
    'nav.fertilizerPortal': 'Olùtajà Ajílẹ̀',
    'nav.machineryPortal': 'Olùpèsè Tiraktọ',
    'nav.seedPortal': 'Olùtajà Èso Gbígbin',
    'nav.switchRole': 'Yí Ipa Padà',

    // Hero & Auth
    'hero.badge': 'Ètò Ìnáwó Àti Iṣẹ́ Àgbẹ̀ Òde Òní',
    'hero.title': 'Ibùwọlé AgriTrust AI',
    'hero.subtitle': 'Àsopọ̀ gbòógbò fún àwọn àgbẹ̀, ilé-ìfowópamọ́, àti àwọn olùpèsè ẹ̀rọ pẹ̀lú ààbò tó péye.',
    'auth.adminGroup': 'Àwọn Alábòójútó (Admin)',
    'auth.farmerPortal': 'Ibùdó Àwọn Àgbẹ̀',
    'auth.googleSignIn': 'Wọlé pẹ̀lú Google Account',
    'auth.googleSignUp': 'Ṣe ìforúkọsílẹ̀ pẹ̀lú Google',
    'auth.orEmail': 'Tàbí pẹ̀lú email',
    'auth.fullName': 'Orúkọ Lẹ́kùn-únrẹ́rẹ́',
    'auth.phone': 'Nọ́mbà Fóònù (MoMo / WhatsApp)',
    'auth.email': 'Àdírẹ́sì Email',
    'auth.password': 'Ọ̀rọ̀ Ìkọ̀kọ̀ / Password',
    'auth.role': 'Ipa Àkántì Rẹ',
    'auth.signInBtn': 'Wọlé sí AgriTrust',
    'auth.createAccountBtn': 'Pari Ìforúkọsílẹ̀',
    'auth.oneClickLogin': 'Wọlé Lẹ́ẹ̀kanṣoṣo',
    'auth.welcomeBack': 'Ẹ káàbọ̀ padà',
    'auth.openDashboard': 'Ṣí Ibùdó Rẹ',

    // Language
    'lang.label': 'Èdè',
    'lang.accessible': 'Àtìlẹ́yìn èdè abínibí fún àwọn àgbẹ̀',
    'lang.switchPrompt': 'Yan Èdè Yorùbá tàbí èdè míràn fún ìrọ̀rùn',
  },

  sw: {
    // Nav
    'nav.dashboard': 'Dashibodi ya Shamba Langu',
    'nav.marketplace': 'Soko Kuu la Pembejeo',
    'nav.financing': 'Mikopo & Fedha za Kilimo',
    'nav.equipment': 'Matrekta na Mitambo',
    'nav.advisory': 'Ushauri wa Kilimo wa AI',
    'nav.howItWorks': 'Jinsi Inavyofanya Kazi',
    'nav.signIn': 'Ingia',
    'nav.createAccount': 'Fungua Akaunti',
    'nav.signOut': 'Ondoka',
    'nav.adminPortal': 'Lango la Wasimamizi',
    'nav.bankPortal': 'Afisa wa Benki',
    'nav.fertilizerPortal': 'Muuzaji wa Mbolea',
    'nav.machineryPortal': 'Mtoa Huduma wa Trekta',
    'nav.seedPortal': 'Muuzaji wa Mbegu Bora',
    'nav.switchRole': 'Badilisha Nafasi',

    // Hero & Auth
    'hero.badge': 'Miundombinu Rasmi ya Kifedha na Kilimo cha Kisasa',
    'hero.title': 'Lango Kuu la AgriTrust AI',
    'hero.subtitle': 'Mfumo wa kidijitali unaowaunganisha wakulima wadogo, mabenki, wauzaji wa mbolea na wenye matrekta kwa usalama kamili.',
    'auth.adminGroup': 'Lango la Wasimamizi (Admin)',
    'auth.farmerPortal': 'Lango la Wakulima',
    'auth.googleSignIn': 'Ingia kwa Google Account',
    'auth.googleSignUp': 'Jisajili kwa Google Account',
    'auth.orEmail': 'Au kwa kutumia email',
    'auth.fullName': 'Majina Kamili',
    'auth.phone': 'Nambari ya Simu (M-Pesa / WhatsApp)',
    'auth.email': 'Barua Pepe / Email',
    'auth.password': 'Nenosiri / Password',
    'auth.role': 'Nafasi ya Akaunti',
    'auth.signInBtn': 'Ingia kwenye AgriTrust',
    'auth.createAccountBtn': 'Kamilisha Usajili',
    'auth.oneClickLogin': 'Ingia Mara Moja',
    'auth.welcomeBack': 'Karibu tena',
    'auth.openDashboard': 'Fungua Dashibodi Yako',

    // Language
    'lang.label': 'Lugha',
    'lang.accessible': 'Msaada wa lugha za kiasili kwa wakulima',
    'lang.switchPrompt': 'Chagua Kiswahili au lugha nyingine kwa maelekezo rahisi',
  },
};

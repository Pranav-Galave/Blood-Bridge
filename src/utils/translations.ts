export type SupportedLanguage = 'en' | 'mr' | 'hi';

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी', flag: '🚩' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', flag: '🇮🇳' },
];

export const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // Top Bar & Navigation
    'nav.home': 'Home',
    'nav.findBlood': 'Find Blood',
    'nav.becomeDonor': 'Become a Donor',
    'nav.bloodBanks': 'Blood Banks',
    'nav.hospitals': 'Hospitals',
    'nav.donorMatching': 'Donor Matching',
    'nav.learnBlood': 'Learn About Blood',
    'nav.dashboard': 'My Dashboard',
    'nav.needBlood': 'Need Blood',
    'nav.notifications': 'Network Alerts',
    'nav.gpsLocation': 'Solapur Urban Zone',

    // Emergency Banner
    'banner.helpline': '24/7 Solapur Emergency Blood Network Helpline:',
    'banner.activeHubs': 'Civil Hospital Blood Centre & 4 Partner Hubs Active',
    'banner.raiseRequest': 'Raise Emergency Blood Request',

    // Role Switcher
    'role.view': 'Stakeholder View:',
    'role.testMsg': 'Switch roles to test all 4 connected viewpoints:',
    'role.patient': 'Patient / Relatives',
    'role.donor': 'Blood Donor',
    'role.bloodBank': 'Blood Bank',
    'role.hospital': 'Hospital',
    'role.prototype': 'Solapur, MH Network Prototype',

    // Hero Section
    'hero.badge': 'Connected Solapur Blood Ecosystem · 4-Way Real-Time Network',
    'hero.taglineLead': 'One Network. Every Donor.',
    'hero.taglineHighlight': 'Every Drop. Every Life.',
    'hero.subtitle':
      'Blood Bridge eliminates frantic calls during emergencies. We unite certified blood banks, trauma hospitals, patients, and GPS-ranked voluntary donors into an intelligent, transparent transfusion network.',
    'hero.needBloodUrgently': 'Need Blood Urgently',
    'hero.checkInventory': 'Check Live Inventory',
    'hero.registerDonor': 'Register as Donor',
    'hero.verifiedLabs': 'Government & NABH Accredited Labs',
    'hero.qrTracking': 'Unique QR Unit Cold-Chain Tracking',
    'hero.rankedMatching': 'Medically Ranked GPS Matching',
    'hero.liveSnapshot': 'Live Solapur Network Snapshot',
    'hero.realtimeSync': 'Real-Time Sync',
    'hero.testedUnitsReady': 'units ready in cold stock',
    'hero.onCallDonors': 'On-Call Donors',
    'hero.activeRequests': 'Active Requirements',
    'hero.searchAll': 'Search All →',

    // Common Actions & Badges
    'action.close': 'Close',
    'action.cancel': 'Cancel',
    'action.submit': 'Submit',
    'action.verify': 'Verify',
    'action.accept': 'Accept',
    'action.decline': 'Decline',
    'action.reserve': 'Reserve Unit',
    'action.viewQR': 'View QR Code',
    'action.scanQR': 'Scan QR Code',
    'action.addUnit': 'Add Blood Unit',
    'action.print': 'Print / Save PDF',
    'action.directions': 'Get GPS Directions',
  },
  mr: {
    // Top Bar & Navigation (Marathi)
    'nav.home': 'मुख्यपृष्ठ',
    'nav.findBlood': 'रक्त शोधा',
    'nav.becomeDonor': 'रक्तदाता बना',
    'nav.bloodBanks': 'रक्तपेढी',
    'nav.hospitals': 'रुग्णालये',
    'nav.donorMatching': 'रक्तदाता जुळवणी',
    'nav.learnBlood': 'रक्त माहिती',
    'nav.dashboard': 'माझे डॅशबोर्ड',
    'nav.needBlood': 'रक्त हवे आहे',
    'nav.notifications': 'नेटवर्क सूचना',
    'nav.gpsLocation': 'सोलापूर शहर विभाग',

    // Emergency Banner
    'banner.helpline': '२४/७ सोलापूर आपत्कालीन रक्त नेटवर्क हेल्पलाइन:',
    'banner.activeHubs': 'जिल्हा शासकीय रुग्णालय रक्तपेढी व ४ भागीदार केंद्रे सक्रिय',
    'banner.raiseRequest': 'तातडीची रक्त मागणी नोंदवा',

    // Role Switcher
    'role.view': 'वापरकर्ता दृष्टिकोन:',
    'role.testMsg': 'सर्व ४ घटकांची तपासणी करण्यासाठी भूमिका बदला:',
    'role.patient': 'रुग्ण / नातेवाईक',
    'role.donor': 'रक्तदाता',
    'role.bloodBank': 'रक्तपेढी',
    'role.hospital': 'रुग्णालय',
    'role.prototype': 'सोलापूर, महा. नेटवर्क प्रोटोटाइप',

    // Hero Section
    'hero.badge': 'सोलापूर एकात्मिक रक्त नेटवर्क · ४-मार्गी थेट जोडणी',
    'hero.taglineLead': 'एक नेटवर्क. प्रत्येक रक्तदाता.',
    'hero.taglineHighlight': 'प्रत्येक थेंब. प्रत्येक जीवन.',
    'hero.subtitle':
      'ब्लड ब्रिज वैद्यकीय आणीबाणीच्या काळात धावाधाव आणि गोंधळ थांबवते. आम्ही अधिकृत रक्तपेढ्या, शस्त्रक्रिया रुग्णालये, रुग्ण आणि जीपीएस-सुसंगत रक्तदात्यांना एका पारदर्शक नेटवर्कमध्ये जोडतो.',
    'hero.needBloodUrgently': 'तातडीने रक्त आवश्यक',
    'hero.checkInventory': 'उपलब्ध रक्त साठा तपासा',
    'hero.registerDonor': 'रक्तदाता म्हणून नोंदणी करा',
    'hero.verifiedLabs': 'शासकीय व एनएबीएच प्रमाणित प्रयोगशाळा',
    'hero.qrTracking': 'प्रत्येक पिशवीसाठी स्वतंत्र क्युआर कोल्ड-चेन ट्रॅकिंग',
    'hero.rankedMatching': 'वैद्यकीय निकषांवर आधारित जीपीएस मॅचिंग',
    'hero.liveSnapshot': 'सोलापूर थेट नेटवर्क सद्यस्थिती',
    'hero.realtimeSync': 'थेट अद्यतन',
    'hero.testedUnitsReady': 'तपासणी झालेल्या रक्त पिशव्या सज्ज',
    'hero.onCallDonors': 'सक्रिय रक्तदाते',
    'hero.activeRequests': 'सक्रिय मागण्या',
    'hero.searchAll': 'सर्व शोधा →',

    // Common Actions & Badges
    'action.close': 'बंद करा',
    'action.cancel': 'रद्द करा',
    'action.submit': 'नोंदवा',
    'action.verify': 'पडताळणी करा',
    'action.accept': 'स्वीकारा',
    'action.decline': 'नाकारा',
    'action.reserve': 'पिशवी आरक्षित करा',
    'action.viewQR': 'क्युआर कोड पाहा',
    'action.scanQR': 'क्युआर कोड स्कॅन करा',
    'action.addUnit': 'रक्त पिशवी जोडा',
    'action.print': 'प्रमाणपत्र प्रिंट करा',
    'action.directions': 'जीपीएस मार्ग दाखवा',
  },
  hi: {
    // Top Bar & Navigation (Hindi)
    'nav.home': 'होम',
    'nav.findBlood': 'रक्त खोजें',
    'nav.becomeDonor': 'रक्तदाता बनें',
    'nav.bloodBanks': 'ब्लड बैंक',
    'nav.hospitals': 'अस्पताल',
    'nav.donorMatching': 'डोनर मैचिंग',
    'nav.learnBlood': 'रक्त के बारे में',
    'nav.dashboard': 'डैशबोर्ड',
    'nav.needBlood': 'रक्त चाहिए',
    'nav.notifications': 'नेटवर्क अलर्ट',
    'nav.gpsLocation': 'सोलापुर शहरी क्षेत्र',

    // Emergency Banner
    'banner.helpline': '24/7 सोलापुर आपातकालीन ब्लड नेटवर्क हेल्पलाइन:',
    'banner.activeHubs': 'सिविल अस्पताल ब्लड सेंटर एवं 4 सहयोगी केंद्र सक्रिय',
    'banner.raiseRequest': 'आपातकालीन रक्त अनुरोध दर्ज करें',

    // Role Switcher
    'role.view': 'हितधारक दृश्य:',
    'role.testMsg': 'सभी 4 दृष्टिकोणों का परीक्षण करने के लिए भूमिका बदलें:',
    'role.patient': 'मरीज / परिजन',
    'role.donor': 'रक्तदाता',
    'role.bloodBank': 'ब्लड बैंक',
    'role.hospital': 'अस्पताल',
    'role.prototype': 'सोलापुर, महा. नेटवर्क प्रोटोटाइप',

    // Hero Section
    'hero.badge': 'सोलापुर एकीकृत ब्लड नेटवर्क · 4-तरफा रीयल-टाइम कनेक्टिविटी',
    'hero.taglineLead': 'एक नेटवर्क। हर रक्तदाता।',
    'hero.taglineHighlight': 'हर बूंद। हर जीवन।',
    'hero.subtitle':
      'ब्लड ब्रिज आपात स्थिति में घबराहट और अनगिनत कॉल्स को समाप्त करता है। हम प्रमाणित ब्लड बैंकों, ट्रॉमा अस्पतालों, मरीजों और जीपीएस-रैंक वाले स्वैच्छिक रक्तदाताओं को एक पारदर्शी प्रणाली में जोड़ते हैं।',
    'hero.needBloodUrgently': 'रक्त की तत्काल आवश्यकता',
    'hero.checkInventory': 'लाइव स्टॉक चेक करें',
    'hero.registerDonor': 'रक्तदाता के रूप में जुड़ें',
    'hero.verifiedLabs': 'सरकारी एवं एनएबीएच मान्यता प्राप्त लैब्स',
    'hero.qrTracking': 'विशिष्ट क्यूआर कोड कोल्ड-चेन ट्रैकिंग',
    'hero.rankedMatching': 'चिकित्सकीय रूप से रैंक की गई जीपीएस मैचिंग',
    'hero.liveSnapshot': 'सोलापुर लाइव नेटवर्क स्थिति',
    'hero.realtimeSync': 'रीयल-टाइम सिंक',
    'hero.testedUnitsReady': 'जांची गई रक्त इकाइयां तैयार',
    'hero.onCallDonors': 'ऑन-कॉल रक्तदाता',
    'hero.activeRequests': 'सक्रिय अनुरोध',
    'hero.searchAll': 'सभी देखें →',

    // Common Actions & Badges
    'action.close': 'बंद करें',
    'action.cancel': 'रद्द करें',
    'action.submit': 'दर्ज करें',
    'action.verify': 'सत्यापित करें',
    'action.accept': 'स्वीकार करें',
    'action.decline': 'अस्वीकार करें',
    'action.reserve': 'यूनिट सुरक्षित करें',
    'action.viewQR': 'क्यूआर कोड देखें',
    'action.scanQR': 'क्यूआर कोड स्कैन करें',
    'action.addUnit': 'रक्त यूनिट जोड़ें',
    'action.print': 'प्रमाणपत्र प्रिंट करें',
    'action.directions': 'जीपीएस दिशा-निर्देश',
  },
};

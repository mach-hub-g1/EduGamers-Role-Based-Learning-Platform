"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
}

export const supportedLanguages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🟡' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🔹' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🔶' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🔺' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🔻' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🔷' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🔸' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🔹' },
]

interface Translations {
  [key: string]: {
    [key: string]: string
  }
}

const translations: Translations = {
  en: {
    // Common
    'welcome': 'Welcome',
    'home': 'Home',
    'profile': 'Profile',
    'settings': 'Settings',
    'games': 'Games',
    'lessons': 'Lessons',
    'dashboard': 'Dashboard',
    'logout': 'Logout',
    'save': 'Save',
    'cancel': 'Cancel',
    'edit': 'Edit',
    'delete': 'Delete',
    'back': 'Back',
    'next': 'Next',
    'previous': 'Previous',
    'loading': 'Loading...',
    'error': 'Error',
    'success': 'Success',
    
    // Home page
    'hero.title': 'Educational Games Store',
    'hero.subtitle': 'Enhance learning through interactive games and challenges',
    'platform.title': 'Welcome to EduGamers',
    'platform.subtitle': 'Choose your role to access the platform',
    'role.student': 'Student',
    'role.teacher': 'Teacher',
    'role.government': 'Government',
    'role.student.desc': 'Play games, track progress, submit assignments',
    'role.teacher.desc': 'Manage students, create assignments, view analytics',
    'role.government.desc': 'View regional data, track implementation, manage policies',
    'explore.games': 'Explore Games',
    'get.started': 'Get Started',
    'solar.status': 'Solar Powered - Active',
    
    // Profile page
    'profile.title': 'My Profile',
    'profile.edit': 'Edit Profile',
    'profile.save': 'Save Changes',
    'profile.name': 'Full Name',
    'profile.email': 'Email',
    'profile.phone': 'Phone',
    'profile.grade': 'Grade/Class',
    'profile.school': 'School',
    'profile.bio': 'Bio',
    'profile.avatar': 'Profile Picture',
    'profile.upload': 'Upload Photo',
    'profile.stats': 'Statistics',
    'profile.achievements': 'Achievements',
    'profile.subjects': 'Subject Progress',
    'profile.level': 'Level',
    'profile.xp': 'XP',
    'profile.streak': 'Streak',
    'profile.lessons': 'Lessons Completed',
    
    // Games
    'games.play': 'Play Now',
    'games.score': 'Score',
    'games.time': 'Time',
    'games.level': 'Level',
    'games.difficulty': 'Difficulty',
    
    // Language
    'language.select': 'Select Language',
    'language.change': 'Change Language',
  },
  hi: {
    // Common
    'welcome': 'स्वागत',
    'home': 'मुख्य पृष्ठ',
    'profile': 'प्रोफ़ाइल',
    'settings': 'सेटिंग्स',
    'games': 'खेल',
    'lessons': 'पाठ',
    'dashboard': 'डैशबोर्ड',
    'logout': 'लॉग आउट',
    'save': 'सेव करें',
    'cancel': 'रद्द करें',
    'edit': 'संपादित करें',
    'delete': 'हटाएं',
    'back': 'वापस',
    'next': 'अगला',
    'previous': 'पिछला',
    'loading': 'लोड हो रहा है...',
    'error': 'त्रुटि',
    'success': 'सफलता',
    
    // Home page
    'hero.title': 'शैक्षणिक खेल स्टोर',
    'hero.subtitle': 'इंटरैक्टिव गेम्स और चुनौतियों के माध्यम से सीखने को बढ़ावा दें',
    'platform.title': 'EduGamers में आपका स्वागत है',
    'platform.subtitle': 'प्लेटफॉर्म तक पहुंचने के लिए अपनी भूमिका चुनें',
    'role.student': 'छात्र',
    'role.teacher': 'शिक्षक',
    'role.government': 'सरकार',
    'role.student.desc': 'खेल खेलें, प्रगति ट्रैक करें, असाइनमेंट जमा करें',
    'role.teacher.desc': 'छात्रों का प्रबंधन करें, असाइनमेंट बनाएं, विश्लेषण देखें',
    'role.government.desc': 'क्षेत्रीय डेटा देखें, कार्यान्वयन ट्रैक करें, नीतियों का प्रबंधन करें',
    'explore.games': 'गेम्स एक्सप्लोर करें',
    'get.started': 'शुरुआत करें',
    'solar.status': 'सौर ऊर्जा संचालित - सक्रिय',
    
    // Profile page
    'profile.title': 'मेरी प्रोफ़ाइल',
    'profile.edit': 'प्रोफ़ाइल संपादित करें',
    'profile.save': 'परिवर्तन सेव करें',
    'profile.name': 'पूरा नाम',
    'profile.email': 'ईमेल',
    'profile.phone': 'फोन',
    'profile.grade': 'ग्रेड/कक्षा',
    'profile.school': 'स्कूल',
    'profile.bio': 'परिचय',
    'profile.avatar': 'प्रोफ़ाइल तस्वीर',
    'profile.upload': 'फोटो अपलोड करें',
    'profile.stats': 'आंकड़े',
    'profile.achievements': 'उपलब्धियां',
    'profile.subjects': 'विषय प्रगति',
    'profile.level': 'स्तर',
    'profile.xp': 'XP',
    'profile.streak': 'स्ट्रीक',
    'profile.lessons': 'पूर्ण पाठ',
    
    // Games
    'games.play': 'अभी खेलें',
    'games.score': 'स्कोर',
    'games.time': 'समय',
    'games.level': 'स्तर',
    'games.difficulty': 'कठिनाई',
    
    // Language
    'language.select': 'भाषा चुनें',
    'language.change': 'भाषा बदलें',
  },
  or: {
    // Common
    'welcome': 'ସ୍ୱାଗତ',
    'home': 'ମୁଖ୍ୟ ପୃଷ୍ଠା',
    'profile': 'ପ୍ରୋଫାଇଲ୍',
    'settings': 'ସେଟିଂ',
    'games': 'ଖେଳ',
    'lessons': 'ପାଠ',
    'dashboard': 'ଡ୍ୟାସବୋର୍ଡ',
    'logout': 'ଲଗ୍ ଆଉଟ୍',
    'save': 'ସେଭ୍ କରନ୍ତୁ',
    'cancel': 'ବାତିଲ୍ କରନ୍ତୁ',
    'edit': 'ସଂପାଦନା କରନ୍ତୁ',
    'delete': 'ଡିଲିଟ୍ କରନ୍ତୁ',
    'back': 'ପଛକୁ',
    'next': 'ପରବର୍ତ୍ତୀ',
    'previous': 'ପୂର୍ବବର୍ତ୍ତୀ',
    'loading': 'ଲୋଡ଼ିଙ୍ଗ...',
    'error': 'ତ୍ରୁଟି',
    'success': 'ସଫଳତା',
    'view': 'ଦେଖନ୍ତୁ',
    'create': 'ତିଆରି କରନ୍ତୁ',
    'update': 'ଅପଡେଟ୍ କରନ୍ତୁ',
    'search': 'ଖୋଜନ୍ତୁ',
    'filter': 'ଫିଲ୍ଟର୍',
    'export': 'ଏକ୍ସପୋର୍ଟ କରନ୍ତୁ',
    'import': 'ଇମ୍ପୋର୍ଟ କରନ୍ତୁ',
    'download': 'ଡାଉନଲୋଡ୍ କରନ୍ତୁ',
    'upload': 'ଅପଲୋଡ୍ କରନ୍ତୁ',
    'submit': 'ଜମା କରନ୍ତୁ',
    'confirm': 'ନିଶ୍ଚିତ କରନ୍ତୁ',
    'close': 'ବନ୍ଦ କରନ୍ତୁ',
    'open': 'ଖୋଲନ୍ତୁ',
    'start': 'ଆରମ୍ଭ କରନ୍ତୁ',
    'stop': 'ବନ୍ଦ କରନ୍ତୁ',
    'pause': 'ବିରାମ',
    'resume': 'ପୁନଃଆରମ୍ଭ',
    'reset': 'ରିସେଟ୍ କରନ୍ତୁ',
    'refresh': 'ସତେଜ କରନ୍ତୁ',
    'copy': 'କପି କରନ୍ତୁ',
    'share': 'ସେୟାର କରନ୍ତୁ',
    'help': 'ସାହାଯ୍ୟ',
    'about': 'ବିଷୟରେ',
    'contact': 'ଯୋଗାଯୋଗ',
    'feedback': 'ମତାମତ',
    'report': 'ରିପୋର୍ଟ',
    'status': 'ଅବସ୍ଥା',
    'active': 'ସକ୍ରିୟ',
    'inactive': 'ନିଷ୍କ୍ରିୟ',
    'completed': 'ସମ୍ପୂର୍ଣ୍ଣ',
    'pending': 'ବିଚାରାଧୀନ',
    'progress': 'ପ୍ରଗତି',
    'performance': 'କାର୍ଯ୍ୟଦକ୍ଷତା',
    'analytics': 'ବିଶ୍ଳେଷଣ',
    'insights': 'ଅନ୍ତର୍ଦୃଷ୍ଟି',
    'overview': 'ସାରାଂଶ',
    'details': 'ବିସ୍ତାର',
    'summary': 'ସଂକ୍ଷିପ୍ତ ବିବରଣୀ',
    'total': 'ସମୁଦାୟ',
    'average': 'ହାରାହାରି',
    'maximum': 'ସର୍ବାଧିକ',
    'minimum': 'ସର୍ବନିମ୍ନ',
    'count': 'ସଂଖ୍ୟା',
    'percentage': 'ଶତକରା',
    'ratio': 'ଅନୁପାତ',
    'trend': 'ଧାରା',
    'change': 'ପରିବର୍ତ୍ତନ',
    'increase': 'ବୃଦ୍ଧି',
    'decrease': 'ହ୍ରାସ',
    'improvement': 'ଉନ୍ନତି',
    'decline': 'ଅବନତି',
    'growth': 'ବୃଦ୍ଧି',
    'target': 'ଲକ୍ଷ୍ୟ',
    'goal': 'ଉଦ୍ଦେଶ୍ୟ',
    'achievement': 'ସଫଳତା',
    'reward': 'ପୁରସ୍କାର',
    'badge': 'ବ୍ୟାଜ୍',
    'certificate': 'ପ୍ରମାଣପତ୍ର',
    'points': 'ପଏଣ୍ଟ',
    'rank': 'ପଦବୀ',
    'position': 'ସ୍ଥାନ',
    'leaderboard': 'ଲିଡରବୋର୍ଡ',
    
    // Home page
    'hero.title': 'ଶିକ୍ଷାଗତ ଖେଳ ଷ୍ଟୋର୍',
    'hero.subtitle': 'ଇଣ୍ଟରାକ୍ଟିଭ୍ ଗେମ୍ ଏବଂ ଚ୍ୟାଲେଞ୍ଜ ମାଧ୍ୟମରେ ଶିକ୍ଷାକୁ ବୃଦ୍ଧି କରନ୍ତୁ',
    'platform.title': 'EduGamers ରେ ଆପଣଙ୍କୁ ସ୍ୱାଗତ',
    'platform.subtitle': 'ପ୍ଲାଟଫର୍ମ ଆକ୍ସେସ୍ କରିବାକୁ ଆପଣଙ୍କର ଭୂମିକା ବାଛନ୍ତୁ',
    'role.student': 'ଛାତ୍ର',
    'role.teacher': 'ଶିକ୍ଷକ',
    'role.government': 'ସରକାର',
    'role.student.desc': 'ଖେଳ ଖେଳନ୍ତୁ, ପ୍ରଗତି ଟ୍ରାକ୍ କରନ୍ତୁ, ଆସାଇନମେଣ୍ଟ ଜମା କରନ୍ତୁ',
    'role.teacher.desc': 'ଛାତ୍ରମାନଙ୍କୁ ପରିଚାଳନା କରନ୍ତୁ, ଆସାଇନମେଣ୍ଟ ତିଆରି କରନ୍ତୁ, ବିଶ୍ଳେଷଣ ଦେଖନ୍ତୁ',
    'role.government.desc': 'ଆଞ୍ଚଳିକ ତଥ୍ୟ ଦେଖନ୍ତୁ, କାର୍ଯ୍ୟକାରିତା ଟ୍ରାକ୍ କରନ୍ତୁ, ନୀତି ପରିଚାଳନା କରନ୍ତୁ',
    'explore.games': 'ଗେମ୍ସ ଏକ୍ସପ୍ଲୋର୍ କରନ୍ତୁ',
    'get.started': 'ଆରମ୍ଭ କରନ୍ତୁ',
    'solar.status': 'ସୌର ଶକ୍ତି ଚାଳିତ - ସକ୍ରିୟ',
    
    // Dashboard & Navigation
    'nav.home': 'ମୁଖ୍ୟ ପୃଷ୍ଠା',
    'nav.dashboard': 'ଡ୍ୟାସବୋର୍ଡ',
    'nav.classes': 'କ୍ଲାସ୍ ପରିଚାଳନା',
    'nav.students': 'ଛାତ୍ର ପରିଚାଳନା',
    'nav.content': 'ବିଷୟବସ୍ତୁ ଏବଂ ଆସାଇନମେଣ୍ଟ',
    'nav.analytics': 'ବିଶ୍ଳେଷଣ ଏବଂ ରିପୋର୍ଟ',
    'nav.support': 'ସହାୟତା ଏବଂ ସେଟିଂ',
    'nav.users': 'ୟୁଜର୍ ପରିଚାଳନା',
    'nav.system': 'ସିଷ୍ଟମ୍ ସେଟିଂ',
    'nav.management': 'ପରିଚାଳନା',
    'nav.oversight': 'ତଦାରଖ',
    
    // Dashboard Cards & Metrics
    'metrics.active.users': 'ସକ୍ରିୟ ଉପଯୋଗକାରୀ',
    'metrics.daily.active': 'ଦୈନିକ ସକ୍ରିୟ ଉପଯୋଗକାରୀ',
    'metrics.lessons.completed': 'ସମ୍ପୂର୍ଣ୍ଣ ପାଠ',
    'metrics.avg.session': 'ହାରାହାରି ସେସନ୍ ସମୟ',
    'metrics.platform.growth': 'ପ୍ଲାଟଫର୍ମ ବୃଦ୍ଧି',
    'metrics.performance.avg': 'ହାରାହାରି କାର୍ଯ୍ୟଦକ୍ଷତା',
    'metrics.attendance': 'ଉପସ୍ଥିତି',
    'metrics.engagement': 'ସଂଯୋଗ',
    'metrics.completion.rate': 'ସମାପ୍ତି ହାର',
    'metrics.success.rate': 'ସଫଳତା ହାର',
    'metrics.class.average': 'କ୍ଲାସ୍ ହାରାହାରି',
    'metrics.student.count': 'ଛାତ୍ର ସଂଖ୍ୟା',
    'metrics.assignment.pending': 'ବିଚାରାଧୀନ ଆସାଇନମେଣ୍ଟ',
    'metrics.reviews.pending': 'ବିଚାରାଧୀନ ସମୀକ୍ଷା',
    'metrics.content.views': 'ବିଷୟବସ୍ତୁ ଦେଖାଯାଇଛି',
    'metrics.downloads.total': 'ମୋଟ ଡାଉନଲୋଡ୍',
    
    // Time & Date
    'time.today': 'ଆଜି',
    'time.yesterday': 'ଗତକାଲି',
    'time.week': 'ସପ୍ତାହ',
    'time.month': 'ମାସ',
    'time.year': 'ବର୍ଷ',
    'time.daily': 'ଦୈନିକ',
    'time.weekly': 'ସାପ୍ତାହିକ',
    'time.monthly': 'ମାସିକ',
    'time.yearly': 'ବାର୍ଷିକ',
    'time.last.week': 'ଗତ ସପ୍ତାହ',
    'time.last.month': 'ଗତ ମାସ',
    'time.this.week': 'ଏହି ସପ୍ତାହ',
    'time.this.month': 'ଏହି ମାସ',
    
    // Analytics & Reports  
    'analytics.title': 'ବିଶ୍ଳେଷଣ ଏବଂ ରିପୋର୍ଟ',
    'analytics.overview': 'ବିଶ୍ଳେଷଣ ସାରାଂଶ',
    'analytics.performance': 'କାର୍ଯ୍ୟଦକ୍ଷତା ବିଶ୍ଳେଷଣ',
    'analytics.engagement': 'ସଂଯୋଗ ବିଶ୍ଳେଷଣ',
    'analytics.insights': 'ବିଶ୍ଳେଷଣ ଅନ୍ତର୍ଦୃଷ୍ଟି',
    'analytics.reports': 'ରିପୋର୍ଟସମୂହ',
    'analytics.export.report': 'ରିପୋର୍ଟ ଏକ୍ସପୋର୍ଟ କରନ୍ତୁ',
    'analytics.generate.report': 'ରିପୋର୍ଟ ତିଆରି କରନ୍ତୁ',
    'analytics.custom.report': 'କସ୍ଟମ ରିପୋର୍ଟ',
    'analytics.timeframe': 'ସମୟସୀମା',
    'analytics.all.subjects': 'ସବୁ ବିଷୟ',
    
    // Settings & Configuration
    'settings.general': 'ସାଧାରଣ ସେଟିଂ',
    'settings.account': 'ଖାତା ସେଟିଂ',
    'settings.privacy': 'ଗୋପନୀୟତା ସେଟିଂ',
    'settings.notifications': 'ନୋଟିଫିକେସନ୍ ସେଟିଂ',
    'settings.appearance': 'ଦୃଶ୍ୟମାନ ସେଟିଂ',
    'settings.learning': 'ଶିକ୍ଷା ପସନ୍ଦ',
    'settings.audio': 'ଅଡିଓ ସେଟିଂ',
    'settings.system': 'ସିଷ୍ଟମ୍ ସେଟିଂ',
    'settings.security': 'ସୁରକ୍ଷା ସେଟିଂ',
    'settings.dark.mode': 'ଡାର୍କ ମୋଡ୍',
    'settings.sound.effects': 'ସାଉଣ୍ଡ ଏଫେକ୍ଟ',
    'settings.background.music': 'ବ୍ୟାକଗ୍ରାଉଣ୍ଡ ସଙ୍ଗୀତ',
    'settings.difficulty.level': 'କଠିନତା ସ୍ତର',
    'settings.email.notifications': 'ଇମେଲ୍ ନୋଟିଫିକେସନ୍',
    'settings.push.notifications': 'ପୁସ୍ ନୋଟିଫିକେସନ୍',
    'settings.share.progress': 'ପ୍ରଗତି ସେୟାର କରନ୍ତୁ',
    'settings.data.collection': 'ଡାଟା ସଂଗ୍ରହ',
    
    // Games & Activities
    'games.categories': 'ଖେଳ ବିଭାଗ',
    'games.difficulty.beginner': 'ଆରମ୍ଭିକ',
    'games.difficulty.intermediate': 'ମଧ୍ୟମ',
    'games.difficulty.advanced': 'ଉନ୍ନତ',
    'games.difficulty.expert': 'ବିଶେଷଜ୍ଞ',
    'games.start.game': 'ଖେଳ ଆରମ୍ଭ କରନ୍ତୁ',
    'games.best.score': 'ସର୍ବୋତ୍କୃଷ୍ଟ ସ୍କୋର୍',
    'games.high.score': 'ଉଚ୍ଚ ସ୍କୋର୍',
    'games.time.limit': 'ସମୟ ସୀମା',
    'games.xp.reward': 'XP ପୁରସ୍କାର',
    'games.multiplayer': 'ବହୁ ଖେଳାଳୀ',
    'games.single.player': 'ଏକଲ ଖେଳାଳୀ',
    'games.collaborative': 'ସହଯୋଗାତ୍ମକ',
    'games.competitive': 'ପ୍ରତିଯୋଗିତାମୂଳକ',
    'games.features': 'ଖେଳ ବିଶେଷତ୍ୱ',
    'games.unlocked': 'ଅନଲକ୍ ହୋଇଛି',
    'games.locked': 'ଲକ୍ ଅଛି',
    'games.completed': 'ସମ୍ପୂର୍ଣ୍ଣ ହୋଇଛି',
    'games.in.progress': 'ଚାଲୁ ଅଛି',
    'games.not.started': 'ଆରମ୍ଭ ହୋଇନାହିଁ',
    
    // Subjects & Learning
    'subjects.mathematics': 'ଗଣିତ',
    'subjects.science': 'ବିଜ୍ଞାନ',
    'subjects.english': 'ଇଂରାଜୀ',
    'subjects.history': 'ଇତିହାସ',
    'subjects.geography': 'ଭୂଗୋଳ',
    'subjects.physics': 'ଭୌତିକ ବିଜ୍ଞାନ',
    'subjects.chemistry': 'ରସାୟନ ବିଜ୍ଞାନ',
    'subjects.biology': 'ଜୀବ ବିଜ୍ଞାନ',
    'subjects.social.studies': 'ସାମାଜିକ ଅଧ୍ୟୟନ',
    'subjects.literature': 'ସାହିତ୍ୟ',
    'subjects.language.arts': 'ଭାଷା କଳା',
    'subjects.computer.science': 'କମ୍ପିଉଟର ବିଜ୍ଞାନ',
    
    // Dashboard Messages
    'message.welcome.back': 'ପୁନରାୟ ସ୍ୱାଗତ',
    'message.good.morning': 'ସୁପ୍ରଭାତ',
    'message.good.afternoon': 'ନମସ୍କାର',
    'message.good.evening': 'ନମସ୍କାର',
    'message.congratulations': 'ଅଭିନନ୍ଦନ',
    'message.well.done': 'ବହୁତ ଭାଲ',
    'message.keep.going': 'ଆଗକୁ ବଢ଼ନ୍ତୁ',
    'message.great.job': 'ବହୁତ ଭାଲ କାମ',
    'message.loading.data': 'ଡାଟା ଲୋଡ୍ ହେଉଛି...',
    'message.no.data': 'କୋଣସି ଡାଟା ନାହିଁ',
    'message.error.occurred': 'ଏକ ତ୍ରୁଟି ଘଟିବ',
    'message.try.again.later': 'ଦୟାକରି ପୁନୃ ଚେଷ୍ଟା କରନ୍ତୁ',
    'message.saved.successfully': 'ସଫଳତାରେ ସେଭ୍ ହେଲା',
    'message.changes.saved': 'ପରିବର୍ତ୍ତନ ସେଭ୍ ହେଲା',
    'message.operation.successful': 'କାର୍ଯ୍ୟ ସଫଳ ହେବ',
  },
}

interface LanguageContextType {
  currentLanguage: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(supportedLanguages[0])
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Load saved language from localStorage only on client side
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('selectedLanguage')
      if (savedLanguage) {
        const language = supportedLanguages.find(lang => lang.code === savedLanguage)
        if (language) {
          setCurrentLanguage(language)
        }
      }
    }
    setIsInitialized(true)
  }, [])

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language)
    // Only save to localStorage if we're on the client side
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedLanguage', language.code)
    }
  }

  const t = (key: string): string => {
    const languageTranslations = translations[currentLanguage.code]
    return languageTranslations?.[key] || translations.en[key] || key
  }

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
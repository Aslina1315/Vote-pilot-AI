/**
 * fallbackAI.js
 * Client-side voting knowledge engine.
 * Activated when the backend is unavailable (network error, no server).
 * Covers all major voting topics with conversational, human-like responses.
 */

const KB = [
  {
    patterns: ['eligible', 'eligibility', 'can i vote', 'qualify', 'citizen', 'age', '18'],
    response: `Namaste! I'd love to help you check your eligibility. 

To vote in India, you just need to meet a few basic criteria:
1. You must be an Indian citizen.
2. You need to be at least 18 years old on the qualifying date.
3. You should be a resident of the constituency where you want to vote.

If you meet these, you're good to go! Shall I help you figure out how to register?`,
  },
  {
    patterns: ['register', 'registration', 'enroll', 'electoral roll', 'voter list', 'form 6', 'form6'],
    response: `Registering is actually quite simple! I can guide you through it.

You just need to visit voters.eci.gov.in or download the Voter Helpline App. Look for "New Voter Registration" and fill out Form 6. You'll need to upload a photo and some basic proof of age and address.

Once it's approved, your name will be on the list and you'll get your Voter ID (EPIC) card. Want to know what ID documents are accepted?`,
  },
  {
    patterns: ['id', 'identity', 'epic', 'document', 'proof', 'what to bring', 'carry', 'aadhaar', 'pan', 'passport'],
    response: `Great question. You definitely need to bring a valid photo ID to the polling booth, even if your name is on the list!

Your EPIC (Voter ID) card is best, but if you don't have it, don't worry. You can bring your Aadhaar Card, PAN Card, Driving Licence, or Passport. Just make sure you have one of those with you when you go to vote.

Have you figured out where your polling station is yet?`,
  },
  {
    patterns: ['evm', 'machine', 'vote', 'how to vote', 'ballot', 'press', 'button', 'cast'],
    response: `Casting your vote on the EVM (Electronic Voting Machine) is really quick.

When you go inside the booth, you'll see the machine with candidates' names and symbols. Just press the blue button next to the candidate you want to vote for. You'll hear a clear "beep" sound, and a red light will glow to confirm your vote was recorded. 

Remember, your vote is completely secret! Is there anything else you'd like to know about the process?`,
  },
  {
    patterns: ['polling station', 'booth', 'where', 'location', 'find', 'nearest'],
    response: `I can help you find exactly where you need to go!

You must vote at your specifically assigned polling station. The easiest way to find it is to use the Voter Helpline App or visit voters.eci.gov.in and search for your name. You can also just SMS your EPIC number to 1950. 

I highly recommend checking this a few days before the election so you know exactly where to go.`,
  },
  {
    patterns: ['nota', 'none of the above', 'reject'],
    response: `Ah, NOTA! Yes, that stands for "None of the Above".

It's the very last button on the EVM. If you don't feel any of the candidates are suitable, you can press NOTA. It's a great way to participate in democracy and express your opinion, even if you're not choosing a specific candidate.

Your NOTA vote is counted and officially recorded.`,
  },
  {
    patterns: ['first time', 'first-time', 'new voter', 'beginner', 'never voted'],
    response: `Welcome! Voting for the first time is such an exciting milestone! 🎉

I'm so glad you're here. Basically, you'll need to register first (using Form 6 on the ECI website). Once you have your Voter ID, you just find your booth, show up on election day with your ID, and press the button on the machine.

Don't worry, the polling officers are very helpful. What's on your mind? Shall we start with registering?`,
  },
  {
    patterns: ['ink', 'indelible', 'finger', 'mark'],
    response: `Yes, the famous voting ink! 🖋️

Before you cast your vote, an officer will put a small mark of indelible ink on your left index finger. It's a special ink that doesn't wash off easily, ensuring everyone only votes once. It usually fades away in a couple of weeks.

Wear it proudly—it shows you've done your part for the country!`,
  },
  {
    patterns: ['result', 'count', 'win', 'election result', 'who won'],
    response: `Election results are always exciting to watch. 

After voting is done, the EVMs are sealed and kept under heavy security. Then, on a scheduled counting day, all the votes are counted round by round. The candidate with the most votes in their constituency wins.

You can follow the live results on the official ECI website or any news channel.`,
  },
  {
    patterns: ['hi', 'hello', 'hey', 'namaste', 'greetings', 'morning', 'afternoon', 'evening'],
    response: `Namaste! I'm your Election Guide. I'm here to help you get ready to vote. Do you want to check if you're eligible or find out how to register?`,
  },
  {
    patterns: ['who are you', 'what are you', 'are you a bot', 'your name', 'what is your name'],
    response: `I'm your friendly Booth Level Officer (BLO) and Election Guide! I don't have a personal name, but my job is to make sure your voting experience is perfectly smooth. How can I help you today?`,
  },
  {
    patterns: ['food', 'movie', 'weather', 'game', 'sports', 'cricket', 'song', 'joke', 'story', 'tell me', 'code', 'write', 'explain', 'why'],
    response: `I'd love to chat about that! However, my core programming is purely dedicated to being your Election Guide. I don't have access to general internet knowledge outside of the voting process. 

Shall we talk about getting you registered or finding your polling station instead?`,
  },
  {
    patterns: ['help', 'what can you do', 'what do you know', 'topics', 'ask'],
    response: `Hello! I'm your friendly Election Guide here to help you with anything related to voting. 🗳️

I can assist you with:
- Finding out if you're eligible
- Registering to vote or getting your EPIC card
- Knowing what ID to bring to the booth
- Finding your exact polling station
- Understanding how to use the EVM

Feel free to ask me any question directly, like "How do I register?" or "Where is my polling booth?" How can I help you today?`,
  },
];

const findBestMatch = (message) => {
  const lower = message.toLowerCase();
  let best = null;
  let bestScore = 0;

  for (const entry of KB) {
    const score = entry.patterns.filter((p) => lower.includes(p)).length;
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  return bestScore > 0 ? best : null;
};

const TRANSLATIONS = {
  hi: "नमस्ते! मैं आपका चुनाव मार्गदर्शक (BLO) हूँ। मैं चुनाव, मतदान पहचान पत्र, और EVM से संबंधित आपकी मदद कर सकता हूँ। आप क्या जानना चाहेंगे?",
  bn: "নমস্কার! আমি আপনার নির্বাচন গাইড (BLO)। নির্বাচন, ভোটার আইডি এবং ইভিএম সম্পর্কে আমি আপনাকে সাহায্য করতে পারি। আপনি কি জানতে চান?",
  te: "నమస్కారం! నేను మీ ఎన్నికల గైడ్ (BLO). ఎన్నికలు, ఓటరు ID మరియు EVM ల గురించి నేను మీకు సహాయపడగలను. మీరు ఏమి తెలుసుకోవాలనుకుంటున్నారు?",
  mr: "नमस्कार! मी तुमचा निवडणूक मार्गदर्शक (BLO) आहे. निवडणुका, मतदार ओळखपत्र आणि ईव्हीएम बद्दल मी तुम्हाला मदत करू शकतो. तुम्हाला काय जाणून घ्यायचे आहे?",
  ta: "வணக்கம்! நான் உங்கள் தேர்தல் வழிகாட்டி (BLO). தேர்தல், வாக்காளர் அடையாள அட்டை மற்றும் EVM குறித்து நான் உங்களுக்கு உதவ முடியும். நீங்கள் என்ன அறிய விரும்புகிறீர்கள்?",
  ur: "آداب! میں آپ کا الیکشن گائیڈ (BLO) ہوں۔ میں الیکشن، ووٹر آئی ڈی اور ای وی ایم کے بارے میں آپ کی مدد کر سکتا ہوں۔ آپ کیا جاننا چاہتے ہیں؟",
  gu: "નમસ્તે! હું તમારો ચૂંટણી માર્ગદર્શક (BLO) છું. હું તમને ચૂંટણી, મતદાર ID અને EVM વિશે મદદ કરી શકું છું. તમે શું જાણવા માંગો છો?",
  kn: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಚುನಾವಣಾ ಮಾರ್ಗದರ್ಶಿ (BLO). ಚುನಾವಣೆಗಳು, ಮತದಾರರ ID ಮತ್ತು EVM ಕುರಿತು ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಬಹುದು. ನೀವು ಏನನ್ನು ತಿಳಿಯಲು ಬಯಸುತ್ತೀರಿ?",
  or: "ନମସ୍କାର! ମୁଁ ଆପଣଙ୍କ ନିର୍ବାଚନ ଗାଇଡ୍ (BLO)। ମୁଁ ଆପଣଙ୍କୁ ନିର୍ବାଚନ, ଭୋଟର ID ଏବଂ EVM ବିଷୟରେ ସାହାଯ୍ୟ କରିପାରିବି। ଆପଣ କ'ଣ ଜାଣିବାକୁ ଚାହୁଁଛନ୍ତି?",
  ml: "നമസ്കാരം! ഞാൻ നിങ്ങളുടെ തിരഞ്ഞെടുപ്പ് ഗൈഡാണ് (BLO). തിരഞ്ഞെടുപ്പ്, വോട്ടർ ഐഡി, ഇവിഎം എന്നിവയെക്കുറിച്ച് എനിക്ക് നിങ്ങളെ സഹായിക്കാനാകും. നിങ്ങൾക്ക് എന്താണ് അറിയേണ്ടത്?",
  pa: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ ਚੋਣ ਗਾਈਡ (BLO) ਹਾਂ। ਮੈਂ ਚੋਣਾਂ, ਵੋਟਰ ਆਈਡੀ ਅਤੇ ਈਵੀਐਮ ਬਾਰੇ ਤੁਹਾਡੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ। ਤੁਸੀਂ ਕੀ ਜਾਣਨਾ ਚਾਹੁੰਦੇ ਹੋ?",
  as: "নমস্কাৰ! মই আপোনাৰ নিৰ্বাচন গাইড (BLO)। মই আপোনাক নিৰ্বাচন, ভোটাৰ আইডি আৰু ইভিএমৰ বিষয়ে সহায় কৰিব পাৰো। আপুনি কি জানিব বিচাৰে?",
  mai: "प्रणाम! हम अहाँक चुनाव गाइड (BLO) छी। हम अहाँक चुनाव, वोटर आईडी आ EVM क बारे मे मद्दत क सकैत छी। अहाँ की जानय चाहैत छी?",
  sat: "ᱡᱚᱦᱟᱨ! ᱤᱧ ᱫᱚ ᱟᱢᱟᱜ ᱵᱟᱪᱷᱱᱟᱣ ᱜᱟᱭᱤᱰ (BLO) ᱠᱟᱱᱟᱧ᱾ ᱤᱧ ᱵᱟᱪᱷᱱᱟᱣ, ᱵᱷᱚᱴᱚᱨ ᱟᱭᱰᱤ ᱟᱨ ᱤᱵᱷᱤᱮᱢ ᱵᱟᱵᱚᱛ ᱛᱮ ᱜᱚᱲᱚ ᱫᱟᱲᱮᱭᱟᱢᱟ᱾ ᱟᱢ ᱪᱮᱫ ᱵᱟᱰᱟᱭ ᱥᱟᱱᱟᱢ ᱠᱟᱱᱟ?",
  ks: "آداب! بہ چھس تُہُند اِلیکشن گایِڈ (BLO)۔ بہ کِتھ کٔنۍ ہیکہِ تُہٕنٛز مَدَتھ کٔرِتھ؟",
  ne: "नमस्ते! म तपाईंको निर्वाचन गाइड (BLO) हुँ। म तपाईंलाई निर्वाचन, मतदाता परिचयपत्र र ईभीएमको बारेमा मद्दत गर्न सक्छु। तपाईं के जान्न चाहनुहुन्छ?",
  kok: "नमस्कार! हांव तुमचो वेंचणूक मार्गदर्शक (BLO). हांव तुमकां कशी मजत करपाक शकता?",
  sd: "سلام! مان توهان جو اليڪشن گائيڊ (BLO) آهيان. مان توهان جي ڪيئن مدد ڪري سگهان ٿو؟",
  doi: "नमस्ते! मैं तुंदा चुनाव गाइड (BLO) हां। मैं तुंदी केह मदद करी सकदा हां?",
  mni: "খুরুমজরি! ঐহাক অদোমগী মীখলগী লমজিংবনি (BLO)। ঐহাক্না অদোমবু করম্না মতেং পাংবা ঙমগদগে?",
  brx: "खुलुमबाय! आं नोंथांनि बिसायखथि दिन्थिगिरि (BLO)। आं नोंथांखौ माबोरै हेफाजाब होनो हागोन?",
  sa: "नमस्ते! अहम् भवतः निर्वाचनमार्गदर्शकः (BLO) अस्मि। अहम् भवतः कथं साहाय्यं कर्तुं शक्नोमि?"
};

const FILLERS = [
  "That's a great question! ",
  "Ah, I see what you mean. ",
  "I'm glad you asked! ",
  "Sure thing, let me help you with that. ",
  "Let me explain that for you. "
];

const DEFAULT_RESPONSE = {
  en: `That's an interesting point! Since I am an AI specifically designed to help you with the Indian election process, my brain is completely focused on voting, polling booths, and eligibility. 

Is there anything specific you need help with regarding the upcoming elections, like finding your booth or registering to vote?`,
  ta: `மன்னிக்கவும், நான் ஒரு தேர்தல் வழிகாட்டி என்பதால், தேர்தல் மற்றும் வாக்குச்சாவடி குறித்த தகவல்களை மட்டுமே என்னால் வழங்க முடியும். வாக்காளர் பதிவு அல்லது உங்கள் வாக்குச்சாவடி பற்றி ஏதேனும் அறிய விரும்புகிறீர்களா?`
};

export const getFallbackResponse = (message, langCode = 'en', messages = []) => {
  const lower = message.toLowerCase();

  // 1. Contextual Awareness (Thinking based on previous AI message)
  if (['yes', 'yeah', 'yep', 'sure', 'ok', 'okay', 'yes please', 'do it'].includes(lower)) {
    const lastAiMsg = messages.filter(m => m.role === 'ai').pop();
    if (lastAiMsg && lastAiMsg.text) {
      const txt = lastAiMsg.text.toLowerCase();
      if (txt.includes('register')) return "Awesome! To register, go to voters.eci.gov.in and fill out Form 6. You'll need a passport photo and age proof. Need help with that?";
      if (txt.includes('eligible')) return "Alright! To be eligible, you must be 18+ and an Indian citizen. Do you meet those criteria?";
      if (txt.includes('id documents') || txt.includes('what id')) return "Perfect. You can bring your Aadhaar, PAN, Passport, or Driving Licence. Do you have one of those ready?";
    }
    return "Great! What would you like to do next?";
  }

  if (['no', 'nope', 'nah', 'no thanks', 'not really'].includes(lower)) {
    const lastAiMsg = messages.filter(m => m.role === 'ai').pop();
    if (lastAiMsg && lastAiMsg.text && lastAiMsg.text.toLowerCase().includes('eligible')) {
      return "That's perfectly fine! If you aren't 18 yet or aren't an Indian citizen, you won't be able to vote this time. But I'm here when you are ready!";
    }
    return "No worries at all! Just let me know when you're ready or if you have any other questions about elections.";
  }

  // 2. Common Small Talk & Humanizing Triggers
  if (lower.includes('thank') || lower.includes('thx')) {
    return "You are very welcome! I'm always happy to help. Is there anything else you need to know about voting?";
  }
  
  if (lower.includes('bye') || lower.includes('goodbye') || lower.includes('see you')) {
    return "Goodbye! Remember, your vote is your voice. Have a wonderful day!";
  }

  if (lower.includes('who made you') || lower.includes('creator') || lower.includes('who created you')) {
    return "I am VotePilot AI, an intelligent Election Guide designed to help Indian citizens navigate the democratic process smoothly!";
  }
  
  if (lower.includes('are you human') || lower.includes('are you a bot') || lower.includes('are you real')) {
    return "I'm an AI assistant! But I try my best to be as helpful and human-like as possible. My goal is to make your voting journey super easy.";
  }

  if (lower.includes('what time') || lower.includes('date')) {
    return "I don't keep track of the live clock, but elections usually happen between 7:00 AM and 6:00 PM on polling days! Make sure to check your specific phase date.";
  }

  // 3. Dynamic Human-Like Interceptor for Names
  const cleanStr = lower.replace(/[^a-z0-9 ]/g, '').replace(/m\s*y\s*name/g, 'my name');
  const nameMatch = cleanStr.match(/(?:my name is|my name|name is|i am|im|call me|myself|this is) ([a-z]{2,})/i);
  if (nameMatch && nameMatch[1] && !['eligible', 'voting', 'ready', 'a', 'the', 'not'].includes(nameMatch[1])) {
    const name = nameMatch[1].charAt(0).toUpperCase() + nameMatch[1].slice(1);
    if (langCode === 'en') return `It is so wonderful to meet you, ${name}! I am your personal Election Guide. How can I help you get ready to vote today?`;
    if (langCode === 'ta') return `உங்களை சந்தித்ததில் மகிழ்ச்சி, ${name}! நான் உங்கள் தேர்தல் வழிகாட்டி. இன்று நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?`;
    
    // Dynamically inject the user's name into their native language greeting!
    const baseResponse = TRANSLATIONS[langCode] || TRANSLATIONS['hi'];
    return baseResponse.replace('!', `, ${name}!`);
  }

  // 4. Dynamic Human-Like Interceptor for Well-being
  if (lower.includes('how are you') || lower.includes("how're you") || lower.includes("what's up")) {
    if (langCode === 'en') return "I'm doing wonderfully, thank you so much for asking! I'm fully charged and ready to help you with anything related to the upcoming elections. What's on your mind?";
    if (langCode === 'ta') return "நான் மிகவும் நன்றாக இருக்கிறேன், கேட்டதற்கு நன்றி! தேர்தல் குறித்து உங்களுக்கு உதவ நான் தயாராக உள்ளேன். நீங்கள் என்ன அறிய விரும்புகிறீர்கள்?";
    return TRANSLATIONS[langCode] || TRANSLATIONS['hi'];
  }

  const match = findBestMatch(message);
  
  // If no match is found, return the language-specific default response.
  if (!match) {
    if (langCode === 'en') return DEFAULT_RESPONSE.en;
    if (langCode === 'ta') return DEFAULT_RESPONSE.ta;
    // For all other Indian languages, return the translated welcome string.
    return TRANSLATIONS[langCode] || TRANSLATIONS['hi'];
  }

  // If there is a match, make it feel more human in English!
  if (langCode === 'en') {
    const isGreetingOrOfftopic = match.patterns.includes('hi') || match.patterns.includes('food') || match.patterns.includes('your name') || match.patterns.includes('help');
    if (isGreetingOrOfftopic) {
      return match.response; // Don't add filler to greetings
    }
    const filler = FILLERS[Math.floor(Math.random() * FILLERS.length)];
    return filler + match.response;
  }
  
  // Tamil mappings
  if (langCode === 'ta') {
    if (match.patterns.includes('eligible')) return 'வணக்கம்! நீங்கள் வாக்களிக்க தகுதியானவரா என்பதை சரிபார்க்க நான் உதவுகிறேன். நீங்கள் 18 வயது நிரம்பிய இந்திய குடிமகனாக இருக்க வேண்டும். நான் எவ்வாறு உதவலாம்?';
    if (match.patterns.includes('register')) return 'வாக்காளர் பதிவு மிகவும் எளிதானது! நீங்கள் voters.eci.gov.in என்ற இணையதளத்தில் படிவம் 6-ஐ நிரப்பலாம். இதற்கு உங்கள் புகைப்படம் மற்றும் வயது சான்றிதழ் தேவை. மேலும் தகவல் வேண்டுமா?';
    if (match.patterns.includes('id')) return 'மிக நல்ல கேள்வி! வாக்களிக்க EPIC (வாக்காளர் அடையாள அட்டை), ஆதார் அட்டை, பான் அட்டை அல்லது பாஸ்போர்ட் போன்ற ஏதேனும் ஒரு புகைப்பட அடையாள ஆவணத்தை கட்டாயம் கொண்டு செல்ல வேண்டும்.';
    if (match.patterns.includes('evm')) return 'EVM (மின்னணு வாக்குப்பதிவு இயந்திரம்) மூலம் வாக்களிப்பது மிகவும் எளிது. இயந்திரத்தில் உங்கள் வேட்பாளரின் பெயருக்கு அருகிலுள்ள நீல நிற பொத்தானை அழுத்தவும். பீப் சத்தம் மற்றும் சிவப்பு விளக்கு உங்கள் வாக்கை உறுதி செய்யும்.';
    if (match.patterns.includes('polling station')) return 'உங்கள் வாக்குச் சாவடியைக் கண்டறிய நான் உதவுகிறேன். நீங்கள் Voter Helpline App அல்லது voters.eci.gov.in இணையதளத்தைப் பயன்படுத்தலாம். அல்லது 1950 என்ற எண்ணுக்கு உங்கள் EPIC எண்ணை குறுஞ்செய்தி அனுப்பலாம்.';
    if (match.patterns.includes('first time')) return 'வரவேற்கிறோம்! முதல் முறையாக வாக்களிப்பது ஒரு சிறந்த அனுபவம். முதலில் படிவம் 6 மூலம் பதிவு செய்யுங்கள். பிறகு உங்கள் வாக்குச்சாவடிக்கு சென்று வாக்களிக்கலாம். நான் எவ்வாறு வழிகாட்ட வேண்டும்?';
    if (match.patterns.includes('food')) return 'மன்னிக்கவும்! நான் தேர்தல் மற்றும் வாக்களிப்பு தொடர்பான கேள்விகளுக்கு மட்டுமே பதிலளிக்க முடியும். வாக்காளர் பதிவு அல்லது வாக்குச்சாவடி பற்றி நீங்கள் ஏதேனும் அறிய வேண்டுமா?';
    if (match.patterns.includes('hi')) return 'வணக்கம்! நான் உங்கள் தேர்தல் வழிகாட்டி. நீங்கள் வாக்களிக்க தயாராக நான் உதவுகிறேன். நீங்கள் வாக்காளர் பதிவு பற்றி அறிய வேண்டுமா?';
    return 'வணக்கம்! நான் உங்கள் தேர்தல் வழிகாட்டி. வாக்காளர் பதிவு, தகுதி அறிதல், வாக்குச்சாவடி கண்டறிதல் மற்றும் EVM பயன்பாடு பற்றி நான் உங்களுக்கு உதவ முடியும். உங்கள் கேள்வியைக் கேளுங்கள்!';
  }

  // For any other 20 Indian languages, respond in that exact language
  return TRANSLATIONS[langCode] || TRANSLATIONS['hi'];
};

export let usingFallback = false;
export const setFallbackMode = (val) => { usingFallback = val; };


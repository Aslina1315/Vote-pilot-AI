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
    patterns: ['name', 'who are you', 'what are you', 'are you a bot', 'your name'],
    response: `I'm your friendly Booth Level Officer (BLO) and Election Guide! I don't have a personal name, but my job is to make sure your voting experience is perfectly smooth. How can I help you today?`,
  },
  {
    patterns: ['food', 'movie', 'weather', 'game', 'sports', 'cricket', 'song', 'joke'],
    response: `I'd love to chat about that, but my specialty is strictly elections and voting! 🗳️ 

I'm here to guide you through registering, finding your polling station, or understanding the EVM. Shall we talk about getting you ready for election day?`,
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

const DEFAULT_RESPONSE = `I'm so sorry, I didn't quite catch that. Could you rephrase your question for me?

I can help you with things like:
- "How do I register to vote?"
- "What ID do I need?"
- "How does the voting machine work?"

Just let me know what you need help with!`;

export const getFallbackResponse = (message) => {
  const match = findBestMatch(message);
  return match ? match.response : DEFAULT_RESPONSE;
};

export let usingFallback = false;
export const setFallbackMode = (val) => { usingFallback = val; };

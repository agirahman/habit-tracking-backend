import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const modelAi = "gemini-2.5-flash"

const DEFAULT_MOTIVATIONS = [
  'Keep taking small steps today. Every effort counts!!',
  "You've made progress. Stay consistent, results will come.",
  'One more day to a new habit. You can do it!',
];

const safeExtractText = (res) => {
  if (!res) return '';
  try {
    // Newer SDK: res.response.text() function
    if (res.response && typeof res.response.text === 'function') {
      return String(res.response.text()).trim();
    }

    // Older/alternative formats
    if (res.output && Array.isArray(res.output) && res.output.length) {
      // concatenate content pieces
      return res.output
        .map((o) => (o.content || []).map((c) => c.text || c).join(''))
        .join('\n')
        .trim();
    }

    if (res.candidates && res.candidates[0] && res.candidates[0].content) {
      return (res.candidates[0].content || []).map((c) => c.text || c).join('').trim();
    }

    // fallback to stringifying small responses
    if (typeof res === 'string') return res.trim();
    return '';
  } catch (e) {
    return '';
  }
};

export const getDailyMotivation = async (habits, userName) => {
  try {
    const model = genAI.getGenerativeModel({ model: modelAi });

    const habitSummary = (habits || [])
      .map((h) => `${h.name} (${(h.records || []).filter((r) => r.completed).length} completed)`)
      .join(', ');

    const prompt = `Generate a SHORT motivational message (1-2 sentences) in Indonesian for ${userName}. Their habits: ${habitSummary}. Be personal and encouraging.`;

    const result = await model.generateContent(prompt);
    const text = safeExtractText(result);

    if (!text) {
      // Return a random default motivational message if AI returns empty
      return DEFAULT_MOTIVATIONS[Math.floor(Math.random() * DEFAULT_MOTIVATIONS.length)];
    }

    return text;
  } catch (err) {
    console.error('AI getDailyMotivation error:', err.message || err);
    return DEFAULT_MOTIVATIONS[Math.floor(Math.random() * DEFAULT_MOTIVATIONS.length)];
  }
};

export const suggestHabits = async (existingHabits) => {
  try {
    const model = genAI.getGenerativeModel({ model: modelAi });
    const habitNames = (existingHabits || []).map((h) => h.name).join(', ');

    const prompt = `User has these habits: ${habitNames}. Suggest 3 complementary habits to build. Return ONLY JSON array: [{ name: string, category: string }]. No markdown.`;

    const result = await model.generateContent(prompt);
    const text = safeExtractText(result);

    try {
      return JSON.parse(text);
    } catch (e) {
      return [];
    }
  } catch (err) {
    console.error('AI suggestHabits error:', err.message || err);
    return [];
  }
};

export default { getDailyMotivation, suggestHabits };

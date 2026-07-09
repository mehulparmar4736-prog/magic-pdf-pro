export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { topic } = req.body;
    
    const prompt = `You are a document writer. Topic: "${topic}"
    
Return ONLY a JSON object with exactly these fields:
{
  "correctedTitle": "corrected topic title",
  "subtitle": "subtitle",
  "introduction": "250+ word introduction",
  "sections": [
    {"title": "title1", "content": "200+ words", "imageQuery": "keyword"},
    {"title": "title2", "content": "200+ words", "imageQuery": "keyword"},
    {"title": "title3", "content": "200+ words", "imageQuery": "keyword"},
    {"title": "title4", "content": "200+ words", "imageQuery": "keyword"},
    {"title": "title5", "content": "200+ words", "imageQuery": "keyword"}
  ],
  "keyFacts": ["fact1","fact2","fact3","fact4","fact5","fact6"],
  "conclusion": "150+ word conclusion"
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8192,
            responseMimeType: "application/json"
          }
        })
      }
    );

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0]) {
      return res.status(500).json({ error: 'No response from Gemini' });
    }
    
    const text = data.candidates[0].content.parts[0].text || '{}';
    res.status(200).json({ content: [{ text }] });
    
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
        }

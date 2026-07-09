export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { topic } = req.body;
    const prompt = `You are a document writer. Topic: "${topic}". Return ONLY a JSON object with these exact fields: correctedTitle, subtitle, introduction (250+ words), sections (array of 5 objects each with title, content 200+ words, imageQuery), keyFacts (array of 6 strings), conclusion (150+ words).`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 8192 }
        })
      }
    );

    const data = await response.json();
    if (!data.candidates?.[0]) return res.status(500).json({ error: 'No response' });
    const text = data.candidates[0].content.parts[0].text || '{}';
    res.status(200).json({ content: [{ text }] });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
}

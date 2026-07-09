export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { topic } = req.body;
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: topic }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 8192 }
        })
      }
    );

    const responseText = await response.text();
    console.log('Status:', response.status);
    console.log('Response:', responseText.substring(0, 500));
    
    if (!response.ok) {
      return res.status(200).json({ 
        content: [{ text: JSON.stringify({
          correctedTitle: topic,
          subtitle: "Document",
          introduction: "Error: " + responseText.substring(0, 200),
          sections: [
            {title: "Error", content: responseText.substring(0, 200), imageQuery: "error"}
          ],
          keyFacts: ["API Error occurred"],
          conclusion: "Please check API key"
        })}]
      });
    }
    
    const data = JSON.parse(responseText);
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    res.status(200).json({ content: [{ text }] });
    
  } catch(err) {
    console.log('Catch error:', err.message);
    res.status(200).json({ 
      content: [{ text: JSON.stringify({
        correctedTitle: topic || "Document",
        subtitle: "Error occurred",
        introduction: "Error: " + err.message,
        sections: [{title: "Error", content: err.message, imageQuery: "document"}],
        keyFacts: [err.message],
        conclusion: "Please try again"
      })}]
    });
  }
      }

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { topic } = req.body;

    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://magic-pdf-pro.vercel.app',
          'X-Title': 'Magic PDF Pro'
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.1-8b-instruct:free',
          messages: [{ role: 'user', content: topic }],
          max_tokens: 8192
        })
      }
    );

    const data = await response.json();
    console.log('OpenRouter response:', JSON.stringify(data).substring(0, 300));
    
    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }
    
    const text = data.choices?.[0]?.message?.content || '{}';
    res.status(200).json({ content: [{ text }] });
    
  } catch(err) {
    console.log('Error:', err.message);
    res.status(500).json({ error: err.message });
  }
          }

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=86400');
  
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'No URL' });

  try {
    // Direct Unsplash image fetch
    const imageUrl = `https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&h=350&fit=crop`;
    
    const imgRes = await fetch(imageUrl);
    const buffer = await imgRes.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const mimeType = 'image/jpeg';
    
    res.status(200).json({ 
      data: `data:${mimeType};base64,${base64}` 
    });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
      }

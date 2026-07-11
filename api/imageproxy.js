export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=86400');
  
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'No URL' });

  try {
    // Unsplash API - topic specific
    const query = encodeURIComponent(url);
    const unsplashUrl = `https://api.unsplash.com/photos/random?query=${query}&w=700&h=350&fit=crop&client_id=your_access_key`;
    
    // Use direct Unsplash source with topic keyword
    const imageUrl = `https://source.unsplash.com/700x350/?${query}`;
    
    const imgRes = await fetch(imageUrl, {
      headers: { 'User-Agent': 'MagicPDFPro/1.0' }
    });
    
    if (!imgRes.ok) throw new Error('Image fetch failed');
    
    const buffer = await imgRes.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const mimeType = imgRes.headers.get('content-type') || 'image/jpeg';
    
    res.status(200).json({ 
      data: `data:${mimeType};base64,${base64}` 
    });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
        }

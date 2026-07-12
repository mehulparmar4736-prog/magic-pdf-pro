export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=86400');
  
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'No URL' });

  try {
    const query = encodeURIComponent(url);
    const pexelsRes = await fetch(
      `https://api.pexels.com/v1/search?query=${query}&per_page=1&orientation=landscape`,
      {
        headers: {
          'Authorization': process.env.PEXELS_API_KEY
        }
      }
    );
    
    const pexelsData = await pexelsRes.json();
    const imageUrl = pexelsData?.photos?.[0]?.src?.large;
    
    if (!imageUrl) throw new Error('No image found');
    
    const imgRes = await fetch(imageUrl);
    const buffer = await imgRes.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const mimeType = imgRes.headers.get('content-type') || 'image/jpeg';
    
    res.status(200).json({ 
      data: `data:${mimeType};base64,${base64}` 
    });
  } catch(err) {
    // Fallback picsum
    try {
      const fallback = await fetch(`https://picsum.photos/seed/${encodeURIComponent(url)}/700/350`);
      const buffer = await fallback.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      res.status(200).json({ data: `data:image/jpeg;base64,${base64}` });
    } catch {
      res.status(500).json({ error: 'Failed' });
    }
  }
  }

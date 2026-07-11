export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'No URL' });

  try {
    const response = await fetch(
      `https://source.unsplash.com/featured/700x350/?${encodeURIComponent(url)}`
    );
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const mimeType = response.headers.get('content-type') || 'image/jpeg';
    
    res.setHeader('Cache-Control', 's-maxage=86400');
    res.status(200).json({ 
      data: `data:${mimeType};base64,${base64}` 
    });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
}

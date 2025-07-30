const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const videoUrl = req.query.url;
    if (!videoUrl) {
      return res.status(400).json({ error: 'Missing video URL' });
    }

    console.log('Proxying video URL:', videoUrl);

    const response = await fetch(videoUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
        'Referer': 'https://weibo.com',
        'Origin': 'https://weibo.com',
      },
    });

    if (!response.ok) {
      throw new Error(`Fetch failed with status ${response.status}`);
    }

    // 设置响应头
    res.setHeader('Content-Type', response.headers.get('content-type') || 'video/mp4');
    res.setHeader('Content-Length', response.headers.get('content-length') || '');
    
    // 流式传输
    response.body.pipe(res);
    
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: error.message });
  }
};
// 简单的重定向代理
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

    console.log('Redirecting to video URL:', videoUrl);

    // 直接重定向到视频 URL
    res.redirect(videoUrl);
    
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: error.message });
  }
};
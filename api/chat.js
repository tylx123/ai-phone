export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const { platform, apiKey, model, messages } = req.body;

  // 增加参数校验，提前拦截不完整请求
  if (!platform || !apiKey || !model || !messages) {
    return res.status(400).json({ error: '缺少必要参数' });
  }

  const platformUrls = {
    openai: "https://api.openai.com/v1/chat/completions",
    doubao: "https://ark.cn-beijing.volces.com/api/v3/chat/completions",
    deepseek: "https://api.deepseek.com/chat/completions",
    openrouter: "https://openrouter.ai/api/v1/chat/completions"
  };

  let url = platformUrls[platform] || platform;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({ model, messages })
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

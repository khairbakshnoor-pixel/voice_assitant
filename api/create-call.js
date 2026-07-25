export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.RETELL_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server not configured: missing Retell API key' });
  }

  try {
    const { agent_id } = req.body;

    const response = await fetch('https://api.retellai.com/v2/create-web-call', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ agent_id })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('Retell call creation error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

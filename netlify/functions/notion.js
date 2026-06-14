// netlify/functions/notion.js
// Proxies all Notion API calls server-side so the browser never hits CORS
// and the token is only ever sent from the user's machine -> Netlify -> Notion.
const https = require('https');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  let endpoint, token, body, method;
  try {
    ({ endpoint, token, body, method } = JSON.parse(event.body || '{}'));
  } catch (e) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'bad request body' }) };
  }
  if (!token) return { statusCode: 401, headers, body: JSON.stringify({ error: 'missing token' }) };

  // Query endpoints POST a body; GET-style reads (block children, page reads) send none.
  const isQuery = endpoint.includes('/query');
  const httpMethod = method || (isQuery ? 'POST' : 'GET');
  const postData = httpMethod === 'POST'
    ? JSON.stringify(body || { page_size: 100 })
    : null;

  const result = await new Promise((resolve) => {
    const options = {
      hostname: 'api.notion.com',
      path: `/v1/${endpoint}`,
      method: httpMethod,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
        ...(postData ? { 'Content-Length': Buffer.byteLength(postData) } : {})
      }
    };
    const req = https.request(options, (res) => {
      let raw = '';
      res.on('data', c => raw += c);
      res.on('end', () => {
        let data;
        try { data = JSON.parse(raw); } catch (e) { data = { error: 'parse error', raw }; }
        resolve({ status: res.statusCode, data });
      });
    });
    req.on('error', e => resolve({ status: 500, data: { error: e.message } }));
    if (postData) req.write(postData);
    req.end();
  });

  return { statusCode: result.status, headers, body: JSON.stringify(result.data) };
};

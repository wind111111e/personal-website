import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getJWTToken } from '@coze/api';

// Cache the token to avoid regenerating it on every request
let cachedToken: string | null = null;
let tokenExpiration: number = 0;

async function getValidToken() {
  const now = Math.floor(Date.now() / 1000);
  
  // Return cached token if it's still valid for at least 5 minutes
  if (cachedToken && tokenExpiration > now + 300) {
    return cachedToken;
  }

  // Get credentials from environment variables
  // In Vercel, it's recommended to use regular env vars (without VITE_ prefix) for backend secrets
  const appId = process.env.COZE_APP_ID || process.env.VITE_COZE_APP_ID;
  const keyid = process.env.COZE_KEY_ID || process.env.VITE_COZE_KEY_ID;
  const privateKey = process.env.COZE_PRIVATE_KEY || process.env.VITE_COZE_PRIVATE_KEY;
  const baseURL = process.env.COZE_BASE_URL || process.env.VITE_COZE_BASE_URL || 'https://api.coze.cn';
  const aud = baseURL.replace(/^https?:\/\//, '');

  if (!appId || !keyid || !privateKey) {
    throw new Error('Missing JWT OAuth configuration (COZE_APP_ID, COZE_KEY_ID, COZE_PRIVATE_KEY)');
  }

  // Handle potentially escaped newlines in the private key from env vars
  const formattedPrivateKey = privateKey.replace(/\\n/g, '\n');

  const tokenData = await getJWTToken({
    appId,
    keyid,
    privateKey: formattedPrivateKey,
    aud,
    baseURL,
    durationSeconds: 3600
  });

  cachedToken = tokenData.access_token;
  tokenExpiration = now + tokenData.expires_in;
  
  return cachedToken;
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // Only allow POST
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  // Get workflow ID if not passed from frontend (optional security measure)
  const workflowId = process.env.COZE_WORKFLOW_ID || process.env.VITE_COZE_WORKFLOW_ID;

  try {
    const { parameters, workflow_id } = request.body;

    // Use the workflow_id from env if available, otherwise use the one from request
    // This prevents users from using your token to call other workflows
    const targetWorkflowId = workflowId || workflow_id;

    if (!targetWorkflowId) {
      return response.status(400).json({ error: 'Missing workflow_id' });
    }

    // Get JWT Token for authentication
    const token = await getValidToken();

    // Call Coze API
    const cozeResponse = await fetch('https://api.coze.cn/v1/workflow/run', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        workflow_id: targetWorkflowId,
        parameters: parameters || {},
      }),
    });

    const data = await cozeResponse.json();

    if (!cozeResponse.ok) {
      return response.status(cozeResponse.status).json(data);
    }

    return response.status(200).json(data);
  } catch (error: any) {
    console.error('Coze Proxy Error:', error);
    return response.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}

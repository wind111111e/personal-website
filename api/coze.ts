import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // Only allow POST
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  // Get token from environment variable (NOT from frontend)
  // Ensure you set COZE_API_TOKEN in Vercel Environment Variables
  const token = process.env.VITE_COZE_API_TOKEN; 
  
  // Also get workflow ID if not passed from frontend (optional security measure)
  const workflowId = process.env.VITE_COZE_WORKFLOW_ID;

  if (!token) {
    return response.status(500).json({ error: 'Missing API Token configuration' });
  }

  try {
    const { parameters, workflow_id } = request.body;

    // Use the workflow_id from env if available, otherwise use the one from request
    // This prevents users from using your token to call other workflows
    const targetWorkflowId = workflowId || workflow_id;

    if (!targetWorkflowId) {
      return response.status(400).json({ error: 'Missing workflow_id' });
    }

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

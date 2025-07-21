export interface N8nResponse {
  answer?: string;
  data?: Array<Record<string, string | number | boolean>>;
  chart_type?: 'bar' | 'line' | 'pie';
  sql?: string;
  [key: string]: string | number | boolean | Array<Record<string, string | number | boolean>> | undefined;
}

export interface WebhookRequest {
  method?: 'GET' | 'POST';
  question?: string;
  action?: string;
  params?: Record<string, any>;
  data?: any;
}

// Debug function to check environment variables
export function debugEnvironment() {
  console.log('🔍 Environment Variables Debug:');
  console.log('VITE_N8N_WEBHOOK_URL:', import.meta.env.VITE_N8N_WEBHOOK_URL);
  console.log('All VITE_ env vars:', Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')));
  console.log('import.meta.env:', import.meta.env);
}

// Test function to check webhook connectivity
export async function testWebhook(): Promise<{ success: boolean; message: string; details?: any }> {
  debugEnvironment();
  
  const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
  
  if (!webhookUrl) {
    return { success: false, message: 'VITE_N8N_WEBHOOK_URL environment variable is not set' };
  }

  try {
    console.log('🧪 Testing webhook connectivity...');
    
    // Test GET request
    const getResponse = await fetch(webhookUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (getResponse.ok) {
      const data = await getResponse.json();
      return { 
        success: true, 
        message: 'Webhook GET is working!', 
        details: { status: getResponse.status, data } 
      };
    }

    // Test POST request
    const postResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question: 'test', action: 'ping' }),
    });

    if (postResponse.ok) {
      const data = await postResponse.json();
      return { 
        success: true, 
        message: 'Webhook POST is working!', 
        details: { status: postResponse.status, data } 
      };
    } else {
      const errorText = await postResponse.text();
      return { 
        success: false, 
        message: `Webhook returned error: ${postResponse.status}`, 
        details: { status: postResponse.status, error: errorText } 
      };
    }
  } catch (error) {
    return { 
      success: false, 
      message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 
      details: { error } 
    };
  }
}

// Main webhook trigger function with flexible parameters
export async function triggerWebhook(request: WebhookRequest | string): Promise<N8nResponse> {
  debugEnvironment();
  
  const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
  
  if (!webhookUrl) {
    throw new Error('VITE_N8N_WEBHOOK_URL environment variable is not set');
  }

  // Handle string input (backward compatibility)
  const webhookRequest: WebhookRequest = typeof request === 'string' 
    ? { question: request, method: 'POST' }
    : request;

  const method = webhookRequest.method || 'POST';
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  console.log('🔗 Attempting to call n8n webhook:', webhookUrl);
  console.log('📤 Method:', method);
  console.log('📤 Request:', webhookRequest);

  try {
    let url = webhookUrl;
    
    // Add query parameters for GET requests
    if (method === 'GET' && webhookRequest.params) {
      const urlObj = new URL(webhookUrl);
      Object.entries(webhookRequest.params).forEach(([key, value]) => {
        urlObj.searchParams.append(key, String(value));
      });
      url = urlObj.toString();
    }

    let fetchOptions: RequestInit = {
      method,
      headers,
    };

    // Add body for POST requests
    if (method === 'POST') {
      fetchOptions.body = JSON.stringify(webhookRequest);
    }

    const response = await fetch(url, fetchOptions);

    console.log('📥 Response status:', response.status);
    console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Webhook error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Webhook response received:', data);
    return data;
  } catch (error) {
    console.error('❌ Error triggering webhook:', error);
    throw error;
  }
}

// Convenience function for GET requests
export async function triggerWebhookGET(params: Record<string, any> = {}): Promise<N8nResponse> {
  return triggerWebhook({
    method: 'GET',
    params,
  });
}

// Convenience function for POST requests
export async function triggerWebhookPOST(data: any): Promise<N8nResponse> {
  return triggerWebhook({
    method: 'POST',
    data,
  });
}

// Legacy function for backward compatibility
export async function triggerWebhookLegacy(question: string): Promise<N8nResponse> {
  return triggerWebhook({
    method: 'POST',
    question,
  });
}

export async function uploadCsvToWebhook(file: File): Promise<N8nResponse> {
  debugEnvironment();
  
  const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
  
  if (!webhookUrl) {
    throw new Error('VITE_N8N_WEBHOOK_URL environment variable is not set');
  }

  console.log('📁 Uploading CSV to webhook:', webhookUrl);
  console.log('📁 File name:', file.name, 'Size:', file.size);

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('action', 'upload_csv');

    const response = await fetch(webhookUrl, {
      method: 'POST',
      body: formData,
    });

    console.log('📥 Upload response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Upload error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Upload response received:', data);
    return data;
  } catch (error) {
    console.error('❌ Error uploading CSV:', error);
    throw error;
  }
} 
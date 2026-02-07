import type {
  AudioRecord,
  CreateRecordPayload,
  UpdateRecordPayload,
  CreateRecordResponse,
  AudioUrlResponse,
} from '../types/audio-record';

const API_BASE_URL = '/api';

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    // Try to parse error as JSON, but handle cases where it's not JSON
    let errorData;
    const contentType = response.headers.get('content-type');
    
    try {
      if (contentType && contentType.includes('application/json')) {
        errorData = await response.json();
      } else {
        // Not JSON, might be HTML or plain text
        const text = await response.text();
        console.error('Non-JSON error response:', text);
        errorData = { error: 'Server error (non-JSON response)' };
      }
    } catch (parseError) {
      console.error('Failed to parse error response:', parseError);
      errorData = { error: 'Request failed' };
    }
    
    // Build detailed error message
    let errorMessage = errorData.error || `HTTP ${response.status}`;
    
    // Add status code for clarity
    if (!errorMessage.includes(response.status.toString())) {
      errorMessage = `${errorMessage} (${response.status})`;
    }
    
    // If backend provided details, include them
    if (errorData.details) {
      errorMessage += `: ${errorData.details}`;
    }
    
    // If backend provided a hint, include it
    if (errorData.hint) {
      errorMessage += `\n💡 ${errorData.hint}`;
    }
    
    // Add generic troubleshooting for 500 errors
    if (response.status === 500 && !errorData.hint) {
      errorMessage += '\n💡 Check the browser console and backend logs for details. Run "npm run check" to verify your setup.';
    }
    
    // Log to console for debugging
    console.error('API Error:', {
      status: response.status,
      url: response.url,
      error: errorData
    });
    
    throw new Error(errorMessage);
  }
  
  if (response.status === 204) {
    return {} as T;
  }
  
  return response.json();
};

export const fetchRecords = async (): Promise<AudioRecord[]> => {
  const response = await fetch(`${API_BASE_URL}/records`);
  return handleResponse<AudioRecord[]>(response);
};

export const createRecord = async (
  payload: CreateRecordPayload
): Promise<CreateRecordResponse> => {
  const response = await fetch(`${API_BASE_URL}/records`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  return handleResponse<CreateRecordResponse>(response);
};

export const updateRecord = async (
  id: number,
  payload: UpdateRecordPayload
): Promise<AudioRecord> => {
  const response = await fetch(`${API_BASE_URL}/records/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  return handleResponse<AudioRecord>(response);
};

export const deleteRecord = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/records/${id}`, {
    method: 'DELETE',
  });
  return handleResponse<void>(response);
};

export const confirmUpload = async (id: number): Promise<AudioRecord> => {
  const response = await fetch(`${API_BASE_URL}/records/${id}/confirm-upload`, {
    method: 'PATCH',
  });
  return handleResponse<AudioRecord>(response);
};

export const getAudioUrl = async (id: number): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/records/${id}/audio-url`);
  const data = await handleResponse<AudioUrlResponse>(response);
  return data.url;
};

export const uploadToS3 = async (
  presignedUrl: string,
  file: File
): Promise<void> => {
  const response = await fetch(presignedUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });

  if (!response.ok) {
    throw new Error(`S3 upload failed: ${response.statusText}`);
  }
};

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
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    
    // Extract detailed error information
    let errorMessage = error.error || `HTTP error! status: ${response.status}`;
    
    // If backend provided details, include them
    if (error.details) {
      errorMessage += `: ${error.details}`;
    }
    
    // If backend provided a hint, include it
    if (error.hint) {
      errorMessage += ` (${error.hint})`;
    }
    
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

export interface AudioRecord {
  id: number;
  file_name: string;
  speaker_id: string;
  age?: number;
  gender?: string;
  native_language?: string;
  accent_region?: string;
  device_type?: string;
  environment?: string;
  noise_level?: string;
  duration?: number;
  sample_rate?: number;
  transcription?: string;
  sentence_type?: string;
  emotion?: string;
  code_mixing?: string;
  clarity_score?: number;
  consent_obtained?: string;
  s3_bucket?: string;
  s3_key?: string;
  upload_complete: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateRecordPayload {
  file_name: string;
  speaker_id: string;
  age?: number;
  gender?: string;
  native_language?: string;
  accent_region?: string;
  device_type?: string;
  environment?: string;
  noise_level?: string;
  duration?: number;
  sample_rate?: number;
  transcription?: string;
  sentence_type?: string;
  emotion?: string;
  code_mixing?: string;
  clarity_score?: number;
  consent_obtained?: string;
}

export interface UpdateRecordPayload {
  file_name?: string;
  speaker_id?: string;
  age?: number;
  gender?: string;
  native_language?: string;
  accent_region?: string;
  device_type?: string;
  environment?: string;
  noise_level?: string;
  duration?: number;
  sample_rate?: number;
  transcription?: string;
  sentence_type?: string;
  emotion?: string;
  code_mixing?: string;
  clarity_score?: number;
  consent_obtained?: string;
}

export interface CreateRecordResponse {
  record: AudioRecord;
  uploadUrl: string;
}

export interface AudioUrlResponse {
  url: string;
}

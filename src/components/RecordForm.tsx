import { useState } from 'react';
import type { FormEvent } from 'react';
import type { AudioRecord, CreateRecordPayload } from '../types/audio-record';

interface RecordFormProps {
  record?: AudioRecord | null;
  onSubmit: (payload: CreateRecordPayload) => void;
  onCancel: () => void;
}

const RecordForm = ({ record, onSubmit, onCancel }: RecordFormProps) => {
  const getInitialFormData = (): CreateRecordPayload => {
    if (record) {
      return {
        file_name: record.file_name,
        speaker_id: record.speaker_id,
        age: record.age,
        gender: record.gender,
        native_language: record.native_language,
        accent_region: record.accent_region,
        device_type: record.device_type,
        environment: record.environment,
        noise_level: record.noise_level,
        duration: record.duration,
        sample_rate: record.sample_rate,
        transcription: record.transcription,
        sentence_type: record.sentence_type,
        emotion: record.emotion,
        code_mixing: record.code_mixing,
        clarity_score: record.clarity_score,
        consent_obtained: record.consent_obtained,
      };
    }
    return {
      file_name: '',
      speaker_id: '',
      age: undefined,
      gender: '',
      native_language: '',
      accent_region: '',
      device_type: '',
      environment: '',
      noise_level: '',
      duration: undefined,
      sample_rate: undefined,
      transcription: '',
      sentence_type: '',
      emotion: '',
      code_mixing: '',
      clarity_score: undefined,
      consent_obtained: '',
    };
  };

  const [formData, setFormData] = useState<CreateRecordPayload>(getInitialFormData());

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!formData.file_name || !formData.speaker_id) {
      alert('File name and Speaker ID are required');
      return;
    }

    onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === '' ? undefined : value,
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{record ? 'Edit Record' : 'Add New Record'}</h2>
        <form onSubmit={handleSubmit} className="record-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="file_name">File Name *</label>
              <input
                type="text"
                id="file_name"
                name="file_name"
                value={formData.file_name}
                onChange={handleChange}
                required
                placeholder="e.g., KH_001_0001.wav"
              />
            </div>

            <div className="form-group">
              <label htmlFor="speaker_id">Speaker ID *</label>
              <input
                type="text"
                id="speaker_id"
                name="speaker_id"
                value={formData.speaker_id}
                onChange={handleChange}
                required
                placeholder="e.g., KH_SPK_001"
              />
            </div>

            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age ?? ''}
                onChange={handleChange}
                min="0"
                max="120"
              />
            </div>

            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender ?? ''}
                onChange={handleChange}
              >
                <option value="">Select...</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="native_language">Native Language</label>
              <input
                type="text"
                id="native_language"
                name="native_language"
                value={formData.native_language ?? ''}
                onChange={handleChange}
                placeholder="e.g., Khasi"
              />
            </div>

            <div className="form-group">
              <label htmlFor="accent_region">Accent Region</label>
              <input
                type="text"
                id="accent_region"
                name="accent_region"
                value={formData.accent_region ?? ''}
                onChange={handleChange}
                placeholder="e.g., East Khasi Hills"
              />
            </div>

            <div className="form-group">
              <label htmlFor="device_type">Device Type</label>
              <input
                type="text"
                id="device_type"
                name="device_type"
                value={formData.device_type ?? ''}
                onChange={handleChange}
                placeholder="e.g., Smartphone"
              />
            </div>

            <div className="form-group">
              <label htmlFor="environment">Environment</label>
              <select
                id="environment"
                name="environment"
                value={formData.environment ?? ''}
                onChange={handleChange}
              >
                <option value="">Select...</option>
                <option value="Indoor">Indoor</option>
                <option value="Outdoor">Outdoor</option>
                <option value="Studio">Studio</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="noise_level">Noise Level</label>
              <select
                id="noise_level"
                name="noise_level"
                value={formData.noise_level ?? ''}
                onChange={handleChange}
              >
                <option value="">Select...</option>
                <option value="Low">Low</option>
                <option value="Moderate">Moderate</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="duration">Duration (seconds)</label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration ?? ''}
                onChange={handleChange}
                step="0.1"
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="sample_rate">Sample Rate (Hz)</label>
              <input
                type="number"
                id="sample_rate"
                name="sample_rate"
                value={formData.sample_rate ?? ''}
                onChange={handleChange}
                placeholder="e.g., 16000"
              />
            </div>

            <div className="form-group">
              <label htmlFor="sentence_type">Sentence Type</label>
              <select
                id="sentence_type"
                name="sentence_type"
                value={formData.sentence_type ?? ''}
                onChange={handleChange}
              >
                <option value="">Select...</option>
                <option value="Spontaneous">Spontaneous</option>
                <option value="Read">Read</option>
                <option value="Scripted">Scripted</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="emotion">Emotion</label>
              <select
                id="emotion"
                name="emotion"
                value={formData.emotion ?? ''}
                onChange={handleChange}
              >
                <option value="">Select...</option>
                <option value="Neutral">Neutral</option>
                <option value="Happy">Happy</option>
                <option value="Sad">Sad</option>
                <option value="Angry">Angry</option>
                <option value="Surprised">Surprised</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="code_mixing">Code Mixing</label>
              <input
                type="text"
                id="code_mixing"
                name="code_mixing"
                value={formData.code_mixing ?? ''}
                onChange={handleChange}
                placeholder="e.g., None"
              />
            </div>

            <div className="form-group">
              <label htmlFor="clarity_score">Clarity Score (1-5)</label>
              <input
                type="number"
                id="clarity_score"
                name="clarity_score"
                value={formData.clarity_score ?? ''}
                onChange={handleChange}
                min="1"
                max="5"
              />
            </div>

            <div className="form-group">
              <label htmlFor="consent_obtained">Consent Obtained</label>
              <select
                id="consent_obtained"
                name="consent_obtained"
                value={formData.consent_obtained ?? ''}
                onChange={handleChange}
              >
                <option value="">Select...</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div className="form-group form-group-full">
              <label htmlFor="transcription">Transcription</label>
              <textarea
                id="transcription"
                name="transcription"
                value={formData.transcription ?? ''}
                onChange={handleChange}
                rows={3}
                placeholder="Enter transcription text..."
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {record ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecordForm;

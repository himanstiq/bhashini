import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { uploadToS3, confirmUpload } from '../services/api';

interface FileUploadProps {
  recordId: number;
  uploadUrl: string;
  onUploadComplete: () => void;
}

const FileUpload = ({ recordId, uploadUrl, onUploadComplete }: FileUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validTypes = ['audio/wav', 'audio/mpeg', 'audio/mp3', 'audio/ogg', 'audio/flac'];
      if (!validTypes.includes(selectedFile.type) && !selectedFile.name.match(/\.(wav|mp3|ogg|flac)$/i)) {
        setError('Please select a valid audio file (.wav, .mp3, .ogg, .flac)');
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress('Uploading to S3...');
    setError(null);

    try {
      // Upload to S3
      await uploadToS3(uploadUrl, file);

      setProgress('Confirming upload...');

      // Confirm upload completion
      await confirmUpload(recordId);

      setProgress('Upload complete!');
      setTimeout(() => {
        onUploadComplete();
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      console.error('Upload error:', err);
      setProgress('');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="file-upload">
      <input
        type="file"
        accept=".wav,.mp3,.ogg,.flac,audio/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="file-input"
      />
      {file && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="upload-button"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      )}
      {progress && <div className="upload-progress">{progress}</div>}
      {error && <div className="upload-error">{error}</div>}
    </div>
  );
};

export default FileUpload;

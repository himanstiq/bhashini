import type { AudioRecord } from '../types/audio-record';
import AudioPlayer from './AudioPlayer';
import FileUpload from './FileUpload';

interface AudioTableProps {
  records: AudioRecord[];
  onEdit: (record: AudioRecord) => void;
  onDelete: (id: number) => void;
  onUploadComplete: () => void;
  uploadUrls: Map<number, string>;
}

const AudioTable = ({
  records,
  onEdit,
  onDelete,
  onUploadComplete,
  uploadUrls,
}: AudioTableProps) => {
  const handleDelete = (id: number, fileName: string) => {
    if (window.confirm(`Are you sure you want to delete "${fileName}"?`)) {
      onDelete(id);
    }
  };

  return (
    <div className="table-container">
      <table className="audio-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>File Name</th>
            <th>Speaker ID</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Native Language</th>
            <th>Accent Region</th>
            <th>Device</th>
            <th>Environment</th>
            <th>Noise Level</th>
            <th>Duration</th>
            <th>Sample Rate</th>
            <th>Transcription</th>
            <th>Sentence Type</th>
            <th>Emotion</th>
            <th>Code Mixing</th>
            <th>Clarity</th>
            <th>Consent</th>
            <th>Audio</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.length === 0 ? (
            <tr>
              <td colSpan={20} className="no-records">
                No records found. Click "Add Record" to create one.
              </td>
            </tr>
          ) : (
            records.map((record) => (
              <tr key={record.id}>
                <td>{record.id}</td>
                <td>{record.file_name}</td>
                <td>{record.speaker_id}</td>
                <td>{record.age ?? '-'}</td>
                <td>{record.gender ?? '-'}</td>
                <td>{record.native_language ?? '-'}</td>
                <td>{record.accent_region ?? '-'}</td>
                <td>{record.device_type ?? '-'}</td>
                <td>{record.environment ?? '-'}</td>
                <td>{record.noise_level ?? '-'}</td>
                <td>{record.duration ? `${record.duration}s` : '-'}</td>
                <td>{record.sample_rate ? `${record.sample_rate} Hz` : '-'}</td>
                <td className="transcription-cell">
                  {record.transcription ?? '-'}
                </td>
                <td>{record.sentence_type ?? '-'}</td>
                <td>{record.emotion ?? '-'}</td>
                <td>{record.code_mixing ?? '-'}</td>
                <td>{record.clarity_score ?? '-'}</td>
                <td>{record.consent_obtained ?? '-'}</td>
                <td className="audio-cell">
                  {record.upload_complete ? (
                    <AudioPlayer recordId={record.id} />
                  ) : uploadUrls.has(record.id) ? (
                    <FileUpload
                      recordId={record.id}
                      uploadUrl={uploadUrls.get(record.id)!}
                      onUploadComplete={onUploadComplete}
                    />
                  ) : (
                    <span className="upload-pending">Pending upload</span>
                  )}
                </td>
                <td className="actions-cell">
                  <button
                    onClick={() => onEdit(record)}
                    className="btn-edit"
                    title="Edit record"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(record.id, record.file_name)}
                    className="btn-delete"
                    title="Delete record"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AudioTable;

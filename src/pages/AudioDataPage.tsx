import { useState, useEffect } from 'react';
import AudioTable from '../components/AudioTable';
import RecordForm from '../components/RecordForm';
import type { AudioRecord, CreateRecordPayload } from '../types/audio-record';
import {
  fetchRecords,
  createRecord,
  updateRecord,
  deleteRecord,
} from '../services/api';

const AudioDataPage = () => {
  const [records, setRecords] = useState<AudioRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AudioRecord | null>(null);
  const [uploadUrls, setUploadUrls] = useState<Map<number, string>>(new Map());

  const loadRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchRecords();
      setRecords(data);
    } catch (err) {
      let errorMessage = 'Failed to load records';
      
      if (err instanceof Error) {
        // Network error - backend not reachable
        if (err.message.includes('Failed to fetch') || err.message.includes('fetch')) {
          errorMessage = '❌ Cannot connect to backend server.\n\n' +
            '🔧 Troubleshooting:\n' +
            '1. Check if backend is running: cd server && npm run dev\n' +
            '2. Or run both servers: npm run dev:all\n' +
            '3. Run setup check: npm run check';
        } 
        // 500 error - backend running but has issues
        else if (err.message.includes('500')) {
          errorMessage = '❌ Backend server error (500).\n\n' +
            err.message + '\n\n' +
            '🔧 Common causes:\n' +
            '• PostgreSQL not running\n' +
            '• Database not created\n' +
            '  → Using psql: psql -U postgres -c "CREATE DATABASE bhashini;"\n' +
            '  → Or createdb: createdb bhashini (if available)\n' +
            '• Wrong credentials in .env file\n' +
            '• Check backend terminal for detailed errors';
        } 
        // Other errors
        else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      console.error('Error loading records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const handleAddRecord = () => {
    setEditingRecord(null);
    setShowForm(true);
  };

  const handleEditRecord = (record: AudioRecord) => {
    setEditingRecord(record);
    setShowForm(true);
  };

  const handleFormSubmit = async (payload: CreateRecordPayload) => {
    try {
      if (editingRecord) {
        // Update existing record
        await updateRecord(editingRecord.id, payload);
      } else {
        // Create new record
        const response = await createRecord(payload);
        // Store the upload URL for the new record
        setUploadUrls((prev) => {
          const newMap = new Map(prev);
          newMap.set(response.record.id, response.uploadUrl);
          return newMap;
        });
      }
      setShowForm(false);
      setEditingRecord(null);
      await loadRecords();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Operation failed');
      console.error('Error submitting form:', err);
    }
  };

  const handleDeleteRecord = async (id: number) => {
    try {
      await deleteRecord(id);
      // Remove upload URL if it exists
      setUploadUrls((prev) => {
        const newMap = new Map(prev);
        newMap.delete(id);
        return newMap;
      });
      await loadRecords();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete record');
      console.error('Error deleting record:', err);
    }
  };

  const handleUploadComplete = async () => {
    await loadRecords();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingRecord(null);
  };

  if (loading) {
    return <div className="loading">Loading records...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <pre className="error">{error}</pre>
        <button onClick={loadRecords} className="btn-primary">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="audio-data-page">
      <header className="page-header">
        <h1>Audio Data Management</h1>
        <button onClick={handleAddRecord} className="btn-primary">
          Add Record
        </button>
      </header>

      <AudioTable
        records={records}
        onEdit={handleEditRecord}
        onDelete={handleDeleteRecord}
        onUploadComplete={handleUploadComplete}
        uploadUrls={uploadUrls}
      />

      {showForm && (
        <RecordForm
          record={editingRecord}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
};

export default AudioDataPage;

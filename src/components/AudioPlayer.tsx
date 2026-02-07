import { useState } from 'react';
import { getAudioUrl } from '../services/api';

interface AudioPlayerProps {
  recordId: number;
}

const AudioPlayer = ({ recordId }: AudioPlayerProps) => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePlay = async () => {
    if (audioUrl) return; // Already loaded

    setLoading(true);
    setError(null);

    try {
      const url = await getAudioUrl(recordId);
      setAudioUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load audio');
      console.error('Error loading audio:', err);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div className="audio-player-error">{error}</div>;
  }

  if (!audioUrl) {
    return (
      <button
        onClick={handlePlay}
        disabled={loading}
        className="audio-load-button"
      >
        {loading ? 'Loading...' : 'Load Audio'}
      </button>
    );
  }

  return (
    <audio controls src={audioUrl} className="audio-player">
      Your browser does not support the audio element.
    </audio>
  );
};

export default AudioPlayer;

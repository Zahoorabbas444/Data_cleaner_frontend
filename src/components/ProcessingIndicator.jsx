export default function ProcessingIndicator({ progress, message }) {
  return (
    <div className="processing-section">
      <h2>Processing Your Data</h2>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <p className="processing-message">{message}</p>
      <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.5rem' }}>
        {progress}% complete
      </p>
    </div>
  );
}

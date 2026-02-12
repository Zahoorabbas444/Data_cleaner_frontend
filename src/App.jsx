import { useState, useEffect, useCallback } from 'react';
import FileUpload from './components/FileUpload';
import ProcessingIndicator from './components/ProcessingIndicator';
import StatusBadge from './components/StatusBadge';
import ChartGallery from './components/ChartGallery';
import DownloadButtons from './components/DownloadButtons';
import IssuesList from './components/IssuesList';
import DataPreview from './components/DataPreview';
import { uploadFile, getStatus, getResults, deleteJob } from './services/api';

function App() {
  const [state, setState] = useState('idle'); // idle, uploading, processing, complete, error
  const [jobId, setJobId] = useState(null);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const pollStatus = useCallback(async (id, retryCount = 0) => {
    const maxRetries = 60; // Max 60 retries (2 minutes with backoff)
    const baseDelay = 1000; // Start with 1 second
    const maxDelay = 5000; // Max 5 seconds between polls

    try {
      const status = await getStatus(id);
      setProgress(status.progress);
      setMessage(status.message);

      if (status.status === 'completed') {
        const resultsData = await getResults(id);
        setResults(resultsData);
        setState('complete');
      } else if (status.status === 'error') {
        setError(status.message);
        setState('error');
      } else {
        // Continue polling with exponential backoff
        const delay = Math.min(baseDelay * Math.pow(1.2, retryCount), maxDelay);
        setTimeout(() => pollStatus(id, retryCount + 1), delay);
      }
    } catch (err) {
      if (err.response?.status === 202) {
        // Still processing - continue polling with backoff
        const delay = Math.min(baseDelay * Math.pow(1.2, retryCount), maxDelay);
        setTimeout(() => pollStatus(id, retryCount + 1), delay);
      } else if (retryCount < maxRetries) {
        // Transient error - retry with backoff
        const delay = Math.min(baseDelay * Math.pow(1.5, retryCount), maxDelay);
        setTimeout(() => pollStatus(id, retryCount + 1), delay);
      } else {
        setError(err.response?.data?.detail || 'Failed to get status. Please try again.');
        setState('error');
      }
    }
  }, []);

  const handleUpload = async (file) => {
    setState('uploading');
    setError(null);
    setProgress(0);
    setMessage('Uploading file...');

    try {
      const response = await uploadFile(file);
      setJobId(response.job_id);
      setState('processing');
      pollStatus(response.job_id);
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed');
      setState('error');
    }
  };

  const handleReset = async () => {
    if (jobId) {
      try {
        await deleteJob(jobId);
      } catch (err) {
        // Ignore errors when deleting
      }
    }
    setState('idle');
    setJobId(null);
    setProgress(0);
    setMessage('');
    setResults(null);
    setError(null);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Data Cleaner & Visual Insight Tool</h1>
        <p>Upload, clean, validate, and visualize your data in seconds</p>
      </header>

      <main className="main-content">
        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
            <button
              className="reset-btn"
              style={{ marginLeft: '1rem' }}
              onClick={handleReset}
            >
              Try Again
            </button>
          </div>
        )}

        {state === 'idle' && (
          <FileUpload onUpload={handleUpload} disabled={false} />
        )}

        {(state === 'uploading' || state === 'processing') && (
          <ProcessingIndicator progress={progress} message={message} />
        )}

        {state === 'complete' && results && (
          <>
            <div className="results-section">
              <div className="results-header">
                <div>
                  <h2>Results</h2>
                  <StatusBadge status={results.validation_summary.status} />
                  <p style={{ marginTop: '0.5rem', color: '#6b7280' }}>
                    {results.validation_summary.status_reason}
                  </p>
                </div>
                <button className="reset-btn" onClick={handleReset}>
                  Process Another File
                </button>
              </div>

              <div className="summary-grid">
                <div className="summary-card">
                  <div className="value">{results.validation_summary.total_rows}</div>
                  <div className="label">Rows</div>
                </div>
                <div className="summary-card">
                  <div className="value">{results.validation_summary.total_columns}</div>
                  <div className="label">Columns</div>
                </div>
                <div className="summary-card">
                  <div className="value">{results.validation_summary.missing_value_count}</div>
                  <div className="label">Missing Values</div>
                </div>
                <div className="summary-card">
                  <div className="value">{results.validation_summary.duplicate_row_count}</div>
                  <div className="label">Duplicates</div>
                </div>
                <div className="summary-card">
                  <div className="value">{results.validation_summary.issue_count}</div>
                  <div className="label">Issues</div>
                </div>
              </div>

              <DownloadButtons jobId={jobId} />
            </div>

            <DataPreview data={results.preview_data} columns={results.columns} />

            <ChartGallery charts={results.charts} />

            <IssuesList issues={results.issues} />
          </>
        )}
      </main>

      <footer style={{ padding: '1rem 2rem', textAlign: 'center', color: '#9ca3af', fontSize: '0.875rem' }}>
        Data Cleaner v1.0 | Files are automatically deleted after 30 minutes
      </footer>
    </div>
  );
}

export default App;

import { downloadCleaned, downloadReport } from '../services/api';

export default function DownloadButtons({ jobId }) {
  const handleDownloadCleaned = () => {
    window.open(downloadCleaned(jobId), '_blank');
  };

  const handleDownloadReport = () => {
    window.open(downloadReport(jobId), '_blank');
  };

  return (
    <div className="download-buttons">
      <button className="download-btn primary" onClick={handleDownloadCleaned}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Download Cleaned Data
      </button>
      <button className="download-btn secondary" onClick={handleDownloadReport}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
        Download Validation Report
      </button>
    </div>
  );
}

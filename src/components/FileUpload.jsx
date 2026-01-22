import { useState, useRef } from 'react';

export default function FileUpload({ onUpload, disabled }) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);

    const file = e.dataTransfer.files[0];
    if (file && isValidFile(file)) {
      setSelectedFile(file);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && isValidFile(file)) {
      setSelectedFile(file);
    }
  };

  const isValidFile = (file) => {
    const validExtensions = ['.csv', '.xlsx', '.xls'];
    const extension = '.' + file.name.split('.').pop().toLowerCase();
    return validExtensions.includes(extension);
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div
      className={`upload-section ${dragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <h2>Upload Your Data File</h2>
      <p>Drag and drop a CSV or Excel file, or click to browse</p>

      <input
        type="file"
        ref={fileInputRef}
        className="file-input"
        accept=".csv,.xlsx,.xls"
        onChange={handleFileSelect}
        disabled={disabled}
      />

      {!selectedFile ? (
        <button
          className="upload-btn"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
        >
          Choose File
        </button>
      ) : (
        <>
          <div className="file-info">
            <strong>{selectedFile.name}</strong> ({formatFileSize(selectedFile.size)})
          </div>
          <div style={{ marginTop: '1rem' }}>
            <button
              className="upload-btn"
              onClick={handleUpload}
              disabled={disabled}
            >
              Upload & Process
            </button>
            <button
              className="reset-btn"
              style={{ marginLeft: '0.5rem' }}
              onClick={() => setSelectedFile(null)}
              disabled={disabled}
            >
              Change File
            </button>
          </div>
        </>
      )}

      <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#9ca3af' }}>
        Supported formats: CSV, Excel (.xlsx, .xls) | Max size: 10MB
      </p>
    </div>
  );
}

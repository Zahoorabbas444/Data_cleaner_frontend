import { useState } from 'react';

export default function DataPreview({ data, columns }) {
  const [showPreview, setShowPreview] = useState(false);
  const maxRows = 20;
  const displayData = data?.slice(0, maxRows) || [];

  if (!data || data.length === 0) {
    return null;
  }

  const columnNames = columns?.map(c => c.name) || Object.keys(displayData[0] || {});

  return (
    <div className="preview-section">
      <div className="preview-header">
        <h2>Data Preview</h2>
        <button
          className="toggle-btn"
          onClick={() => setShowPreview(!showPreview)}
        >
          {showPreview ? 'Hide Preview' : 'Show Preview'}
        </button>
      </div>

      {showPreview && (
        <>
          <p className="preview-note">
            Showing first {Math.min(displayData.length, maxRows)} of {data.length} rows
          </p>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  {columnNames.map((col, idx) => (
                    <th key={idx} title={col}>
                      {col.length > 15 ? col.substring(0, 15) + '...' : col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayData.map((row, rowIdx) => (
                  <tr key={rowIdx}>
                    <td className="row-number">{rowIdx + 1}</td>
                    {columnNames.map((col, colIdx) => (
                      <td key={colIdx} title={String(row[col] ?? '')}>
                        {formatCell(row[col])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function formatCell(value) {
  if (value === null || value === undefined) {
    return <span className="null-value">null</span>;
  }
  if (value === '') {
    return <span className="empty-value">(empty)</span>;
  }
  const str = String(value);
  if (str.length > 30) {
    return str.substring(0, 30) + '...';
  }
  return str;
}

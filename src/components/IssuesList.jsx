export default function IssuesList({ issues }) {
  if (!issues || issues.length === 0) {
    return (
      <div className="issues-section">
        <h2>Data Issues</h2>
        <p style={{ color: '#10b981', fontWeight: 500 }}>
          No issues found. Your data looks good!
        </p>
      </div>
    );
  }

  const formatIssueType = (type) => {
    const types = {
      missing_value: 'Missing Values',
      duplicate_row: 'Duplicate Rows',
      mixed_type: 'Mixed Data Types',
      invalid_date: 'Invalid Dates',
      invalid_numeric: 'Invalid Numbers',
    };
    return types[type] || type;
  };

  return (
    <div className="issues-section">
      <h2>Data Issues ({issues.length})</h2>
      <div className="issues-list">
        {issues.map((issue, index) => (
          <div key={index} className={`issue-item ${issue.severity}`}>
            <span className={`issue-severity ${issue.severity}`}>
              {issue.severity}
            </span>
            <div className="issue-content">
              <div className="issue-type">
                {formatIssueType(issue.issue_type)}
                {issue.column_name && ` - ${issue.column_name}`}
              </div>
              <div className="issue-description">{issue.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

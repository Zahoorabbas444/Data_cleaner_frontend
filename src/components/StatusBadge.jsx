export default function StatusBadge({ status }) {
  const getStatusConfig = () => {
    switch (status) {
      case 'ready':
        return { label: 'Ready', emoji: '🟢', className: 'ready' };
      case 'warning':
        return { label: 'Warning', emoji: '🟡', className: 'warning' };
      case 'not_ready':
        return { label: 'Not Ready', emoji: '🔴', className: 'not_ready' };
      default:
        return { label: 'Unknown', emoji: '⚪', className: '' };
    }
  };

  const config = getStatusConfig();

  return (
    <span className={`status-badge ${config.className}`}>
      {config.emoji} {config.label}
    </span>
  );
}

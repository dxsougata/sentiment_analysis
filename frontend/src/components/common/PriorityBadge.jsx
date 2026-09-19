import { AlertCircle, AlertTriangle, Info } from 'lucide-react';

export default function PriorityBadge({ priority }) {
  const normPriority = (priority || '').toLowerCase();

  let badgeClass = 'badge-low';
  let Icon = Info;

  if (normPriority === 'high') {
    badgeClass = 'badge-high';
    Icon = AlertCircle;
  } else if (normPriority === 'medium') {
    badgeClass = 'badge-medium';
    Icon = AlertTriangle;
  }

  return (
    <span className={`badge ${badgeClass}`}>
      <Icon size={12} strokeWidth={2.5} />
      <span>{priority || 'Low'} Priority</span>
    </span>
  );
}

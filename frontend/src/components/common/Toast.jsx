import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function Toast({ toast }) {
  if (!toast) return null;

  const { message, type = 'info' } = toast;

  let Icon = Info;
  let iconColor = '#3b82f6';

  if (type === 'success') {
    Icon = CheckCircle2;
    iconColor = '#10b981';
  } else if (type === 'error') {
    Icon = AlertCircle;
    iconColor = '#ef4444';
  }

  return (
    <div className="toast-container" role="status" aria-live="polite">
      <div className="toast">
        <Icon size={18} color={iconColor} />
        <span>{message}</span>
      </div>
    </div>
  );
}

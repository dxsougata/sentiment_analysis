import { Inbox } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmptyState({
  title = 'No items found',
  description = 'Try adjusting your search queries or filter parameters.',
  icon: Icon = Inbox,
  actionText,
  onAction,
  actionTo
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Icon size={28} />
      </div>
      <h4 className="empty-state-title">{title}</h4>
      <p className="empty-state-description">{description}</p>
      {actionTo && actionText && (
        <Link to={actionTo} className="btn btn-primary btn-sm">
          {actionText}
        </Link>
      )}
      {!actionTo && actionText && onAction && (
        <button type="button" className="btn btn-secondary btn-sm" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
}

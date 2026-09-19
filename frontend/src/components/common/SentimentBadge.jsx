import { ThumbsUp, Minus, ThumbsDown } from 'lucide-react';

export default function SentimentBadge({ sentiment, showIcon = false, size = 'md' }) {
  const normSentiment = (sentiment || '').toLowerCase();

  let badgeClass = 'badge-neutral';
  let label = 'Neutral';
  let Icon = Minus;

  if (normSentiment === 'positive') {
    badgeClass = 'badge-positive';
    label = 'Positive';
    Icon = ThumbsUp;
  } else if (normSentiment === 'negative') {
    badgeClass = 'badge-negative';
    label = 'Negative';
    Icon = ThumbsDown;
  }

  return (
    <span className={`badge ${badgeClass} badge-${size}`}>
      {showIcon ? (
        <Icon size={12} strokeWidth={2.5} />
      ) : (
        <span className="badge-pill-dot" />
      )}
      <span>{label}</span>
    </span>
  );
}

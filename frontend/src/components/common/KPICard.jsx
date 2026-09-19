import { TrendingUp, TrendingDown } from 'lucide-react';

export default function KPICard({
  label,
  value,
  percentage,
  trendText,
  trendType = 'neutral', // 'positive' | 'negative' | 'neutral'
  icon: Icon,
  variant = 'default' // 'default' | 'positive' | 'neutral' | 'negative' | 'primary'
}) {
  const iconVariantClasses = {
    default: 'kpi-icon-default',
    positive: 'kpi-icon-positive',
    neutral: 'kpi-icon-neutral',
    negative: 'kpi-icon-negative',
    primary: 'kpi-icon-primary'
  };

  return (
    <div className="kpi-card">
      <div className="kpi-top">
        <span className="kpi-label">{label}</span>
        {Icon && (
          <div className={`kpi-icon-wrapper ${iconVariantClasses[variant] || 'kpi-icon-default'}`}>
            <Icon size={18} />
          </div>
        )}
      </div>

      <div className="kpi-value-row">
        <span className="kpi-value">{value}</span>
        {percentage !== undefined && (
          <span
            className={`kpi-percentage ${
              variant === 'positive'
                ? 'badge-positive'
                : variant === 'negative'
                ? 'badge-negative'
                : variant === 'neutral'
                ? 'badge-neutral'
                : ''
            }`}
          >
            {percentage}
          </span>
        )}
      </div>

      {trendText && (
        <div className="kpi-trend">
          {trendType === 'positive' && <TrendingUp size={14} color="var(--positive)" />}
          {trendType === 'negative' && <TrendingDown size={14} color="var(--negative)" />}
          <span>{trendText}</span>
        </div>
      )}
    </div>
  );
}

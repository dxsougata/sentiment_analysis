import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div style={{
        backgroundColor: '#1e293b',
        color: '#ffffff',
        padding: '8px 12px',
        borderRadius: '6px',
        fontSize: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <div style={{ fontWeight: 600 }}>{item.name} Sentiment</div>
        <div>Count: <strong>{item.value.toLocaleString()}</strong> ({item.percent}%)</div>
      </div>
    );
  }
  return null;
}

export default function SentimentDonutChart({ stats }) {
  const data = [
    { name: 'Positive', value: stats.positiveCount, percent: stats.positivePercent, color: '#16a34a' },
    { name: 'Neutral', value: stats.neutralCount, percent: stats.neutralPercent, color: '#d97706' },
    { name: 'Negative', value: stats.negativeCount, percent: stats.negativePercent, color: '#dc2626' }
  ];

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, minHeight: '220px', position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label inside donut */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          pointerEvents: 'none'
        }}>
          <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
            Positive
          </span>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            {stats.positivePercent}%
          </span>
        </div>
      </div>

      {/* Legend below */}
      <div className="chart-center-legend">
        {data.map((item) => (
          <div key={item.name} className="legend-item">
            <span className="legend-color" style={{ backgroundColor: item.color }} />
            <span>{item.name}: <strong>{item.percent}%</strong></span>
          </div>
        ))}
      </div>
    </div>
  );
}

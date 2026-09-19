import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: '#1e293b',
        color: '#ffffff',
        padding: '10px 14px',
        borderRadius: '6px',
        fontSize: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <div style={{ fontWeight: 700, marginBottom: '4px' }}>Week of {label}</div>
        {payload.map((entry) => (
          <div key={entry.dataKey} style={{ color: entry.color, marginBottom: '2px' }}>
            {entry.name}: <strong>{entry.value}</strong> reviews
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export default function SentimentTrendChart({ trend }) {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '260px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={trend}
          margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
        >
          <defs>
            <linearGradient id="posGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#16a34a" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="negGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#dc2626" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: '#64748b' }}
            axisLine={{ stroke: '#e2e8f0' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            wrapperStyle={{ paddingBottom: '10px', fontSize: '12px' }}
          />
          <Area
            type="monotone"
            dataKey="positive"
            name="Positive"
            stroke="#16a34a"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#posGradient)"
          />
          <Area
            type="monotone"
            dataKey="negative"
            name="Negative"
            stroke="#dc2626"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#negGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

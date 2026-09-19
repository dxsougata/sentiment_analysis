import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

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
        <div style={{ fontWeight: 700, marginBottom: '4px' }}>{label}</div>
        <div style={{ color: '#4ade80' }}>Positive: {payload[0]?.value}</div>
        <div style={{ color: '#fbbf24' }}>Neutral: {payload[1]?.value}</div>
        <div style={{ color: '#f87171' }}>Negative: {payload[2]?.value}</div>
      </div>
    );
  }
  return null;
}

export default function CategoryBreakdownChart({ categories }) {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '260px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={categories}
          margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="category"
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
          <Bar dataKey="positive" name="Positive" fill="#16a34a" radius={[4, 4, 0, 0]} stackId="a" />
          <Bar dataKey="neutral" name="Neutral" fill="#d97706" radius={[0, 0, 0, 0]} stackId="a" />
          <Bar dataKey="negative" name="Negative" fill="#dc2626" radius={[4, 4, 0, 0]} stackId="a" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

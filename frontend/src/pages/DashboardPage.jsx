import { Link } from 'react-router-dom';
import {
  MessageSquare,
  ThumbsUp,
  Minus,
  ThumbsDown,
  UploadCloud,
  ArrowRight,
  AlertTriangle,
  FileCheck2,
  Calendar
} from 'lucide-react';
import { useAnalysis } from '../hooks/useAnalysis';
import KPICard from '../components/common/KPICard';
import SentimentBadge from '../components/common/SentimentBadge';
import PriorityBadge from '../components/common/PriorityBadge';
import SentimentDonutChart from '../components/charts/SentimentDonutChart';
import CategoryBreakdownChart from '../components/charts/CategoryBreakdownChart';
import SentimentTrendChart from '../components/charts/SentimentTrendChart';
import { formatNumber, formatDate } from '../utils/formatters';

export default function DashboardPage() {
  const { stats, categories, trend, issues, history, activeDatasetName } = useAnalysis();

  return (
    <div>
      {/* Top Welcome Banner */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Executive Sentiment Overview</h1>
          <p>
            Customer feedback intelligence, root-cause pain points, and actionable business insights.
          </p>
        </div>

        <div className="page-actions">
          <Link to="/upload" className="btn btn-primary">
            <UploadCloud size={16} />
            <span>Upload New Batch</span>
          </Link>
          <Link to="/report" className="btn btn-secondary">
            <span>View AI Report</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Simulated Mode Banner */}
      <div className="demo-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <FileCheck2 size={18} />
          <span>
            Active Dataset: <strong>{activeDatasetName}</strong> (Simulated Mock Engine — Real backend API ready for plug-in).
          </span>
        </div>
        <Link to="/upload" style={{ color: 'inherit', fontWeight: 600, textDecoration: 'underline' }}>
          Analyze different file
        </Link>
      </div>

      {/* 4 Core KPI Cards + 1 CSAT Metric */}
      <div className="kpi-grid">
        <KPICard
          label="Total Feedback"
          value={formatNumber(stats.totalFeedback)}
          trendText="+12.4% vs last month"
          trendType="positive"
          icon={MessageSquare}
          variant="primary"
        />

        <KPICard
          label="Positive Sentiment"
          value={formatNumber(stats.positiveCount)}
          percentage={`${stats.positivePercent}%`}
          trendText="+4.1% customer praise"
          trendType="positive"
          icon={ThumbsUp}
          variant="positive"
        />

        <KPICard
          label="Neutral Sentiment"
          value={formatNumber(stats.neutralCount)}
          percentage={`${stats.neutralPercent}%`}
          trendText="Informational queries"
          trendType="neutral"
          icon={Minus}
          variant="neutral"
        />

        <KPICard
          label="Negative Sentiment"
          value={formatNumber(stats.negativeCount)}
          percentage={`${stats.negativePercent}%`}
          trendText="Needs immediate attention"
          trendType="negative"
          icon={ThumbsDown}
          variant="negative"
        />
      </div>

      {/* Primary Analytics Charts Grid */}
      <div className="charts-grid-3">
        {/* Overall Sentiment Split */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Overall Sentiment Split</h2>
              <p className="card-subtitle">Distribution across positive, neutral, and negative reviews</p>
            </div>
            <SentimentBadge sentiment="positive" size="sm" />
          </div>
          <div className="card-body" style={{ height: '320px' }}>
            <SentimentDonutChart stats={stats} />
          </div>
        </div>

        {/* Category Breakdown Chart */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Sentiment by Topic & Category</h2>
              <p className="card-subtitle">Stacked volume of feedback by operational area</p>
            </div>
          </div>
          <div className="card-body" style={{ height: '320px' }}>
            <CategoryBreakdownChart categories={categories} />
          </div>
        </div>
      </div>

      {/* Sentiment Trend Timeline */}
      <div className="card" style={{ marginBottom: '1.75rem' }}>
        <div className="card-header">
          <div>
            <h2 className="card-title">Weekly Sentiment Trajectory</h2>
            <p className="card-subtitle">Positive volume vs Negative friction spikes across recent weeks</p>
          </div>
          <div className="badge badge-category">
            <Calendar size={13} style={{ marginRight: 4 }} />
            Last 6 Weeks
          </div>
        </div>
        <div className="card-body" style={{ height: '280px' }}>
          <SentimentTrendChart trend={trend} />
        </div>
      </div>

      {/* Two Column Layout: Key Negative Issues + Recent Analysis Activity */}
      <div className="charts-grid-2">
        {/* Key Negative Issues Section */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title" style={{ color: 'var(--negative-text)' }}>
                <AlertTriangle size={18} color="var(--negative)" />
                Key Negative Issues & Pain Points
              </h2>
              <p className="card-subtitle">Top drivers behind unhappy customer feedback</p>
            </div>
            <Link to="/issues" className="btn btn-outline btn-sm">
              View All
            </Link>
          </div>
          <div className="card-body" style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {issues.slice(0, 3).map((issue) => (
                <div
                  key={issue.id}
                  style={{
                    padding: '0.875rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: '#fafbfc'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{issue.title}</span>
                    <PriorityBadge priority={issue.priority} />
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    {issue.explanation}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>Mentions: <strong>{issue.mentions}</strong> ({issue.shareOfNegative}% of complaints)</span>
                    <Link to="/issues" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
                      Inspect quotes &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity / Analysis Batches */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Recent Feedback Batches</h2>
              <p className="card-subtitle">Historical dataset processing status and runs</p>
            </div>
            <Link to="/history" className="btn btn-secondary btn-sm">
              Full History
            </Link>
          </div>
          <div className="card-body" style={{ padding: '0.5rem 1rem' }}>
            <div className="table-container" style={{ border: 'none' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Batch File</th>
                    <th>Date</th>
                    <th>Volume</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.slice(0, 4).map((item) => (
                    <tr key={item.id}>
                      <td style={{ fontWeight: 600, fontSize: '0.8125rem' }}>
                        {item.filename}
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                        {formatDate(item.date)}
                      </td>
                      <td style={{ fontSize: '0.8125rem' }}>
                        {formatNumber(item.feedbackCount)} reviews
                      </td>
                      <td>
                        <span className={`badge ${item.status === 'Completed' ? 'badge-positive' : 'badge-category'}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquareQuote,
  Eye,
  ArrowRight,
  Sparkles,
  Search,
  Calendar
} from 'lucide-react';
import { useAnalysis } from '../hooks/useAnalysis';
import PriorityBadge from '../components/common/PriorityBadge';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';
import { formatDate } from '../utils/formatters';

export default function IssuesPage() {
  const { issues, stats } = useAnalysis();

  const [selectedIssue, setSelectedIssue] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState('all'); // 'all' | 'high' | 'medium' | 'low'
  const [issueSearch, setIssueSearch] = useState('');

  // Modal search term for supporting quotes
  const [quoteSearch, setQuoteSearch] = useState('');

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      if (priorityFilter !== 'all' && issue.priority.toLowerCase() !== priorityFilter) {
        return false;
      }
      if (issueSearch.trim()) {
        const query = issueSearch.toLowerCase();
        const matchTitle = issue.title.toLowerCase().includes(query);
        const matchCategory = issue.category.toLowerCase().includes(query);
        const matchExpl = issue.explanation.toLowerCase().includes(query);
        return matchTitle || matchCategory || matchExpl;
      }
      return true;
    });
  }, [issues, priorityFilter, issueSearch]);

  // Quotes inside the active modal
  const modalQuotes = useMemo(() => {
    if (!selectedIssue) return [];
    if (!quoteSearch.trim()) return selectedIssue.quotes || [];

    const q = quoteSearch.toLowerCase();
    return (selectedIssue.quotes || []).filter((item) =>
      item.review.toLowerCase().includes(q)
    );
  }, [selectedIssue, quoteSearch]);

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Customer Friction & Root Cause Issues</h1>
          <p>
            Pinpointing exactly WHY customers are unhappy, quantifying mention share, and evaluating operational risk.
          </p>
        </div>

        <div className="page-actions">
          <Link to="/report" className="btn btn-primary">
            <Sparkles size={16} />
            <span>Generate Action Report</span>
          </Link>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="kpi-grid" style={{ marginBottom: '1.75rem' }}>
        <div className="kpi-card" style={{ borderLeft: '4px solid var(--negative)' }}>
          <span className="kpi-label" style={{ color: 'var(--negative-text)' }}>Total Negative Complaints</span>
          <div className="kpi-value-row" style={{ marginTop: '0.5rem' }}>
            <span className="kpi-value">{stats.negativeCount}</span>
            <span className="badge-negative">{stats.negativePercent}% of total</span>
          </div>
          <span className="kpi-trend">Requires operational investigation</span>
        </div>

        <div className="kpi-card" style={{ borderLeft: '4px solid #ef4444' }}>
          <span className="kpi-label">Highest Impact Bottleneck</span>
          <div className="kpi-value-row" style={{ marginTop: '0.5rem' }}>
            <span className="kpi-value" style={{ fontSize: '1.25rem' }}>Delivery Delays</span>
          </div>
          <span className="kpi-trend" style={{ color: 'var(--negative)' }}>
            50.3% of all negative sentiment
          </span>
        </div>

        <div className="kpi-card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <span className="kpi-label">Active Issue Clusters</span>
          <div className="kpi-value-row" style={{ marginTop: '0.5rem' }}>
            <span className="kpi-value">{issues.length} Identified</span>
          </div>
          <span className="kpi-trend">2 High Priority • 2 Medium • 1 Low</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-body" style={{ padding: '1rem 1.25rem' }}>
          <div className="filter-bar" style={{ margin: 0 }}>
            <div className="search-box">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search issues or categories..."
                value={issueSearch}
                onChange={(e) => setIssueSearch(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                Priority:
              </span>
              <button
                type="button"
                className={`filter-pill ${priorityFilter === 'all' ? 'active' : ''}`}
                onClick={() => setPriorityFilter('all')}
              >
                All ({issues.length})
              </button>
              <button
                type="button"
                className={`filter-pill ${priorityFilter === 'high' ? 'active' : ''}`}
                onClick={() => setPriorityFilter('high')}
              >
                High Priority
              </button>
              <button
                type="button"
                className={`filter-pill ${priorityFilter === 'medium' ? 'active' : ''}`}
                onClick={() => setPriorityFilter('medium')}
              >
                Medium Priority
              </button>
              <button
                type="button"
                className={`filter-pill ${priorityFilter === 'low' ? 'active' : ''}`}
                onClick={() => setPriorityFilter('low')}
              >
                Low Priority
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Issues Grid / List */}
      {filteredIssues.length > 0 ? (
        <div className="issues-grid">
          {filteredIssues.map((issue) => (
            <div key={issue.id} className="issue-card">
              <div className="issue-header">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span className="badge badge-category">{issue.category}</span>
                    <PriorityBadge priority={issue.priority} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{issue.trend}</span>
                  </div>
                  <h3 className="issue-title">{issue.title}</h3>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--negative-text)' }}>
                    {issue.shareOfNegative}%
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Share of negative</span>
                </div>
              </div>

              {/* Metrics Strip */}
              <div className="issue-metrics-row">
                <div className="metric-pill-stat">
                  <span className="stat-bold">{issue.mentions}</span>
                  <span className="stat-label">total mentions</span>
                </div>
                <div className="metric-pill-stat">
                  <span className="stat-bold">{issue.quotes?.length || 0}</span>
                  <span className="stat-label">indexed quotes</span>
                </div>
                <div className="metric-pill-stat">
                  <span className="stat-bold" style={{ color: issue.priority === 'High' ? 'var(--negative)' : 'var(--neutral)' }}>
                    {issue.urgencyLevel}/100
                  </span>
                  <span className="stat-label">severity index</span>
                </div>
              </div>

              {/* Short explanation */}
              <div className="issue-explanation">
                {issue.explanation}
              </div>

              {/* Impact summary */}
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                <strong>Business Risk:</strong> {issue.impactAnalysis}
              </div>

              {/* Representative Customer Comments */}
              <div className="issue-quotes-section">
                <div className="quotes-heading">
                  <MessageSquareQuote size={13} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                  Voice of Customer (Representative Quotes)
                </div>
                <div className="quotes-list">
                  {issue.quotes?.slice(0, 2).map((q) => (
                    <div key={q.id} className="customer-quote-item">
                      "{q.review}"
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="issue-card-actions">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setSelectedIssue(issue);
                    setQuoteSearch('');
                  }}
                >
                  <Eye size={15} />
                  <span>View Supporting Feedback ({issue.quotes?.length || 0})</span>
                </button>

                <Link
                  to="/report"
                  style={{
                    fontSize: '0.8125rem',
                    color: 'var(--primary)',
                    fontWeight: 600,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <span>See recommended fix in AI Report</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No issues found"
          description="No issues match the selected priority filter or search keyword."
          actionText="Reset Priority Filter"
          onAction={() => {
            setPriorityFilter('all');
            setIssueSearch('');
          }}
        />
      )}

      {/* Accessible Supporting Feedback Modal */}
      <Modal
        isOpen={Boolean(selectedIssue)}
        onClose={() => setSelectedIssue(null)}
        title={selectedIssue ? `Supporting Customer Feedback: ${selectedIssue.category}` : ''}
        maxWidth="760px"
      >
        {selectedIssue && (
          <div>
            <div style={{ marginBottom: '1.25rem', padding: '0.875rem', backgroundColor: 'var(--bg-subtle)', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <PriorityBadge priority={selectedIssue.priority} />
                <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{selectedIssue.title}</span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                {selectedIssue.explanation}
              </p>
            </div>

            {/* In-Modal Search */}
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              <input
                type="text"
                className="search-input"
                style={{ paddingLeft: '2.25rem', fontSize: '0.8125rem' }}
                placeholder="Filter supporting quotes by keyword..."
                value={quoteSearch}
                onChange={(e) => setQuoteSearch(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {modalQuotes.length > 0 ? (
                modalQuotes.map((q) => (
                  <div
                    key={q.id}
                    style={{
                      padding: '1rem',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      backgroundColor: '#ffffff',
                      borderLeft: '4px solid var(--negative)'
                    }}
                  >
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: 1.4 }}>
                      "{q.review}"
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Calendar size={12} />
                        {formatDate(q.date)}
                      </span>
                      <span>Confidence: {Math.round((q.confidence || 0.95) * 100)}%</span>
                      <span>Rating: {q.rating}/5</span>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  No quotes match "{quoteSearch}".
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

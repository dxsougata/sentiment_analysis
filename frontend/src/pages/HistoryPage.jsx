import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  FileSpreadsheet,
  FileText,
  Eye,
  Sparkles,
  Calendar
} from 'lucide-react';
import { useAnalysis } from '../hooks/useAnalysis';
import EmptyState from '../components/common/EmptyState';
import { formatNumber, formatDate } from '../utils/formatters';

export default function HistoryPage() {
  const navigate = useNavigate();
  const { history, loadHistoricalBatch } = useAnalysis();

  const [historySearch, setHistorySearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      if (statusFilter !== 'all' && item.status.toLowerCase() !== statusFilter) {
        return false;
      }
      if (historySearch.trim()) {
        const q = historySearch.toLowerCase();
        return (
          item.filename.toLowerCase().includes(q) ||
          item.topIssue.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [history, statusFilter, historySearch]);

  const handleSelectBatch = (batchId, destination) => {
    loadHistoricalBatch(batchId);
    navigate(destination);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Customer Feedback Analysis History</h1>
          <p>
            Audit log of previous feedback batch uploads, sentiment health snapshots, and historical improvement reports.
          </p>
        </div>

        <div className="page-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate('/upload')}
          >
            <span>+ Upload New Batch</span>
          </button>
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
                placeholder="Search history by filename or top issue..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                Status:
              </span>
              <button
                type="button"
                className={`filter-pill ${statusFilter === 'all' ? 'active' : ''}`}
                onClick={() => setStatusFilter('all')}
              >
                All ({history.length})
              </button>
              <button
                type="button"
                className={`filter-pill ${statusFilter === 'completed' ? 'active' : ''}`}
                onClick={() => setStatusFilter('completed')}
              >
                Completed
              </button>
              <button
                type="button"
                className={`filter-pill ${statusFilter === 'archived' ? 'active' : ''}`}
                onClick={() => setStatusFilter('archived')}
              >
                Archived
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* History Table */}
      {filteredHistory.length > 0 ? (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Batch Filename</th>
                <th>Date Analyzed</th>
                <th>Volume</th>
                <th>Sentiment Distribution</th>
                <th>Top Bottleneck</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((item) => {
                const isCsv = item.filename.endsWith('.csv');
                return (
                  <tr key={item.id} style={{ backgroundColor: item.isCurrent ? '#f0f7ff' : 'transparent' }}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: '6px',
                            backgroundColor: isCsv ? '#eff6ff' : '#ecfdf5',
                            color: isCsv ? 'var(--primary)' : 'var(--positive)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {isCsv ? <FileText size={16} /> : <FileSpreadsheet size={16} />}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <span>{item.filename}</span>
                            {item.isCurrent && (
                              <span className="badge badge-category" style={{ fontSize: '0.625rem', backgroundColor: '#dbeafe', color: 'var(--primary)' }}>
                                Active
                              </span>
                            )}
                          </div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {item.fileSize}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Calendar size={13} color="var(--text-tertiary)" />
                        <span>{formatDate(item.date)}</span>
                      </div>
                    </td>

                    <td style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                      {formatNumber(item.feedbackCount)}
                    </td>

                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <div className="sentiment-mini-bar" title={`Positive: ${item.positivePercent}%, Neutral: ${item.neutralPercent}%, Negative: ${item.negativePercent}%`}>
                          <div className="bar-segment-pos" style={{ width: `${item.positivePercent}%` }} />
                          <div className="bar-segment-neu" style={{ width: `${item.neutralPercent}%` }} />
                          <div className="bar-segment-neg" style={{ width: `${item.negativePercent}%` }} />
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                          <span style={{ color: 'var(--positive-text)' }}>{item.positivePercent}% Pos</span>
                          <span>•</span>
                          <span style={{ color: 'var(--negative-text)' }}>{item.negativePercent}% Neg</span>
                        </div>
                      </div>
                    </td>

                    <td style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                      {item.topIssue}
                    </td>

                    <td>
                      <span className={`badge ${item.status === 'Completed' ? 'badge-positive' : 'badge-category'}`}>
                        {item.status}
                      </span>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleSelectBatch(item.id, '/analysis')}
                          title="View analysis metrics and customer feedback"
                        >
                          <Eye size={13} />
                          <span>View Analysis</span>
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => handleSelectBatch(item.id, '/report')}
                          title="View synthesized improvement report"
                        >
                          <Sparkles size={13} />
                          <span>View Report</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title="No past analyses found"
          description="Try clearing your search query or uploading a new customer feedback batch."
          actionText="Reset Filters"
          onAction={() => {
            setHistorySearch('');
            setStatusFilter('all');
          }}
        />
      )}
    </div>
  );
}

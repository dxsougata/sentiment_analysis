import { useState, useMemo } from 'react';
import {
  Search,
  ThumbsUp,
  Minus,
  ThumbsDown,
  Calendar,
  Sparkles,
  FilterX
} from 'lucide-react';
import { useAnalysis } from '../hooks/useAnalysis';
import SentimentBadge from '../components/common/SentimentBadge';
import EmptyState from '../components/common/EmptyState';
import SentimentDonutChart from '../components/charts/SentimentDonutChart';
import CategoryBreakdownChart from '../components/charts/CategoryBreakdownChart';
import SentimentTrendChart from '../components/charts/SentimentTrendChart';
import { formatNumber, formatDate } from '../utils/formatters';

export default function AnalysisPage() {
  const { stats, reviews, categories, trend, activeDatasetName } = useAnalysis();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState('all'); // 'all' | 'positive' | 'neutral' | 'negative'
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'confidence' | 'rating'

  // Extract unique categories dynamically from current dataset
  const availableCategories = useMemo(() => {
    const cats = new Set(reviews.map((r) => r.category).filter(Boolean));
    return Array.from(cats);
  }, [reviews]);

  // Filter and sort reviews
  const filteredReviews = useMemo(() => {
    return reviews
      .filter((item) => {
        // Sentiment filter
        if (sentimentFilter !== 'all' && item.sentiment !== sentimentFilter) {
          return false;
        }

        // Category filter
        if (categoryFilter !== 'all' && item.category !== categoryFilter) {
          return false;
        }

        // Search text filter
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          const matchText = item.review.toLowerCase().includes(term);
          const matchCat = (item.category || '').toLowerCase().includes(term);
          return matchText || matchCat;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.date) - new Date(a.date);
        if (sortBy === 'oldest') return new Date(a.date) - new Date(b.date);
        if (sortBy === 'confidence') return b.confidence - a.confidence;
        if (sortBy === 'rating') return a.rating - b.rating;
        return 0;
      });
  }, [reviews, sentimentFilter, categoryFilter, searchTerm, sortBy]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSentimentFilter('all');
    setCategoryFilter('all');
    setSortBy('newest');
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>Customer Sentiment Analysis</h1>
          <p>
            Detailed sentiment polarity, categorical distribution, and individual customer feedback for{' '}
            <strong>{activeDatasetName}</strong>.
          </p>
        </div>
      </div>

      {/* Summary Stats Header Bar */}
      <div className="kpi-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="kpi-card">
          <span className="kpi-label">Analyzed Records</span>
          <div className="kpi-value-row" style={{ marginTop: '0.5rem' }}>
            <span className="kpi-value">{formatNumber(stats.totalFeedback)}</span>
          </div>
          <span className="kpi-trend">100% processed</span>
        </div>

        <div className="kpi-card" style={{ borderLeft: '4px solid var(--positive)' }}>
          <span className="kpi-label" style={{ color: 'var(--positive-text)' }}>Positive Feedback</span>
          <div className="kpi-value-row" style={{ marginTop: '0.5rem' }}>
            <span className="kpi-value">{formatNumber(stats.positiveCount)}</span>
            <span className="badge-positive">{stats.positivePercent}%</span>
          </div>
          <span className="kpi-trend">High brand affinity</span>
        </div>

        <div className="kpi-card" style={{ borderLeft: '4px solid var(--neutral)' }}>
          <span className="kpi-label" style={{ color: 'var(--neutral-text)' }}>Neutral Feedback</span>
          <div className="kpi-value-row" style={{ marginTop: '0.5rem' }}>
            <span className="kpi-value">{formatNumber(stats.neutralCount)}</span>
            <span className="badge-neutral">{stats.neutralPercent}%</span>
          </div>
          <span className="kpi-trend">Routine / informational</span>
        </div>

        <div className="kpi-card" style={{ borderLeft: '4px solid var(--negative)' }}>
          <span className="kpi-label" style={{ color: 'var(--negative-text)' }}>Negative Feedback</span>
          <div className="kpi-value-row" style={{ marginTop: '0.5rem' }}>
            <span className="kpi-value">{formatNumber(stats.negativeCount)}</span>
            <span className="badge-negative">{stats.negativePercent}%</span>
          </div>
          <span className="kpi-trend">Friction & complaints</span>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid-3">
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Sentiment Distribution</h2>
              <p className="card-subtitle">Polarity ratios for uploaded feedback</p>
            </div>
          </div>
          <div className="card-body" style={{ height: '300px' }}>
            <SentimentDonutChart stats={stats} />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Topic & Category Breakdown</h2>
              <p className="card-subtitle">Volume of positive, neutral, and negative per category</p>
            </div>
          </div>
          <div className="card-body" style={{ height: '300px' }}>
            <CategoryBreakdownChart categories={categories} />
          </div>
        </div>
      </div>

      {/* Sentiment Trend Timeline */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <div>
            <h2 className="card-title">Timeline Trajectory</h2>
            <p className="card-subtitle">Tracking customer sentiment spikes over collection dates</p>
          </div>
          <div className="badge badge-category">
            <Calendar size={13} style={{ marginRight: 4 }} />
            Weekly Aggregate
          </div>
        </div>
        <div className="card-body" style={{ height: '260px' }}>
          <SentimentTrendChart trend={trend} />
        </div>
      </div>

      {/* Search & Filter Controls Bar */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div className="card-body" style={{ padding: '1.25rem' }}>
          <div className="filter-bar" style={{ margin: 0 }}>
            {/* Search Input */}
            <div className="search-box">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search reviews by keyword, topic, or phrase..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Sentiment Pills */}
            <div className="filter-group">
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                Sentiment:
              </span>
              <button
                type="button"
                className={`filter-pill ${sentimentFilter === 'all' ? 'active' : ''}`}
                onClick={() => setSentimentFilter('all')}
              >
                All
              </button>
              <button
                type="button"
                className={`filter-pill ${sentimentFilter === 'positive' ? 'active' : ''}`}
                onClick={() => setSentimentFilter('positive')}
              >
                <ThumbsUp size={13} style={{ marginRight: 4 }} />
                Positive
              </button>
              <button
                type="button"
                className={`filter-pill ${sentimentFilter === 'neutral' ? 'active' : ''}`}
                onClick={() => setSentimentFilter('neutral')}
              >
                <Minus size={13} style={{ marginRight: 4 }} />
                Neutral
              </button>
              <button
                type="button"
                className={`filter-pill ${sentimentFilter === 'negative' ? 'active' : ''}`}
                onClick={() => setSentimentFilter('negative')}
              >
                <ThumbsDown size={13} style={{ marginRight: 4 }} />
                Negative
              </button>
            </div>

            {/* Category Dropdown */}
            <div className="filter-group">
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                Category:
              </span>
              <select
                className="select-control"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                aria-label="Filter by category"
              >
                <option value="all">All Categories</option>
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="filter-group">
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                Sort:
              </span>
              <select
                className="select-control"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort reviews"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="confidence">Highest Confidence</option>
                <option value="rating">Lowest Rating First</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            {(searchTerm || sentimentFilter !== 'all' || categoryFilter !== 'all' || sortBy !== 'newest') && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleResetFilters}
              >
                <FilterX size={14} />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Count Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Showing <strong>{filteredReviews.length}</strong> matching feedback entries
        </span>
        {sentimentFilter === 'negative' && (
          <span className="badge badge-negative">
            Filtering Negative Complaints Only
          </span>
        )}
      </div>

      {/* Feedback Card List */}
      {filteredReviews.length > 0 ? (
        <div className="feedback-card-list">
          {filteredReviews.map((item) => (
            <div
              key={item.id}
              className={`feedback-card ${item.sentiment}`}
            >
              <div className="feedback-card-header">
                <div className="feedback-card-meta">
                  <SentimentBadge sentiment={item.sentiment} showIcon />
                  {item.category && (
                    <span className="badge badge-category">{item.category}</span>
                  )}
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Rating: {item.rating}/5
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Sparkles size={12} color="var(--primary)" />
                    {Math.round(item.confidence * 100)}% confidence
                  </span>
                  <span>{formatDate(item.date)}</span>
                </div>
              </div>

              <p className="feedback-card-text">{item.review}</p>

              <div className="feedback-card-footer">
                <span>Entry #{item.id}</span>
                {item.sentiment === 'negative' && (
                  <span style={{ color: 'var(--negative)', fontWeight: 500 }}>
                    Identified Customer Pain Point
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No reviews match your filters"
          description="Try broadening your search term or clearing the active sentiment and category filters."
          actionText="Clear All Filters"
          onAction={handleResetFilters}
        />
      )}
    </div>
  );
}

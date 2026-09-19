import { useState } from 'react';
import {
  Download,
  Share2,
  RefreshCw,
  CheckCircle2,
  Building,
  Target,
  FileCheck,
  TrendingUp,
  Clock,
  Printer,
  Sparkles
} from 'lucide-react';
import { useAnalysis } from '../hooks/useAnalysis';
import PriorityBadge from '../components/common/PriorityBadge';
import { formatNumber } from '../utils/formatters';

export default function ReportPage() {
  const {
    report,
    stats,
    isGeneratingReport,
    runGenerateReport,
    showToast,
    activeDatasetName
  } = useAnalysis();

  const [downloadDropdown, setDownloadDropdown] = useState(false);

  const handleDownload = (format) => {
    setDownloadDropdown(false);
    if (format === 'print') {
      window.print();
    } else if (format === 'copy') {
      const summaryText = `Sentix AI Customer Feedback Report\nDataset: ${report.batchName}\nGenerated: ${report.generatedDate}\n\nExecutive Summary:\n${report.summary.executiveSummary}\n\nKey Actions:\n${report.actionRoadmap.map((a, i) => `${i + 1}. [${a.priority} Priority] ${a.issue} -> ${a.suggestedAction}`).join('\n')}`;
      navigator.clipboard.writeText(summaryText);
      showToast('Report summary copied to clipboard!', 'success');
    } else {
      showToast(`Report export initialized (${format.toUpperCase()}). Placeholder ready for backend PDF generator.`, 'info');
    }
  };

  return (
    <div className="report-page-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>AI Business Improvement Report</h1>
          <p>
            Strategic operational recommendations synthesized from customer sentiment polarity and friction clusters.
          </p>
        </div>

        <div className="page-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => runGenerateReport()}
            disabled={isGeneratingReport}
          >
            <RefreshCw size={16} className={isGeneratingReport ? 'spin' : ''} />
            <span>{isGeneratingReport ? 'Synthesizing...' : 'Regenerate Report'}</span>
          </button>

          <div style={{ position: 'relative' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setDownloadDropdown(!downloadDropdown)}
            >
              <Download size={16} />
              <span>Download Report</span>
            </button>

            {downloadDropdown && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '100%',
                  marginTop: '0.5rem',
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 50,
                  minWidth: '180px',
                  overflow: 'hidden'
                }}
              >
                <button
                  type="button"
                  style={{
                    width: '100%',
                    padding: '0.65rem 1rem',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onClick={() => handleDownload('pdf')}
                >
                  <Printer size={14} />
                  <span>PDF Document</span>
                </button>
                <button
                  type="button"
                  style={{
                    width: '100%',
                    padding: '0.65rem 1rem',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onClick={() => handleDownload('copy')}
                >
                  <Share2 size={14} />
                  <span>Copy Markdown Summary</span>
                </button>
                <button
                  type="button"
                  style={{
                    width: '100%',
                    padding: '0.65rem 1rem',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onClick={() => handleDownload('json')}
                >
                  <FileCheck size={14} />
                  <span>Raw JSON Export</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Simulated Mode Indicator */}
      <div className="demo-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={16} />
          <span>
            Mock Intelligence Layer: Demonstrates the exact structure the future LLM/ML backend will deliver.
          </span>
        </div>
        <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Status: Simulated Output</span>
      </div>

      {/* Report Hero Card */}
      <div className="report-hero-card">
        <div className="report-hero-meta">
          <span className="badge badge-category">Report ID: {report.id}</span>
          <span className="badge badge-category">Dataset: {activeDatasetName}</span>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Generated on {report.generatedDate}
          </span>
        </div>

        <h2 className="report-title">{report.title}</h2>

        <div className="report-exec-summary">
          <div style={{ fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--primary)', marginBottom: '0.5rem' }}>
            Section 1: Executive Summary
          </div>
          <p>{report.summary.executiveSummary}</p>
        </div>

        {/* High-level Findings */}
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Core Strategic Takeaways:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
            {report.summary.keyFindings.map((finding, idx) => (
              <div
                key={idx}
                style={{
                  padding: '0.75rem',
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  fontSize: '0.8125rem',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5rem'
                }}
              >
                <CheckCircle2 size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: 2 }} />
                <span>{finding}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 2: Overall Sentiment Health Balance */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <div>
            <h2 className="card-title">Section 2: Overall Sentiment Baseline</h2>
            <p className="card-subtitle">Volume and polarity distribution across {formatNumber(stats.totalFeedback)} customer voices</p>
          </div>
        </div>
        <div className="card-body">
          <div className="kpi-grid" style={{ marginBottom: 0 }}>
            <div className="kpi-card" style={{ borderLeft: '4px solid var(--positive)' }}>
              <span className="kpi-label">Positive Sentiment</span>
              <div className="kpi-value-row" style={{ marginTop: '0.5rem' }}>
                <span className="kpi-value">{stats.positivePercent}%</span>
                <span className="badge-positive">{formatNumber(stats.positiveCount)} reviews</span>
              </div>
              <span className="kpi-trend">Strong product loyalty</span>
            </div>

            <div className="kpi-card" style={{ borderLeft: '4px solid var(--neutral)' }}>
              <span className="kpi-label">Neutral Inquiries</span>
              <div className="kpi-value-row" style={{ marginTop: '0.5rem' }}>
                <span className="kpi-value">{stats.neutralPercent}%</span>
                <span className="badge-neutral">{formatNumber(stats.neutralCount)} reviews</span>
              </div>
              <span className="kpi-trend">Informational interactions</span>
            </div>

            <div className="kpi-card" style={{ borderLeft: '4px solid var(--negative)' }}>
              <span className="kpi-label">Negative Friction</span>
              <div className="kpi-value-row" style={{ marginTop: '0.5rem' }}>
                <span className="kpi-value">{stats.negativePercent}%</span>
                <span className="badge-negative">{formatNumber(stats.negativeCount)} reviews</span>
              </div>
              <span className="kpi-trend">Target for immediate intervention</span>
            </div>

            <div className="kpi-card" style={{ borderLeft: '4px solid var(--primary)' }}>
              <span className="kpi-label">Net Sentiment Score</span>
              <div className="kpi-value-row" style={{ marginTop: '0.5rem' }}>
                <span className="kpi-value">+{stats.netSentimentScore}</span>
              </div>
              <span className="kpi-trend">Benchmark: +25 Industry Avg</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3 & 4: Suggested Actions & Evidence Matrix */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Section 3 & 4: Prioritized Action Roadmap
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Direct mapping: Identified Issue &rarr; Voice of Customer Evidence &rarr; Suggested Operational Fix &rarr; Target Impact
            </p>
          </div>
          <span className="badge badge-category">{report.actionRoadmap.length} Action Items</span>
        </div>

        <div className="actions-roadmap-list">
          {report.actionRoadmap.map((item) => (
            <div key={item.id} className="roadmap-card">
              <div className="roadmap-card-header">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <PriorityBadge priority={item.priority} />
                    <span className="roadmap-area-tag">
                      <Building size={13} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                      {item.area} • {item.owner}
                    </span>
                  </div>
                  <h3 className="roadmap-issue-title">
                    ISSUE: {item.issue}
                  </h3>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <Clock size={13} />
                  <span>{item.implementationHorizon}</span>
                </div>
              </div>

              {/* Evidence Box */}
              <div className="roadmap-block">
                <div className="roadmap-block-label">Evidence / Voice of Customer:</div>
                <div className="roadmap-evidence-box">
                  "{item.evidence}"
                </div>
              </div>

              {/* Suggested Action Box */}
              <div className="roadmap-block">
                <div className="roadmap-block-label">Suggested Business Action:</div>
                <div className="roadmap-action-box">
                  <strong>Recommendation:</strong> {item.suggestedAction}
                </div>
              </div>

              {/* Expected Impact Box */}
              <div className="roadmap-impact-box">
                <TrendingUp size={16} />
                <span><strong>Expected Business ROI:</strong> {item.expectedImpact}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 5: Priority Implementation Matrix */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <div>
            <h2 className="card-title">Section 5: Priority Implementation Matrix</h2>
            <p className="card-subtitle">Resource effort vs business impact classification</p>
          </div>
          <Target size={18} color="var(--primary)" />
        </div>
        <div className="card-body">
          <div className="priority-matrix-grid">
            {report.priorityMatrix.map((quadrant, idx) => (
              <div key={idx} className="matrix-quadrant">
                <h4 className="matrix-quadrant-title">
                  {quadrant.matrixQuadrant}
                </h4>
                <ul className="matrix-list">
                  {quadrant.items.map((action, actionIdx) => (
                    <li key={actionIdx} className="matrix-item">
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  FileSpreadsheet,
  FileText,
  Trash2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { useAnalysis } from '../hooks/useAnalysis';
import { formatFileSize } from '../utils/formatters';
import { parseCSV } from '../utils/csvParser';
import { getSampleDataset } from '../services/api';

export default function UploadPage() {
  const navigate = useNavigate();
  const { runAnalysis, isAnalyzing, analysisProgress } = useAnalysis();

  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [previewRows, setPreviewRows] = useState(null);
  const [previewHeaders, setPreviewHeaders] = useState([]);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const fileInputRef = useRef(null);

  // Supported extensions
  const ALLOWED_EXTENSIONS = ['.csv', '.xlsx', '.xls'];

  const validateAndSetFile = (file) => {
    setFileError(null);
    setAnalysisComplete(false);

    if (!file) return;

    const fileName = file.name.toLowerCase();
    const isValid = ALLOWED_EXTENSIONS.some((ext) => fileName.endsWith(ext));

    if (!isValid) {
      setFileError('Unsupported file format. Please upload a .csv, .xlsx, or .xls file.');
      setSelectedFile(null);
      setPreviewRows(null);
      return;
    }

    setSelectedFile(file);

    // If it's a CSV file, read preview locally using FileReader
    if (fileName.endsWith('.csv')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const parsed = parseCSV(text);
        if (parsed.headers.length > 0) {
          setPreviewHeaders(parsed.headers.slice(0, 5));
          setPreviewRows(parsed.rows.slice(0, 5));
        } else {
          // Fallback sample preview
          applySamplePreview();
        }
      };
      reader.readAsText(file.slice(0, 50000)); // Read first 50KB for fast preview
    } else {
      // For Excel files, show sample preview format
      applySamplePreview();
    }
  };

  const applySamplePreview = () => {
    setPreviewHeaders(['id', 'customer_review', 'category', 'date', 'rating']);
    setPreviewRows([
      { id: '1', customer_review: 'Delivery was delayed by 6 days without tracking updates.', category: 'Delivery', date: '2026-09-15', rating: '2' },
      { id: '2', customer_review: 'Outstanding product build and audio clarity. Highly recommended!', category: 'Product Quality', date: '2026-09-15', rating: '5' },
      { id: '3', customer_review: 'Support live chat took 40 minutes to reply.', category: 'Customer Support', date: '2026-09-14', rating: '1' },
      { id: '4', customer_review: 'Smooth mobile checkout experience and quick confirmation email.', category: 'User Experience', date: '2026-09-13', rating: '5' },
      { id: '5', customer_review: 'Standard package arrival, good condition.', category: 'Product Quality', date: '2026-09-12', rating: '3' }
    ]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setPreviewRows(null);
    setPreviewHeaders([]);
    setFileError(null);
    setAnalysisComplete(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleLoadSample = () => {
    const sample = getSampleDataset();
    const fakeFile = new File(['mock content'], sample.name, {
      type: 'text/csv'
    });
    setSelectedFile(fakeFile);
    applySamplePreview();
    setFileError(null);
    setAnalysisComplete(false);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    const success = await runAnalysis(selectedFile);
    if (success) {
      setAnalysisComplete(true);
    }
  };

  return (
    <div className="upload-container">
      {/* Page Title */}
      <div className="page-header" style={{ textAlign: 'center', display: 'block', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Upload Customer Feedback</h1>
        <p style={{ maxWidth: '600px', margin: '0.35rem auto 0', color: 'var(--text-muted)' }}>
          Import customer reviews from your website, storefront, or surveys in CSV or Excel format for automated sentiment analysis and issue extraction.
        </p>
      </div>

      {/* Error Message if invalid file */}
      {fileError && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem',
            backgroundColor: 'var(--negative-bg)',
            border: '1px solid var(--negative-border)',
            borderRadius: '8px',
            color: 'var(--negative-text)',
            marginBottom: '1.5rem',
            fontSize: '0.875rem'
          }}
        >
          <AlertCircle size={20} />
          <span>{fileError}</span>
        </div>
      )}

      {/* Drag and Drop Zone */}
      {!selectedFile && (
        <>
          <div
            className={`dropzone ${dragOver ? 'dragover' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            role="button"
            tabIndex={0}
            aria-label="Upload feedback file dropzone"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".csv,.xlsx,.xls"
              style={{ display: 'none' }}
            />

            <div className="upload-icon-circle">
              <UploadCloud size={32} />
            </div>

            <div className="dropzone-title">
              Drag & Drop your customer feedback file here
            </div>

            <div className="dropzone-subtitle">
              or click to browse your computer files
            </div>

            <div className="format-pills">
              <span className="format-pill">CSV (.csv)</span>
              <span className="format-pill">Excel (.xlsx, .xls)</span>
              <span className="format-pill">Max 50MB</span>
            </div>
          </div>

          {/* Quick Demo Sample Button */}
          <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleLoadSample}
            >
              <span>Load Sample E-Commerce Feedback (1-Click Demo)</span>
            </button>
          </div>
        </>
      )}

      {/* Selected File Details Card */}
      {selectedFile && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="selected-file-card" style={{ marginTop: 0 }}>
            <div className="file-info-group">
              <div className="file-type-icon">
                {selectedFile.name.endsWith('.csv') ? (
                  <FileText size={24} />
                ) : (
                  <FileSpreadsheet size={24} />
                )}
              </div>
              <div>
                <div className="file-meta-name">{selectedFile.name}</div>
                <div className="file-meta-size">
                  {formatFileSize(selectedFile.size)} • Ready for sentiment extraction
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {!isAnalyzing && !analysisComplete && (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleClearFile}
                  title="Remove file"
                  aria-label="Remove selected file"
                >
                  <Trash2 size={16} />
                  <span>Remove</span>
                </button>
              )}

              {!isAnalyzing && !analysisComplete && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAnalyze}
                >
                  <Sparkles size={16} />
                  <span>Analyze Feedback</span>
                </button>
              )}
            </div>
          </div>

          {/* Dataset Preview Section */}
          {previewRows && previewRows.length > 0 && !isAnalyzing && !analysisComplete && (
            <div className="card-body" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
              <div className="preview-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
                  <Eye size={16} color="var(--primary)" />
                  <span>Dataset Schema & Sample Preview (First 5 Rows)</span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Detected {previewHeaders.length} columns
                </span>
              </div>

              <div className="table-container" style={{ maxHeight: '220px' }}>
                <table className="data-table preview-table">
                  <thead>
                    <tr>
                      {previewHeaders.map((header) => (
                        <th key={header}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map((row, idx) => (
                      <tr key={idx}>
                        {previewHeaders.map((h) => (
                          <td key={h}>{row[h] || '—'}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Simulation Progress Pipeline */}
      {isAnalyzing && (
        <div className="simulation-pipeline">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.9375rem' }}>
              <Loader2 size={18} className="spin" color="var(--primary)" />
              <span>Simulating Feedback Intelligence Engine</span>
            </div>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--primary)' }}>
              {analysisProgress ? `${analysisProgress.percent}%` : '0%'}
            </span>
          </div>

          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{ width: `${analysisProgress ? analysisProgress.percent : 0}%` }}
            />
          </div>

          <div className="stages-list">
            {[
              { step: 1, label: 'Validating file structure and schema...' },
              { step: 2, label: 'Normalizing customer reviews and timestamps...' },
              { step: 3, label: 'Executing sentiment classification (Positive / Neutral / Negative)...' },
              { step: 4, label: 'Clustering root-cause topics and pain points...' },
              { step: 5, label: 'Synthesizing executive summary & action items...' }
            ].map((stage) => {
              const currentStep = analysisProgress ? analysisProgress.step : 0;
              const isDone = currentStep > stage.step;
              const isActive = currentStep === stage.step;

              return (
                <div
                  key={stage.step}
                  className={`stage-item ${isDone ? 'completed' : ''} ${isActive ? 'active' : ''}`}
                >
                  <div className="stage-dot">
                    {isDone ? <CheckCircle2 size={14} /> : stage.step}
                  </div>
                  <span>{stage.label}</span>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '1.25rem', padding: '0.75rem', backgroundColor: 'var(--bg-subtle)', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Note: This simulation runs entirely in mock mode to replicate the exact lifecycle of the future backend model. No real backend required.
          </div>
        </div>
      )}

      {/* Analysis Complete Success Banner */}
      {analysisComplete && (
        <div
          className="card"
          style={{
            padding: '2rem',
            textAlign: 'center',
            backgroundColor: 'var(--positive-bg)',
            borderColor: 'var(--positive-border)'
          }}
        >
          <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: '#ffffff', color: 'var(--positive)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: 'var(--shadow-sm)' }}>
            <CheckCircle2 size={28} />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--positive-text)', marginBottom: '0.35rem' }}>
            Analysis Successfully Completed!
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 1.5rem' }}>
            Extracted sentiment polarity, issue categorization, and confidence metrics for <strong>{selectedFile?.name}</strong>.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClearFile}
            >
              Upload Another Batch
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate('/analysis')}
            >
              <span>View Analysis Results</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

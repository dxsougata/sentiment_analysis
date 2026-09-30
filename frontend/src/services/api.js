/**
 * API layer for the sentiment platform.
 * Live mode posts CSV files to FastAPI `/api/upload-csv`.
 * Set VITE_USE_MOCK_API=true to use the local mock pipeline.
 */

import { INITIAL_MOCK_FEEDBACK, MOCK_SUMMARY_STATS, MOCK_CATEGORY_BREAKDOWN, MOCK_SENTIMENT_TREND } from '../data/mockFeedback';
import { MOCK_ISSUES } from '../data/mockIssues';
import { MOCK_REPORT } from '../data/mockReport';
import { MOCK_HISTORY } from '../data/mockHistory';
import { mapUploadResponse } from '../utils/analysisMapper';
import { buildImprovementReport } from '../utils/reportGenerator';

export const USE_MOCK_API = String(import.meta.env.VITE_USE_MOCK_API || '').toLowerCase() === 'true';
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function readApiError(response) {
  try {
    const body = await response.json();
    const detail = body?.detail;
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail)) {
      return detail.map((item) => item.msg || item.detail || JSON.stringify(item)).join('; ');
    }
    if (detail && typeof detail === 'object') return JSON.stringify(detail);
    if (body?.message) return body.message;
  } catch {
    /* ignore parse errors */
  }
  return `Request failed (${response.status} ${response.statusText || 'Error'})`;
}

function connectionError(error) {
  if (error?.name === 'TypeError' || /failed to fetch/i.test(error?.message || '')) {
    return new Error('Cannot reach the API. Start the FastAPI server on port 8000 and retry.');
  }
  return error instanceof Error ? error : new Error(String(error));
}

export async function analyzeFeedback(file, onProgress = () => {}) {
  if (!USE_MOCK_API) {
    onProgress({
      step: 1,
      percent: 15,
      message: 'Uploading CSV and running DistilBERT. This can take a few minutes on large files.'
    });

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/upload-csv`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(await readApiError(response));
      }

      onProgress({ step: 2, percent: 80, message: 'Formatting results for the dashboard...' });
      const data = await response.json();
      const mapped = mapUploadResponse(data, file);
      onProgress({ step: 3, percent: 100, message: 'Complete' });
      return mapped;
    } catch (error) {
      throw connectionError(error);
    }
  }

  const stages = [
    { step: 1, percent: 15, message: 'Validating file structure and schema...' },
    { step: 2, percent: 35, message: 'Normalizing customer reviews and timestamps...' },
    { step: 3, percent: 65, message: 'Executing sentiment classification...' },
    { step: 4, percent: 85, message: 'Clustering root-cause topics...' },
    { step: 5, percent: 100, message: 'Synthesizing summary...' }
  ];

  for (const stage of stages) {
    onProgress(stage);
    await delay(400);
  }

  const feedbackCount = file && file.size ? Math.max(120, Math.floor(file.size / 350)) : 1420;
  return {
    success: true,
    fileInfo: {
      name: file ? file.name : 'customer_feedback_batch.csv',
      size: file ? file.size : 482000,
      analyzedAt: new Date().toISOString()
    },
    stats: {
      ...MOCK_SUMMARY_STATS,
      totalFeedback: feedbackCount
    },
    reviews: INITIAL_MOCK_FEEDBACK,
    categories: MOCK_CATEGORY_BREAKDOWN,
    trend: MOCK_SENTIMENT_TREND,
    issues: MOCK_ISSUES
  };
}

export function generateImprovementReport(payload = {}) {
  if (USE_MOCK_API) {
    return Promise.resolve({
      ...MOCK_REPORT,
      generatedDate: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    });
  }

  return Promise.resolve(buildImprovementReport(payload));
}

export async function getSampleDatasetFile() {
  const response = await fetch('/sample_ecommerce_feedback.csv');
  if (!response.ok) {
    throw new Error('Could not load the sample CSV from the app.');
  }
  const blob = await response.blob();
  return new File([blob], 'sample_ecommerce_feedback.csv', { type: 'text/csv' });
}

export function getSampleDataset() {
  return {
    name: 'sample_ecommerce_feedback.csv',
    size: 0,
    reviews: INITIAL_MOCK_FEEDBACK,
    stats: MOCK_SUMMARY_STATS
  };
}

export { MOCK_HISTORY };

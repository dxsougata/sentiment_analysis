/**
 * API Service Layer for Sentiment Analysis Platform
 * 
 * IMPORTANT ARCHITECTURE NOTE:
 * The backend API has not been finalized yet. This service layer acts as the
 * single point of contact between UI components and business logic.
 * 
 * When the backend is ready:
 * 1. Set `USE_MOCK_API = false` below (or via VITE_USE_MOCK_API=false in .env).
 * 2. Configure `API_BASE_URL` with your server address (e.g., http://localhost:5000/api).
 * 3. The React UI components will continue to function without any changes because
 *    they consume this standardized contract.
 */

import { INITIAL_MOCK_FEEDBACK, MOCK_SUMMARY_STATS, MOCK_CATEGORY_BREAKDOWN, MOCK_SENTIMENT_TREND } from '../data/mockFeedback';
import { MOCK_ISSUES } from '../data/mockIssues';
import { MOCK_REPORT } from '../data/mockReport';
import { MOCK_HISTORY } from '../data/mockHistory';

// Set to false when connecting to the real backend server
export const USE_MOCK_API = true;

// Future Backend Base URL configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Simulates network latency for realistic SaaS feel
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Analyzes uploaded customer feedback file (CSV or Excel)
 * In mock mode: Runs a multi-stage simulated analysis pipeline with progress updates.
 * In production mode: Sends multipart/form-data to the backend API endpoint.
 * 
 * @param {File} file - The uploaded CSV or Excel file
 * @param {Function} onProgress - Optional callback for simulation progress (stage, percentage, message)
 * @returns {Promise<Object>} Analysis results and metadata
 */
export async function analyzeFeedback(file, onProgress = () => {}) {
  if (!USE_MOCK_API) {
    // -------------------------------------------------------------
    // FUTURE REAL BACKEND INTEGRATION:
    // -------------------------------------------------------------
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      body: formData,
      // headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      throw new Error(`Analysis failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  // ---------------------------------------------------------------
  // SIMULATED MOCK INTELLIGENCE PIPELINE:
  // ---------------------------------------------------------------
  const stages = [
    { step: 1, percent: 15, message: 'Validating file structure and schema...' },
    { step: 2, percent: 35, message: 'Normalizing customer reviews and timestamps...' },
    { step: 3, percent: 65, message: 'Executing sentiment classification (Positive / Neutral / Negative)...' },
    { step: 4, percent: 85, message: 'Clustering root-cause topics and pain points...' },
    { step: 5, percent: 100, message: 'Synthesizing executive summary & action items...' }
  ];

  for (const stage of stages) {
    onProgress(stage);
    await delay(500); // 500ms per stage = 2.5 seconds total realistic simulation
  }

  // Estimate counts based on file size or fallback to mock defaults
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

/**
 * Retrieves the current sentiment analysis results
 * @returns {Promise<Object>} Summary statistics, review lists, and chart distributions
 */
export async function getAnalysisResults() {
  if (!USE_MOCK_API) {
    const response = await fetch(`${API_BASE_URL}/results`);
    if (!response.ok) throw new Error('Failed to retrieve analysis results');
    return await response.json();
  }

  await delay(200);
  return {
    stats: MOCK_SUMMARY_STATS,
    reviews: INITIAL_MOCK_FEEDBACK,
    categories: MOCK_CATEGORY_BREAKDOWN,
    trend: MOCK_SENTIMENT_TREND
  };
}

/**
 * Retrieves granular customer pain points and root-cause issues
 * @returns {Promise<Array>} List of prioritized issues with evidence and quotes
 */
export async function getIssues() {
  if (!USE_MOCK_API) {
    const response = await fetch(`${API_BASE_URL}/issues`);
    if (!response.ok) throw new Error('Failed to retrieve issues');
    return await response.json();
  }

  await delay(200);
  return MOCK_ISSUES;
}

/**
 * Generates an AI-assisted business improvement report
 * @param {Object} options - Optional generation filters (e.g. date range, focus categories)
 * @returns {Promise<Object>} Structured executive recommendations and action roadmap
 */
export async function generateImprovementReport(options = {}) {
  if (!USE_MOCK_API) {
    const response = await fetch(`${API_BASE_URL}/reports/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options)
    });
    if (!response.ok) throw new Error('Failed to generate report');
    return await response.json();
  }

  // Realistic generation delay
  await delay(1200);
  return {
    ...MOCK_REPORT,
    generatedDate: new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  };
}

/**
 * Retrieves the list of historical analysis runs
 * @returns {Promise<Array>} Previous analysis batches
 */
export async function getReportHistory() {
  if (!USE_MOCK_API) {
    const response = await fetch(`${API_BASE_URL}/history`);
    if (!response.ok) throw new Error('Failed to retrieve report history');
    return await response.json();
  }

  await delay(200);
  return MOCK_HISTORY;
}

/**
 * Helper to fetch pre-packaged sample dataset for instant testing
 */
export function getSampleDataset() {
  return {
    name: 'sample_ecommerce_q3_feedback.csv',
    size: 493568,
    reviews: INITIAL_MOCK_FEEDBACK,
    stats: MOCK_SUMMARY_STATS
  };
}

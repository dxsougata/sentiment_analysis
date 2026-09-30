import { useState, useEffect } from 'react';
import { AnalysisContext } from './AnalysisContextObject';
import { analyzeFeedback, generateImprovementReport } from '../services/api';

const EMPTY_STATS = {
  totalFeedback: 0,
  positiveCount: 0,
  positivePercent: 0,
  neutralCount: 0,
  neutralPercent: 0,
  negativeCount: 0,
  negativePercent: 0,
  netSentimentScore: 0,
  avgConfidence: 0
};

const STORAGE_KEY = 'sentix-analysis-v1';

function loadPersisted() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function persist(state) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* quota or private mode */
  }
}

const defaultState = {
  activeDatasetName: null,
  fileInfo: null,
  stats: EMPTY_STATS,
  reviews: [],
  categories: [],
  trend: [],
  issues: [],
  report: null,
  history: []
};

export function AnalysisProvider({ children }) {
  const [activeDatasetName, setActiveDatasetName] = useState(defaultState.activeDatasetName);
  const [fileInfo, setFileInfo] = useState(defaultState.fileInfo);
  const [stats, setStats] = useState(defaultState.stats);
  const [reviews, setReviews] = useState(defaultState.reviews);
  const [categories, setCategories] = useState(defaultState.categories);
  const [trend, setTrend] = useState(defaultState.trend);
  const [issues, setIssues] = useState(defaultState.issues);
  const [report, setReport] = useState(defaultState.report);
  const [history, setHistory] = useState(defaultState.history);
  const [hydrated, setHydrated] = useState(false);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const saved = loadPersisted();
    if (saved) {
      setActiveDatasetName(saved.activeDatasetName ?? null);
      setFileInfo(saved.fileInfo ?? null);
      setStats(saved.stats || EMPTY_STATS);
      setReviews(saved.reviews || []);
      setCategories(saved.categories || []);
      setTrend(saved.trend || []);
      setIssues(saved.issues || []);
      setReport(saved.report ?? null);
      setHistory(saved.history || []);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    persist({
      activeDatasetName,
      fileInfo,
      stats,
      reviews,
      categories,
      trend,
      issues,
      report,
      history
    });
  }, [hydrated, activeDatasetName, fileInfo, stats, reviews, categories, trend, issues, report, history]);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const applyResult = (result, { appendHistory } = { appendHistory: true }) => {
    setActiveDatasetName(result.fileInfo.name);
    setFileInfo(result.fileInfo);
    setStats(result.stats);
    setReviews(result.reviews);
    setCategories(result.categories);
    setTrend(result.trend);
    setIssues(result.issues);
    setReport(null);

    if (!appendHistory) return;

    const topIssue = result.issues[0]
      ? `${result.issues[0].title} (${result.issues[0].shareOfNegative}%)`
      : 'None';

    const snapshot = {
      fileInfo: result.fileInfo,
      stats: result.stats,
      reviews: result.reviews,
      categories: result.categories,
      trend: result.trend,
      issues: result.issues
    };

    const newHistoryItem = {
      id: `hist-${Date.now()}`,
      filename: result.fileInfo.name,
      fileSize: `${Math.max(1, Math.round((result.fileInfo.size || 0) / 1024))} KB`,
      date: new Date().toISOString().split('T')[0],
      feedbackCount: result.stats.totalFeedback,
      positivePercent: result.stats.positivePercent,
      neutralPercent: result.stats.neutralPercent,
      negativePercent: result.stats.negativePercent,
      topIssue,
      status: 'Completed',
      isCurrent: true,
      snapshot
    };

    setHistory((prev) => [
      newHistoryItem,
      ...prev.map((item) => ({ ...item, isCurrent: false }))
    ]);
  };

  const runAnalysis = async (file) => {
    setIsAnalyzing(true);
    setAnalysisProgress({ step: 0, percent: 5, message: 'Starting analysis...' });

    try {
      const result = await analyzeFeedback(file, (progress) => {
        setAnalysisProgress(progress);
      });

      if (result.success) {
        applyResult(result);
        showToast('Analysis completed. Dashboard now shows this upload.', 'success');
        return true;
      }
      showToast('Analysis did not return results.', 'error');
      return false;
    } catch (err) {
      showToast(err.message || 'Failed to analyze feedback', 'error');
      return false;
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(null);
    }
  };

  const runGenerateReport = async () => {
    if (!stats.totalFeedback) {
      showToast('Analyze a CSV first, then generate a report.', 'error');
      return null;
    }

    setIsGeneratingReport(true);
    try {
      const generated = await generateImprovementReport({
        stats,
        issues,
        fileInfo,
        reviews
      });
      setReport(generated);
      showToast('Improvement report generated from this batch.', 'success');
      return generated;
    } catch (err) {
      showToast(err.message || 'Failed to generate report', 'error');
      return null;
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const loadHistoricalBatch = (batchId) => {
    const item = history.find((h) => h.id === batchId);
    if (!item?.snapshot) {
      showToast('This history item has no saved results.', 'error');
      return;
    }

    setActiveDatasetName(item.filename);
    setFileInfo(item.snapshot.fileInfo);
    setStats(item.snapshot.stats);
    setReviews(item.snapshot.reviews);
    setCategories(item.snapshot.categories);
    setTrend(item.snapshot.trend);
    setIssues(item.snapshot.issues);
    setReport(null);
    setHistory((prev) =>
      prev.map((h) => ({
        ...h,
        isCurrent: h.id === batchId
      }))
    );
    showToast(`Loaded ${item.filename}`, 'info');
  };

  const hasAnalysis = Boolean(activeDatasetName && stats.totalFeedback > 0);

  return (
    <AnalysisContext.Provider
      value={{
        activeDatasetName,
        fileInfo,
        stats,
        reviews,
        categories,
        trend,
        issues,
        report,
        history,
        isAnalyzing,
        analysisProgress,
        isGeneratingReport,
        runAnalysis,
        runGenerateReport,
        loadHistoricalBatch,
        toast,
        showToast,
        hasAnalysis
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
}

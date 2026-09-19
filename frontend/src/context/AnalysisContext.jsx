import { useState } from 'react';
import { AnalysisContext } from './AnalysisContextObject';
import { INITIAL_MOCK_FEEDBACK, MOCK_SUMMARY_STATS, MOCK_CATEGORY_BREAKDOWN, MOCK_SENTIMENT_TREND } from '../data/mockFeedback';
import { MOCK_ISSUES } from '../data/mockIssues';
import { MOCK_REPORT } from '../data/mockReport';
import { MOCK_HISTORY } from '../data/mockHistory';
import { analyzeFeedback, generateImprovementReport } from '../services/api';

export function AnalysisProvider({ children }) {
  // Current active analysis dataset state
  const [activeDatasetName, setActiveDatasetName] = useState('q3_storefront_reviews_master.csv');
  const [fileInfo, setFileInfo] = useState({
    name: 'q3_storefront_reviews_master.csv',
    size: 493568,
    uploadedAt: '2026-09-18T00:00:00.000Z'
  });
  
  const [stats, setStats] = useState(MOCK_SUMMARY_STATS);
  const [reviews, setReviews] = useState(INITIAL_MOCK_FEEDBACK);
  const [categories, setCategories] = useState(MOCK_CATEGORY_BREAKDOWN);
  const [trend, setTrend] = useState(MOCK_SENTIMENT_TREND);
  const [issues, setIssues] = useState(MOCK_ISSUES);
  const [report, setReport] = useState(MOCK_REPORT);
  const [history, setHistory] = useState(MOCK_HISTORY);

  // Analysis simulation state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(null);

  // Report generation state
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Toast notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  /**
   * Triggers the feedback analysis pipeline (mock simulation)
   */
  const runAnalysis = async (file) => {
    setIsAnalyzing(true);
    setAnalysisProgress({ step: 0, percent: 5, message: 'Initializing analysis engine...' });

    try {
      const result = await analyzeFeedback(file, (progress) => {
        setAnalysisProgress(progress);
      });

      if (result.success) {
        setActiveDatasetName(result.fileInfo.name);
        setFileInfo(result.fileInfo);
        setStats(result.stats);
        setReviews(result.reviews);
        setCategories(result.categories);
        setTrend(result.trend);
        setIssues(result.issues);

        // Add to history list
        const newHistoryItem = {
          id: `hist-${Date.now()}`,
          filename: result.fileInfo.name,
          fileSize: `${Math.round(result.fileInfo.size / 1024)} KB`,
          date: new Date().toISOString().split('T')[0],
          feedbackCount: result.stats.totalFeedback,
          positivePercent: result.stats.positivePercent,
          neutralPercent: result.stats.neutralPercent,
          negativePercent: result.stats.negativePercent,
          topIssue: 'Delivery Delays (50.3%)',
          status: 'Completed',
          isCurrent: true
        };

        setHistory((prev) => [
          newHistoryItem,
          ...prev.map((item) => ({ ...item, isCurrent: false }))
        ]);

        showToast('Feedback analysis completed successfully! Results ready.', 'success');
        return true;
      }
    } catch (err) {
      showToast(err.message || 'Failed to analyze feedback', 'error');
      return false;
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(null);
    }
  };

  /**
   * Generates or regenerates the AI business improvement report
   */
  const runGenerateReport = async () => {
    setIsGeneratingReport(true);
    try {
      const generated = await generateImprovementReport();
      setReport(generated);
      showToast('AI Business Improvement Report generated successfully.', 'success');
      return generated;
    } catch (err) {
      showToast(err.message || 'Failed to generate report', 'error');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  /**
   * Loads a historical batch into current view
   */
  const loadHistoricalBatch = (batchId) => {
    const item = history.find((h) => h.id === batchId);
    if (!item) return;

    setActiveDatasetName(item.filename);
    setFileInfo({
      name: item.filename,
      size: 350000,
      uploadedAt: item.date
    });

    setHistory((prev) =>
      prev.map((h) => ({
        ...h,
        isCurrent: h.id === batchId
      }))
    );

    showToast(`Loaded historical dataset: ${item.filename}`, 'info');
  };

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
        showToast
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
}

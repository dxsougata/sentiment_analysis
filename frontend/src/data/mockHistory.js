/**
 * Mock History Dataset
 * Contains previous analysis runs and batch reports.
 */

export const MOCK_HISTORY = [
  {
    id: "hist-001",
    filename: "q3_storefront_reviews_master.csv",
    fileSize: "482 KB",
    date: "2026-09-18",
    feedbackCount: 1420,
    positivePercent: 58.0,
    neutralPercent: 17.5,
    negativePercent: 24.5,
    topIssue: "Delivery Delays (50.3%)",
    status: "Completed",
    isCurrent: true
  },
  {
    id: "hist-002",
    filename: "august_customer_surveys_export.xlsx",
    fileSize: "320 KB",
    date: "2026-08-31",
    feedbackCount: 980,
    positivePercent: 62.2,
    neutralPercent: 15.1,
    negativePercent: 22.7,
    topIssue: "Customer Support Wait Times (38%)",
    status: "Completed",
    isCurrent: false
  },
  {
    id: "hist-003",
    filename: "mobile_app_feedback_v3.csv",
    fileSize: "215 KB",
    date: "2026-08-15",
    feedbackCount: 650,
    positivePercent: 51.5,
    neutralPercent: 19.2,
    negativePercent: 29.3,
    topIssue: "Mobile Checkout Friction (42%)",
    status: "Completed",
    isCurrent: false
  },
  {
    id: "hist-004",
    filename: "q2_ecomm_trustpilot_export.csv",
    fileSize: "890 KB",
    date: "2026-06-30",
    feedbackCount: 2240,
    positivePercent: 64.0,
    neutralPercent: 14.8,
    negativePercent: 21.2,
    topIssue: "Packaging Durability (28%)",
    status: "Archived",
    isCurrent: false
  },
  {
    id: "hist-005",
    filename: "zendesk_csat_tickets_july.csv",
    fileSize: "410 KB",
    date: "2026-07-28",
    feedbackCount: 1100,
    positivePercent: 59.8,
    neutralPercent: 16.0,
    negativePercent: 24.2,
    topIssue: "Warranty Exchange Delays (33%)",
    status: "Completed",
    isCurrent: false
  }
];

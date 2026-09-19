/**
 * Mock Issues & Insights Dataset
 * Identifies root causes behind negative customer feedback.
 */

export const MOCK_ISSUES = [
  {
    id: "issue-delivery-delays",
    category: "Delivery",
    title: "Delivery Delays & Inaccurate Tracking Estimates",
    mentions: 175,
    shareOfNegative: 50.3, // % of all negative feedback
    priority: "High", // 'High' | 'Medium' | 'Low'
    urgencyLevel: 92, // 0-100 scale for severity
    trend: "+6.4% this month",
    explanation: "Customers frequently report delivery delays of 4 to 8 business days past estimated dates, coupled with non-functioning tracking links and lack of proactive delay notifications.",
    impactAnalysis: "Significant risk to repeat purchase rate and post-order CSAT score, resulting in high support ticket escalation.",
    quotes: [
      {
        id: 1,
        review: "The wireless noise-canceling headphones sound phenomenal, but the delivery took 8 business days instead of the promised 2.",
        date: "2026-09-15",
        confidence: 0.93,
        rating: 2
      },
      {
        id: 11,
        review: "The tracking link sent via SMS gave a 404 page for two days. Very frustrating to be left guessing.",
        date: "2026-09-11",
        confidence: 0.92,
        rating: 2
      },
      {
        id: 18,
        review: "Driver left the package on the curbside in pouring rain rather than placing it on the covered porch.",
        date: "2026-09-09",
        confidence: 0.97,
        rating: 1
      },
      {
        id: 22,
        review: "Courier delayed delivery three times citing 'operational constraints'. Ruined our event timeline.",
        date: "2026-09-07",
        confidence: 0.98,
        rating: 1
      },
      {
        id: 32,
        review: "Estimated delivery said 3-5 days, but it took nearly two weeks with zero email updates.",
        date: "2026-09-02",
        confidence: 0.95,
        rating: 2
      }
    ]
  },
  {
    id: "issue-support-response",
    category: "Customer Support",
    title: "Delayed Customer Support & Scripted Bot Replies",
    mentions: 70,
    shareOfNegative: 20.1,
    priority: "High",
    urgencyLevel: 84,
    trend: "+2.1% this month",
    explanation: "Users experience long live-chat wait times exceeding 40 minutes, followed by repetitive canned responses that do not address nuanced account or warranty issues.",
    impactAnalysis: "Increases churn during critical post-purchase moments and drives negative public sentiment on social channels.",
    quotes: [
      {
        id: 5,
        review: "Waited 45 minutes on live chat just to get a robotic reply about my missing order confirmation.",
        date: "2026-09-14",
        confidence: 0.96,
        rating: 1
      },
      {
        id: 14,
        review: "Support ticket was acknowledged automatically but took four days for a human representative to follow up.",
        date: "2026-09-10",
        confidence: 0.94,
        rating: 2
      },
      {
        id: 25,
        review: "No phone support option available. When an urgent billing discrepancy happens, email tickets are too slow.",
        date: "2026-09-05",
        confidence: 0.93,
        rating: 2
      },
      {
        id: 38,
        review: "Support agent sent generic copy-paste troubleshooting steps that didn't address my specific issue.",
        date: "2026-08-29",
        confidence: 0.93,
        rating: 2
      }
    ]
  },
  {
    id: "issue-quality-durability",
    category: "Product Quality",
    title: "Material Durability & Specification Discrepancies",
    mentions: 55,
    shareOfNegative: 15.8,
    priority: "Medium",
    urgencyLevel: 68,
    trend: "-1.5% this month",
    explanation: "A subset of customers observed build quality variances, zipper/seam wear within the first two weeks, and slight deviations from published website dimensions.",
    impactAnalysis: "Triggers return requests and warranty claims, affecting net product margins.",
    quotes: [
      {
        id: 12,
        review: "Material feels cheap compared to the product photos shown on the catalog page.",
        date: "2026-09-11",
        confidence: 0.91,
        rating: 2
      },
      {
        id: 27,
        review: "The zipper broke on the second day of use. Expected far better stitching for this price point.",
        date: "2026-09-04",
        confidence: 0.97,
        rating: 1
      },
      {
        id: 34,
        review: "Product dimensions provided on the specs sheet were off by approximately 2 inches.",
        date: "2026-09-01",
        confidence: 0.90,
        rating: 2
      }
    ]
  },
  {
    id: "issue-ux-checkout",
    category: "User Experience",
    title: "Mobile Checkout Friction & Multi-Step Account Cancellation",
    mentions: 35,
    shareOfNegative: 10.1,
    priority: "Medium",
    urgencyLevel: 62,
    trend: "-0.8% this month",
    explanation: "Mobile Safari customers encounter form freezes when applying coupon codes, and subscription cancellation lacks an automated 1-click self-service path.",
    impactAnalysis: "Direct cart abandonment at the final conversion funnel step and frustration upon subscription lifecycle management.",
    quotes: [
      {
        id: 3,
        review: "The checkout form repeatedly failed on mobile Safari when trying to apply a valid discount code.",
        date: "2026-09-14",
        confidence: 0.95,
        rating: 2
      },
      {
        id: 19,
        review: "The new search filters on the catalog are confusing. Too many nested categories to find basic items.",
        date: "2026-09-08",
        confidence: 0.89,
        rating: 2
      },
      {
        id: 30,
        review: "The mobile app crashes every time I try to upload a photo attachment for product feedback.",
        date: "2026-09-03",
        confidence: 0.96,
        rating: 1
      },
      {
        id: 36,
        review: "Cancellation flow required contacting support rather than a 1-click button in account settings.",
        date: "2026-08-30",
        confidence: 0.94,
        rating: 1
      }
    ]
  },
  {
    id: "issue-pricing-transparency",
    category: "Pricing",
    title: "Unexpected Checkout Surcharges & Pricing Transparency",
    mentions: 13,
    shareOfNegative: 3.7,
    priority: "Low",
    urgencyLevel: 42,
    trend: "+0.3% this month",
    explanation: "Customers expressed annoyance with unannounced subscription renewal price increases and processing fees revealed only at the terminal payment step.",
    impactAnalysis: "Causes friction in customer trust and increases price-sensitivity churn.",
    quotes: [
      {
        id: 7,
        review: "Subscription pricing increased by 25% without prior email notification. Feeling shortchanged.",
        date: "2026-09-13",
        confidence: 0.94,
        rating: 1
      },
      {
        id: 16,
        review: "Hidden processing fees appeared at the final payment step that were not itemized in the cart.",
        date: "2026-09-10",
        confidence: 0.96,
        rating: 1
      }
    ]
  }
];

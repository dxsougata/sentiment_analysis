/**
 * Mock AI Business Improvement Report
 * Structured executive recommendations mapped directly from customer sentiment insights.
 */

export const MOCK_REPORT = {
  id: "rep-2026-09-q3",
  title: "Q3 Customer Experience & Sentiment Remediation Strategy",
  generatedDate: "September 18, 2026",
  batchName: "q3_storefront_reviews_master.csv",
  totalAnalyzed: 1420,
  confidenceScore: 94.2,
  summary: {
    executiveSummary: "Analysis of 1,420 customer feedback entries reveals a generally healthy core brand affinity (58.0% positive sentiment), driven primarily by product satisfaction and responsive individual support heroes. However, customer satisfaction is heavily depressed by friction in logistics (accounting for 50.3% of all negative complaints) and delayed support responses (20.1%). Implementing automated carrier status syncing and 1-click self-service returns will alleviate an estimated 65% of customer friction over the upcoming quarter.",
    sentimentHealthScore: 72, // 0-100 index
    keyFindings: [
      "Core product quality remains our highest competitive advantage (70.5% positive rating in category).",
      "Delivery delay complaints jumped by 6.4% in the last 30 days due to regional carrier handoffs.",
      "Customer support resolution satisfaction drops dramatically when live chat queue exceeds 15 minutes.",
      "Checkout conversion on mobile Safari drops due to promo code validation glitches."
    ]
  },
  actionRoadmap: [
    {
      id: "act-1",
      priority: "High",
      area: "Logistics & Fulfillment",
      owner: "Operations & Carrier Management",
      issue: "Delivery delays and inaccurate tracking estimates",
      evidence: "50.3% of negative feedback (175 mentions) cite deliveries running 4-8 days late, broken SMS tracking links, and unnotified shipment holds.",
      suggestedAction: "Audit 3PL carrier service level agreements (SLAs) and integrate real-time webhooks with courier tracking APIs (e.g. ShipStation/EasyPost) to send proactive delay alerts before customers complain.",
      expectedImpact: "-42% reduction in delivery-related WISMO ('Where Is My Order') tickets within 45 days.",
      implementationHorizon: "Immediate (1-2 weeks)"
    },
    {
      id: "act-2",
      priority: "High",
      area: "Customer Support",
      owner: "Support Operations",
      issue: "Extended support queue times and scripted chat bot loops",
      evidence: "20.1% of negative feedback (70 mentions) report queue times over 40 minutes and repetitive bot answers that fail to resolve billing discrepancies.",
      suggestedAction: "Deploy smart skill-based routing to bypass generic bot scripts for order discrepancies, and introduce an asynchronous email callback option when chat queue exceeds 10 minutes.",
      expectedImpact: "+24 point increase in First Contact Resolution (FCR) and improved support CSAT from 3.2 to 4.5.",
      implementationHorizon: "Short term (2-4 weeks)"
    },
    {
      id: "act-3",
      priority: "Medium",
      area: "Product Experience & Catalog",
      owner: "Product & Merchandising",
      issue: "Material specification variances and early zipper/seam degradation",
      evidence: "15.8% of negative reviews (55 mentions) report dimension differences (+/- 2 inches) and zipper failures within 14 days.",
      suggestedAction: "Conduct batch sampling audit at supplier warehouse and update online sizing guides with 360-degree dimension overlays and material care instructions.",
      expectedImpact: "-18% drop in return requests for apparel/hardware accessories.",
      implementationHorizon: "Medium term (4-6 weeks)"
    },
    {
      id: "act-4",
      priority: "Medium",
      area: "Digital Product & Engineering",
      owner: "E-Commerce Web Engineering",
      issue: "Mobile Safari checkout freezes and multi-step cancellation friction",
      evidence: "10.1% of negative reviews (35 mentions) complain about coupon validation errors and lack of direct self-serve subscription cancellation.",
      suggestedAction: "Patch mobile viewport input validation bugs in checkout bundle and implement standard 1-click self-service cancellation with automated exit survey capture.",
      expectedImpact: "+3.2% bump in mobile checkout conversion rate and full regulatory compliance.",
      implementationHorizon: "Short term (2-3 weeks)"
    },
    {
      id: "act-5",
      priority: "Low",
      area: "Pricing & Billing",
      owner: "Growth & Finance",
      issue: "Unexpected checkout processing surcharges and surprise renewal pricing",
      evidence: "3.7% of negative feedback (13 mentions) express dissatisfaction with unannounced renewal rate increases and surprise checkout fees.",
      suggestedAction: "Itemize all taxes, handling, and fees transparently in cart summary before final payment step, and send 14-day pre-renewal notification emails.",
      expectedImpact: "-15% decrease in billing chargeback disputes.",
      implementationHorizon: "Medium term (3-4 weeks)"
    }
  ],
  priorityMatrix: [
    { matrixQuadrant: "Quick Wins (High Impact, Low Effort)", items: ["Proactive SMS carrier delay alerts", "Itemize checkout fees transparently"] },
    { matrixQuadrant: "Strategic Initiatives (High Impact, High Effort)", items: ["3PL courier SLA renegotiation", "Smart skill-based support routing"] },
    { matrixQuadrant: "Operational Tweaks (Low Impact, Low Effort)", items: ["Catalog sizing guide updates", "1-click cancellation flow"] },
    { matrixQuadrant: "Deferred / Re-evaluate (Low Impact, High Effort)", items: ["Full custom warehousing migration"] }
  ]
};

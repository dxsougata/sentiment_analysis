function todayLabel() {
  return new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

function sampleQuotes(issues) {
  return issues
    .flatMap((issue) => (issue.quotes || []).slice(0, 1).map((q) => q.review))
    .filter(Boolean)
    .slice(0, 3);
}

export function buildImprovementReport({ stats, issues, fileInfo, reviews }) {
  const total = stats?.totalFeedback || 0;
  const pos = stats?.positivePercent ?? 0;
  const neg = stats?.negativePercent ?? 0;
  const neu = stats?.neutralPercent ?? 0;
  const filename = fileInfo?.name || 'current batch';
  const topIssues = (issues || []).slice(0, 5);
  const top = topIssues[0];
  const quotes = sampleQuotes(topIssues);

  const keyFindings = [
    `${pos}% of ${total} analyzed reviews are positive; ${neg}% are negative (${neu}% near-neutral).`,
    top
      ? `${top.category} is the largest friction cluster (${top.shareOfNegative}% of negative mentions).`
      : 'No negative issue clusters were detected in this batch.',
    stats?.avgConfidence
      ? `Average classifier confidence is ${stats.avgConfidence}%.`
      : 'Classifier confidence was not available.',
    quotes[0] ? `Representative complaint: “${quotes[0]}”` : 'Few quoted complaints were available for this run.'
  ];

  const actionRoadmap = topIssues.length
    ? topIssues.map((issue, index) => ({
        id: `act-${issue.id}`,
        priority: issue.priority,
        area: issue.category,
        owner: 'Operations',
        issue: issue.title,
        evidence: `${issue.mentions} negative mentions (${issue.shareOfNegative}% of complaints). ${issue.quotes?.[0]?.review || ''}`,
        suggestedAction: `Investigate ${issue.category.toLowerCase()} workflows against the quoted reviews, then assign an owner and a 2-week follow-up.`,
        expectedImpact: `Reducing this cluster would address about ${issue.shareOfNegative}% of current negative sentiment.`,
        implementationHorizon: index === 0 ? 'Immediate (1-2 weeks)' : 'Short term (2-4 weeks)'
      }))
    : [
        {
          id: 'act-none',
          priority: 'Low',
          area: 'Quality',
          owner: 'Operations',
          issue: 'No concentrated negative clusters',
          evidence: 'This batch did not produce grouped negative issues.',
          suggestedAction: 'Continue monitoring new uploads and compare against the next batch.',
          expectedImpact: 'Maintain current sentiment baseline.',
          implementationHorizon: 'Ongoing'
        }
      ];

  const highImpact = actionRoadmap.filter((a) => a.priority === 'High').map((a) => a.issue);
  const mediumImpact = actionRoadmap.filter((a) => a.priority === 'Medium').map((a) => a.issue);
  const lowImpact = actionRoadmap.filter((a) => a.priority === 'Low').map((a) => a.issue);

  return {
    id: `rep-${Date.now()}`,
    title: `Sentiment improvement report — ${filename}`,
    generatedDate: todayLabel(),
    batchName: filename,
    totalAnalyzed: total,
    confidenceScore: stats?.avgConfidence || 0,
    summary: {
      executiveSummary: `Analysis of ${total} reviews from ${filename} shows ${pos}% positive and ${neg}% negative sentiment. ${
        top
          ? `The primary pain point is ${top.category} (${top.shareOfNegative}% of negative mentions).`
          : 'Negative volume is low or unclustered in this batch.'
      } Recommendations below are derived from this upload, not from demo data.`,
      sentimentHealthScore: Math.max(0, Math.min(100, Math.round(50 + (pos - neg) / 2))),
      keyFindings
    },
    actionRoadmap,
    priorityMatrix: [
      { matrixQuadrant: 'Quick Wins (High Impact, Low Effort)', items: highImpact.slice(0, 2).length ? highImpact.slice(0, 2) : ['Monitor next upload for emerging clusters'] },
      { matrixQuadrant: 'Strategic Initiatives (High Impact, High Effort)', items: highImpact.slice(2).length ? highImpact.slice(2) : mediumImpact.slice(0, 2).length ? mediumImpact.slice(0, 2) : ['No high-effort items identified'] },
      { matrixQuadrant: 'Operational Tweaks (Low Impact, Low Effort)', items: lowImpact.length ? lowImpact : mediumImpact },
      { matrixQuadrant: 'Deferred / Re-evaluate (Low Impact, High Effort)', items: ['Re-run analysis after process changes'] }
    ],
    sourceReviewCount: reviews?.length || 0
  };
}

const CATEGORY_RULES = [
  {
    category: 'Delivery',
    keywords: ['deliver', 'shipping', 'shipped', 'tracking', 'courier', 'package', 'late', 'delay', 'arrived', 'logistics']
  },
  {
    category: 'Customer Support',
    keywords: ['support', 'chat', 'agent', 'help desk', 'customer service', 'waited', 'hold', 'ticket', 'refund']
  },
  {
    category: 'Product Quality',
    keywords: ['quality', 'broke', 'broken', 'defect', 'material', 'durable', 'cheap', 'scratch', 'zipper', 'battery']
  },
  {
    category: 'Pricing',
    keywords: ['price', 'expensive', 'cheap', 'fee', 'charge', 'subscription', 'billing', 'cost', 'overpriced']
  },
  {
    category: 'User Experience',
    keywords: ['app', 'website', 'checkout', 'login', 'ui', 'mobile', 'crash', 'bug', 'slow', 'interface']
  }
];

function round1(value) {
  return Number((Number(value) || 0).toFixed(1));
}

function classifyCategory(text) {
  const hay = (text || '').toLowerCase();
  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some((kw) => hay.includes(kw))) {
      return rule.category;
    }
  }
  return 'General';
}

function classifyPolarity(positiveProb, negativeProb) {
  const pos = Number(positiveProb) || 0;
  const neg = Number(negativeProb) || 0;
  const confidence = Math.max(pos, neg);
  if (confidence < 0.58) {
    return { sentiment: 'neutral', confidence };
  }
  return { sentiment: pos >= neg ? 'positive' : 'negative', confidence };
}

function parseRating(raw, sentiment) {
  const n = Number(raw);
  if (Number.isFinite(n) && n >= 1 && n <= 5) {
    return n;
  }
  if (sentiment === 'positive') return 5;
  if (sentiment === 'neutral') return 3;
  return 1;
}

function normalizeDate(raw, fallback) {
  if (raw && String(raw).trim() && String(raw) !== 'nan' && String(raw) !== 'NaT') {
    const d = new Date(raw);
    if (!Number.isNaN(d.getTime())) {
      return d.toISOString().split('T')[0];
    }
    return String(raw).slice(0, 10);
  }
  return fallback;
}

export function deriveCategories(reviews) {
  const buckets = new Map();
  reviews.forEach((review) => {
    const key = review.category || 'General';
    if (!buckets.has(key)) {
      buckets.set(key, { category: key, positive: 0, neutral: 0, negative: 0 });
    }
    const row = buckets.get(key);
    if (review.sentiment === 'positive') row.positive += 1;
    else if (review.sentiment === 'neutral') row.neutral += 1;
    else row.negative += 1;
  });
  return Array.from(buckets.values()).sort(
    (a, b) => b.positive + b.neutral + b.negative - (a.positive + a.neutral + a.negative)
  );
}

export function deriveTrend(reviews) {
  const buckets = new Map();
  reviews.forEach((review) => {
    const key = review.date || 'This batch';
    if (!buckets.has(key)) {
      buckets.set(key, { date: key, positive: 0, negative: 0, neutral: 0 });
    }
    const row = buckets.get(key);
    if (review.sentiment === 'positive') row.positive += 1;
    else if (review.sentiment === 'negative') row.negative += 1;
    else row.neutral += 1;
  });
  return Array.from(buckets.values()).sort((a, b) => String(a.date).localeCompare(String(b.date)));
}

export function deriveIssues(reviews) {
  const negatives = reviews.filter((r) => r.sentiment === 'negative');
  const totalNeg = negatives.length || 1;
  const byCategory = new Map();

  negatives.forEach((review) => {
    const key = review.category || 'General';
    if (!byCategory.has(key)) {
      byCategory.set(key, []);
    }
    byCategory.get(key).push(review);
  });

  const issues = Array.from(byCategory.entries())
    .map(([category, items], index) => {
      const share = round1((items.length / totalNeg) * 100);
      const priority = share >= 35 ? 'High' : share >= 15 ? 'Medium' : 'Low';
      const quotes = items.slice(0, 8).map((item, qIdx) => ({
        id: `${item.id}-q${qIdx}`,
        review: item.review,
        date: item.date,
        confidence: item.confidence,
        rating: item.rating
      }));

      return {
        id: `issue-${index + 1}`,
        title: `${category} complaints`,
        category,
        priority,
        trend: `${items.length} mention${items.length === 1 ? '' : 's'} in this batch`,
        mentions: items.length,
        shareOfNegative: share,
        urgencyLevel: Math.min(100, Math.round(share + items.length)),
        explanation: `${items.length} negative review${items.length === 1 ? '' : 's'} in this upload were classified under ${category}.`,
        impactAnalysis: share >= 35
          ? `This is the largest source of negative sentiment (${share}% of complaints).`
          : `This cluster accounts for ${share}% of negative sentiment in the current batch.`,
        quotes
      };
    })
    .sort((a, b) => b.mentions - a.mentions);

  return issues;
}

export function mapUploadResponse(data, file) {
  if (!data || !Array.isArray(data.products)) {
    throw new Error('The server did not return product analysis results.');
  }

  const analyzedAt = new Date().toISOString();
  const fallbackDate = analyzedAt.split('T')[0];
  const allReviews = [];

  data.products.forEach((product, pIdx) => {
    (product.reviews || []).forEach((rev, rIdx) => {
      const { sentiment, confidence } = classifyPolarity(
        rev.positive_probability,
        rev.negative_probability
      );
      const text = rev.review_text || '';
      allReviews.push({
        id: `${product.product_id || pIdx}-${rIdx}`,
        productId: product.product_id,
        review: text,
        sentiment,
        confidence,
        category: classifyCategory(text),
        date: normalizeDate(rev.date, fallbackDate),
        rating: parseRating(rev.rating, sentiment)
      });
    });
  });

  const total = allReviews.length;
  const positiveCount = allReviews.filter((r) => r.sentiment === 'positive').length;
  const negativeCount = allReviews.filter((r) => r.sentiment === 'negative').length;
  const neutralCount = allReviews.filter((r) => r.sentiment === 'neutral').length;
  const denom = total || 1;
  const positivePercent = round1((positiveCount / denom) * 100);
  const negativePercent = round1((negativeCount / denom) * 100);
  const neutralPercent = round1((neutralCount / denom) * 100);
  const avgConfidence = round1(
    (allReviews.reduce((sum, r) => sum + r.confidence, 0) / denom) * 100
  );

  const issues = deriveIssues(allReviews);

  return {
    success: true,
    fileInfo: {
      name: file?.name || 'upload.csv',
      size: file?.size || 0,
      analyzedAt
    },
    stats: {
      totalFeedback: total,
      positiveCount,
      positivePercent,
      neutralCount,
      neutralPercent,
      negativeCount,
      negativePercent,
      netSentimentScore: round1(positivePercent - negativePercent),
      avgConfidence
    },
    reviews: allReviews,
    categories: deriveCategories(allReviews),
    trend: deriveTrend(allReviews),
    issues
  };
}

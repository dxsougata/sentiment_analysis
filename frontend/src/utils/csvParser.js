/**
 * Lightweight CSV parsing helper for client-side feedback preview
 */

export function parseCSV(text) {
  if (!text || typeof text !== 'string') {
    return { headers: [], rows: [], totalRows: 0 };
  }

  const lines = text.trim().split(/\r\n|\n/);
  if (lines.length === 0) {
    return { headers: [], rows: [], totalRows: 0 };
  }

  // Parse a single CSV line taking quotes into account
  const parseLine = (line) => {
    const values = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"' || char === "'") {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim().replace(/^["']|["']$/g, ''));
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim().replace(/^["']|["']$/g, ''));
    return values;
  };

  const headers = parseLine(lines[0]).map((h) => h.toLowerCase().replace(/[^a-z0-9_]/g, '_'));
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i].trim();
    if (!rawLine) continue;
    const values = parseLine(rawLine);
    const rowObj = {};
    headers.forEach((header, index) => {
      rowObj[header] = values[index] || '';
    });
    rows.push(rowObj);
  }

  return {
    headers,
    rows,
    totalRows: rows.length
  };
}

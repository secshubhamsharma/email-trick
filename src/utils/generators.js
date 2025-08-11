export function generateDotVariants(localPart, domain, limit = 500) {
  const n = localPart.length;

  if (n < 2 || localPart.includes('.')) {
    return [`${localPart}@${domain}`];
  }

  const maxComb = 1 << (n - 1);
  const results = [];

  for (let mask = 0; mask < maxComb && results.length < limit; mask++) {
    let s = '';
    for (let i = 0; i < n; i++) {
      s += localPart[i];

      if (i < n - 1) {
        if (mask & (1 << i)) {
          s += '.';
        }
      }
    }
    results.push(`${s}@${domain}`);
  }
  return results;
}

export function generatePlusVariants(localPart, domain, { limit = 50 } = {}) {
  const results = new Set();

  for (let i = 1; i <= limit; i++) {
    results.add(`${localPart}+${i}@${domain}`);
  }

  return Array.from(results);
}

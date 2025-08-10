export function generateDotVariants(localPart, domain, limit = 500) {
    const n = localPart.length;
    if (n < 2) return [`${localPart}@${domain}`];
    const maxComb = 1 << (n - 1);
    const results = [];
    for (let mask = 0; mask < maxComb && results.length < limit; mask++) {
      let s = '';
      for (let i = 0; i < n; i++) {
        s += localPart[i];
        if (i < n - 1) {
          if (mask & (1 << i)) s += '.';
        }
      }
      results.push(`${s}@${domain}`);
    }
    return results;
}

export function generatePlusVariants(localPart, domain, { start = 1, end = 50, customTags = [] } = {}) {
    const results = [];
    for (let i = start; i <= end; i++) {
      results.push(`${localPart}+${i}@${domain}`);
    }
    for (const tag of customTags) {
      results.push(`${localPart}+${tag}@${domain}`);
    }
    return results;
}
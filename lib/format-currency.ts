/**
 * Formats a number into a compact currency string using the Indian number system.
 *
 * Examples (symbol = "Rs. "):
 *   500        → "Rs. 500"
 *   1_500      → "Rs. 1.5k"
 *   1_00_000   → "Rs. 1L"
 *   25_50_000  → "Rs. 25.5L"
 *   1_00_00_000 → "Rs. 1Cr"
 */
export function formatAmount(amount: number, symbol = "Rs. "): string {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? "-" : "";

  if (abs >= 1_00_00_000) {
    const val = abs / 1_00_00_000;
    return `${sign}${symbol}${trimDecimal(val)}Cr`;
  }
  if (abs >= 1_00_000) {
    const val = abs / 1_00_000;
    return `${sign}${symbol}${trimDecimal(val)}L`;
  }
  if (abs >= 1_000) {
    const val = abs / 1_000;
    return `${sign}${symbol}${trimDecimal(val)}k`;
  }
  return `${sign}${symbol}${abs % 1 === 0 ? abs : abs.toFixed(2)}`;
}

/** Drops the decimal when it is .0 (e.g. 2.0 → "2", 2.5 → "2.5") */
function trimDecimal(val: number): string {
  const fixed = val.toFixed(1);
  return fixed.endsWith(".0") ? fixed.slice(0, -2) : fixed;
}

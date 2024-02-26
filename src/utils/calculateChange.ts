export function calculateChange({lastRank, currentRank}: {lastRank: undefined | number, currentRank: number}) {
  // If there is no last rank, it's new on the charts.
  if (!lastRank) return null;
  // Calculate Change. today it's 5, last time it was 10
  const change = lastRank - currentRank;
  return change;
}

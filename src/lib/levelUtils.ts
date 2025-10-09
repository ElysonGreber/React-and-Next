export const LEVEL_THRESHOLDS = [5, 10, 15, 25, 35, 50, 70, 90, 110, 130]

export function calculateLevel(historyLength: number): number {
  return LEVEL_THRESHOLDS.filter(threshold => historyLength >= threshold).length
}
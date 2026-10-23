const FAST_WINDOW_MS = 2500;
const MENU_WINDOW_MS = 1800;
const TAP_HISTORY_MS = 12000;

export type SosActivationState = 'inactive' | 'active';
export type SecretGestureResult = 'none' | 'sos' | 'menu';

export function trimOldTaps(timestamps: readonly number[], nowMs: number): number[] {
  const cutoff = nowMs - TAP_HISTORY_MS;
  return timestamps.filter((t) => t >= cutoff);
}

export function canTriggerSos(contactsLength: number): boolean {
  return contactsLength > 0;
}

export function evaluateSosModeFromTaps(
  timestamps: readonly number[],
  nowMs: number
): SosActivationState {
  const trimmed = trimOldTaps(timestamps, nowMs);
  if (trimmed.length < 5) {
    return 'inactive';
  }
  const lastFive = trimmed.slice(-5);
  const spanMs = lastFive[4] - lastFive[0];
  if (spanMs <= FAST_WINDOW_MS) {
    return 'active';
  }
  return 'inactive';
}

export function evaluateSecretMenuFromTaps(
  timestamps: readonly number[],
  nowMs: number
): boolean {
  const trimmed = trimOldTaps(timestamps, nowMs);
  if (trimmed.length < 3) {
    return false;
  }
  const lastThree = trimmed.slice(-3);
  return lastThree[2] - lastThree[0] <= MENU_WINDOW_MS;
}

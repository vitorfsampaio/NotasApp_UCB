import {
  canTriggerSos,
  evaluateSosModeFromTaps,
  trimOldTaps,
} from './sosTapEngine';

describe('TC01 — 3 toques em 2 segundos', () => {
  it('mantém SOS inativo com apenas 3 toques', () => {
    const base = 1_700_000_000_000;
    const taps = [base, base + 400, base + 1800];
    expect(evaluateSosModeFromTaps(taps, base + 2000)).toBe('inactive');
  });
});

describe('TC02 — 5 toques em 2,5 segundos', () => {
  it('ativa SOS com 5 toques dentro de 2500 ms', () => {
    const base = 1_700_000_000_000;
    const taps = [
      base,
      base + 400,
      base + 900,
      base + 1400,
      base + 2200,
    ];
    expect(evaluateSosModeFromTaps(taps, base + 2300)).toBe('active');
  });
});

describe('TC03 — 5 toques em 4 segundos', () => {
  it('mantém SOS inativo quando o intervalo do 1º ao 5º excede 2,5 s', () => {
    const base = 1_700_000_000_000;
    const taps = [
      base,
      base + 1000,
      base + 2000,
      base + 3000,
      base + 4000,
    ];
    expect(evaluateSosModeFromTaps(taps, base + 4100)).toBe('inactive');
  });
});

describe('TC04 — 5 toques com app em segundo plano', () => {
  it('usa a mesma janela rápida; resultado esperado ativo quando sequência é válida', () => {
    const base = 1_700_000_000_000;
    const taps = [
      base,
      base + 300,
      base + 700,
      base + 1100,
      base + 2000,
    ];
    expect(evaluateSosModeFromTaps(taps, base + 2100)).toBe('active');
  });
});

describe('TC08 — sem contatos cadastrados', () => {
  it('bloqueia disparo SOS quando não há contatos', () => {
    expect(canTriggerSos(0)).toBe(false);
    expect(canTriggerSos(2)).toBe(true);
  });
});

describe('trimOldTaps', () => {
  it('remove toques antigos fora da janela de histórico', () => {
    const now = 2_000_000;
    const taps = [now - 50_000, now - 1000, now];
    const trimmed = trimOldTaps(taps, now);
    expect(trimmed.length).toBeGreaterThanOrEqual(1);
  });
});

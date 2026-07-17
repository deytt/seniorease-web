/**
 * SeniorFeedback — equivalente web do SeniorFeedback Flutter.
 *
 * No mobile usa-se HapticFeedback (tátil) + AudioPlayer (success.mp3).
 * No web usamos:
 *   - Web Audio API para sintetizar tons simples (sem ficheiro de áudio externo)
 *   - navigator.vibrate (disponível em Android Chrome) para haptic
 *
 * Intensidades espelham o mobile:
 *   light     → tap genérico / navegação
 *   selection → chips, filtros, toggles, passo anterior
 *   medium    → ações destrutivas / guardar settings
 *   success   → conclusão / celebração (sequência ascendente C5→E5→G5)
 */

type FeedbackLevel = "light" | "selection" | "medium" | "success";

interface ToneConfig {
  frequencies: number[];
  duration: number; // ms por tom
  gain: number; // 0–1
  type: OscillatorType;
  gap?: number; // ms de silêncio entre tons (success)
  vibration?: number | number[]; // padrão para navigator.vibrate
}

const CONFIGS: Record<FeedbackLevel, ToneConfig> = {
  light: {
    frequencies: [880],
    duration: 50,
    gain: 0.08,
    type: "sine",
    vibration: 20,
  },
  selection: {
    frequencies: [660],
    duration: 35,
    gain: 0.06,
    type: "sine",
    vibration: 10,
  },
  medium: {
    frequencies: [440],
    duration: 90,
    gain: 0.1,
    type: "triangle",
    vibration: 40,
  },
  // Acorde ascendente: Dó5 → Mi5 → Sol5 (C major arpeggio)
  success: {
    frequencies: [523, 659, 784],
    duration: 110,
    gap: 30,
    gain: 0.12,
    type: "sine",
    vibration: [30, 20, 50],
  },
};

let _audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!_audioCtx || _audioCtx.state === "closed") {
    try {
      _audioCtx = new AudioContext();
    } catch {
      return null;
    }
  }
  return _audioCtx;
}

function playTone(
  ctx: AudioContext,
  frequency: number,
  startAt: number,
  durationMs: number,
  gain: number,
  type: OscillatorType,
): void {
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ctx.currentTime + startAt / 1000);

  gainNode.gain.setValueAtTime(0, ctx.currentTime + startAt / 1000);
  gainNode.gain.linearRampToValueAtTime(
    gain,
    ctx.currentTime + (startAt + 5) / 1000,
  );
  gainNode.gain.linearRampToValueAtTime(
    0,
    ctx.currentTime + (startAt + durationMs) / 1000,
  );

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.start(ctx.currentTime + startAt / 1000);
  osc.stop(ctx.currentTime + (startAt + durationMs + 10) / 1000);
}

async function triggerFeedback(level: FeedbackLevel): Promise<void> {
  const cfg = CONFIGS[level];

  // Vibração tátil (Android Chrome / alguns mobile browsers)
  if (
    typeof navigator !== "undefined" &&
    typeof navigator.vibrate === "function"
  ) {
    try {
      navigator.vibrate(cfg.vibration ?? 20);
    } catch {
      // Silencioso — vibração não é crítica
    }
  }

  // Áudio via Web Audio API
  const ctx = getAudioContext();
  if (!ctx) return;

  // Resume necessário após interaction policy do browser
  if (ctx.state === "suspended") {
    try {
      await ctx.resume();
    } catch {
      return;
    }
  }

  const gap = cfg.gap ?? 0;
  cfg.frequencies.forEach((freq, i) => {
    const startAt = i * (cfg.duration + gap);
    playTone(ctx, freq, startAt, cfg.duration, cfg.gain, cfg.type);
  });
}

/**
 * API pública — espelha SeniorFeedback do Flutter.
 * Só executa se `enabled === true`.
 */
export const SeniorFeedback = {
  light: (enabled: boolean) => enabled && triggerFeedback("light"),
  selection: (enabled: boolean) => enabled && triggerFeedback("selection"),
  medium: (enabled: boolean) => enabled && triggerFeedback("medium"),
  success: (enabled: boolean) => enabled && triggerFeedback("success"),
};

// Web Speech API + Audio metering wrapper for the /studio/voice demo.
// No external deps. Continuous + interim transcripts; exposes a 0-1 audio level
// derived from a live AnalyserNode for the waveform visualizer.

// ----- Types ---------------------------------------------------------------
// TS doesn't ship Web Speech types in lib.dom for all targets, so we declare
// the minimum surface we touch.

export type SpeechSupport = {
  supported: boolean;
  reason?: string;
};

export type VoiceCallbacks = {
  /** Called on every result event with the latest interim text (already concatenated). */
  onTranscript?: (interimText: string, finalText: string) => void;
  /** Called when a final transcript chunk fires (one utterance's final text). */
  onFinal?: (finalChunk: string, fullFinalText: string) => void;
  /** Recognition error. */
  onError?: (err: string) => void;
  /** Recognition ended (either user stopped or browser auto-stopped). */
  onEnd?: () => void;
};

type SRResultAlternative = { transcript: string; confidence: number };
type SRResult = { 0: SRResultAlternative; isFinal: boolean; length: number };
type SRResultList = { length: number; item(i: number): SRResult; [i: number]: SRResult };
type SREvent = { resultIndex: number; results: SRResultList };
type SRErrorEvent = { error: string; message?: string };

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((e: SREvent) => void) | null;
  onerror: ((e: SRErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

type SRConstructor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SRConstructor;
    webkitSpeechRecognition?: SRConstructor;
  }
}

// ----- Support detection ---------------------------------------------------

export function detectSpeechSupport(): SpeechSupport {
  if (typeof window === "undefined") return { supported: false, reason: "ssr" };
  const ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!ctor) {
    return {
      supported: false,
      reason: "Web Speech API not available in this browser.",
    };
  }
  return { supported: true };
}

// ----- Voice controller ----------------------------------------------------

export class VoiceController {
  private recognition: SpeechRecognitionLike | null = null;
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private rafId: number | null = null;
  private currentLevel = 0;
  private finalText = "";
  private callbacks: VoiceCallbacks = {};
  private listening = false;

  isSupported(): boolean {
    return detectSpeechSupport().supported;
  }

  isListening(): boolean {
    return this.listening;
  }

  /** Latest 0-1 audio level (smoothed). */
  getLevel(): number {
    return this.currentLevel;
  }

  /** Cumulative final transcript since last reset. */
  getFinalText(): string {
    return this.finalText;
  }

  reset(): void {
    this.finalText = "";
  }

  async start(callbacks: VoiceCallbacks = {}): Promise<void> {
    if (this.listening) return;
    this.callbacks = callbacks;
    const ctor =
      typeof window !== "undefined"
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : undefined;
    if (!ctor) {
      callbacks.onError?.("Speech recognition not supported.");
      return;
    }

    // Audio level metering (best-effort; speech recognition still works without it).
    try {
      await this.initAudioMeter();
    } catch (err) {
      // Don't block recognition on meter failure (e.g. permission denied for getUserMedia).
      console.warn("Audio metering unavailable:", err);
    }

    const rec = new ctor();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";

    rec.onresult = (event: SREvent) => {
      let interim = "";
      let newlyFinal = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0]?.transcript ?? "";
        if (result.isFinal) {
          newlyFinal += transcript;
        } else {
          interim += transcript;
        }
      }
      if (newlyFinal) {
        this.finalText = (this.finalText + " " + newlyFinal).trim();
        callbacks.onFinal?.(newlyFinal.trim(), this.finalText);
      }
      callbacks.onTranscript?.(interim.trim(), this.finalText);
    };

    rec.onerror = (e: SRErrorEvent) => {
      callbacks.onError?.(e.error || "speech-error");
    };

    rec.onend = () => {
      this.listening = false;
      this.teardownAudioMeter();
      callbacks.onEnd?.();
    };

    this.recognition = rec;
    try {
      rec.start();
      this.listening = true;
    } catch (err) {
      callbacks.onError?.(err instanceof Error ? err.message : "start-failed");
    }
  }

  stop(): void {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // ignore
      }
    }
    this.listening = false;
    this.teardownAudioMeter();
  }

  // ----- Audio meter -------------------------------------------------------

  private async initAudioMeter(): Promise<void> {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) return;
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.mediaStream = stream;
    const AudioCtor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtor) return;
    const ctx = new AudioCtor();
    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.6;
    source.connect(analyser);
    this.audioCtx = ctx;
    this.analyser = analyser;
    this.tickLevel();
  }

  private tickLevel = (): void => {
    if (!this.analyser) return;
    const buf = new Uint8Array(this.analyser.fftSize);
    this.analyser.getByteTimeDomainData(buf);
    // RMS around 128 (silence).
    let sum = 0;
    for (let i = 0; i < buf.length; i++) {
      const v = (buf[i] - 128) / 128;
      sum += v * v;
    }
    const rms = Math.sqrt(sum / buf.length);
    // Boost & clamp for visual punch.
    const boosted = Math.min(1, rms * 3.2);
    // Simple smoothing.
    this.currentLevel = this.currentLevel * 0.6 + boosted * 0.4;
    this.rafId = requestAnimationFrame(this.tickLevel);
  };

  private teardownAudioMeter(): void {
    if (this.rafId != null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((t) => t.stop());
      this.mediaStream = null;
    }
    if (this.audioCtx) {
      this.audioCtx.close().catch(() => {});
      this.audioCtx = null;
    }
    this.analyser = null;
    this.currentLevel = 0;
  }
}

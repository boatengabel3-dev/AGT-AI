import React, { useEffect, useRef, useState } from 'react';
import { Mic, Activity, Radio, Volume2, Sparkles } from 'lucide-react';

interface VoiceWaveformProps {
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  onVolumeChange?: (vol: number) => void;
  className?: string;
  variant?: 'compact' | 'full' | 'hero';
}

export const VoiceWaveform: React.FC<VoiceWaveformProps> = ({
  isListening,
  isProcessing,
  isSpeaking,
  onVolumeChange,
  className = '',
  variant = 'full',
}) => {
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [frequencyData, setFrequencyData] = useState<number[]>(new Array(24).fill(10));
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const syntheticTimerRef = useRef<number | null>(null);

  // Initialize and tear down Web Audio API stream when listening
  useEffect(() => {
    let isCancelled = false;

    if (isListening) {
      const initAudio = async () => {
        try {
          // Attempt real microphone stream for true live audio waveform
          if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            const stream = await navigator.mediaDevices.getUserMedia({
              audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
              },
            });

            if (isCancelled) {
              stream.getTracks().forEach((track) => track.stop());
              return;
            }

            mediaStreamRef.current = stream;

            const AudioContextClass =
              window.AudioContext || (window as any).webkitAudioContext;
            const ctx = new AudioContextClass();
            audioContextRef.current = ctx;

            const analyser = ctx.createAnalyser();
            analyser.fftSize = 64; // Gives 32 frequency bins
            analyser.smoothingTimeConstant = 0.8;
            analyserRef.current = analyser;

            const source = ctx.createMediaStreamSource(stream);
            source.connect(analyser);

            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const renderFrame = () => {
              if (!analyserRef.current) return;
              analyserRef.current.getByteFrequencyData(dataArray);

              // Calculate overall volume level
              let sum = 0;
              const barCount = 24;
              const step = Math.floor(bufferLength / barCount) || 1;
              const bars: number[] = [];

              for (let i = 0; i < barCount; i++) {
                const idx = Math.min(i * step, bufferLength - 1);
                const val = dataArray[idx];
                sum += val;
                // Map to 15% - 100% height
                const normalized = Math.max(12, Math.min(100, (val / 255) * 100));
                bars.push(normalized);
              }

              const avg = sum / (bufferLength || 1);
              const normalizedVol = Math.min(100, Math.round((avg / 255) * 100));

              setAudioLevel(normalizedVol);
              setFrequencyData(bars);
              if (onVolumeChange) onVolumeChange(normalizedVol);

              animationFrameRef.current = requestAnimationFrame(renderFrame);
            };

            renderFrame();
          } else {
            fallbackSyntheticAnimation();
          }
        } catch (err) {
          console.warn('Microphone stream access unavailable for waveform; using dynamic simulation:', err);
          fallbackSyntheticAnimation();
        }
      };

      initAudio();
    } else {
      cleanupAudio();
      if (isProcessing) {
        runProcessingAnimation();
      } else if (isSpeaking) {
        runSpeakingAnimation();
      } else {
        // Idle state: calm baseline
        setFrequencyData(new Array(24).fill(12));
        setAudioLevel(0);
        if (onVolumeChange) onVolumeChange(0);
      }
    }

    return () => {
      isCancelled = true;
      cleanupAudio();
    };
  }, [isListening, isProcessing, isSpeaking]);

  const cleanupAudio = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (syntheticTimerRef.current) {
      clearInterval(syntheticTimerRef.current);
      syntheticTimerRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch {}
      audioContextRef.current = null;
    }
  };

  // Synthetic animated pulse for fallback or speech playback
  const fallbackSyntheticAnimation = () => {
    let t = 0;
    syntheticTimerRef.current = window.setInterval(() => {
      t += 0.2;
      const bars = Array.from({ length: 24 }, (_, i) => {
        const wave1 = Math.sin(t + i * 0.4);
        const wave2 = Math.cos(t * 1.5 - i * 0.2);
        const height = Math.max(18, Math.min(95, Math.abs(wave1 * 40 + wave2 * 30 + 35)));
        return height;
      });
      const avg = Math.round(bars.reduce((a, b) => a + b, 0) / bars.length);
      setAudioLevel(avg);
      setFrequencyData(bars);
      if (onVolumeChange) onVolumeChange(avg);
    }, 50);
  };

  const runSpeakingAnimation = () => {
    let t = 0;
    syntheticTimerRef.current = window.setInterval(() => {
      t += 0.18;
      const bars = Array.from({ length: 24 }, (_, i) => {
        const centerDist = Math.abs(i - 12) / 12;
        const bell = 1 - centerDist * 0.6;
        const wave = Math.sin(t * 2 + i * 0.5) * Math.cos(t - i * 0.2);
        return Math.max(15, Math.min(90, Math.abs(wave * 55 * bell) + 20));
      });
      setFrequencyData(bars);
      setAudioLevel(45);
    }, 60);
  };

  const runProcessingAnimation = () => {
    let phase = 0;
    syntheticTimerRef.current = window.setInterval(() => {
      phase = (phase + 1) % 24;
      const bars = Array.from({ length: 24 }, (_, i) => {
        const dist = Math.abs(i - phase);
        const spark = dist === 0 ? 85 : dist === 1 ? 55 : dist === 2 ? 30 : 15;
        return spark;
      });
      setFrequencyData(bars);
      setAudioLevel(30);
    }, 45);
  };

  // Status text and styles
  const getStatusDetails = () => {
    if (isListening) {
      return {
        badge: 'LIVE MIC ACTIVE',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        dotColor: 'bg-emerald-400',
        message: 'Microphone is active — listening to your speech...',
        glowColor: 'shadow-emerald-500/30',
        ringColor: 'border-emerald-500/50',
      };
    }
    if (isProcessing) {
      return {
        badge: 'PROCESSING SPEECH',
        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        dotColor: 'bg-amber-400',
        message: 'Extracting farm details from your voice answer...',
        glowColor: 'shadow-amber-500/30',
        ringColor: 'border-amber-500/50',
      };
    }
    if (isSpeaking) {
      return {
        badge: 'ASSISTANT SPEAKING',
        badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
        dotColor: 'bg-teal-400',
        message: 'AgriTrust conversational assistant is speaking...',
        glowColor: 'shadow-teal-500/30',
        ringColor: 'border-teal-500/50',
      };
    }
    return {
      badge: 'STANDBY',
      badgeColor: 'bg-white/5 text-slate-400 border-white/10',
      dotColor: 'bg-slate-500',
      message: 'Tap the microphone to speak your response',
      glowColor: '',
      ringColor: 'border-white/10',
    };
  };

  const status = getStatusDetails();

  // Dynamic pulse scale based on audio volume
  const pulseScale = isListening
    ? 1 + (audioLevel / 100) * 0.35
    : isProcessing
    ? 1.08
    : 1;

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#07130F] border border-[#1A382B] ${className}`}>
        {/* Pulsing indicator orb */}
        <div className="relative flex items-center justify-center">
          {isListening && (
            <span
              className="absolute -inset-1 rounded-full bg-emerald-500/30 animate-ping opacity-75"
              style={{ transform: `scale(${pulseScale})` }}
            />
          )}
          <div
            className={`w-3 h-3 rounded-full ${status.dotColor} transition-transform duration-100 shadow-sm`}
            style={{ transform: `scale(${isListening ? pulseScale : 1})` }}
          />
        </div>

        {/* Compact Waveform Bars */}
        <div className="flex items-center gap-0.5 h-5 px-1">
          {frequencyData.slice(0, 16).map((val, idx) => (
            <div
              key={idx}
              className={`w-1 rounded-full transition-all duration-75 ${
                isListening
                  ? val > 60
                    ? 'bg-[#D4AF37]'
                    : 'bg-emerald-400'
                  : isProcessing
                  ? 'bg-amber-400'
                  : isSpeaking
                  ? 'bg-teal-400'
                  : 'bg-white/20'
              }`}
              style={{
                height: `${isListening || isSpeaking || isProcessing ? val : 20}%`,
              }}
            />
          ))}
        </div>

        <span className="text-[11px] font-medium text-slate-300 truncate max-w-[150px]">
          {isListening ? 'Listening...' : isProcessing ? 'Processing...' : 'Ready'}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#0A1A14] to-[#050D0A] border transition-all duration-300 ${
        isListening
          ? 'border-emerald-500/60 shadow-lg shadow-emerald-950/50'
          : isProcessing
          ? 'border-amber-500/60 shadow-lg shadow-amber-950/50'
          : isSpeaking
          ? 'border-teal-500/50'
          : 'border-[#1A382B]'
      } p-4 ${className}`}
    >
      {/* Background radial glow */}
      {isListening && (
        <div
          className="absolute -top-12 left-1/2 -translate-x-1/2 w-64 h-32 bg-emerald-500/15 blur-3xl pointer-events-none rounded-full"
          style={{ transform: `translate(-50%, 0) scale(${1 + (audioLevel / 100) * 0.8})` }}
        />
      )}

      {isProcessing && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-64 h-32 bg-amber-500/15 blur-3xl pointer-events-none rounded-full animate-pulse" />
      )}

      {/* Header bar with badges */}
      <div className="relative z-10 flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          {/* Central Pulsing Radar Rings */}
          <div className="relative flex items-center justify-center w-7 h-7">
            {isListening && (
              <>
                <span
                  className="absolute inset-0 rounded-full border-2 border-emerald-400/60 animate-ping opacity-60"
                  style={{ transform: `scale(${1.2 + (audioLevel / 100) * 0.5})` }}
                />
                <span
                  className="absolute -inset-1 rounded-full border border-emerald-500/30 animate-pulse"
                  style={{ transform: `scale(${1.1 + (audioLevel / 100) * 0.25})` }}
                />
              </>
            )}
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-150 ${
                isListening
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/50'
                  : isProcessing
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/50'
                  : isSpeaking
                  ? 'bg-teal-500 text-slate-950'
                  : 'bg-white/10 text-slate-400'
              }`}
              style={{ transform: `scale(${pulseScale})` }}
            >
              {isListening ? (
                <Mic className="h-3.5 w-3.5 animate-pulse" />
              ) : isProcessing ? (
                <Sparkles className="h-3.5 w-3.5 animate-spin" />
              ) : isSpeaking ? (
                <Volume2 className="h-3.5 w-3.5" />
              ) : (
                <Radio className="h-3.5 w-3.5" />
              )}
            </div>
          </div>

          <span
            className={`text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded border ${status.badgeColor}`}
          >
            {status.badge}
          </span>
        </div>

        {/* Real-time decibel / volume indicator meter */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-white/50 font-mono">
            {isListening
              ? `${Math.max(15, audioLevel)}% VOL`
              : isProcessing
              ? 'AI EXTRACT'
              : 'IDLE'}
          </span>
          <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className={`h-full transition-all duration-100 ${
                isListening
                  ? audioLevel > 70
                    ? 'bg-[#D4AF37]'
                    : 'bg-emerald-400'
                  : isProcessing
                  ? 'bg-amber-400 animate-pulse'
                  : isSpeaking
                  ? 'bg-teal-400'
                  : 'bg-white/20'
              }`}
              style={{
                width: `${
                  isListening
                    ? Math.max(10, audioLevel)
                    : isProcessing
                    ? 80
                    : isSpeaking
                    ? 50
                    : 0
                }%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Real-time Dynamic Waveform Equalizer */}
      <div className="relative z-10 flex items-center justify-center gap-1 sm:gap-1.5 h-16 px-2 my-1 bg-black/30 rounded-xl border border-white/5">
        {frequencyData.map((val, idx) => {
          // Centered curve amplification for high-aesthetic waveform
          const centerDist = Math.abs(idx - 12) / 12;
          const curveWeight = 1 - centerDist * 0.35;
          const heightPercent = isListening
            ? Math.max(10, Math.min(95, val * curveWeight))
            : isSpeaking
            ? Math.max(10, Math.min(85, val * curveWeight))
            : isProcessing
            ? Math.max(12, Math.min(90, val))
            : 12;

          const isPeak = heightPercent > 70;
          const isMid = heightPercent > 40;

          return (
            <div
              key={idx}
              className="flex-1 max-w-[8px] h-full flex items-center justify-center"
            >
              <div
                className={`w-full rounded-full transition-all duration-75 ${
                  isListening
                    ? isPeak
                      ? 'bg-gradient-to-t from-emerald-500 via-[#D4AF37] to-amber-300 shadow-xs shadow-amber-400/50'
                      : isMid
                      ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-xs shadow-emerald-400/30'
                      : 'bg-emerald-500/50'
                    : isProcessing
                    ? 'bg-gradient-to-t from-amber-600 via-amber-400 to-yellow-200'
                    : isSpeaking
                    ? 'bg-gradient-to-t from-teal-600 to-emerald-400'
                    : 'bg-white/15'
                }`}
                style={{
                  height: `${heightPercent}%`,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Informative subtext */}
      <div className="relative z-10 flex items-center justify-between text-xs pt-1 px-1">
        <div className="flex items-center gap-1.5 text-slate-300 text-[11px]">
          <Activity
            className={`h-3 w-3 ${
              isListening
                ? 'text-emerald-400 animate-pulse'
                : isProcessing
                ? 'text-amber-400 animate-spin'
                : 'text-white/40'
            }`}
          />
          <span className="font-medium">{status.message}</span>
        </div>

        {isListening && (
          <span className="text-[10px] text-emerald-400/80 font-mono animate-pulse">
            ● REC
          </span>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Sparkles,
  MapPin,
  Sprout,
  User,
  Ruler,
  AlertCircle,
  FileText,
  Send,
  X,
  Check,
} from 'lucide-react';
import { VoiceWaveform } from './VoiceWaveform';

export interface VoiceRegistrationData {
  fullName: string;
  region: string;
  district: string;
  community: string;
  cropTypes: string[];
  farmSizeAcres: number;
  consentGiven: boolean;
  timestamp: string;
}

export type ConversationStep =
  | 'consent'
  | 'ask_name'
  | 'ask_location'
  | 'ask_crops'
  | 'ask_size'
  | 'review_confirm'
  | 'completed';

export interface ChatMessage {
  id: string;
  sender: 'assistant' | 'user' | 'system';
  text: string;
  timestamp: string;
}

interface VoiceRegistrationAgentProps {
  onComplete?: (data: VoiceRegistrationData) => void;
  onCancel?: () => void;
  className?: string;
}

const STORAGE_KEY = 'agritrust_voice_reg_session_v1';

export const VoiceRegistrationAgent: React.FC<VoiceRegistrationAgentProps> = ({
  onComplete,
  onCancel,
  className = '',
}) => {
  // Conversational state machine step
  const [step, setStep] = useState<ConversationStep>('consent');
  
  // Registration data local state with session persistence
  const [formData, setFormData] = useState<VoiceRegistrationData>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse saved voice registration session:', e);
    }
    return {
      fullName: '',
      region: '',
      district: '',
      community: '',
      cropTypes: [],
      farmSizeAcres: 0,
      consentGiven: false,
      timestamp: new Date().toISOString(),
    };
  });

  // Conversation transcripts
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [audioVolume, setAudioVolume] = useState<number>(0);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [textInput, setTextInput] = useState<string>('');
  const [micError, setMicError] = useState<string | null>(null);
  const [micPermission, setMicPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  
  // References
  const recognitionRef = useRef<any>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Sync to session storage on change
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch (e) {
      console.warn('Could not persist voice registration state:', e);
    }
  }, [formData]);

  // Auto scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isListening, isSpeaking]);

  // Query microphone permissions if supported
  useEffect(() => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: 'microphone' as PermissionName })
        .then((perm) => {
          setMicPermission(perm.state as any);
          perm.onchange = () => setMicPermission(perm.state as any);
        })
        .catch(() => {});
    }
  }, []);

  // Speech Synthesis helper
  const speak = (text: string) => {
    if (!voiceEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch {
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  // Add message helper
  const addMessage = (sender: 'assistant' | 'user' | 'system', text: string) => {
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      sender,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMsg]);
    if (sender === 'assistant') {
      speak(text);
    }
  };

  // Web Speech API Voice Recognition
  const startListening = () => {
    stopSpeaking();
    setMicError(null);
    setIsProcessing(false);

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMicError('Speech recognition is not supported in this browser. Please type your responses below.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setIsProcessing(false);
      };

      recognition.onspeechend = () => {
        // Speech ended, transcribing
        setIsProcessing(true);
      };

      recognition.onresult = (event: any) => {
        setIsListening(false);
        setIsProcessing(true);
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          handleUserResponse(transcript);
        } else {
          setIsProcessing(false);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('SpeechRecognition error:', event.error);
        setIsListening(false);
        setIsProcessing(false);
        if (event.error === 'not-allowed') {
          setMicPermission('denied');
          setMicError('Microphone permission was denied. You can still register using the text input below.');
        } else if (event.error === 'no-speech') {
          setMicError('No speech detected. Please tap the microphone and speak clearly.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.warn('Failed to start speech recognition:', err);
      setIsListening(false);
      setIsProcessing(false);
      setMicError('Could not start microphone. You can type your answer below.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsListening(false);
  };

  // Handle consent acceptance and transition to first question
  const handleAcceptConsent = () => {
    setFormData((prev) => ({ ...prev, consentGiven: true }));
    setStep('ask_name');
    const introText =
      "Thank you for giving consent. Let's begin your farm registration. What is your full legal name?";
    setMessages([
      {
        id: 'msg_welcome',
        sender: 'assistant',
        text: introText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    speak(introText);
  };

  // Conversational Extraction State Machine
  const handleUserResponse = (text: string) => {
    const cleaned = text.trim();
    if (!cleaned) {
      setIsProcessing(false);
      return;
    }

    stopListening();
    setIsProcessing(true);
    addMessage('user', cleaned);
    setTextInput('');

    const lower = cleaned.toLowerCase();

    // Check for conversational corrections across steps
    // e.g. "I meant 7 acres" or "Change size to 10 acres"
    const sizeCorrectionMatch = lower.match(/(?:i meant|change to|actually|rather)\s+(\d+(?:\.\d+)?)\s*(?:acres|acre)?/i);
    if (sizeCorrectionMatch) {
      const acres = parseFloat(sizeCorrectionMatch[1]);
      setFormData((prev) => ({ ...prev, farmSizeAcres: acres }));
      setTimeout(() => {
        setIsProcessing(false);
        addMessage(
          'assistant',
          `Understood! I have updated your farm size to ${acres} acres. ${
            step === 'review_confirm' ? "Does everything look correct now? Say 'Confirm' or click Confirm Registration." : "Let's continue."
          }`
        );
      }, 350);
      return;
    }

    switch (step) {
      case 'ask_name': {
        // Strip common conversational prefixes if any (e.g. "My name is Kwame Mensah" -> "Kwame Mensah")
        let parsedName = cleaned.replace(/^(?:my name is|i am|it's|it is|this is)\s+/i, '').trim();
        // Capitalize words
        parsedName = parsedName
          .split(' ')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');

        setFormData((prev) => ({ ...prev, fullName: parsedName }));
        setStep('ask_location');
        setTimeout(() => {
          setIsProcessing(false);
          addMessage(
            'assistant',
            `Pleased to meet you, ${parsedName}! Where is your farm located? Please mention your Community, District, and Region (for example: Fiapre, Sunyani Municipal, Bono Region).`
          );
        }, 350);
        break;
      }

      case 'ask_location': {
        // Parse community, district, region from comma or space-separated answer
        const parts = cleaned.split(/,|\band\b/i).map((p) => p.trim()).filter(Boolean);
        let community = parts[0] || cleaned;
        let district = parts[1] || (parts[0] ? `${parts[0]} District` : 'Sunyani Municipal');
        let region = parts[2] || 'Bono Region';

        // Check if user specified a known region
        const regions = [
          'Bono',
          'Ashanti',
          'Eastern',
          'Central',
          'Western',
          'Northern',
          'Volta',
          'Greater Accra',
          'Upper East',
          'Upper West',
          'Oti',
          'Bono East',
          'Ahafo',
        ];
        for (const reg of regions) {
          if (lower.includes(reg.toLowerCase())) {
            region = `${reg} Region`;
            break;
          }
        }

        setFormData((prev) => ({
          ...prev,
          community,
          district,
          region,
        }));

        setStep('ask_crops');
        setTimeout(() => {
          setIsProcessing(false);
          addMessage(
            'assistant',
            `Recorded your location as ${community}, ${district} in the ${region}. What primary crops do you grow on your farm? (e.g. Maize, Cassava, Rice, Soybean, or Yam)`
          );
        }, 350);
        break;
      }

      case 'ask_crops': {
        const detectedCrops: string[] = [];
        const cropCatalog = [
          'Maize',
          'Cassava',
          'Rice',
          'Soybean',
          'Yam',
          'Cocoa',
          'Plantain',
          'Tomato',
          'Pepper',
          'Sorghum',
          'Millet',
          'Groundnut',
        ];

        for (const crop of cropCatalog) {
          if (lower.includes(crop.toLowerCase())) {
            detectedCrops.push(crop);
          }
        }

        // Fallback: if no keyword matched, split comma or use as single crop
        const finalCrops =
          detectedCrops.length > 0
            ? detectedCrops
            : cleaned
                .split(/,|\band\b/i)
                .map((c) => c.trim())
                .filter(Boolean);

        setFormData((prev) => ({
          ...prev,
          cropTypes: finalCrops.length > 0 ? finalCrops : ['Maize', 'Cassava'],
        }));

        setStep('ask_size');
        setTimeout(() => {
          setIsProcessing(false);
          addMessage(
            'assistant',
            `Great! Recorded crops: ${finalCrops.join(', ')}. How large is your cultivated farm parcel in acres?`
          );
        }, 350);
        break;
      }

      case 'ask_size': {
        const match = cleaned.match(/\d+(?:\.\d+)?/);
        const acres = match ? parseFloat(match[0]) : 5;

        setFormData((prev) => ({ ...prev, farmSizeAcres: acres }));
        setStep('review_confirm');

        setTimeout(() => {
          setIsProcessing(false);
          addMessage(
            'assistant',
            `Got it! I have recorded ${acres} acres. Here is your farm summary:\n\n• Farmer: ${formData.fullName}\n• Location: ${formData.community}, ${formData.district} (${formData.region})\n• Crops: ${formData.cropTypes.join(', ')}\n• Size: ${acres} Acres\n\nDoes everything look correct? You can say "Confirm" or tap the button to finalize registration.`
          );
        }, 350);
        break;
      }

      case 'review_confirm': {
        setIsProcessing(false);
        if (
          lower.includes('confirm') ||
          lower.includes('yes') ||
          lower.includes('correct') ||
          lower.includes('save') ||
          lower.includes('proceed') ||
          lower.includes('submit')
        ) {
          handleFinalSubmit();
        } else if (lower.includes('change') || lower.includes('no') || lower.includes('edit')) {
          addMessage(
            'assistant',
            'What would you like to update? You can say "Change size to 7 acres", or tell me your updated crops or location.'
          );
        } else {
          addMessage(
            'assistant',
            'Please confirm if this information is accurate, or specify what needs to be changed.'
          );
        }
        break;
      }

      case 'completed':
        setIsProcessing(false);
        addMessage(
          'assistant',
          'Your registration is already saved! You can start a new registration using the reset button.'
        );
        break;

      default:
        setIsProcessing(false);
        break;
    }
  };

  const handleFinalSubmit = () => {
    setStep('completed');
    addMessage(
      'assistant',
      'Congratulations! Your farm has been successfully registered in the AgriTrust system under secure, consent-backed data protection standards.'
    );

    if (onComplete) {
      onComplete(formData);
    }
  };

  const handleReset = () => {
    stopSpeaking();
    stopListening();
    try {
      sessionStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setFormData({
      fullName: '',
      region: '',
      district: '',
      community: '',
      cropTypes: [],
      farmSizeAcres: 0,
      consentGiven: false,
      timestamp: new Date().toISOString(),
    });
    setStep('consent');
    setMessages([]);
    setMicError(null);
    setIsProcessing(false);
    setAudioVolume(0);
  };

  return (
    <div
      className={`relative mx-auto w-full max-w-2xl rounded-3xl bg-[#091512] border border-[#1A382B] shadow-2xl overflow-hidden flex flex-col text-slate-100 ${className}`}
    >
      {/* HEADER BAR */}
      <div className="px-6 py-4 border-b border-[#1A382B] bg-[#0E201B]/80 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#103B2D] to-[#2E7D32] text-[#D4AF37] border border-[#D4AF37]/30 shadow-md">
            <Sprout className="h-5 w-5" />
          </div>
          <div>
            <div className="font-display text-base font-bold text-white flex items-center gap-2">
              <span>AgriTrust Voice Registration</span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                Web Speech API
              </span>
            </div>
            <p className="text-xs text-emerald-200/70">
              Conversational state machine for smallholder farmer onboarding
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Header Compact Real-Time Pulse Indicator */}
          {step !== 'consent' && (
            <VoiceWaveform
              isListening={isListening}
              isProcessing={isProcessing}
              isSpeaking={isSpeaking}
              variant="compact"
              className="hidden md:flex"
            />
          )}

          {/* Audio toggle button */}
          <button
            type="button"
            onClick={() => {
              if (voiceEnabled) stopSpeaking();
              setVoiceEnabled(!voiceEnabled);
            }}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              voiceEnabled
                ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
            title={voiceEnabled ? 'Mute Assistant Voice' : 'Enable Assistant Voice'}
          >
            {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>

          {/* Reset button */}
          <button
            type="button"
            onClick={handleReset}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Reset session draft"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* STEP PROGRESS INDICATOR */}
      <div className="px-6 py-2.5 bg-[#07110E] border-b border-[#1A382B] flex items-center justify-between text-xs overflow-x-auto">
        {[
          { key: 'consent', label: '1. Privacy' },
          { key: 'ask_name', label: '2. Name' },
          { key: 'ask_location', label: '3. Location' },
          { key: 'ask_crops', label: '4. Crops' },
          { key: 'ask_size', label: '5. Size' },
          { key: 'review_confirm', label: '6. Review' },
        ].map((s, idx) => {
          const stepOrder = ['consent', 'ask_name', 'ask_location', 'ask_crops', 'ask_size', 'review_confirm', 'completed'];
          const currentIndex = stepOrder.indexOf(step);
          const itemIndex = stepOrder.indexOf(s.key);
          const isPassed = currentIndex > itemIndex;
          const isCurrent = step === s.key;

          return (
            <div key={s.key} className="flex items-center gap-1.5 shrink-0 px-1">
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                  isPassed
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : isCurrent
                    ? 'bg-[#D4AF37] text-slate-950 font-bold animate-pulse'
                    : 'bg-white/10 text-white/40'
                }`}
              >
                {isPassed ? '✓' : idx + 1}
              </span>
              <span
                className={`text-[11px] font-medium ${
                  isCurrent ? 'text-[#D4AF37] font-bold' : isPassed ? 'text-emerald-300' : 'text-white/40'
                }`}
              >
                {s.label}
              </span>
              {idx < 5 && <span className="text-white/20 mx-1">&rsaquo;</span>}
            </div>
          );
        })}
      </div>

      {/* MAIN BODY: SPLIT VIEW (CHAT STREAM + LIVE FORM DRAFT CARD) */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[460px]">
        {/* LEFT COLUMN: CONVERSATION AREA (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          {/* STEP 1: PRIVACY DISCLOSURE & CONSENT SCREEN */}
          {step === 'consent' ? (
            <div className="p-5 rounded-2xl bg-[#0D221B] border border-emerald-500/30 space-y-4">
              <div className="flex items-center gap-2.5 text-emerald-400">
                <ShieldCheck className="h-6 w-6 text-[#D4AF37]" />
                <h3 className="font-display font-bold text-base text-white">
                  Privacy-First Voice Processing Disclosure
                </h3>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Before activating voice capture, please review how your spoken data is handled under
                Ghana's Data Protection Act, 2012 (Act 843):
              </p>

              <div className="space-y-2 text-xs text-slate-300/90 bg-black/20 p-3.5 rounded-xl border border-white/5">
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>On-Device Voice Capture:</strong> Speech recognition runs in your browser via the standard Web Speech API.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Strict Purpose Limitation:</strong> Your voice inputs are exclusively used to extract your farm profile details (name, location, crops, parcel acreage).
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>No Unauthorised Third-Party Sharing:</strong> Your private farm data will never be shared with financial institutions or third parties without your explicit consent.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Session Persistence:</strong> Registration draft fields persist in your local browser session so no data is lost during network interruptions.
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <span className="text-xs text-slate-300">Microphone Permission Status:</span>
                <span
                  className={`text-[11px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                    micPermission === 'granted'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : micPermission === 'denied'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {micPermission}
                </span>
              </div>

              <button
                type="button"
                onClick={handleAcceptConsent}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#103B2D] via-[#1E7454] to-[#2E7D32] hover:from-[#134937] hover:to-[#276e2b] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer border border-[#D4AF37]/30 hover:scale-[1.01] active:scale-[0.99]"
              >
                <span>Accept &amp; Begin Voice Registration</span>
                <ArrowRight className="h-4 w-4 text-[#D4AF37]" />
              </button>
            </div>
          ) : (
            /* CONVERSATION TRANSCRIPT STREAM */
            <div
              ref={chatScrollRef}
              className="flex-1 max-h-[380px] overflow-y-auto space-y-3 pr-2 scrollbar-thin"
            >
              {messages.map((msg) => {
                const isAssistant = msg.sender === 'assistant';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                  >
                    <div
                      className={`max-w-[90%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm ${
                        isAssistant
                          ? 'bg-[#10241E] border border-emerald-500/20 text-slate-100'
                          : 'bg-gradient-to-br from-[#185338] to-[#113B28] border border-emerald-400/30 text-white'
                      }`}
                    >
                      <p className="whitespace-pre-line font-medium text-[13px]">{msg.text}</p>
                    </div>
                    <span className="text-[10px] text-white/40 mt-1 px-1">{msg.timestamp}</span>
                  </div>
                );
              })}

              {/* Real-time speaking / listening indicator */}
              {(isListening || isSpeaking) && (
                <div className="flex items-center gap-2 py-1 text-xs text-emerald-300 animate-pulse">
                  <div className="flex items-center gap-0.5">
                    <span className="h-3 w-1 bg-emerald-400 rounded-full animate-bounce" />
                    <span className="h-4 w-1 bg-emerald-300 rounded-full animate-bounce [animation-delay:0.15s]" />
                    <span className="h-2 w-1 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.3s]" />
                  </div>
                  <span>{isListening ? 'Listening to your speech...' : 'Assistant speaking...'}</span>
                </div>
              )}
            </div>
          )}

          {/* QUICK PROMPT CHIPS (Contextual for the active step) */}
          {step !== 'consent' && step !== 'completed' && (
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] text-white/50 block font-semibold uppercase tracking-wider">
                Quick Suggested Responses:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {step === 'ask_name' &&
                  ['Kwame Mensah', 'Akosua Serwaa', 'Ibrahim Mahama', 'Kofi Boateng'].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => handleUserResponse(n)}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-emerald-950/80 border border-white/10 hover:border-emerald-500/40 text-[11px] text-slate-200 transition-colors cursor-pointer"
                    >
                      {n}
                    </button>
                  ))}

                {step === 'ask_location' &&
                  ['Fiapre, Sunyani, Bono Region', 'Ejura, Sekyedumase, Ashanti', 'Hohoe, Volta Region'].map(
                    (loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => handleUserResponse(loc)}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-emerald-950/80 border border-white/10 hover:border-emerald-500/40 text-[11px] text-slate-200 transition-colors cursor-pointer"
                      >
                        {loc}
                      </button>
                    )
                  )}

                {step === 'ask_crops' &&
                  [
                    'Maize and Cassava',
                    'Soybean and Rice',
                    'Yam and Maize',
                    'Cocoa and Plantain',
                  ].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => handleUserResponse(c)}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-emerald-950/80 border border-white/10 hover:border-emerald-500/40 text-[11px] text-slate-200 transition-colors cursor-pointer"
                    >
                      {c}
                    </button>
                  ))}

                {step === 'ask_size' &&
                  ['5 acres', '7 acres', '10 acres', '15 acres'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleUserResponse(s)}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-emerald-950/80 border border-white/10 hover:border-emerald-500/40 text-[11px] text-slate-200 transition-colors cursor-pointer"
                    >
                      {s}
                    </button>
                  ))}

                {step === 'review_confirm' && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleUserResponse('Confirm and save')}
                      className="px-3 py-1.5 rounded-lg bg-[#2E7D32] hover:bg-[#256628] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Confirm &amp; Register</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUserResponse('I meant 7 acres')}
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 text-slate-300 text-xs transition-colors cursor-pointer"
                    >
                      Correct to 7 Acres
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* REAL-TIME VISUAL WAVEFORM & ACOUSTIC PULSE INDICATOR */}
          {step !== 'consent' && step !== 'completed' && (
            <VoiceWaveform
              isListening={isListening}
              isProcessing={isProcessing}
              isSpeaking={isSpeaking}
              onVolumeChange={setAudioVolume}
              variant="full"
              className="mt-1 mb-1"
            />
          )}

          {/* INPUT BAR: MICROPHONE BUTTON + TEXT FALLBACK INPUT */}
          {step !== 'consent' && step !== 'completed' && (
            <div className="pt-2 border-t border-[#1A382B] space-y-2">
              {micError && (
                <div className="p-2 rounded-xl bg-amber-950/60 border border-amber-500/30 text-[11px] text-amber-200 flex items-center gap-2">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                  <span>{micError}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                {/* Voice Capture Mic Button with Acoustic Pulse Rings */}
                <div className="relative inline-flex items-center justify-center shrink-0">
                  {isListening && (
                    <>
                      <span
                        className="absolute -inset-1 rounded-xl bg-red-500/40 animate-ping opacity-75"
                        style={{ transform: `scale(${1 + (audioVolume / 100) * 0.25})` }}
                      />
                      <span className="absolute -inset-2 rounded-xl bg-emerald-500/20 animate-pulse" />
                    </>
                  )}
                  <button
                    type="button"
                    onClick={isListening ? stopListening : startListening}
                    className={`relative z-10 h-11 px-4 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                      isListening
                        ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/40 ring-2 ring-red-400'
                        : 'bg-gradient-to-r from-[#103B2D] to-[#2E7D32] hover:from-[#134937] hover:to-[#26682a] text-white border border-[#D4AF37]/30 shadow-md'
                    }`}
                    title={isListening ? 'Stop listening' : 'Start microphone to speak'}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="h-4 w-4 animate-bounce text-white" />
                        <span>Listening... (Tap to stop)</span>
                        {/* Dynamic mini audio pulse bars */}
                        <div className="flex items-center gap-0.5 ml-1">
                          <span
                            className="w-1 bg-white rounded-full transition-all duration-75"
                            style={{ height: `${Math.max(6, (audioVolume / 100) * 16)}px` }}
                          />
                          <span
                            className="w-1 bg-[#D4AF37] rounded-full transition-all duration-75"
                            style={{ height: `${Math.max(10, (audioVolume / 100) * 22)}px` }}
                          />
                          <span
                            className="w-1 bg-white rounded-full transition-all duration-75"
                            style={{ height: `${Math.max(6, (audioVolume / 100) * 16)}px` }}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <Mic className="h-4 w-4 text-[#D4AF37]" />
                        <span>Speak</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Text Input Fallback */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUserResponse(textInput);
                  }}
                  className="flex-1 flex items-center gap-1.5"
                >
                  <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Or type your response here..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-white/40 text-xs focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                  />
                  <button
                    type="submit"
                    disabled={!textInput.trim()}
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-[#2E7D32] text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {step === 'completed' && (
            <div className="p-5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-center space-y-3 animate-fade-in">
              <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
              <h4 className="font-display font-bold text-base text-white">
                Farmer Profile &amp; Parcel Successfully Registered!
              </h4>
              <p className="text-xs text-slate-300">
                All fields have been stored in your session and submitted. You can now explore seasonal
                financing, order certified fertilizer, or view your geolocation map.
              </p>
              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white font-semibold transition-colors cursor-pointer"
                >
                  Register Another Parcel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: REAL-TIME CAPTURED REGISTRATION FORM DATA (5 Cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-[#0B1A15] border border-[#1A382B] p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#D4AF37]" />
                <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider">
                  Live Form State (Session)
                </h4>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/90 px-2 py-0.5 rounded border border-emerald-500/30">
                Auto-saved
              </span>
            </div>

            <p className="text-[11px] text-white/60 mb-3 leading-snug">
              Fields update automatically as you speak each response.
            </p>

            <div className="space-y-2.5 text-xs">
              {/* Farmer Name Field */}
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-1.5 text-white/50 text-[10px] uppercase font-semibold mb-1">
                  <User className="h-3 w-3 text-emerald-400" />
                  <span>Farmer Full Name</span>
                </div>
                <div className="font-bold text-white text-sm">
                  {formData.fullName || <span className="text-white/30 italic">Awaiting answer...</span>}
                </div>
              </div>

              {/* Location Fields */}
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-1.5 text-white/50 text-[10px] uppercase font-semibold mb-1">
                  <MapPin className="h-3 w-3 text-emerald-400" />
                  <span>Farm Location</span>
                </div>
                <div className="font-medium text-white text-xs">
                  {formData.community || formData.district || formData.region ? (
                    <span>
                      {formData.community && `${formData.community}, `}
                      {formData.district && `${formData.district}, `}
                      {formData.region}
                    </span>
                  ) : (
                    <span className="text-white/30 italic">Awaiting answer...</span>
                  )}
                </div>
              </div>

              {/* Crop Types */}
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-1.5 text-white/50 text-[10px] uppercase font-semibold mb-1">
                  <Sprout className="h-3 w-3 text-emerald-400" />
                  <span>Primary Cultivated Crops</span>
                </div>
                {formData.cropTypes.length > 0 ? (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {formData.cropTypes.map((c) => (
                      <span
                        key={c}
                        className="px-2 py-0.5 rounded-md bg-emerald-950 border border-emerald-500/30 text-emerald-200 text-[11px] font-semibold"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-white/30 italic">Awaiting answer...</span>
                )}
              </div>

              {/* Farm Parcel Size */}
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-1.5 text-white/50 text-[10px] uppercase font-semibold mb-1">
                  <Ruler className="h-3 w-3 text-emerald-400" />
                  <span>Reported Farm Size</span>
                </div>
                <div className="font-bold text-[#D4AF37] text-sm">
                  {formData.farmSizeAcres > 0 ? (
                    `${formData.farmSizeAcres} Acres`
                  ) : (
                    <span className="text-white/30 italic">Awaiting answer...</span>
                  )}
                </div>
              </div>

              {/* Privacy Consent Tag */}
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-white/50 text-[10px] uppercase font-semibold">
                  <ShieldCheck className="h-3 w-3 text-emerald-400" />
                  <span>Act 843 Consent</span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    formData.consentGiven
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-white/10 text-white/40'
                  }`}
                >
                  {formData.consentGiven ? 'Granted' : 'Pending'}
                </span>
              </div>
            </div>
          </div>

          {/* Review Step Confirm Button */}
          {step === 'review_confirm' && (
            <button
              type="button"
              onClick={handleFinalSubmit}
              className="mt-4 w-full py-3 rounded-xl bg-[#2E7D32] hover:bg-[#256628] text-white font-bold text-xs shadow-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Check className="h-4 w-4" />
              <span>Confirm &amp; Save Registration</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

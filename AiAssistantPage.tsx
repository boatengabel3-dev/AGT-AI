import React, { useState, useRef, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CropDiagnosisResult } from '../types';
import {
  Bot,
  Send,
  User,
  Sparkles,
  ShieldCheck,
  MapPin,
  ExternalLink,
  Zap,
  Cpu,
  Camera,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Bug,
  Leaf,
  ShieldAlert,
  ArrowRight,
  X,
  RefreshCw,
  ShoppingCart,
  Layers,
  HelpCircle,
  Eye,
  Info,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: string;
  modelUsed?: string;
  imageThumbnail?: string;
  mapsLinks?: { title: string; uri: string }[];
}

// 5 pre-loaded sample field photos with rich visual SVG data for instant demonstration
const SAMPLE_FIELD_PHOTOS = [
  {
    id: 'sample_maize_faw',
    label: 'Maize - Fall Armyworm',
    crop: 'Maize / Corn',
    cropHint: 'Maize',
    notes: 'Windowpane feeding damage and frass seen on young maize whorls in Sunyani.',
    colorTheme: 'from-amber-600 to-emerald-700',
    svgData: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><defs><linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%232E7D32"/><stop offset="100%" stop-color="%231B4D20"/></linearGradient></defs><rect width="400" height="300" fill="url(%23g1)"/><path d="M50 280 C120 180 180 80 200 20 C220 80 280 180 350 280" stroke="%2343A047" stroke-width="28" fill="none"/><path d="M120 220 C160 140 190 90 200 40" stroke="%2366BB6A" stroke-width="14" fill="none"/><circle cx="170" cy="110" r="14" fill="%23D32F2F" fill-opacity="0.3" stroke="%23B71C1C" stroke-dasharray="4,2"/><circle cx="215" cy="140" r="18" fill="%23D32F2F" fill-opacity="0.3" stroke="%23B71C1C" stroke-dasharray="4,2"/><circle cx="190" cy="180" r="22" fill="%23D32F2F" fill-opacity="0.3" stroke="%23B71C1C" stroke-dasharray="4,2"/><rect x="180" y="130" width="30" height="15" rx="5" fill="%238D6E63"/><text x="200" y="270" text-anchor="middle" fill="%23FFF" font-family="sans-serif" font-weight="bold" font-size="14">Sample: Maize Fall Armyworm</text></svg>`,
  },
  {
    id: 'sample_cocoa_blackpod',
    label: 'Cocoa - Black Pod Disease',
    crop: 'Cocoa Pod',
    cropHint: 'Cocoa',
    notes: 'Brown to black lesions expanding with white fungal mold during rainy season.',
    colorTheme: 'from-amber-900 to-amber-700',
    svgData: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><defs><linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%235D4037"/><stop offset="100%" stop-color="%233E2723"/></linearGradient></defs><rect width="400" height="300" fill="%231E2A22"/><ellipse cx="200" cy="150" rx="90" ry="120" fill="%23D4AF37"/><path d="M140 150 C140 220 200 260 260 220 C240 160 190 140 140 150 Z" fill="%232D1810"/><ellipse cx="205" cy="200" rx="45" ry="35" fill="%231C0D02"/><ellipse cx="215" cy="195" rx="20" ry="15" fill="%23F5F5F5" fill-opacity="0.4"/><text x="200" y="275" text-anchor="middle" fill="%23FFF" font-family="sans-serif" font-weight="bold" font-size="14">Sample: Cocoa Black Pod (Phytophthora)</text></svg>`,
  },
  {
    id: 'sample_tomato_blight',
    label: 'Tomato - Early Blight',
    crop: 'Tomato',
    cropHint: 'Tomato',
    notes: 'Concentric ring target lesions and yellowing halos on lower foliage.',
    colorTheme: 'from-red-800 to-amber-800',
    svgData: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23153020"/><circle cx="160" cy="180" r="50" fill="%23C62828"/><circle cx="240" cy="160" r="45" fill="%23D32F2F"/><path d="M100 100 C150 70 250 80 300 120 C240 150 160 140 100 100" fill="%234CAF50"/><ellipse cx="180" cy="105" rx="20" ry="14" fill="%23FFEB3B" fill-opacity="0.8"/><circle cx="180" cy="105" r="9" fill="%234E342E"/><circle cx="180" cy="105" r="5" fill="%238D6E63"/><ellipse cx="230" cy="120" rx="16" ry="12" fill="%23FFEB3B" fill-opacity="0.8"/><circle cx="230" cy="120" r="7" fill="%234E342E"/><text x="200" y="275" text-anchor="middle" fill="%23FFF" font-family="sans-serif" font-weight="bold" font-size="14">Sample: Tomato Early Blight</text></svg>`,
  },
  {
    id: 'sample_cassava_mosaic',
    label: 'Cassava - Mosaic Virus',
    crop: 'Cassava',
    cropHint: 'Cassava',
    notes: 'Severe leaf distortion, asymmetric curling, and yellow mosaic patches.',
    colorTheme: 'from-yellow-700 to-emerald-800',
    svgData: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%230F2318"/><path d="M200 250 L200 60" stroke="%238D6E63" stroke-width="8"/><path d="M200 150 C130 110 90 60 70 50 C120 70 170 120 200 150" fill="%2381C784"/><path d="M200 150 C270 110 310 60 330 50 C280 70 230 120 200 150" fill="%23FFEE58"/><path d="M200 120 C150 80 130 30 130 10 C160 40 180 90 200 120" fill="%23FFEE58"/><path d="M200 120 C250 80 270 30 270 10 C240 40 220 90 200 120" fill="%2381C784"/><text x="200" y="275" text-anchor="middle" fill="%23FFF" font-family="sans-serif" font-weight="bold" font-size="14">Sample: African Cassava Mosaic Disease</text></svg>`,
  },
  {
    id: 'sample_healthy_maize',
    label: 'Healthy Maize Leaf',
    crop: 'Maize',
    cropHint: 'Maize',
    notes: 'Clean vigorous green leaf foliage, no lesions, optimal chlorophyll content.',
    colorTheme: 'from-emerald-700 to-teal-800',
    svgData: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><defs><linearGradient id="gH" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%231B5E20"/><stop offset="100%" stop-color="%232E7D32"/></linearGradient></defs><rect width="400" height="300" fill="url(%23gH)"/><path d="M40 280 C100 200 180 100 200 20 C220 100 300 200 360 280" stroke="%234CAF50" stroke-width="32" fill="none"/><path d="M200 20 L200 280" stroke="%2381C784" stroke-width="6"/><circle cx="200" cy="150" r="12" fill="%23FFF" fill-opacity="0.2"/><text x="200" y="270" text-anchor="middle" fill="%23A5D6A7" font-family="sans-serif" font-weight="bold" font-size="14">Sample: Healthy Maize Crop (Zero Pests)</text></svg>`,
  },
];

export const AiAssistantPage: React.FC = () => {
  const { user, setActiveView } = useAuth();

  // Active view tab: 'vision_scanner' or 'advisory_chat'
  const [activeTab, setActiveTab] = useState<'vision_scanner' | 'advisory_chat'>('vision_scanner');

  // Vision scanner states
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedCropHint, setSelectedCropHint] = useState<string>('Maize');
  const [farmerNotes, setFarmerNotes] = useState<string>('');
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<CropDiagnosisResult | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  // Chat advisory states
  const [inputMessage, setInputMessage] = useState('');
  const [chatAttachedImage, setChatAttachedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<'gemini-3.8-flash' | 'gemini-3.1-flash-lite' | 'gemini-4-argon'>('gemini-3.8-flash');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatFileInputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_01',
      sender: 'assistant',
      text: `Akwaaba, ${user?.fullName || 'Farmer'}! I am the AgriTrust AI Agricultural Advisory Assistant for Ghana.

I provide:
• Multimodal Crop Photo Pest & Disease Vision Diagnosis
• Google Maps Grounded locations for verified agro-input depots & bank branches
• Seasonal input credit guidance for Agricultural Development Bank (ADB) facilities
• Direct tractor & mechanisation availability checks
• MoFA / PPRSD certified integrated pest management (IPM)

Upload a photo of your crops or ask any agricultural question below!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'gemini-3.8-flash',
      modelUsed: 'gemini-3.8-flash',
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeTab === 'advisory_chat') {
      scrollToBottom();
    }
  }, [messages, loading, activeTab]);

  // Handle file selection from camera/picker
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      setScanResult(null);
      setScanError(null);
    };
    reader.readAsDataURL(file);
  };

  // Handle chat image attachment
  const handleChatImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setChatAttachedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Select sample photo
  const handleSelectSample = (sample: typeof SAMPLE_FIELD_PHOTOS[0]) => {
    setSelectedImage(sample.svgData);
    setSelectedCropHint(sample.cropHint);
    setFarmerNotes(sample.notes);
    setScanResult(null);
    setScanError(null);
  };

  // Run crop diagnosis
  const handleRunDiagnosis = async () => {
    if (!selectedImage || scanning) return;

    setScanning(true);
    setScanError(null);

    try {
      const response = await api.diagnoseCrop({
        imageBase64: selectedImage,
        cropHint: selectedCropHint,
        farmerNotes,
        region: 'Bono Region',
      });

      if (response && response.diagnosis) {
        setScanResult(response.diagnosis);
      } else {
        throw new Error('Diagnosis data was not returned');
      }
    } catch (err: any) {
      console.error('Pest diagnosis error:', err);
      setScanError(err?.message || 'Failed to analyze crop photo. Please verify image and try again.');
    } finally {
      setScanning(false);
    }
  };

  // Transition from diagnosis result into conversational chat with preloaded question
  const handleAskFollowUp = (questionText: string) => {
    setActiveTab('advisory_chat');
    setInputMessage(questionText);
    if (selectedImage) {
      setChatAttachedImage(selectedImage);
    }
  };

  // Send message in chat
  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || inputMessage;
    if ((!textToSend.trim() && !chatAttachedImage) || loading) return;

    const attachedThumbnail = chatAttachedImage;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      imageThumbnail: attachedThumbnail || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!messageText) setInputMessage('');
    setChatAttachedImage(null);
    setLoading(true);

    try {
      const history = messages.slice(-6).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }],
      }));

      const res = await api.askAssistant(
        textToSend || 'Please analyze this attached crop photo and recommend treatments.',
        history,
        selectedModel,
        { lat: 7.3399, lng: -2.3268 },
        attachedThumbnail || undefined
      );

      const assistantMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'assistant',
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: res.source,
        modelUsed: res.modelUsed,
        mapsLinks: res.mapsLinks,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai_err_${Date.now()}`,
          sender: 'assistant',
          text: 'I encountered an error retrieving agricultural information. Please try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    'Where can I find certified NPK fertilizer depots in Sunyani?',
    'What are the ADB seasonal crop input credit requirements?',
    'What is the MoFA approved dosage of Emamectin Benzoate for Fall Armyworm?',
    'Where is the nearest Agricultural Development Bank branch?',
  ];

  // Helper for severity styling
  const getSeverityBadge = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return {
          bg: 'bg-red-50 text-red-700 border-red-200',
          dot: 'bg-red-600',
          label: 'Critical Immediate Threat',
        };
      case 'high':
        return {
          bg: 'bg-orange-50 text-orange-700 border-orange-200',
          dot: 'bg-orange-600',
          label: 'High Urgency Action Needed',
        };
      case 'medium':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          dot: 'bg-amber-600',
          label: 'Moderate Severity',
        };
      case 'low':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          dot: 'bg-blue-600',
          label: 'Low Severity / Early Detection',
        };
      case 'healthy':
      default:
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-600',
          label: 'Vigorous & Healthy',
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5EF] pb-16">
      {/* Page Header with African Geometric & Gold Accent */}
      <div className="bg-[#103B2D] text-[#F7F5EF] py-8 sm:py-10 border-b border-[#2A4D3F] shadow-inner">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-[#2E7D32] text-[#D4AF37] shadow-lg border border-[#D4AF37]/40 shrink-0">
                <Sparkles className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
                  <Bug className="h-3 w-3" />
                  <span>Gemini Multimodal Vision &middot; MoFA / PPRSD Certified</span>
                </div>
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  AI Advisory &amp; Crop Health Diagnostics
                </h1>
                <p className="text-xs sm:text-sm text-[#F7F5EF]/80 mt-0.5">
                  Detect pests, fungal blights, and crop diseases from photographs with instant Ghanaian treatment protocols
                </p>
              </div>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex items-center p-1 bg-black/25 backdrop-blur-sm rounded-xl border border-white/15 self-start md:self-center shadow-xs">
              <button
                onClick={() => setActiveTab('vision_scanner')}
                className={`px-3 sm:px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-all ${
                  activeTab === 'vision_scanner'
                    ? 'bg-[#D4AF37] text-[#103B2D] shadow-md font-extrabold'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <Camera className="h-4 w-4" />
                <span>Crop Vision Scanner</span>
              </button>

              <button
                onClick={() => setActiveTab('advisory_chat')}
                className={`px-3 sm:px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-all ${
                  activeTab === 'advisory_chat'
                    ? 'bg-[#D4AF37] text-[#103B2D] shadow-md font-extrabold'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <Bot className="h-4 w-4" />
                <span>AI Advisory Chat</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="mx-auto max-w-6xl px-3 sm:px-6 pt-6">
        {/* ========================================================================= */}
        {/* TAB 1: CROP VISION PEST & DISEASE SCANNER                                  */}
        {/* ========================================================================= */}
        {activeTab === 'vision_scanner' && (
          <div className="space-y-6">
            {/* Quick Informational Banner */}
            <div className="rounded-2xl bg-gradient-to-r from-emerald-900 to-[#103B2D] p-4 sm:p-5 text-white shadow-sm border border-[#2E7D32]/40">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2E7D32] text-[#D4AF37] shrink-0 shadow-xs">
                    <Leaf className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-sm sm:text-base text-white">
                      Ghanaian Crop Pest &amp; Disease Early Warning System
                    </h2>
                    <p className="text-xs text-white/80 leading-relaxed mt-0.5">
                      Snap or upload a photo of your field crops (Maize, Cocoa, Cassava, Tomato, Pepper, Yam).
                      Gemini Vision inspects foliage, stems, and fruits to diagnose issues and specify MoFA-PPRSD approved treatments.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      handleSelectSample(SAMPLE_FIELD_PHOTOS[0]);
                      setTimeout(handleRunDiagnosis, 150);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D4AF37] text-[#103B2D] font-bold text-xs hover:bg-[#c29f2e] transition-colors shadow-xs"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Run Demo Scan</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Image Upload & Controls (5 Cols) */}
              <div className="lg:col-span-5 space-y-5">
                <div className="rounded-2xl border border-[#E5E0D5] bg-white p-4 sm:p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-[#F0EBE0] pb-3">
                    <h3 className="font-display font-bold text-sm text-[#103B2D] flex items-center gap-2">
                      <Camera className="h-4 w-4 text-[#2E7D32]" />
                      <span>Upload Crop Photo</span>
                    </h3>
                    {selectedImage && (
                      <button
                        onClick={() => {
                          setSelectedImage(null);
                          setScanResult(null);
                          setScanError(null);
                        }}
                        className="text-[11px] font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1"
                      >
                        <X className="h-3.5 w-3.5" />
                        <span>Clear</span>
                      </button>
                    )}
                  </div>

                  {/* Upload / Drop Zone or Preview */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />

                  {selectedImage ? (
                    <div className="relative rounded-xl overflow-hidden border border-[#CBD5E1] bg-slate-900 shadow-inner group">
                      <img
                        src={selectedImage}
                        alt="Uploaded crop"
                        className="w-full h-56 sm:h-64 object-contain bg-slate-950/70"
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 text-white flex items-center justify-between">
                        <div className="text-[11px] font-medium truncate max-w-[200px]">
                          Crop image ready for diagnosis
                        </div>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-2 py-1 rounded-md bg-white/20 hover:bg-white/30 backdrop-blur-sm text-[10px] font-semibold flex items-center gap-1 transition-colors"
                        >
                          <Camera className="h-3 w-3" />
                          <span>Retake / Change</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-[#CBD5E1] hover:border-[#2E7D32] hover:bg-emerald-50/20 transition-all rounded-xl p-6 sm:p-8 text-center cursor-pointer flex flex-col items-center justify-center gap-3 bg-[#FAF8F5]"
                    >
                      <div className="h-12 w-12 rounded-2xl bg-emerald-100/80 text-[#2E7D32] flex items-center justify-center shadow-xs">
                        <Upload className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#103B2D]">
                          Click to upload or take a field photo
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 max-w-xs">
                          Supports JPEG, PNG, WEBP from mobile camera or gallery
                        </p>
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#103B2D] text-[#D4AF37] text-xs font-bold shadow-xs">
                        <Camera className="h-3.5 w-3.5" />
                        <span>Choose File or Capture</span>
                      </div>
                    </div>
                  )}

                  {/* Crop Hint Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Suspected / Target Crop
                    </label>
                    <div className="grid grid-cols-4 gap-1.5 text-xs">
                      {['Maize', 'Cocoa', 'Cassava', 'Tomato', 'Pepper', 'Plantain', 'Rice', 'Unknown'].map((crop) => (
                        <button
                          key={crop}
                          type="button"
                          onClick={() => setSelectedCropHint(crop)}
                          className={`py-1.5 px-2 rounded-lg font-medium text-[11px] transition-all border ${
                            selectedCropHint === crop
                              ? 'bg-[#103B2D] text-white border-[#103B2D] shadow-xs'
                              : 'bg-white text-slate-700 border-[#CBD5E1] hover:bg-slate-50'
                          }`}
                        >
                          {crop}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Field Notes Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span>Field Notes / Observed Symptoms</span>
                      <span className="text-[10px] text-slate-400 font-normal">Optional</span>
                    </label>
                    <textarea
                      value={farmerNotes}
                      onChange={(e) => setFarmerNotes(e.target.value)}
                      placeholder="e.g., Spots observed on underside of leaves after 3 days of rain; spreading from eastern boundary..."
                      rows={2}
                      className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3 py-2 text-xs text-slate-900 focus:border-[#2E7D32] focus:outline-none"
                    />
                  </div>

                  {/* Scan CTA */}
                  <button
                    type="button"
                    onClick={handleRunDiagnosis}
                    disabled={!selectedImage || scanning}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#103B2D] to-[#2E7D32] text-[#D4AF37] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {scanning ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin text-[#D4AF37]" />
                        <span>Scanning foliage with Gemini Vision...</span>
                      </>
                    ) : (
                      <>
                        <Bug className="h-4 w-4" />
                        <span>Detect Pests &amp; Diseases Now</span>
                      </>
                    )}
                  </button>

                  {scanError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                      <div>{scanError}</div>
                    </div>
                  )}
                </div>

                {/* Pre-loaded Sample Crops for Instant Verification */}
                <div className="rounded-2xl border border-[#E5E0D5] bg-white p-4 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-[#103B2D] flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
                      <span>Instant Field Test Samples</span>
                    </div>
                    <span className="text-[10px] text-slate-500">1-Click Try</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {SAMPLE_FIELD_PHOTOS.map((sample) => (
                      <button
                        key={sample.id}
                        type="button"
                        onClick={() => handleSelectSample(sample)}
                        className={`text-left p-2.5 rounded-xl border transition-all flex items-center gap-2.5 ${
                          selectedImage === sample.svgData
                            ? 'border-[#2E7D32] bg-emerald-50/60 ring-1 ring-[#2E7D32]'
                            : 'border-[#CBD5E1] bg-[#FAF8F5] hover:border-slate-400 hover:bg-white'
                        }`}
                      >
                        <div className="h-10 w-10 rounded-lg overflow-hidden shrink-0 border border-black/10 bg-black/10">
                          <img src={sample.svgData} alt={sample.label} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 truncate">
                            {sample.label}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">
                            {sample.crop}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Diagnosis Report or Empty State (7 Cols) */}
              <div className="lg:col-span-7">
                {scanResult ? (
                  <div className="rounded-2xl border border-[#E5E0D5] bg-white shadow-sm overflow-hidden animate-fadeIn">
                    {/* Diagnostic Report Header */}
                    <div className="bg-[#103B2D] text-white p-5 border-b border-[#2A4D3F]">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${
                              getSeverityBadge(scanResult.severity).bg
                            }`}
                          >
                            <span
                              className={`h-2 w-2 rounded-full ${
                                getSeverityBadge(scanResult.severity).dot
                              }`}
                            />
                            <span>{getSeverityBadge(scanResult.severity).label}</span>
                          </span>
                          <span className="px-2.5 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold">
                            {scanResult.condition}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-[#D4AF37] font-semibold">Confidence:</span>
                          <div className="w-20 bg-white/20 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-[#D4AF37] h-2.5 rounded-full"
                              style={{ width: `${scanResult.confidenceScore}%` }}
                            />
                          </div>
                          <span className="font-mono font-bold text-white text-[11px]">
                            {scanResult.confidenceScore}%
                          </span>
                        </div>
                      </div>

                      <div className="mt-3">
                        <h2 className="font-display text-xl sm:text-2xl font-black text-white">
                          {scanResult.diagnosisTitle}
                        </h2>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/80 mt-1">
                          <span>
                            <strong>Crop:</strong> {scanResult.cropIdentified}
                          </span>
                          {scanResult.scientificName && (
                            <span className="italic text-[#D4AF37]">({scanResult.scientificName})</span>
                          )}
                          <span>
                            <strong>Scanned:</strong>{' '}
                            {new Date(scanResult.scannedAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 sm:p-6 space-y-6">
                      {/* Diagnostic Summary */}
                      <div className="rounded-xl bg-[#F7F5EF] p-4 border border-[#E5E0D5] text-xs leading-relaxed text-[#171C19]">
                        <div className="font-bold text-[#103B2D] mb-1 flex items-center gap-1.5">
                          <Eye className="h-4 w-4 text-[#2E7D32]" />
                          <span>Gemini Vision Assessment</span>
                        </div>
                        <p>{scanResult.summary}</p>
                      </div>

                      {/* Visual Symptoms Observed */}
                      {scanResult.symptomsObserved && scanResult.symptomsObserved.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                            <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                            <span>Visual Symptoms Spotted in Photograph</span>
                          </h4>
                          <ul className="space-y-1.5 text-xs text-slate-800">
                            {scanResult.symptomsObserved.map((symp, sIdx) => (
                              <li key={sIdx} className="flex items-start gap-2 bg-amber-50/40 p-2 rounded-lg border border-amber-100">
                                <span className="text-amber-700 font-bold mt-0.5">•</span>
                                <span>{symp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* MoFA / PPRSD Approved Immediate Treatments */}
                      {scanResult.immediateRemedies && scanResult.immediateRemedies.length > 0 && (
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-[#103B2D] flex items-center gap-1.5">
                              <ShieldCheck className="h-4 w-4 text-[#2E7D32]" />
                              <span>Ghana MoFA / PPRSD Approved Treatment Protocol</span>
                            </h4>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              Official IPM Standard
                            </span>
                          </div>

                          <div className="space-y-2">
                            {scanResult.immediateRemedies.map((rem, rIdx) => (
                              <div
                                key={rIdx}
                                className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-1"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <div className="font-bold text-xs text-[#103B2D]">
                                    {rem.action}
                                  </div>
                                  {rem.productCategory && (
                                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                                      {rem.productCategory}
                                    </span>
                                  )}
                                </div>
                                {rem.dosageOrApplication && (
                                  <div className="text-[11px] text-slate-700 leading-relaxed">
                                    <strong>Application &amp; Knapsack Dosage:</strong> {rem.dosageOrApplication}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Cultural & Preventive Practices */}
                      {scanResult.culturalAndPreventive && scanResult.culturalAndPreventive.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                            <Layers className="h-3.5 w-3.5 text-[#2E7D32]" />
                            <span>Cultural &amp; Preventive Management (Next Cycle)</span>
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {scanResult.culturalAndPreventive.map((prev, pIdx) => (
                              <div
                                key={pIdx}
                                className="p-2.5 rounded-lg border border-[#CBD5E1] bg-[#FAF8F5] text-slate-700 flex items-start gap-2"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5 text-[#2E7D32] shrink-0 mt-0.5" />
                                <span>{prev}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Safety & PPE Notice */}
                      {scanResult.safetyAndPPE && scanResult.safetyAndPPE.length > 0 && (
                        <div className="rounded-xl bg-orange-50/80 border border-orange-200 p-3 text-xs text-orange-950 space-y-1">
                          <div className="font-bold flex items-center gap-1.5 text-orange-900">
                            <ShieldAlert className="h-4 w-4 text-orange-700" />
                            <span>Farmer Safety &amp; Pre-Harvest Interval (PHI)</span>
                          </div>
                          <ul className="list-disc pl-5 space-y-0.5 text-[11px] text-orange-900/90">
                            {scanResult.safetyAndPPE.map((safe, sfIdx) => (
                              <li key={sfIdx}>{safe}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Certified AgriTrust Catalog Input Matches */}
                      {scanResult.recommendedCatalogItems && scanResult.recommendedCatalogItems.length > 0 && (
                        <div className="space-y-2.5 pt-2 border-t border-[#F0EBE0]">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-[#103B2D] flex items-center gap-1.5">
                              <ShoppingCart className="h-3.5 w-3.5 text-[#2E7D32]" />
                              <span>Order Verified Inputs on AgriTrust Marketplace</span>
                            </h4>
                            <span className="text-[10px] text-slate-500">Certified Suppliers &middot; Sunyani Hub</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {scanResult.recommendedCatalogItems.map((item, itemIdx) => (
                              <div
                                key={itemIdx}
                                className="p-3 rounded-xl border border-[#CBD5E1] bg-white hover:border-[#103B2D] transition-colors shadow-xs flex flex-col justify-between gap-2"
                              >
                                <div>
                                  <div className="font-bold text-xs text-slate-900">
                                    {item.title}
                                  </div>
                                  <div className="text-[11px] text-slate-500 mt-0.5">
                                    {item.purpose}
                                  </div>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                  {item.unitPriceGHS && (
                                    <span className="font-bold text-xs text-[#2E7D32]">
                                      GHS {item.unitPriceGHS}
                                    </span>
                                  )}
                                  <button
                                    onClick={() => setActiveView('marketplace')}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#103B2D] text-[#D4AF37] font-semibold text-[10px] hover:bg-[#185340] transition-colors"
                                  >
                                    <span>View Input</span>
                                    <ArrowRight className="h-2.5 w-2.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Bar */}
                      <div className="pt-3 border-t border-[#F0EBE0] flex flex-wrap items-center justify-between gap-3">
                        <button
                          onClick={() =>
                            handleAskFollowUp(
                              `I need more guidance on treating ${scanResult.diagnosisTitle} in my ${scanResult.cropIdentified} field. What are the best weather conditions and knapsack calibration for spraying?`
                            )
                          }
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#103B2D] text-[#D4AF37] font-bold text-xs hover:bg-[#185340] shadow-sm transition-all"
                        >
                          <Bot className="h-3.5 w-3.5" />
                          <span>Ask Follow-up in AI Advisory Chat</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>

                        <button
                          onClick={() => {
                            setSelectedImage(null);
                            setScanResult(null);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#CBD5E1] bg-white text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
                        >
                          <Camera className="h-3.5 w-3.5" />
                          <span>Scan Another Crop Photo</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Empty state when no diagnosis has been run */
                  <div className="rounded-2xl border border-dashed border-[#CBD5E1] bg-white p-8 sm:p-12 text-center h-full flex flex-col items-center justify-center space-y-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-[#2E7D32] border border-emerald-100 shadow-sm">
                      <Bug className="h-8 w-8" />
                    </div>
                    <div className="max-w-md">
                      <h3 className="font-display font-bold text-base text-[#103B2D]">
                        Awaiting Crop Photograph
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Upload or snap a photo of any crop with suspect damage, or choose one of the instant field samples on the left to test Gemini's vision capabilities.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full max-w-md pt-2 text-left">
                      <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5E0D5]">
                        <div className="text-[11px] font-bold text-[#103B2D]">🌽 Maize</div>
                        <div className="text-[10px] text-slate-500">Fall armyworm, streak virus</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5E0D5]">
                        <div className="text-[11px] font-bold text-[#103B2D]">🍫 Cocoa</div>
                        <div className="text-[10px] text-slate-500">Black pod, capsid bugs</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5E0D5]">
                        <div className="text-[11px] font-bold text-[#103B2D]">🍅 Tomato</div>
                        <div className="text-[10px] text-slate-500">Early blight, bacterial wilt</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: AI ADVISORY CHAT WITH PHOTO ATTACHMENT & MAPS GROUNDING             */}
        {/* ========================================================================= */}
        {activeTab === 'advisory_chat' && (
          <div className="space-y-4">
            {/* Top Bar with Model Switcher & GPS Context */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-white border border-[#E5E0D5] shadow-xs">
              <div className="flex items-center gap-2 text-xs">
                <MapPin className="h-3.5 w-3.5 text-[#2E7D32]" />
                <span className="font-semibold text-slate-800">Grounding Context:</span>
                <span className="text-slate-600">Sunyani / Bono Agricultural Hub &middot; MoFA Ghana</span>
              </div>

              {/* Model Selector Bar */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs self-start sm:self-auto">
                <button
                  onClick={() => setSelectedModel('gemini-3.8-flash')}
                  className={`px-2.5 py-1 rounded-md font-bold flex items-center gap-1 transition-all ${
                    selectedModel === 'gemini-3.8-flash'
                      ? 'bg-[#103B2D] text-[#D4AF37] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Vision & Google Maps Grounding"
                >
                  <MapPin className="h-3 w-3" />
                  <span>3.8 Flash (Vision &amp; Maps)</span>
                </button>

                <button
                  onClick={() => setSelectedModel('gemini-3.1-flash-lite')}
                  className={`px-2.5 py-1 rounded-md font-semibold flex items-center gap-1 transition-all ${
                    selectedModel === 'gemini-3.1-flash-lite'
                      ? 'bg-[#103B2D] text-[#D4AF37] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Zap className="h-3 w-3" />
                  <span>3.1 Lite</span>
                </button>

                <button
                  onClick={() => setSelectedModel('gemini-4-argon')}
                  className={`px-2.5 py-1 rounded-md font-semibold flex items-center gap-1 transition-all ${
                    selectedModel === 'gemini-4-argon'
                      ? 'bg-[#103B2D] text-[#D4AF37] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Cpu className="h-3 w-3" />
                  <span>4 Argon</span>
                </button>
              </div>
            </div>

            {/* Chat Box Interface */}
            <div className="rounded-2xl border border-[#E5E0D5] bg-white shadow-sm overflow-hidden flex flex-col h-[75vh] sm:h-[620px]">
              {/* Scrollable Messages Thread */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.sender === 'assistant' && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#103B2D] text-[#D4AF37] shrink-0 shadow-xs">
                        <Bot className="h-4 w-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed whitespace-pre-line shadow-sm ${
                        msg.sender === 'user'
                          ? 'bg-[#103B2D] text-white rounded-tr-none'
                          : 'bg-[#F7F5EF] text-[#171C19] border border-[#E5E0D5] rounded-tl-none'
                      }`}
                    >
                      {/* Attached Thumbnail if user sent an image */}
                      {msg.imageThumbnail && (
                        <div className="mb-2.5 rounded-lg overflow-hidden border border-white/20 max-w-[220px] bg-black/40">
                          <img
                            src={msg.imageThumbnail}
                            alt="Crop attachment"
                            className="w-full h-28 object-cover"
                          />
                          <div className="px-2 py-0.5 bg-black/60 text-[9px] text-white/90">
                            Attached Crop Photo
                          </div>
                        </div>
                      )}

                      <div>{msg.text}</div>

                      {/* Google Maps Grounded Location Links */}
                      {msg.mapsLinks && msg.mapsLinks.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-200/80 space-y-1.5">
                          <div className="flex items-center gap-1 text-[11px] font-bold text-[#103B2D]">
                            <MapPin className="h-3.5 w-3.5 text-[#2E7D32]" />
                            <span>Google Maps Verified Places:</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {msg.mapsLinks.map((place, pIdx) => (
                              <a
                                key={pIdx}
                                href={place.uri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-[#CBD5E1] text-[11px] font-semibold text-slate-800 hover:border-[#103B2D] hover:text-[#103B2D] shadow-xs transition-colors"
                              >
                                <span>{place.title}</span>
                                <ExternalLink className="h-3 w-3 text-slate-400" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      <div
                        className={`mt-2 text-[10px] flex items-center justify-between gap-3 ${
                          msg.sender === 'user' ? 'text-white/60' : 'text-slate-400'
                        }`}
                      >
                        <span>{msg.timestamp}</span>
                        {msg.source && (
                          <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                            {msg.source}
                          </span>
                        )}
                      </div>
                    </div>

                    {msg.sender === 'user' && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2E7D32] text-white shrink-0 shadow-xs">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                ))}

                {loading && (
                  <div className="flex gap-3 items-center text-xs text-slate-500">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#103B2D] text-[#D4AF37]">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-[#F7F5EF] p-3 rounded-2xl border border-[#E5E0D5] flex items-center gap-2">
                      <span className="animate-pulse">
                        {chatAttachedImage
                          ? 'Analyzing crop image with Gemini Vision & MoFA rules...'
                          : 'Consulting agricultural database & Google Maps...'}
                      </span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts Bar */}
              <div className="p-2.5 bg-[#F7F5EF] border-t border-[#E5E0D5] flex items-center gap-2 overflow-x-auto">
                <span className="text-[11px] font-semibold text-slate-500 shrink-0">Quick Ask:</span>
                {samplePrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(p)}
                    className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white border border-[#CBD5E1] text-[11px] text-slate-700 hover:border-[#103B2D] hover:bg-emerald-50/50 transition-colors shadow-2xs"
                  >
                    {p}
                  </button>
                ))}
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 sm:p-4 bg-white border-t border-[#E5E0D5] space-y-2">
                {/* Hidden File Input for Chat Photo Attachment */}
                <input
                  ref={chatFileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleChatImageChange}
                  className="hidden"
                />

                {/* Attached Image Preview Pill */}
                {chatAttachedImage && (
                  <div className="flex items-center gap-2 p-1.5 px-3 rounded-xl bg-emerald-50 border border-emerald-200 self-start w-fit text-xs text-[#103B2D]">
                    <div className="h-8 w-8 rounded overflow-hidden border border-emerald-300">
                      <img src={chatAttachedImage} alt="Attachment" className="w-full h-full object-cover" />
                    </div>
                    <span className="font-semibold text-[11px]">Crop photo attached for Gemini Vision</span>
                    <button
                      type="button"
                      onClick={() => setChatAttachedImage(null)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex items-center gap-2"
                >
                  <button
                    type="button"
                    onClick={() => chatFileInputRef.current?.click()}
                    title="Attach a crop photo for Gemini Vision pest detection"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#CBD5E1] bg-slate-50 hover:bg-emerald-50 hover:border-[#2E7D32] text-slate-700 transition-colors shrink-0 shadow-2xs"
                  >
                    <Camera className="h-4 w-4" />
                  </button>

                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={
                      chatAttachedImage
                        ? 'Describe this photo (e.g. what crop, how long spots have appeared)...'
                        : 'Ask about fertilizer depots, crop diseases, tractor rates, or nearby bank branches...'
                    }
                    className="flex-1 rounded-xl border border-[#CBD5E1] bg-white px-4 py-2.5 text-xs text-slate-900 focus:border-[#2E7D32] focus:outline-none"
                  />

                  <button
                    type="submit"
                    disabled={loading || (!inputMessage.trim() && !chatAttachedImage)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#103B2D] text-[#D4AF37] hover:bg-[#185340] transition-colors disabled:opacity-40 shrink-0 shadow-sm"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>

            {/* Safety & Grounding Notice */}
            <div className="p-3 rounded-xl bg-[#EAE5D9] border border-[#E5E0D5] text-[11px] text-slate-600 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#2E7D32] shrink-0" />
              <span>
                Gemini Vision pest detection follows Ghana Ministry of Food &amp; Agriculture (MoFA) and PPRSD plant pathology standards. Always verify pesticide pre-harvest intervals and wear proper PPE.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

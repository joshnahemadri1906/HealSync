import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Sparkles,
  Bot,
  User,
  X,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { voiceService, VOICE_PERSONAS } from '../services/voiceService';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
  activeContext?: any;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  initialPrompt,
  activeContext,
}) => {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text:
        language === 'ta'
          ? 'வணக்கம்! நான் உங்கள் பிசியோகேர் AI மறுவாழ்வு உதவியாளர். மூட்டு வலி, உடற்பயிற்சிகள், தினசரி உணவு முறை அல்லது உடல் நலன் குறித்து என்னிடம் எந்த சந்தேகமும் கேட்கலாம். தமிழில் பதிலளிக்க தயாராக உள்ளேன்.'
          : 'Hello! I am your PhysioCare AI Rehabilitation Partner, designed to explain physiotherapy exercises, daily nutrition, and recovery routines in simple, friendly terms. How can I help you feel better today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [selectedPersonaId, setSelectedPersonaId] = useState('dr_priya');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle initialPrompt injection
  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  // Speech Recognition setup
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      const langMap: Record<string, string> = {
        en: 'en-IN',
        ta: 'ta-IN',
        hi: 'hi-IN',
        te: 'te-IN',
        ml: 'ml-IN',
        kn: 'kn-IN',
      };
      recognition.lang = langMap[language] || 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsRecording(false);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Voice dictation is not supported by your browser. Please type your query.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      recognitionRef.current.start();
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isLoading) return;

    const userMsg: Message = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          language: language === 'ta' ? 'Tamil' : language === 'hi' ? 'Hindi' : 'English',
          context: activeContext,
        }),
      });

      const data = await res.json();
      const botReply =
        data.reply ||
        'I have analyzed your query. Always remember to practice gentle movements, stay well hydrated, and consult your certified physiotherapist for hands-on evaluation.';

      const botMsg: Message = {
        id: 'bot-' + Date.now(),
        sender: 'bot',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);

      // Speak answer aloud
      handleSpeakMessage(botMsg.id, botMsg.text);
    } catch (err) {
      const fallbackMsg: Message = {
        id: 'bot-err-' + Date.now(),
        sender: 'bot',
        text: 'I am here to guide your physiotherapy journey. For pain relief, apply gentle warm/cold compression, maintain proper spinal alignment, and consult our verified physiotherapists.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeakMessage = (msgId: string, text: string) => {
    if (speakingMessageId === msgId) {
      voiceService.stop();
      setSpeakingMessageId(null);
      return;
    }

    setSpeakingMessageId(msgId);
    voiceService.speak(text, selectedPersonaId, language);

    const unsubscribe = voiceService.subscribe((speaking) => {
      if (!speaking) {
        setSpeakingMessageId(null);
        unsubscribe();
      }
    });
  };

  if (!isOpen) return null;

  const quickPrompts = [
    { label: 'Lower back stiffness relief', prompt: 'What are 3 gentle exercises for lower back pain when sitting?' },
    { label: 'Knee osteoarthritis diet', prompt: 'What daily diet and nutrients help reduce knee joint inflammation?' },
    { label: 'Tamil: கழுத்து வலி உடற்பயிற்சி', prompt: 'கழுத்து வலிக்கு செய்யக்கூடிய 3 எளிய உடற்பயிற்சிகளை தமிழில் விளக்குங்கள்.' },
    { label: 'Hydration & joints', prompt: 'Why is drinking enough water so important for joint cartilage?' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full h-[90vh] flex flex-col border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-linear-to-r from-teal-700 via-teal-800 to-cyan-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl shadow-xs">
              <Bot className="w-5 h-5 text-teal-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base leading-tight">
                  {t('aiBotTitle')}
                </h3>
                <span className="px-2 py-0.5 bg-teal-500/40 text-teal-100 rounded-full text-[10px] font-semibold border border-teal-300/30">
                  Gemini 3.8 Powered
                </span>
              </div>
              <p className="text-[11px] text-teal-100/80 mt-0.5">
                Low-digital-literacy friendly • Multi-voice & multilingual guidance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Voice Persona Selector Bar */}
        <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs overflow-x-auto shrink-0">
          <div className="flex items-center gap-1.5 text-slate-600 font-semibold shrink-0">
            <Volume2 className="w-3.5 h-3.5 text-teal-700" />
            <span>Voice Guide:</span>
          </div>

          <div className="flex items-center gap-1">
            {VOICE_PERSONAS.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPersonaId(p.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  selectedPersonaId === p.id
                    ? 'bg-teal-600 text-white shadow-2xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200'
                }`}
              >
                {p.name.split(' ')[0]} ({p.gender === 'female' ? '♀' : '♂'})
              </button>
            ))}
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
          {/* Quick Prompts */}
          <div className="flex flex-wrap gap-1.5 pb-2">
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q.prompt)}
                className="px-2.5 py-1 rounded-full bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-slate-700 hover:text-teal-800 text-[11px] font-medium transition-all shadow-2xs"
              >
                ✨ {q.label}
              </button>
            ))}
          </div>

          {messages.map((msg) => {
            const isBot = msg.sender === 'bot';
            const isSpeakingThis = speakingMessageId === msg.id;

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}
              >
                {isBot && (
                  <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs space-y-1.5 shadow-2xs ${
                    isBot
                      ? 'bg-white text-slate-800 border border-slate-200'
                      : 'bg-teal-600 text-white font-medium rounded-tr-xs'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>

                  <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                    <span>{msg.timestamp}</span>

                    {isBot && (
                      <button
                        onClick={() => handleSpeakMessage(msg.id, msg.text)}
                        className={`flex items-center gap-1 font-semibold transition-colors ${
                          isSpeakingThis ? 'text-rose-600 animate-pulse' : 'text-teal-700 hover:text-teal-900'
                        }`}
                      >
                        {isSpeakingThis ? (
                          <>
                            <VolumeX className="w-3 h-3" /> Stop
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3" /> Listen
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {!isBot && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-2xs flex items-center gap-2 text-xs text-slate-500">
                <Sparkles className="w-3.5 h-3.5 text-teal-600 animate-spin" />
                <span>Formulating simple rehabilitation guidance...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Clinical Disclaimer */}
        <div className="px-4 py-1.5 bg-amber-50 border-t border-amber-200 text-[10px] text-amber-900 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span className="line-clamp-1">{t('disclaimer')}</span>
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <button
            type="button"
            onClick={toggleRecording}
            className={`p-2.5 rounded-xl border transition-all ${
              isRecording
                ? 'bg-rose-500 text-white border-rose-600 ring-2 ring-rose-400 animate-pulse'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
            title="Speak your question (Voice Input)"
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder={t('aiAskPlaceholder')}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 focus:bg-white"
          />

          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isLoading}
            className="p-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl shadow-xs transition-all active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

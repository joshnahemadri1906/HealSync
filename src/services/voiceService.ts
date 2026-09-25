import { VoicePersona, SupportedLanguage } from '../types';

export const VOICE_PERSONAS: VoicePersona[] = [
  {
    id: 'dr_priya',
    name: 'Dr. Priya (Gentle & Reassuring)',
    gender: 'female',
    tag: 'Warm Clinical Physiotherapist',
    rate: 0.95,
    pitch: 1.1,
    langCode: 'en-IN',
  },
  {
    id: 'dr_anand',
    name: 'Dr. Anand (Calm & Authoritative)',
    gender: 'male',
    tag: 'Senior Rehabilitation Specialist',
    rate: 0.92,
    pitch: 0.9,
    langCode: 'en-IN',
  },
  {
    id: 'nurse_meena',
    name: 'Nurse Meena (Patient & Low-Literacy Friendly)',
    gender: 'female',
    tag: 'Step-by-Step Care Guide',
    rate: 0.85,
    pitch: 1.05,
    langCode: 'ta-IN',
  },
  {
    id: 'coach_vikram',
    name: 'Coach Vikram (Energetic Mobility Guide)',
    gender: 'male',
    tag: 'Active Exercise Motivator',
    rate: 1.05,
    pitch: 1.0,
    langCode: 'hi-IN',
  },
];

class VoiceService {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking = false;
  private listeners: ((speaking: boolean) => void)[] = [];

  public subscribe(cb: (speaking: boolean) => void) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  private notify(speaking: boolean) {
    this.isSpeaking = speaking;
    this.listeners.forEach((cb) => cb(speaking));
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.notify(false);
    }
  }

  public speak(
    text: string,
    personaId = 'dr_priya',
    language: SupportedLanguage = 'en',
    speedMultiplier = 1.0
  ) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('SpeechSynthesis is not supported in this browser.');
      return;
    }

    this.stop();

    const persona =
      VOICE_PERSONAS.find((p) => p.id === personaId) || VOICE_PERSONAS[0];

    const utterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance = utterance;

    utterance.rate = persona.rate * speedMultiplier;
    utterance.pitch = persona.pitch;

    // Map language
    const langMap: Record<SupportedLanguage, string> = {
      en: 'en-IN',
      ta: 'ta-IN',
      hi: 'hi-IN',
      te: 'te-IN',
      ml: 'ml-IN',
      kn: 'kn-IN',
    };
    utterance.lang = langMap[language] || 'en-US';

    // Try finding matching voice
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const preferred = voices.find((v) => {
        if (language === 'ta' && (v.lang.includes('ta') || v.name.toLowerCase().includes('tamil'))) {
          return true;
        }
        if (language === 'hi' && (v.lang.includes('hi') || v.name.toLowerCase().includes('hindi'))) {
          return true;
        }
        if (persona.gender === 'female' && (v.name.includes('Female') || v.name.includes('Google UK English Female') || v.name.includes('Zira') || v.name.includes('Priya') || v.name.includes('Heera'))) {
          return true;
        }
        if (persona.gender === 'male' && (v.name.includes('Male') || v.name.includes('Google UK English Male') || v.name.includes('David') || v.name.includes('Ravi'))) {
          return true;
        }
        return false;
      });

      if (preferred) {
        utterance.voice = preferred;
      }
    }

    utterance.onstart = () => {
      this.notify(true);
    };

    utterance.onend = () => {
      this.notify(false);
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e);
      this.notify(false);
    };

    window.speechSynthesis.speak(utterance);
  }

  // Play gentle web audio chime for reminders
  public playReminderChime() {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Soft dual-tone bell (E5 -> B5)
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, now); // E5
      osc1.frequency.exponentialRampToValueAtTime(987.77, now + 0.3); // B5

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(329.63, now); // E4
      osc2.frequency.exponentialRampToValueAtTime(493.88, now + 0.3);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.2);
      osc2.stop(now + 1.2);
    } catch (err) {
      console.log('Audio chime error:', err);
    }
  }
}

export const voiceService = new VoiceService();

import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI SDK on server
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// In-memory dispatched emails log for simulation & verification
interface EmailLog {
  id: string;
  to: string;
  patientName: string;
  type: string;
  subject: string;
  body: string;
  sentAt: string;
  status: 'delivered' | 'queued';
}

const sentEmailsDb: EmailLog[] = [];

// AI Consultation endpoint
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  try {
    const { message, language = 'English', context, patientHistory } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured. Please set GEMINI_API_KEY.',
        reply: `[Offline AI Physiotherapy Assistant] For "${message}", please maintain good posture, apply cold/warm compress as instructed, and consult your certified physiotherapist.`,
      });
    }

    const systemInstruction = `
You are the PhysioCare Intelligent Rehabilitation Assistant, co-designed for patients including those with low digital literacy.
Your primary role:
1. Translate complex clinical physiotherapy terms into simple, compassionate, step-by-step instructions.
2. Emphasize patient safety: Clearly distinguish AI educational advice from the professional diagnosis of a certified physiotherapist.
3. Suggest practical daily routines, hydration, diet tips (e.g. anti-inflammatory, calcium, collagen, protein), and gentle rehabilitation movements.
4. Support the patient in their selected language: ${language}. If Tamil is requested, respond in natural, friendly Tamil (or English translation along with Tamil for easy comprehension). If Hindi or other Indian languages are requested, communicate in that language fluently.
5. If the user mentions pain, ask clarifying questions (duration, intensity, aggravating movements) and advise when to seek immediate emergency or in-clinic physical therapy.
${context ? `Current Body System context: ${JSON.stringify(context)}` : ''}
${patientHistory ? `Patient profile: ${JSON.stringify(patientHistory)}` : ''}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'I am here to guide your physiotherapy journey. Please ask any question.';
    return res.json({ reply });
  } catch (error: any) {
    console.error('Error generating AI response:', error);
    return res.status(500).json({
      error: error.message || 'Failed to process AI query',
      reply: 'An error occurred while connecting to the physiotherapy knowledge base. Please try again.',
    });
  }
});

// Gemini Text-to-Speech endpoint
app.post('/api/ai/tts', async (req: Request, res: Response) => {
  try {
    const { text, voice = 'Kore', language = 'English' } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required for TTS' });
    }

    if (!ai) {
      return res.status(503).json({ error: 'TTS service not available without Gemini API key' });
    }

    const voiceNames = ['Kore', 'Puck', 'Zephyr', 'Fenrir', 'Charon'];
    const chosenVoice = voiceNames.includes(voice) ? voice : 'Kore';

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text.slice(0, 450), // keep speech concise
              speechMetadata: {
                style: 'Gentle, clear, supportive clinical physiotherapist voice',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: chosenVoice },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return res.json({ audio: base64Audio, format: 'audio/pcm;rate=24000' });
    }

    return res.status(404).json({ error: 'Could not generate speech audio' });
  } catch (err: any) {
    console.error('TTS error:', err);
    return res.status(500).json({ error: err.message || 'TTS generation failed' });
  }
});

// Email Reminder Dispatch API
app.post('/api/reminders/send-email', (req: Request, res: Response) => {
  try {
    const { to, patientName, reminderType, title, message, scheduledTime } = req.body;

    if (!to || !title) {
      return res.status(400).json({ error: 'Recipient email and title are required' });
    }

    const emailEntry: EmailLog = {
      id: 'em_' + Math.random().toString(36).substring(2, 9),
      to,
      patientName: patientName || 'Valued Patient',
      type: reminderType || 'General Health',
      subject: `[PhysioCare Alert] ${title}`,
      body: message || `This is a friendly reminder to take care of your health: ${title}.`,
      sentAt: new Date().toISOString(),
      status: 'delivered',
    };

    sentEmailsDb.unshift(emailEntry);
    console.log(`[Email Dispatcher] Successfully sent reminder email to ${to}: ${title}`);

    return res.json({
      success: true,
      message: `Reminder email successfully dispatched to ${to}`,
      email: emailEntry,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to dispatch email' });
  }
});

// Retrieve dispatched emails for a patient
app.get('/api/reminders/inbox', (req: Request, res: Response) => {
  const email = req.query.email as string;
  if (!email) {
    return res.json({ emails: sentEmailsDb });
  }
  const filtered = sentEmailsDb.filter(
    (e) => e.to.toLowerCase() === email.toLowerCase()
  );
  return res.json({ emails: filtered });
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`PhysioCare Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

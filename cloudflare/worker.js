import { Document } from '@langchain/core/documents';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';

const PROFILE_DOCS = [
  {
    source: 'profile',
    content:
      'Sarika S Shirolkar. Software Engineer focused on AI Agents, ML Systems, and Cloud Applications. Location: Bengaluru, India.'
  },
  {
    source: 'education',
    content:
      'B.E (CSE - AI & ML), VTU - Sai Vidya Institute of Technology. CGPA 9.1. Graduation year 2026.'
  },
  {
    source: 'experience',
    content:
      'Software Engineer (AI Agents & ML Systems), AI Workflow Automation, Oct 2025 to Present. Built AI voice scheduling workflows using Retell AI, n8n, and Google Calendar. Built Python data services, automated scraping + SQL pipelines, and delivered end-to-end ML execution.'
  },
  {
    source: 'experience',
    content:
      'Software Engineer (Cloud Applications), AI Workflow Automation, Mar 2025 to Sep 2025. Deployed backend services on Azure Linux VMs and improved development velocity with AI-assisted development and deployment reliability practices.'
  },
  {
    source: 'experience',
    content:
      'AI & ML Intern, Bharat Electronics Limited, Jul 2025 to Sep 2025. Built and evaluated deep learning computer vision systems with preprocessing, training, validation, and error analysis.'
  },
  {
    source: 'experience',
    content:
      "Project Intern, IEEE IAMPro'25, Apr 2025 to Sep 2025. Object identification and classification for crime scene imagery."
  },
  {
    source: 'projects',
    content:
      'Key projects: appointo.ai, IBM-Sales-Risk-Prediction-Model, Amazon-Business-Risk-Prediction-Model, retell-calendar-mvp, DAWNVision, Crater-Detection, AI-Research-Agent, Portfolio-Sarika.'
  },
  {
    source: 'skills',
    content:
      'Skills: Python, SQL, Java, C, TensorFlow, Keras, Pandas, NumPy, OpenCV, YOLO, LangChain, Streamlit, Azure, Linux, Windows, macOS, MySQL, MongoDB, Power BI, Tableau.'
  },
  {
    source: 'leadership',
    content:
      'Leadership: First author of an IEEE conference paper. Chair, IEEE CIS SVIT with workshops, hackathons, and peer mentoring.'
  }
];

const NOT_AVAILABLE = 'That is not available in resume/portfolio context.';

const corsHeaders = (origin) => ({
  'Access-Control-Allow-Origin': origin || '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  Vary: 'Origin'
});

let vectorStorePromise;

const getVectorStore = async (env) => {
  if (vectorStorePromise) return vectorStorePromise;

  vectorStorePromise = (async () => {
    const docs = PROFILE_DOCS.map(
      (entry) =>
        new Document({
          pageContent: entry.content,
          metadata: { source: entry.source }
        })
    );

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 350,
      chunkOverlap: 40
    });
    const splitDocs = await splitter.splitDocuments(docs);

    const embeddings = new OpenAIEmbeddings({
      apiKey: env.OPENAI_API_KEY,
      model: env.EMBEDDING_MODEL || 'text-embedding-3-small'
    });

    return MemoryVectorStore.fromDocuments(splitDocs, embeddings);
  })();

  return vectorStorePromise;
};

const formatContext = (documents) =>
  documents
    .map((doc, index) => `[${index + 1}] (${doc.metadata?.source || 'unknown'}) ${doc.pageContent}`)
    .join('\n\n');

const askWithLangChain = async (question, env) => {
  const store = await getVectorStore(env);
  const matches = await store.similaritySearch(question, 4);

  const context = formatContext(matches);
  const prompt = PromptTemplate.fromTemplate(`You are Sarika's professional portfolio assistant.
Use only the context below.
If the answer is missing, respond exactly with: ${NOT_AVAILABLE}
Keep answer concise in 2-4 sentences.
Prefer concrete facts: roles, dates, tools, outcomes.

Context:
{context}

Question:
{question}`);

  const model = new ChatOpenAI({
    apiKey: env.OPENAI_API_KEY,
    model: env.OPENAI_MODEL || 'gpt-5-mini',
    temperature: 0,
    maxTokens: 260
  });

  const chain = prompt.pipe(model).pipe(new StringOutputParser());
  const answer = (await chain.invoke({ context, question })).trim();

  const sources = Array.from(new Set(matches.map((item) => item.metadata?.source).filter(Boolean)));
  return {
    answer: answer || NOT_AVAILABLE,
    sources
  };
};

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin');
    const allowedOrigin = env.ALLOWED_ORIGIN || '*';
    const canAllowOrigin = allowedOrigin === '*' || origin === allowedOrigin;
    const headers = corsHeaders(canAllowOrigin ? (origin || '*') : allowedOrigin);
    const jsonHeaders = { ...headers, 'Content-Type': 'application/json' };
    const pathname = new URL(request.url).pathname;

    const jsonResponse = (payload, status = 200) =>
      new Response(JSON.stringify(payload), {
        status,
        headers: jsonHeaders
      });

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers });
    }

    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed' }, 405);
    }

    if (pathname === '/contact') {
      try {
        const body = await request.json();
        const name = String(body?.name || '').trim();
        const message = String(body?.message || '').trim();

        if (!name || !message) {
          return jsonResponse({ error: 'Name and message are required' }, 400);
        }

        if (name.length > 120 || message.length > 1500) {
          return jsonResponse({ error: 'Input too long' }, 400);
        }

        if (!env.RESEND_API_KEY) {
          return jsonResponse({ error: 'Email service not configured' }, 503);
        }

        const fromEmail = env.CONTACT_FROM_EMAIL || 'sarikasharada123@gmail.com';
        const toEmail = env.CONTACT_TO_EMAIL || 'sarikashirolkar@gmail.com';
        const subject = `New portfolio contact query from ${name}`;
        const text = `New message from your portfolio contact panel.\n\nName: ${name}\n\nMessage:\n${message}`;

        const emailResp = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${env.RESEND_API_KEY}`
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [toEmail],
            subject,
            text,
            reply_to: fromEmail
          })
        });

        if (!emailResp.ok) {
          const errorText = await emailResp.text();
          return jsonResponse({ error: 'Email request failed', details: errorText }, 502);
        }

        return jsonResponse({ ok: true });
      } catch (error) {
        return jsonResponse({ error: 'Contact server error', details: String(error) }, 500);
      }
    }

    try {
      if (!env.OPENAI_API_KEY) {
        return jsonResponse({ error: 'OPENAI_API_KEY is not configured' }, 503);
      }

      const body = await request.json();
      const question = String(body?.question || '').trim();

      if (!question) {
        return jsonResponse({ error: 'Question is required' }, 400);
      }

      if (question.length > 500) {
        return jsonResponse({ error: 'Question too long' }, 400);
      }

      const result = await askWithLangChain(question, env);
      return jsonResponse(result);
    } catch (error) {
      return jsonResponse({ error: 'Server error', details: String(error) }, 500);
    }
  }
};

const RESUME_CONTEXT = `
Name: Sarika S Shirolkar
Role: Software Engineer (AI Agents, ML Systems, Cloud Applications)
Location: Bengaluru, India

Experience:
- Software Engineer (AI Agents & ML Systems), AI Workflow Automation (Oct 2025 - Present): Built AI voice scheduling workflows with Retell AI, n8n, Google Calendar; Python data services; automated scraping + SQL pipelines; end-to-end ML execution and delivery.
- Software Engineer (Cloud Applications), AI Workflow Automation (Mar 2025 - Sep 2025): Deployed backend services on Azure Linux VMs, improved velocity with AI-assisted development, standardized deployment and reliability practices.
- AI & ML Intern, Bharat Electronics Limited (Jul 2025 - Sep 2025): Built/evaluated deep learning computer vision systems; preprocessing, training, validation, error analysis.
- Project Intern, IEEE IAMPro'25 (Apr 2025 - Sep 2025): Object identification and classification for crime scene imagery.

Projects:
- appointo.ai
- IBM-Sales-Risk-Prediction-Model
- Amazon-Business-Risk-Prediction-Model
- retell-calendar-mvp
- DAWNVision
- Crater-Detection
- AI-Research-Agent
- Portfolio-Sarika

Skills:
Python, SQL, Java, C, TensorFlow, Keras, Pandas, NumPy, OpenCV, YOLO, LangChain, Streamlit, Azure, Linux, Windows, macOS, MySQL, MongoDB, Power BI, Tableau.

Important truthfulness rule:
- If information is not present above, reply that it is not available in resume/portfolio context.
- Hobbies are not listed in the resume context.
`;

const corsHeaders = (origin) => ({
  'Access-Control-Allow-Origin': origin || '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Vary': 'Origin'
});

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
      const body = await request.json();
      const question = String(body?.question || '').trim();

      if (!question) {
        return jsonResponse({ error: 'Question is required' }, 400);
      }

      if (question.length > 500) {
        return jsonResponse({ error: 'Question too long' }, 400);
      }

      const model = env.OPENAI_MODEL || 'gpt-5-mini';
      const openaiResp = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model,
          max_output_tokens: 220,
          input: [
            {
              role: 'system',
              content:
                'You are Sarika\'s professional portfolio assistant. Answer concisely using ONLY resume/portfolio context. Do not hallucinate. If unknown, say it is not available in resume/portfolio context.'
            },
            {
              role: 'system',
              content: RESUME_CONTEXT
            },
            {
              role: 'user',
              content: question
            }
          ]
        })
      });

      if (!openaiResp.ok) {
        const errorText = await openaiResp.text();
        return jsonResponse({ error: 'OpenAI request failed', details: errorText }, 502);
      }

      const data = await openaiResp.json();
      const answer = (data.output_text || '').trim();

      return jsonResponse({
        answer: answer || 'I could not find that in the resume/portfolio context.'
      });
    } catch (error) {
      return jsonResponse({ error: 'Server error', details: String(error) }, 500);
    }
  }
};

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

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }

    try {
      const body = await request.json();
      const question = String(body?.question || '').trim();

      if (!question) {
        return new Response(JSON.stringify({ error: 'Question is required' }), {
          status: 400,
          headers: { ...headers, 'Content-Type': 'application/json' }
        });
      }

      if (question.length > 500) {
        return new Response(JSON.stringify({ error: 'Question too long' }), {
          status: 400,
          headers: { ...headers, 'Content-Type': 'application/json' }
        });
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
        return new Response(JSON.stringify({ error: 'OpenAI request failed', details: errorText }), {
          status: 502,
          headers: { ...headers, 'Content-Type': 'application/json' }
        });
      }

      const data = await openaiResp.json();
      const answer = (data.output_text || '').trim();

      return new Response(
        JSON.stringify({
          answer: answer || 'I could not find that in the resume/portfolio context.'
        }),
        {
          status: 200,
          headers: { ...headers, 'Content-Type': 'application/json' }
        }
      );
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Server error', details: String(error) }), {
        status: 500,
        headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }
  }
};

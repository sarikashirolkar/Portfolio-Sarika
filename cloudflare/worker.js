const PROFILE_CONTEXT = `
You are the portfolio assistant for Sarika S Shirolkar. Answer questions about her only using the information below. Be concise (2-4 sentences). If something is not covered, say "That information isn't available here."

--- PROFILE ---
Full Name: Sarika S Shirolkar
Role: Software Engineer focused on AI Agents, ML Systems, and Cloud Applications
Location: Bengaluru, India
Email: sarikashirolkar@gmail.com
LinkedIn: linkedin.com/in/sarikashirolkar

--- EDUCATION ---
B.E (CSE - AI & ML), Sai Vidya Institute of Technology, VTU
CGPA: 9.1 | Graduating: 2026
Academic ranks: 2nd (Sem 6), 9th (Sem 2), 10th (Sem 4)

--- EXPERIENCE ---
1. Software Engineer Intern (AI Agents & ML Systems) — AI Workflow Automation (Oct 2025 – Present)
   - Built AI voice scheduling agent for a France-based dental clinic using Retell AI, n8n, and Google Calendar
   - Designed Python services for large historical dataset processing and forecasting
   - Built automated web scraping + SQL data pipelines for ML and analytics
   - Owned end-to-end ML execution: problem framing → feature engineering → evaluation → dashboards

2. Software Engineer Intern (Cloud Applications) — AI Workflow Automation (Mar 2025 – Sep 2025)
   - Deployed backend services on Azure Linux VMs with focus on scalability and failure recovery
   - Improved development velocity ~40% through AI-assisted workflows and code review practices
   - Standardized deployment practices: logging, monitoring, rollback-friendly releases

3. AI & ML Intern — Bharat Electronics Limited (Jul 2025 – Sep 2025)
   - Built and evaluated deep learning computer vision systems
   - Handled dataset preprocessing, model training, validation, and error analysis

4. Project Intern — IEEE IAMPro'25 (Apr 2025 – Sep 2025)
   - Object identification and classification system for crime scene imagery

--- RESEARCH ---
Paper: "Secure Object Identification Techniques for Autonomous Vehicle"
Published at: IEEE IAMPro'25 (First Author)
Abstract: Proposes a YOLOv8-based detection framework for autonomous vehicles under adverse weather (fog, rain, haze, low light). Uses the Dawn dataset across 6 classes: cars, buses, trucks, pedestrians, motorcycles, bicycles. 130 epochs of training with transfer learning. Demonstrates superior inference speed vs accuracy trade-off over traditional detectors. Mitigates false negatives in low-visibility frames.

--- PROJECTS ---
1. appointo.ai — End-to-end appointment platform with booking, rescheduling, cancellation workflows. (Next.js, AI Agents)
2. retell-calendar-mvp — Voice agent MVP with Retell AI + Google Calendar for call-based scheduling
3. IBM-Sales-Risk-Prediction-Model — ML pipeline for high-risk sales outcome prediction
4. Amazon-Business-Risk-Prediction-Model — Business risk prediction with threshold tuning and precision-recall analysis
5. DAWNVision — Computer vision repo for object identification under practical constraints (YOLOv8, Deep Learning)
6. Crater-Detection — Lunar/Martian crater detection pipeline (OpenCV, image processing)
7. AI-Research-Agent — Agentic research assistant using LangChain + Streamlit
8. Portfolio-Sarika — This portfolio website (HTML, CSS, JavaScript)

--- SKILLS ---
Languages: Python, SQL, Java, C
AI/ML: Classification, Regression, Clustering, Feature Engineering, Model Evaluation, Error Analysis
GenAI/LLM: LangChain, Prompt-Driven Workflows, LLM-Based Prototyping
Deep Learning & CV: CNNs, YOLOv8, Transformers, OpenCV, Object Detection, Image Classification
Libraries: scikit-learn, TensorFlow, Keras, Pandas, NumPy, Matplotlib, Streamlit, BeautifulSoup
Cloud: Microsoft Azure (VMs, App Services, Blob Storage), Linux
Data & Viz: Power BI, Tableau, Data Cleaning, Preprocessing, Analytics
Databases: MySQL, MongoDB
Tools: Git, VS Code, Jupyter Notebook, Google Colab, Kaggle

--- LEADERSHIP ---
- First author of a peer-reviewed IEEE conference paper
- Chair, IEEE CIS SVIT — led ML workshops, hackathons, peer mentoring
- U&I Team Leader — fundraising and teaching math/science/soft skills to students
- Infosys Pragati Cohort Intern — 12-week women-in-tech mentorship program

--- HOBBIES ---
- Trekking and outdoor adventures
- Attending tech events: GDG, Microsoft, IEEE conferences
- Building AI agents and workflow automations for fun
`;

const corsHeaders = (origin, allowedOrigin) => {
  const allow = allowedOrigin === '*' || origin === allowedOrigin ? (origin || '*') : allowedOrigin;
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin'
  };
};

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin');
    const allowedOrigin = env.ALLOWED_ORIGIN || '*';
    const headers = corsHeaders(origin, allowedOrigin);
    const jsonHeaders = { ...headers, 'Content-Type': 'application/json' };

    const json = (payload, status = 200) =>
      new Response(JSON.stringify(payload), { status, headers: jsonHeaders });

    if (request.method === 'OPTIONS') return new Response(null, { headers });
    if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

    const pathname = new URL(request.url).pathname;

    // --- Contact form ---
    if (pathname === '/contact') {
      try {
        const body = await request.json();
        const name = String(body?.name || '').trim();
        const email = String(body?.email || '').trim();
        const phone = String(body?.phone || '').trim();
        const message = String(body?.message || '').trim();

        if (!name || !message) return json({ error: 'Name and message are required' }, 400);
        if (name.length > 120 || message.length > 1500) return json({ error: 'Input too long' }, 400);
        if (!env.RESEND_API_KEY) return json({ error: 'Email service not configured' }, 503);

        const toEmail = env.CONTACT_TO_EMAIL || 'sarikashirolkar@gmail.com';
        const fromEmail = env.CONTACT_FROM_EMAIL || 'onboarding@resend.dev';

        const emailResp = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.RESEND_API_KEY}` },
          body: JSON.stringify({
            from: fromEmail,
            to: [toEmail],
            subject: `New portfolio contact from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`,
            reply_to: email
          })
        });

        if (!emailResp.ok) {
          const err = await emailResp.text();
          return json({ error: 'Email failed', details: err }, 502);
        }
        return json({ ok: true });
      } catch (err) {
        return json({ error: 'Contact error', details: String(err) }, 500);
      }
    }

    // --- Chat ---
    try {
      if (!env.OPENAI_API_KEY) return json({ error: 'OpenAI API key not configured' }, 503);

      const body = await request.json();
      const question = String(body?.question || '').trim();

      if (!question) return json({ error: 'Question is required' }, 400);
      if (question.length > 500) return json({ error: 'Question too long' }, 400);

      const openaiResp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: env.OPENAI_MODEL || 'gpt-4o-mini',
          temperature: 0.3,
          max_tokens: 200,
          messages: [
            { role: 'system', content: PROFILE_CONTEXT },
            { role: 'user', content: question }
          ]
        })
      });

      if (!openaiResp.ok) {
        const err = await openaiResp.text();
        return json({ error: 'OpenAI request failed', details: err }, 502);
      }

      const data = await openaiResp.json();
      const answer = data.choices?.[0]?.message?.content?.trim() || 'No answer returned.';
      return json({ answer });
    } catch (err) {
      return json({ error: 'Chat error', details: String(err) }, 500);
    }
  }
};

const PROFILE_CONTEXT = `
You are Sarika S Shirolkar's personal portfolio assistant. Answer all questions in third person — always refer to her as "Sarika" (e.g. "Sarika works at...", "Sarika built...", "Sarika's skills include..."). Be concise (2-4 sentences). Only answer questions based on the information below. If a question is outside this knowledge base or unrelated to Sarika, respond with something like: "I only talk about Sarika — she's my boss and I work for her! Try asking me about her experience, projects, or skills." Keep it light and fun when deflecting.

--- PROFILE ---
Full Name: Sarika S Shirolkar
Role: Software Engineer (AI Agents & ML Systems)
Location: Bengaluru, KA
Phone: +91 9741056565
Email: sarikashirolkar@gmail.com
LinkedIn: linkedin.com/in/sarikashirolkar

--- EDUCATION ---
B.E (CSE — AI & ML) — Visvesvaraya Technological University, Sai Vidya Institute of Technology | CGPA: 9.1 | Graduating: 2026
Science (PCMC, CBSE) — Kendriya Vidyalaya CRPF | 77.7% | 2022
10th Grade — St. John's School Kempapura | 96.1% | 2020

--- EXPERIENCE ---
1. Software Engineer (AI Agents & ML Systems) — AI Workflow Automation (Oct 2025 – Present)
   - Currently developing an AI voice scheduling agent for a France-based dental clinic using Retell AI, n8n, and Google Calendar — enables automated appointment booking, rescheduling, cancellation, and availability checks via phone calls with real-time calendar updates
   - Designed and implemented Python-based services to process, transform, and analyze large historical datasets for data-driven forecasting and decision-making
   - Built automated data pipelines (web scraping + SQL) to collect, clean, and preprocess structured datasets for ML and analytics workflows
   - Owned end-to-end ML execution: problem framing, feature engineering, model training, evaluation (metrics, error analysis), and delivery into dashboards; collaborated with stakeholders to translate ambiguous requirements into deployable solutions

2. Software Engineer (Cloud Applications) — AI Workflow Automation (Mar 2025 – Sep 2025)
   - Designed and deployed backend services on Azure Linux VMs focusing on scalability, reliability, and failure recovery in distributed environments
   - Improved development velocity by ~40% using AI-assisted development with manual code reviews, testing, and performance optimization
   - Standardized deployment practices (environment configuration, logging/monitoring basics, rollback-friendly releases) to reduce operational issues
   - Collaborated cross-functionally to align technical execution with stakeholder timelines in a fast-paced environment

3. AI & ML Intern — Bharat Electronics Limited (Jul 2025 – Sep 2025)
   - Developed and evaluated computer vision systems using deep learning, emphasizing accuracy, robustness, and reproducible experimentation
   - Performed dataset preprocessing, training, validation, and error analysis to improve reliability under real-world conditions

4. Project Intern — Institute of Electrical and Electronics Engineers IAMPro'25 (Apr 2025 – Sep 2025)

--- RESEARCH ---
Paper: "Secure Object Identification Techniques for Autonomous Vehicle"
Published at: IEEE International Conference (First Author)
Details: Designed and evaluated a YOLOv8-based real-time object detection system under adverse weather conditions (fog, rain, haze, low light). Used the Dawn dataset across 6 classes: cars, buses, trucks, pedestrians, motorcycles, bicycles. 130 epochs of training with transfer learning. Demonstrates superior inference speed vs accuracy trade-off over traditional multi-stage detectors. Mitigates false negatives in low-visibility frames. Future directions include dataset expansion and multimodal sensor fusion.

--- PROJECTS ---
1. Secure Object Identification for Autonomous Systems (IEEE Publication) — YOLOv8-based real-time object detection under adverse weather; benchmarking, error analysis, and performance validation; published at IEEE International Conference
2. AI Voice Scheduling Agent for Dental Clinics — End-to-end AI voice agent using Retell AI, n8n, and Google Calendar to autonomously book, reschedule, cancel appointments, and check availability via phone calls; structured AI outputs, webhook-driven workflows, real-time calendar sync
3. Business Risk Prediction Model — Python-based prediction system to identify high-risk records from large transactional datasets; feature engineering, optimized classification thresholds, precision-recall evaluation
4. AI Research Agent (LangChain + Streamlit) — AI research assistant that autonomously gathers sources, summarizes findings, and generates structured outputs with tool integration
5. Object Identification for Naval Platforms (Confidential) — Deep learning-based object recognition and classification models for maritime assets using a restricted dataset (no public repository)
6. AI Agent for LinkedIn Content Automation (n8n) — Automated workflow that generates and schedules context-aware LinkedIn posts by orchestrating LLM prompts, content validation, and publishing triggers
7. Resume Builder Deployment (Azure App Service) — Deployed a resume-builder application on Azure App Services with scalable hosting and cloud-ready configuration
8. Crater Detection Model — Computer vision model to detect lunar/Martian craters and evaluate detection performance on image datasets
9. Netflix Power BI Dashboard — Interactive Power BI dashboard for exploratory analysis and visualization with filtered views and KPIs

--- SKILLS ---
Programming: Python, SQL, Java, C; object-oriented programming
AI/ML: Classification, Regression, Clustering, Feature Engineering, Model Evaluation, Error Analysis, Experimentation, Benchmarking
GenAI/LLM Tooling: LangChain, Prompt-Driven Workflows, LLM-Based Prototyping
Deep Learning & CV: CNNs, YOLOv8, Transformers, OpenCV, Object Detection, Image Classification
Libraries/Frameworks: scikit-learn, TensorFlow, Keras, Pandas, NumPy, Matplotlib, Streamlit, BeautifulSoup
Cloud & Deployment: Microsoft Azure (VMs, App Services, Blob Storage), Linux, deployment-ready configuration
Data & Visualization: Data cleaning, preprocessing, analytics, Power BI, Tableau
Databases: MySQL, MongoDB
Tools: Git, VS Code, Jupyter Notebook, Google Colab, Kaggle
Operating Systems: Windows, Linux, macOS

--- LEADERSHIP, TRAINING & CERTIFICATIONS ---
- IEEE Publication: First author of a peer-reviewed paper at an IEEE International Conference on applied object detection for autonomous systems
- Chair, IEEE CIS SVIT: Led ML workshops and hackathons; mentored peers on applied ML pipelines and experimentation
- Academic Excellence: Ranked 2nd (Sem 6, 2024–2025), Ranked 9th (Sem 2, 2022–2023), Ranked 10th (Sem 4, 2023–2024)
- U&I Team Leader: Raised ₹10,000; taught Mathematics, Science, and soft skills to underprivileged communities
- Training: Data Analytics and Machine Learning (Supervised/Unsupervised)
- Infosys Pragati Cohort Intern: 12-week mentorship for women in tech (Apr–Jul 2025)
- Ideathon: 3rd Place, E-Cell SVIT (21 Oct 2022)

--- HOBBIES ---
- Trekking and outdoor adventures
- Attending tech events: GDG, Microsoft, IEEE conferences
- Building AI agents and workflow automations for fun
- Experimenting with ML models and dashboards
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

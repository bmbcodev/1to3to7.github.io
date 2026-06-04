export const knowledgeBase: Record<string, string> = {
  "who is bizimana fils": `BIZIMANA FILS is a Rwandan innovator, founder of BIA CO (Bizimana Idea Agency Company), 
    based in Kigali, Rwanda. He is an Electric Vehicle Technician, AI Prompt Engineer, Web Developer, and 
    Automotive Technology Consultant. He holds an A2 Certificate in Automobile Technology from 
    Ecole Technique de Kabgayi. His slogan is "Bwangu Nk'Intore". Contact: +250 783 444 370, bmbcodev@gmail.com.`,

  "what is bia co": `BIA CO stands for Bizimana Idea Agency Company. It is the brand and agency founded by 
    BIZIMANA FILS. The company focuses on electric vehicle technology, AI solutions, web development, 
    and technology research. Based in Kigali, Rwanda. Slogan: "Bwangu Nk'Intore".`,

  "what are your skills": `BIZIMANA FILS has expertise in: Electric Vehicle Diagnostics (95%), 
    Vehicle Diagnostics (90%), AI Prompt Engineering (85%), Web Development (80%), 
    Automotive Repair (90%), and Technology Research (85%).`,

  "services": `BIA CO offers these services:
    1. Electric Vehicle Diagnostics & Repair — battery health, motor control systems
    2. AI Prompt Engineering & Automation — workflow automation, intelligent systems
    3. Web Development & UI Design — full-stack, responsive, modern frameworks
    4. Automotive Technology Consulting — diagnostics, telematics, EV integration
    5. Technology Research & Innovation — feasibility studies, innovation strategy`,

  "contact": `You can reach BIZIMANA FILS via:
    📞 Phone: +250 783 444 370 / +250 795 914 094
    📧 Email: bmbcodev@gmail.com
    📍 Location: Kigali, Rwanda
    Also find him on LinkedIn, Instagram, X, TikTok, Threads, Twitch, and ORCID.`,

  "location": `BIZIMANA FILS is based in Kigali, Rwanda.`,

  "education": `BIZIMANA FILS studied at Ecole Technique de Kabgayi, earning an A2 Certificate in Automobile Technology.`,

  "slogan": `The slogan of BIA CO is "Bwangu Nk'Intore". It represents excellence and speed in the Rwandan cultural context.`,

  "projects": `BIA CO has worked on various projects in Electric Vehicle technology, AI, Web Development, 
    and Automotive innovation. You can view them on the Projects page of this website.`,

  "social media": `BIZIMANA FILS is active on:
    • LinkedIn: https://www.linkedin.com/in/bizimana-fils-fils-8b94883b9
    • Instagram: https://www.instagram.com/1to3to7
    • X (Twitter): https://x.com/1to3to7
    • TikTok: https://tiktok.com/@1to3to7
    • Threads: https://www.threads.com/@1to3to7
    • Twitch: https://www.twitch.tv/1to3to7
    • ORCID: https://orcid.org/0009-0006-4474-9648`,

  "what is bwangu nk intore": `"Bwangu Nk'Intore" is the slogan of BIA CO. It is a Rwandan/Kinyarwanda phrase 
    that conveys excellence, speed, and warrior spirit — inspired by the "Intore" (warrior) tradition in Rwandan culture.`,

  "phone number": `📞 +250 783 444 370 / +250 795 914 094`,
  "email address": `📧 bmbcodev@gmail.com`,

  "what is this website": `This is the official portfolio website of BIZIMANA FILS / BIA CO. Built with Next.js 15, 
    Tailwind CSS, and Supabase. Features include: project showcase, file downloads, contact form, 
    blog/services info, and a founder dashboard. The AI Assistant helps you navigate the site.`,

  "how to use translator": `Go to the Translate tab in this AI Assistant panel. Type/paste text in the input box, 
    select target language from 190+ languages, and click Translate. You can also enable auto-detect 
    for the source language. Use the copy button to copy the translated text.`,

  "default": `I'm the BIA CO AI Assistant, trained with knowledge about BIZIMANA FILS and BIA CO. 
    I can answer questions about skills, services, projects, contact info, education, social media, 
    and more. Try asking: "Who is BIZIMANA FILS?", "What are your services?", "Contact info", etc. 
    I also have a built-in translator — use the Translate tab to translate text between 190+ languages!`,
};

export function findAnswer(query: string): string {
  const q = query.toLowerCase().trim();

  if (/^(hi|hello|hey|good morning|good evening|greetings|yo|sup|howdy)/.test(q)) {
    return `Hello! I'm the BIA CO AI Assistant. How can I help you today? Ask me about BIZIMANA FILS, BIA CO services, projects, or use the Translate tab to translate text between 190+ languages!`;
  }

  if (/how are you|how are things|whats up|what's up/i.test(q)) {
    return `I'm doing great, thanks for asking! I'm here to help you learn about BIA CO and BIZIMANA FILS. What would you like to know?`;
  }

  if (/thank|thanks|appreciate|thx/i.test(q)) {
    return `You're welcome! BIA CO is always here to help. Bwangu Nk'Intore! Feel free to ask anything else.`;
  }

  if (/bye|goodbye|see you|see ya|cya/i.test(q)) {
    return `Goodbye! Come back anytime. BIA CO is always here for you. Bwangu Nk'Intore!`;
  }

  if (/help|what can you do|capabilities/i.test(q)) {
    return `I can answer questions about BIZIMANA FILS, BIA CO services, projects, skills, education, contact info, social media, and more. I also have a built-in translator for 190+ languages! Just type your question or switch to the Translate tab.`;
  }

  if (/who are you|your name|what are you/i.test(q)) {
    return `I'm the BIA CO AI Assistant — your guide to everything about BIZIMANA FILS and BIA CO. I can answer questions and help translate text between 190+ languages. How can I help?`;
  }

  if (/translate|translator|language/i.test(q)) {
    return `To use the translator, switch to the Translate tab (click the Translate button at the top of this panel). Type your text, choose your target language from 190+ options, and click Translate. The source language can be auto-detected!`;
  }

  const keys = Object.keys(knowledgeBase).filter((k) => k !== "default");
  const scored: { key: string; score: number }[] = [];

  for (const key of keys) {
    const keywords = key.toLowerCase().split(" ");
    let score = 0;
    for (const kw of keywords) {
      if (q.includes(kw)) score += 2;
    }
    const words = key.toLowerCase().split(/\s+/);
    for (const w of words) {
      if (q.split(/\s+/).some((qw) => qw.includes(w) || w.includes(qw))) score += 1;
    }
    if (score > 0) scored.push({ key, score });
  }

  scored.sort((a, b) => b.score - a.score);
  if (scored.length > 0 && scored[0].score >= 2) {
    return knowledgeBase[scored[0].key];
  }

  return knowledgeBase["default"];
}

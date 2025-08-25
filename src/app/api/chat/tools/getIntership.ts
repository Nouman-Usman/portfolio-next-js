import { tool } from 'ai';
import { z } from 'zod';

export const getInternship = tool({
  description:
    "Gives a summary of what kind of internship I'm looking for, plus my contact info and how to reach me. Use this tool when the user asks about my internship search or how to contact me for opportunities.",
  parameters: z.object({}),
  execute: async () => {
    return `Here’s what I’m looking for 👇

- 📅 **Duration**: 3–6 month internship starting **September 2025**
- 🌍 **Location**: Open to **Lahore**, **remote**, or international opportunities (US/EU/Canada preferred)
- 🧑‍💻 **Focus**: Generative AI, SaaS platforms, agentic workflows, full-stack development
- 🛠️ **Stack**: Python, Next.js, React, Tailwind CSS, TypeScript, LangChain, RAG pipelines, cloud (Azure/GCP)
- 💼 **What I bring**: Hands-on experience as an **AI Engineer (UC Irvine)**, **Generative AI Intern (Xavor)**, SaaS builder (EcoBarter AI, Legal Case Management, Virtual Shark Tank PK), and **Teaching Assistant** debugging 200+ real-world projects
- 🚀 I move fast, debug smarter, and thrive in building AI-driven products

📬 **Contact me** via:
- Email: 2022cs49@student.uet.edu.pk
- LinkedIn: [linkedin.com/in/nouman-usman](https://linkedin.com/in/nouman-usman/)
- GitHub: [github.com/Nouman-Usman](https://github.com/Nouman-Usman)

Let’s build something impactful together ✌️
    `;
  },
});

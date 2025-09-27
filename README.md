# 🪶 Codenest

Codenest is your AI-powered coding nest—where prompts hatch into production-ready code. Built for developers who want clean, modular, and well-commented code with cinematic precision. Powered by OpenRouter and GPT-3.5, Codenest turns natural language into elegant software.

🔗 Live Demo: [codenests.netlify.app](https://codenests.netlify.app/)  
🔗 Alt UI: [codenest-red.vercel.app](https://codenest-red.vercel.app/)

---

## ✨ Features

- 🧠 Prompt-to-code generation with language-specific best practices
- 📚 Code explanation engine for educational breakdowns
- 🛠️ Modular API service with error handling and markdown parsing
- 🎬 Cinematic system prompts for style, clarity, and maintainability

---

## 🚀 How It Works

Codenest sends structured prompts to OpenRouter’s GPT-3.5 model, guiding it to generate clean, idiomatic code. It extracts code from markdown blocks and returns both the code and its explanation.

```ts
const request = {
  prompt: "Build a REST API for user authentication",
  language: "TypeScript",
  context: "Using Express and JWT"
};

const { code, explanation } = await APIService.generateCode(request);
```

---

## 🧩 APIService Highlights

- `generateCode(request: GenerateCodeRequest)`  
  → Returns clean code + optional explanation

- `explainCode(code: string, language: string)`  
  → Breaks down logic and concepts for learning

- Built-in system prompts ensure:
  - Modular structure
  - Helpful comments
  - Error handling
  - Style consistency

---

## 🛡️ Tech Stack

- TypeScript
- OpenRouter API
- GPT-3.5-turbo
- Modular service architecture

---

## 🐣 Getting Started

1. Clone the repo  
   `git clone https://github.com/ved1rajderkar/codenest.git`

2. Install dependencies  
   `npm install`

3. Add your OpenRouter API key in `src/apiService.ts`  
   _Note: Keep your key secure and avoid committing it._

4. Start coding with prompts!

---

## 🧠 Philosophy

Codenest isn’t just a tool—it’s a vibe. It’s for devs who want their code to feel alive, readable, and cinematic. Whether you're building bots, games, or branded CLIs, Codenest helps you nest your ideas in clean code.

---

## 📜 License

MIT

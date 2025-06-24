# TCC - AI-Assisted Test Generation for React Components

This repository contains the full code, prompts, and test results for a research project that evaluates the use of artificial intelligence tools to automatically generate unit tests for React components.

## 📘 Project Overview

This study compares two AI tools — **GitHub Copilot** and **Windsurf** — in the automated generation of unit tests, focusing on:

- ✅ Test coverage
- ⚙️ Efficiency of the development process
- 🔧 Required manual intervention

The study adopts a **quantitative experimental design**, applying **prompt engineering techniques** (Chain of Thought and Self-Reflection) to guide the test generation process.

## 🧪 Key Results

- **Windsurf** achieved a **higher average coverage** (71.60%) but required more manual corrections.
- **Copilot** provided **more predictable and stable tests**, with fewer interventions.
- Both tools offer advantages depending on the development context.

## 🗂️ Repository Structure

```
📁 ai-prompts
│   ├── prompt-test-case-generation.md         → Prompt for generating test scenarios
│   ├── prompt-test-code-generation.md         → Prompt for generating test code
│   ├── prompt-login-component.md              → Prompt for LoginPage component
│   └── prompt-form-component.md               → Prompt for FormPage component
│
📁 react-components-project
│   ├── LoginPage.jsx                          → Login form component
│   ├── FormPage.jsx                           → Generic form component
│   ├── package.json                           → Project dependencies
│   └── README.md                              → Component usage and setup
│
📁 test-results
│   ├── copilot-test-results.xlsx              → Results from GitHub Copilot
│   ├── windsurf-test-results.xlsx             → Results from Windsurf
│   └── summary.xlsx                           → Aggregated comparison data
│
📄 README.md                                    → Main project description and usage
```

Each folder includes its own `README.md` with additional context.

## ▶️ How to Use

1. Clone the repository:
   ```bash
   git clone https://github.com/rafauniville/TCC-2025.git
   cd TCC-2025
   ```

2. Install dependencies (inside `react-components-project`):
   ```bash
   cd react-components-project
   npm install
   ```

3. Run tests (if configured):
   ```bash
   npm run test
   ```

> 💡 Tests were generated using [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) and [Vitest](https://vitest.dev/), as required by the research design.

## 📊 Evaluation Data

All test execution results are available in the `test-results` folder, including:

- Test coverage by case
- Number of generations
- Manual interventions
- Final success rate

## 📄 License

This project is part of an undergraduate thesis (TCC) and is made available for academic and educational purposes only.

---

**Author:** Rafael Lima da Silva
**Institution:** Universidade da Região de Joinville – Univille  
**Year:** 2025

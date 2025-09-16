# HealthBot

HealthBot is an AI-powered symptom checker designed to provide potential health insights based on the symptoms you describe. Built with Next.js, Genkit, and Firebase, this application offers a conversational interface for users to describe their symptoms and receive an analysis of possible conditions.

## Features

- **AI Symptom Analysis:** Leverages generative AI to analyze user-provided symptoms and suggest potential medical conditions.
- **Interactive Chat Interface:** A user-friendly chat allows for a natural conversation to describe health concerns.
- **Detailed Reasoning:** The AI provides reasoning behind its suggestions to help users understand the potential connections.
- **Important Recommendations:** Includes clear recommendations for users to seek professional medical advice.
- **Dark/Light Mode:** A theme toggle for user preference.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) with App Router
- **AI:** [Genkit](https://firebase.google.com/docs/genkit)
- **UI:** [ShadCN UI](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/)
- **Deployment:** Firebase App Hosting

## Getting Started

To get started with the project:

1.  Install dependencies: `npm install`
2.  Set up your environment variables in a `.env` file, specifically your `GEMINI_API_KEY`.
3.  Run the development server: `npm run dev`

You can start by exploring the main application page at `src/app/page.tsx`.

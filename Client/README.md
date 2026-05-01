# Electra: Election Process Education Platform

Electra is an immersive, non-partisan educational portal designed for the 2026 Tamil Nadu Legislative Assembly election cycle. It empowers citizens through data transparency, neutral information, and conversational AI.

## Chosen Vertical
**Election Process Education**

## Approach and Logic
Electra adopts a multi-modal approach to civic education, focusing on four primary interaction pillars:

1.  **Electra AI (Conversational Intelligence)**: A smart assistant powered by **Google Gemini 2.0 Flash**. It provides neutral, non-partisan answers to complex democratic questions, grounded in official ECI (Election Commission of India) data patterns.
2.  **Constituency Explorer (Live Data Engine)**: A robust search interface that uses a Node.js backend to scrape and cache authentic candidate information from ADR/MyNeta. It provides real-world transparency into who is contesting in every constituency.
3.  **The Odyssey (Interactive Timeline)**: A visual roadmap of the election cycle, helping users understand key milestones from nomination filing to the announcement of results.
4.  **Voter Mode (Procedural Walkthrough)**: A step-by-step interactive guide for first-time voters, covering everything from eligibility checks to the secret ballot process at the polling station.

## How the Solution Works
- **Frontend**: Built with React and Tailwind CSS, utilizing Framer Motion for premium, accessible animations and Luide-react for clear iconography.
- **Backend**: A Node.js/Express server handles API requests, orchestrates live data scraping, and integrates with the **Google Generative AI SDK**.
- **Data Integrity**: The system prioritizes verified sources (ECI, MyNeta) and uses local caching to ensure high performance and reliability during peak traffic.

## Assumptions Made
- **Data Availability**: It is assumed that MyNeta/ADR remains the primary reliable source for structured candidate affidavits during the 2026 cycle.
- **Connectivity**: The application assumes active internet connectivity for real-time AI responses and live candidate lookups.
- **Neutrality**: All AI prompts are engineered to enforce strict neutrality, avoiding political bias in accordance with civic education best practices.

## Project Structure
- `/client`: React frontend application.
- `/server`: Node.js backend and data scraping engine.

---
*Built with Google Antigravity and Gemini.*

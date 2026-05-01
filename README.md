# Electra: Election Process Education Platform

Electra is an immersive, non-partisan educational portal designed for the 2026 Tamil Nadu Legislative Assembly election cycle. It empowers citizens through data transparency, neutral information, and conversational AI.

## DEMO Video

https://github.com/user-attachments/assets/3af0bbf6-7545-49d3-baf7-38448db18218

## Chosen Vertical
**Election Process Education**

## 🚀 Latest Premium Features (v2.0)

Electra has been modernized with high-fidelity interactive elements and a professional AI interface:

1.  **Interactive Civic Identity (3D Voter ID)**:
    - Implemented a state-of-the-art 3D model of the Indian Voter ID (EPIC) using **React Three Fiber (R3F)** and **Drei**.
    - Features holographic-style tricolor branding, interactive tilt/rotation, and contextual triggers within the AI chat.

2.  **Smart AI Response Streaming**:
    - Responses now stream character-by-character with **punctuation-aware pacing**, mimicking professional assistants like Google Gemini.
    - Added a **blinking saffron cursor** to provide a real-time "active" feedback loop.

3.  **Premium Gemini-Inspired UI**:
    - A custom "Thinking" animation featuring a **pulsating tricolor halo** and a central Electra "E" logo.
    - Visualizes constitutional data synchronization through shimmering gradients and animated tricolor dots.

4.  **Smart Scroll & Navigation**:
    - **Intelligent Auto-Scroll**: The chat only scrolls to the bottom if the user is already there, allowing unrestricted reading of chat history while the AI types.
    - **Fluid Page Transitions**: Standardized **Framer Motion** transitions across all routes for a seamless, high-end application feel.

## Core Interaction Pillars

- **Electra AI (Conversational Intelligence)**: A smart assistant powered by **Google Gemini 2.0 Flash**. It provides neutral, non-partisan answers grounded in official ECI data patterns.
- **Constituency Explorer (Live Data Engine)**: A robust search interface that uses a Node.js backend to provide real-world transparency into candidate affidavits and MLA roles.
- **The Odyssey (Interactive Timeline)**: A visual roadmap of the election cycle milestones from nomination to results.
- **Voter Mode (Procedural Walkthrough)**: A step-by-step interactive guide for first-time voters, covering everything from registration to the booth.

## 🛠️ Tech Stack
- **Frontend**: React, Tailwind CSS, **React Three Fiber (Three.js)**.
- **Animation**: **Framer Motion** for UI and page transitions.
- **Backend**: Node.js/Express with Google Generative AI SDK.
- **Data**: Scraped and cached candidate information from official sources.

# Disclaimer 
Since we use Gemini API for the AI response, sometimes the server gets failed prompting "Electra is temporarily unavailable due to high demand on Gemini servers".


## Project Structure
- `/client`: React frontend application.
- `/server`: Node.js backend and data scraping engine.

## For Reference Hosted Repo Files
- Client : https://github.com/Hemanth-M2002/Electra-Client
- Server : https://github.com/Hemanth-M2002/Electra-Server
---
*Built for the future of Indian Democracy with Google Gemini.*

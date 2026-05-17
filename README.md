
GM Chess ♟️

A real-time chess coaching marketplace connecting students with Grandmasters for live games, AI-powered analysis, and personalized feedback.


✨ Overview

GM Chess combines competitive chess, live coaching, and AI assistance into a single modern platform.


Students can:

🎓 Find verified Grandmasters

♟️ Play live chess matches

🤖 Receive AI-powered move analysis

💬 Get real-time coaching feedback

Grandmasters can:

🏆 Monetize coaching sessions

📈 Manage availability

💰 Earn virtual coins

🧠 Review and guide players live

🏗️ Architecture

Built using modern full-stack technologies with scalability and real-time performance in mind.

app/                  # App Router pages (marketplace, game, wallet, profile)
features/             # Feature-based modules (auth, game, marketplace, wallet, messages)
components/           # Shared UI components
lib/                  # Supabase client & utilities
types/                # TypeScript interfaces




Browse verified Grandmasters sorted by ELO rating with real-time availability status.

✅ Live availability

🧠 Verified GM profiles

📊 ELO-based ranking

⚡ Instant session joining

♟️ Live Chess


Interactive real-time chess powered by chess.js and react-chessboard.

♜ Legal move validation

🔄 Real-time move synchronization

🎯 Interactive board UI

🧩 FEN state management

🤖 AI Coaching


Stockfish-powered analysis integrated directly into gameplay.

💡 Best move suggestions

📈 Position evaluation

🎯 Depth 12 analysis

✨ Visual coaching overlays

💰 Virtual Economy

A complete coin-based reward system.


Students

🪙 Purchase coins

🎮 Spend coins per game

Grandmasters
💵 Earn coins from coaching sessions

📊 Track completed games

💬 Real-Time Messaging


Instant coaching communication using Supabase Realtime.

⚡ Live feedback

🧠 Coaching annotations

💭 Session messaging

🧑‍🏫 GM Dashboard

Dedicated dashboard for Grandmasters.

🟢 Toggle availability

⏳ View waiting sessions

🎮 Join active games instantly

🔐 Authentication

Secure authentication with Google OAuth.

🔑 Supabase Auth

🌐 OAuth login

🍪 SSR session handling

🌙 Dark Theme



Modern dark UI with amber accents.

🌑 Full dark mode

✨ Smooth UI styling

♿ Accessibility-focused design

🛠️ Tech Stack

Tool	Purpose
Next.js 16 + React 19	Frontend framework (App Router)
TypeScript	Type safety
Supabase	Auth, PostgreSQL database, Realtime
chess.js	Chess move validation & game logic
react-chessboard	Interactive chess board
Stockfish API (chess-api.com)	AI move analysis
TanStack React Query	Server state management
Tailwind CSS v4 + shadcn/ui	Styling & UI components
Vitest + RTL	Testing


⚡ Getting Started
📦 Install dependencies

npm install


🔑 Configure environment variables

Create a .env.local file:

NEXT_PUBLIC_SUPABASE_URL=https://nihtoyrxxumirjfyewpb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5paHRveXJ4eHVtaXJqZnlld3BiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5NjA0MDUsImV4cCI6MjA5MzUzNjQwNX0.wpAy-YEXjAE1jdsfCW-vVYtRZinMB0S74OofCNN9JxY


▶️ Start development server
npm run dev

🧪 Run tests
npm run test

📊 Run tests with coverage
npm run test:coverage


🧪 Testing Philosophy
Unit tests focus on core business logic.
✅ Pure logic testing
❌ No UI testing (by design)




Core tables:

Table	Description
profiles	Users, roles, ELO, coins, availability
games	Chess matches, FEN state, turns, status
messages	Real-time coaching feedback


Schema management is handled through the Supabase Dashboard.

📸 Screenshots

🏪 App

<h2 align="center">📸 Screenshots</h2>

<br />


<!-- HERO IMAGE -->
<p align="center">
  <img 
    src="https://github.com/user-attachments/assets/359576d3-ed76-4b35-b483-4c772e99343f"
    width="70%"
  />
</p>

<br />

<!-- TWO COLUMN GRID -->
<p align="center">
  <img 
    src="https://github.com/user-attachments/assets/96e3988e-58ad-4059-a6e4-aed3c719d125"
    width="45%"
  />

  <img 
    src="https://github.com/user-attachments/assets/b31e63b4-d387-4430-853e-a396fc50d38a"
    width="45%"
  />
</p>

<br />

<p align="center">
  <img 
    src="https://github.com/user-attachments/assets/be4f9203-466c-405e-8be4-1edcf186f71c"
    width="45%"
  />

  <img 
    src="https://github.com/user-attachments/assets/d9ce8ed0-f78c-41ba-8c61-ee03961a4895"
    width="45%"
  />
</p>


🧪 Testing Coverage
<img width="1918" height="693" alt="Testing Coverage" src="https://github.com/user-attachments/assets/4afc2fd5-0626-4508-870c-7a3684aa1f28" />

♿ Accessibility Score

<p align="center">
  <img 
    src="https://github.com/user-attachments/assets/2b8dd900-4948-41fe-b970-527f5b8bc79a"
    width="70%"
  />
</p>



🔄 User Flows

<p align="center">
  <img 
    src="https://github.com/user-attachments/assets/3e1188d1-612a-4a7a-9a61-a4f1c21eac9c"
    width="70%"
  />
</p>

<p align="center">
  <img 
    src="https://github.com/user-attachments/assets/a89f6b1d-21bc-4d82-91ee-383ffb132c17"
    width="70%"
  />
</p>

<p align="center">
  <img 
    src="https://github.com/user-attachments/assets/46b8f162-d5cb-47df-a582-84ee3190c509"
    width="70%"
  />
</p>

<p align="center">
  <img 
   src="https://github.com/user-attachments/assets/7c056909-6b0a-4f50-b5c4-5fa9bff817d7"
    width="70%"
  />
</p>

<p align="center">
  <img 
   src="https://github.com/user-attachments/assets/c6bf6b8b-73ff-4551-b7e2-9ae8f135bdb3"
    width="70%"
  />
</p>



🗺️ Roadmap
 📹 In-app video calls for live coaching
 📚 Historical game review
 🤖 Move-by-move AI analysis
 💳 Subscription plans
 🏆 Multiplayer tournaments
 🔁 Match replay system
 🏁 End game button
 ⏱️ Chess clock support

 
🌟 Vision

GM Chess aims to make high-level chess coaching accessible, interactive, and engaging through real-time gameplay and AI-enhanced learning.

🧠 Built With Passion For Chess & Learning ♟️

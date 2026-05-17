
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
🚀 Features
🏪 Marketplace

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

NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
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
♿ Accessibility

GM Chess is built with accessibility in mind and currently achieves a Lighthouse accessibility score of 100.

Ongoing improvements focus on:

♿ Full compliance
⌨️ Keyboard navigation
🎨 Contrast optimization
🗣️ Screen reader support
🗄️ Database Schema

Core tables:

Table	Description
profiles	Users, roles, ELO, coins, availability
games	Chess matches, FEN state, turns, status
messages	Real-time coaching feedback

Schema management is handled through the Supabase Dashboard.

📸 Screenshots
🏪 Marketplace
<img width="1890" height="848" alt="Marketplace" src="https://github.com/user-attachments/assets/d28aa8e0-bc10-4f0b-bb6a-78df4e421020" />
🧪 Testing Coverage
<img width="1918" height="693" alt="Testing Coverage" src="https://github.com/user-attachments/assets/4afc2fd5-0626-4508-870c-7a3684aa1f28" />
♿ Accessibility Score
<img width="492" height="768" alt="Accessibility Score" src="https://github.com/user-attachments/assets/2b8dd900-4948-41fe-b970-527f5b8bc79a" />
🔄 User Flows
<img width="8192" height="3061" alt="User Flows" src="https://github.com/user-attachments/assets/1f4a3f18-4511-461f-a6d1-8abbb99de219" />
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


# GM Chess ♟️
A real-time chess coaching marketplace that connects students with Grandmasters for live games with AI-powered analysis and personalized feedback.


## Architecture
GM Chess is built on **Next.js 16** (App Router) with **React 19**, **Supabase** for backend (auth, database, realtime), and **Tailwind CSS v4** for styling.

```
app/                  # App Router pages (marketplace, game, wallet, profile)
features/             # Feature-based modules (auth, game, marketplace, wallet, messages)
components/           # Shared UI components
lib/                  # Supabase client & utilities
types/                # TypeScript interfaces
```
## Features
- **Marketplace** — Browse verified Grandmasters sorted by ELO rating with real-time availability status
- **Live Chess** — Full chess engine via `chess.js` with interactive board (`react-chessboard`) and real-time move sync
- **AI Coaching** — Stockfish-powered hints at depth 12 with visual overlay (best move, evaluation)
- **Virtual Economy** — Coin-based system: students purchase coins, spend them per game; GMs earn coins for completed games
- **Real-time Messaging** — GMs provide written coaching feedback that appears instantly via Supabase Realtime
- **GM Dashboard** — Toggle availability, view waiting games, join student sessions
- **Google OAuth** — Authentication via Supabase Auth with SSR session handling
- **Dark Theme** — Full dark mode UI with amber accents


## Tech Stack
| Tool | Purpose |
|---|---|
| Next.js 16 + React 19 | Frontend framework (App Router) |
| TypeScript | Type safety |
| Supabase | Auth, PostgreSQL database, Realtime subscriptions |
| chess.js | Chess move validation and game logic |
| react-chessboard | Interactive chess board UI |
| Stockfish API (chess-api.com) | AI move analysis and hints |
| TanStack React Query | Server state management and caching |
| Tailwind CSS v4 + shadcn/ui | Styling and component system |
| Vitest + RTL | Testing |


## Getting Started
```bash
# Install dependencies
npm install
# Set up environment variables
# Create .env.local with your Supabase project URL and anon key
# Start development server
npm run dev
# Run tests
npm run test
# Run tests with coverage
npm run test:coverage
```
## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=https://nihtoyrxxumirjfyewpb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5paHRveXJ4eHVtaXJqZnlld3BiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5NjA0MDUsImV4cCI6MjA5MzUzNjQwNX0.wpAy-YEXjAE1jdsfCW-vVYtRZinMB0S74OofCNN9JxY

🧪 Testing
Unit tests are implemented using Vitest, focusing on core business logic.

✅ Pure logic testing
❌ No UI testing (by design)

<img width="1918" height="693" alt="Captura de pantalla 2026-05-16 102513" src="https://github.com/user-attachments/assets/4afc2fd5-0626-4508-870c-7a3684aa1f28" />



📸 Screenshots

<img width="1890" height="848" alt="Captura de pantalla 2026-05-16 110833" src="https://github.com/user-attachments/assets/d28aa8e0-bc10-4f0b-bb6a-78df4e421020" />


Users Flows

<img width="8192" height="3061" alt="Land Marketplace User Flow-2026-05-16-090049" src="https://github.com/user-attachments/assets/1f4a3f18-4511-461f-a6d1-8abbb99de219" />



GM Chess is built with accessibility in mind and currently achieves a Lighthouse accessibility score of 100. Ongoing improvements are focused on reaching full compliance, ensuring the platform is usable for all users.

<img width="492" height="768" alt="Captura de pantalla 2026-05-15 104632" src="https://github.com/user-attachments/assets/2b8dd900-4948-41fe-b970-527f5b8bc79a" />




```
## Database Schema
Key tables: `profiles` (users with roles, ELO, coins, availability), `games` (chess games with FEN, status, turn), `messages` (coaching feedback). Schema is managed through the Supabase dashboard.


## Roadmap
- [ ] In-app video calls for live coaching sessions
- [ ] Historical game review with move-by-move analysis
- [ ] Subscription plans for recurring coaching
- [ ] Multiplayer tournaments
- [ ] Match Replay
- [ ] End Game Button
- [ ] Clock

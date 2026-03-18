# MindPeace Frontend

MindPeace is a mental health and wellness platform that connects users with professional consultants, provides an AI-powered mental health assistant, and offers tools for mood tracking, session booking, and real-time video consultations.

---

## Features

- **AI Mental Health Chatbot** - Powered by Google Gemini 2.5 Flash, the assistant helps users explore mental wellness topics and achieve mental peace.
- **Video Consultations** - Real-time, end-to-end encrypted video rooms via LiveKit with recording support.
- **Collaborative Notes** - Shared real-time editor (Liveblocks + Yjs) available inside consultation rooms.
- **Session Booking** - Book online or in-person sessions with a consultant; track booking status (pending, accepted, rejected).
- **User Dashboard** - Mood check-ins, daily task list, activity calendar, streak counter, and mindful minutes tracking.
- **Consultant Dashboard** - Manage incoming bookings, view upcoming sessions, update availability, and track daily tasks.
- **Analytics** - Visual activity history and wellness progress tracking.
- **Google Authentication** - Sign in with Google via NextAuth v5.

---

## Tech Stack

| Category | Library / Tool |
|---|---|
| Framework | [Next.js 15](https://nextjs.org) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS, HeroUI |
| Authentication | NextAuth v5 (Google OAuth) |
| AI | Google Gemini 2.5 Flash (\@ai-sdk/google\) |
| Video | LiveKit (\@livekit/components-react\) |
| Collaboration | Liveblocks + Yjs |
| Animations | Framer Motion |
| HTTP Client | Axios |
| Monitoring | Datadog Browser Logs |

---

## Project Structure

```r
src/
  app/
    dashboard/          # User mood & activity dashboard
    consultant/         # Consultant dashboard, schedule, upcoming sessions
    book-session/       # Session booking flow
    chatBot/            # AI chatbot interface
    rooms/[roomName]/   # LiveKit video rooms with collaborative editor
    analytics/          # Wellness analytics
    settings/           # User settings
    login/              # Authentication
    api/
      chatbox/          # AI chat streaming endpoint (Gemini)
      connection-details/ # LiveKit token generation
      record/           # Session recording start/stop
      liveblocks-auth/  # Liveblocks authentication
      token/            # Auth token endpoint
lib/                    # LiveKit UI helpers (settings, recording, E2EE, etc.)
src/component/          # Shared UI components (sidebar, modals, inputs, etc.)
src/components/editor/  # Collaborative rich-text editor
src/utils/              # Auth utilities and API request helpers
```r

---

## Getting Started

### Prerequisites

- Node.js 18+
- A LiveKit account and server (for video rooms)
- A Liveblocks account (for collaborative editor)
- A Google Cloud project with OAuth credentials and Gemini API access

### Environment Variables

Create a \.env.local\ file in the project root:

\\\env
# LiveKit
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
LIVEKIT_URL=
NEXT_PUBLIC_CONN_DETAILS_ENDPOINT=/api/connection-details
NEXT_PUBLIC_SHOW_SETTINGS_MENU=true

# Liveblocks
LIVEBLOCKS_SECRET_KEY=

# Google AI
GOOGLE_GENERATIVE_AI_API_KEY=

# NextAuth
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
\\\`r

### Installation

\\\ash
npm install
\\\`r

### Running Locally

\\\ash
npm run dev
\\\`r

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

\\\ash
npm run build
npm start
\\\`r

---

## API Routes

| Route | Method | Description |
|---|---|---|
| \/api/chatbox\ | POST | Streams AI responses from Google Gemini |
| \/api/connection-details\ | GET | Generates a LiveKit participant token |
| \/api/record/start\ | POST | Starts session recording |
| \/api/record/stop\ | POST | Stops session recording |
| \/api/liveblocks-auth\ | POST | Authenticates users with Liveblocks |
| \/api/token\ | GET | Returns an auth token |

---

## Deployment

The recommended deployment platform is [Vercel](https://vercel.com). After connecting your repository, add all environment variables in the Vercel project settings and deploy.

For self-hosted deployments, run \
pm run build\ and \
pm start\, and ensure all environment variables are set in your hosting environment.

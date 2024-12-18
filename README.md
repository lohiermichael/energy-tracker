<div align="center">

# <img src="public/logo.svg" alt="Energy Tracker Logo" width="32" height="32"> Energy Tracker

<img
  src="public/website-preview.png"
  alt="Website Preview"
  width="800"
  style="max-width: 100%;">

</div>


## Introduction

During my time in Greece, I faced a monthly electricity cap of 200 kWh. This
constraint led me to develop this energy tracking application - a tool to
monitor daily usage and get alerts before reaching limits. While built for my
specific needs, this app can help anyone looking to manage their energy
consumption better.

<a href="https://energy-tracker-brown.vercel.app/" target="_blank">
  <img src="public/globe.svg" alt="Website Globe" width="20" height="20" 
       style="vertical-align: middle; margin-right: 8px">
  <strong>View Live Website</strong>
</a>


## Features

- 📊 Consumption visualization with interactive charts
- 📝 Easy meter reading input and management
- 📱 Responsive design for desktop and mobile
- ✏️ Editable historical readings
- 📈 Daily and cumulative consumption analysis

## Tech Stack

**Development:**
[![Next.js](https://img.shields.io/badge/-Next.js%2015.0-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/-React%2018.2-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)

**Styling & UI:**
[![Tailwind CSS](https://img.shields.io/badge/-Tailwind%20CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Recharts](https://img.shields.io/badge/-Recharts-22B5BF?style=flat-square&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0yIDJ2MjBoMjBWMkgyeiIvPjxwYXRoIGZpbGw9IiMyMkI1QkYiIGQ9Ik00IDRoMTZ2MTZINFY0em00IDhoOHY0SDh2LTR6Ii8+PC9zdmc+)](https://recharts.org)

**Backend & Data:**
[![Firebase](https://img.shields.io/badge/-Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com)

**Deployment:**
[![Vercel](https://img.shields.io/badge/-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com)


## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with your Firebase credentials:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

- Add daily meter readings using the input form
- View consumption patterns in the interactive charts
- Edit previous readings if needed
- Monitor usage against predefined thresholds:
  - Safe limit: 6 kWh/day
  - Max limit: 6.66 kWh/day
  - Extra charge threshold: 14.33 kWh/day

## Data Migration

To migrate existing readings:

```bash
npm run migrate
```

## Development

The project uses:
- ESLint for code linting
- Tailwind CSS for styling
- Firebase Firestore for data storage
- Recharts for data visualization

## Project Structure

```
src/
├── app/                 # Next.js app router
├── components/          # React components
│   └── energy/         # Energy tracking components
├── lib/                # External service setup
└── utils/              # Utility functions
```

## Browser Support

Works in modern browsers that support:
- ES6+ JavaScript
- CSS Grid and Flexbox
- Web Notifications API

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

## Features

- 📊 Consumption visualization with interactive charts
- 📝 Easy meter reading input and management
- 📱 Responsive design for desktop and mobile
- ✏️ Editable historical readings
- 📈 Daily and cumulative consumption analysis

## Tech Stack

- Next.js 15.0
- React 18.2
- Firebase (Firestore)
- Tailwind CSS
- Recharts
- TypeScript

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

# NeuroNote AI

An offline-first AI note-taking app built with **React Native New Architecture**.

Save notes locally, then use Gemini to summarize a note or chat with your notes as context.

## Features

- Local notes stored with MMKV
- Gemini-powered note summaries and chat
- Search, edit, delete, and create notes
- Dark mode support
- Offline-first note storage

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React Native 0.86+ (New Architecture) |
| Language | TypeScript |
| State | Redux Toolkit |
| Storage | MMKV |
| AI | Gemini API (`gemini-3.5-flash`) |
| Forms | React Hook Form + Zod |
| Navigation | React Navigation (bottom tabs + native stack) |
| Styling | StyleSheet + design tokens |
| HTTP | Axios with typed error handling |

## Project Structure

```
src/
├── app/              App entry + bootstrap
├── navigation/       Tab + stack navigators
├── components/       ErrorBoundary + shared UI
├── theme/            Colors, spacing, typography
├── store/            Redux slices
├── services/
│   ├── api/          Axios client + typed errors
│   └── ai/           Gemini service + prompts
├── storage/          MMKV persistence
├── hooks/            useNotes, useAI, useSettings
├── types/            Shared TypeScript types
├── utils/            Date formatting, ID generation
└── features/
    ├── notes/        Notes list + editor
    ├── ai/           Summarize + chat screens
    └── settings/     API key + appearance
```

## Getting Started

### Prerequisites

- Node.js >= 22.11
- Xcode (iOS) / Android Studio (Android)
- Gemini API key from Google AI Studio

### Install

```bash
npm install
cd ios && pod install && cd ..
```

### Run

```bash
# Start Metro
npm start

# iOS
npm run ios

# Android
npm run android
```

### Configure Gemini

1. Open the app → **Settings** tab
2. Paste your Gemini API key (`AIza…`)
3. Tap **Save API Key**

Your key is stored **locally on device only** via MMKV — never committed to git.

## Usage

1. **Create notes** on the Notes tab (+ FAB button)
2. **Search** notes with the search bar
3. **Summarize** — AI tab → select a note → Summarize
4. **Chat** — AI tab → "Chat with all notes" → ask questions

## Testing

```bash
npm test
npm run lint
```

## Build

```bash
cd android && ./gradlew assembleDebug
```

The debug APK is generated and Available under GitHub Releases

## Screenshots

docs/screenshots

## Notes

- Gemini requests require a valid API key from Google AI Studio.
- Notes are stored locally on the device with MMKV.

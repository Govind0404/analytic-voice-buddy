# SalesChatGPT - Conversational Sales Analytics Dashboard

A modern, responsive web application that enables natural language interaction with sales data through text, voice, and file uploads. Built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

### Core Functionality
- **Natural Language Queries**: Ask questions about sales data in plain English
- **Voice Input**: Real-time speech-to-text transcription for hands-free interaction
- **CSV File Upload**: Drag-and-drop or click to upload sales data files
- **Interactive Analytics**: Display results as charts, tables, and key metrics
- **Conversation History**: Sidebar with past queries and responses
- **Dark/Light Theme**: Toggle between themes with system preference support

### UI Components
- **Three-Panel Layout**: Sidebar, main chat, and metrics panel
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern Chat Interface**: Clean, ChatGPT-style conversation bubbles
- **Real-time Metrics**: Live dashboard with key sales indicators
- **Smooth Animations**: Polished transitions and micro-interactions

## 🛠️ Technical Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Charts**: Recharts for data visualization
- **Voice**: Web Speech API for speech recognition
- **File Processing**: PapaParse for CSV handling
- **Theme**: next-themes for dark/light mode
- **Build Tool**: Vite

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ or Bun
- Modern web browser with Speech API support

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd saleschatgpt
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

## 💬 Usage Examples

### Text Queries
- "What were total sales in Q1 2024?"
- "Show me sales by region"
- "Who are our top customers?"
- "What's the average deal size?"
- "Show me the sales pipeline"

### Voice Input
1. Click the microphone button
2. Speak your question clearly
3. Wait for transcription
4. Click send or say "send"

### File Upload
1. Click the upload button or drag a CSV file
2. System automatically processes the data
3. Ask questions about the uploaded data
4. View results in charts and tables

## 📊 Key Components

- **ChatInterface**: Main conversational UI with voice/file support
- **QueryProcessor**: Handles natural language queries and generates responses
- **AnalyticsChart/Table**: Beautiful data visualizations using Recharts
- **VoiceRecorder**: Real-time speech recognition
- **FileUploader**: CSV processing with PapaParse
- **Layout**: Three-panel responsive layout with sidebar and metrics
- **ThemeProvider**: Dark/light mode support

## 🎨 Architecture

The application follows a modular component architecture:

```
src/
├── components/          # React components
├── data/               # Sample sales data
├── hooks/              # Custom React hooks
├── providers/          # Context providers
├── types/              # TypeScript definitions
├── utils/              # Utility functions
└── pages/              # Application pages
```

## 🔧 Deployment

### Via Lovable
Simply open [Lovable](https://lovable.dev/projects/50f96f73-b937-4404-a845-653eb6212ecc) and click on Share → Publish.

### Manual Deployment
```bash
npm run build
# Deploy the dist/ folder to your hosting provider
```

## 🤝 Development

This project is built with:
- **Vite** - Fast build tool
- **TypeScript** - Type safety
- **React 18** - Modern React features
- **shadcn/ui** - Beautiful components
- **Tailwind CSS** - Utility-first styling

Built with ❤️ for modern sales teams who want to interact with their data naturally.

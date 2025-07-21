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
- **n8n Integration**: Webhook-based chat functionality with data visualization

### UI Components
- **Three-Panel Layout**: Sidebar, main chat, and metrics panel
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern Chat Interface**: Clean, ChatGPT-style conversation bubbles
- **Real-time Metrics**: Live dashboard with key sales indicators
- **Smooth Animations**: Polished transitions and micro-interactions

## 🛠️ Technical Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Charts**: Recharts for data visualization + Chart.js for n8n responses
- **Voice**: Web Speech API for speech recognition
- **File Processing**: PapaParse for CSV handling
- **Theme**: next-themes for dark/light mode
- **Build Tool**: Vite
- **Backend Integration**: n8n webhooks for chat functionality

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ or Bun
- Modern web browser with Speech API support
- n8n server with webhook endpoint

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

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```bash
   VITE_N8N_WEBHOOK_URL=https://adyut.app.n8n.cloud/webhook-test/e37bd202-9bc8-4fbd-b41c-07477d8e0275
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:5173`

## 🔧 n8n Integration

### Webhook Configuration
The application integrates with n8n through webhooks for chat functionality:

- **Chat Endpoint**: `POST /webhook/saleschat`
- **Request Format**: `{ "question": "string" }`
- **Response Format**: 
  ```json
  {
    "answer": "string",
    "data": [{"column1": "value1", "column2": "value2"}],
    "chart_type": "bar|line|pie",
    "sql": "SELECT * FROM table"
  }
  ```

### Features
- **Text Queries**: Send natural language questions to n8n
- **Data Visualization**: Automatic chart rendering based on response data
- **Table Display**: Tabular data presentation with sorting
- **SQL Preview**: Expandable SQL query display
- **CSV Upload**: File upload functionality for data processing

### Usage Examples
- "What were total sales in Q1 2024?"
- "Show me sales by region"
- "Who are our top customers?"
- "What's the average deal size?"

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
- **ChatUI**: n8n webhook integration with data visualization
- **n8n.ts**: Webhook communication utilities

## 🎨 Architecture

The application follows a modular component architecture:

```
src/
├── components/          # React components
│   ├── ChatUI.tsx      # n8n chat interface
│   └── ui/             # shadcn/ui components
├── lib/
│   └── n8n.ts          # n8n webhook utilities
├── pages/              # Route components
└── styles/             # CSS and theme files
```

## 🔒 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_N8N_WEBHOOK_URL` | n8n webhook endpoint | `https://my-n8n-server/webhook/saleschat` |

## 🚀 Deployment

1. **Build for production**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting provider

3. **Set environment variables** in your hosting platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

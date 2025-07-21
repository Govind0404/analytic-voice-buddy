# SalesChatGPT - Conversational Business Intelligence Dashboard

A comprehensive analytics dashboard that integrates natural language processing with business intelligence capabilities. Query your sales data through conversational interfaces, supporting both text and voice inputs, with automatic data visualization and SQL query generation.

## 🚀 Features

- **🤖 AI-Powered Queries**: Natural language processing for business data analysis
- **📊 Dynamic Visualizations**: Automatic chart generation (bar, line, pie charts)
- **🗣️ Voice Interface**: Speech-to-text and text-to-speech capabilities
- **📁 File Upload**: CSV data import and processing
- **🔗 n8n Integration**: Webhook-based workflow orchestration
- **📱 Modern UI**: Responsive design with shadcn/ui components
- **⚡ Real-time Processing**: Instant query processing and response generation

## 🛠️ Technology Stack

### Frontend
- **React 18** + **TypeScript** - Modern, type-safe UI development
- **Vite** - Fast build tooling and development server
- **Chart.js** + **react-chartjs-2** - Dynamic data visualization
- **shadcn/ui** - Beautiful, accessible UI components
- **React Router DOM** - Client-side routing

### Backend & AI
- **OpenAI GPT-4** - Advanced language model for query processing
- **LangChain** - LLM orchestration and tool calling
- **n8n** - Workflow automation and webhook processing
- **Web Speech API** - Browser-based voice processing

### Data & Integration
- **SQL Templates** - Schema-aware query generation
- **RAG Pipeline** - Retrieval-augmented generation for accurate responses
- **Webhook Architecture** - Real-time frontend-backend communication

## 📖 Documentation

- **[Technical Write-Up](TECHNICAL_WRITEUP.md)** - Detailed technical architecture and implementation details
- **[API Documentation](docs/API.md)** - Webhook endpoints and data formats
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Setup and deployment instructions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- n8n instance with webhook endpoint

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Govind0404/analytic-voice-buddy.git
   cd analytic-voice-buddy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your n8n webhook URL:
   ```
   VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-endpoint
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🎯 Usage

### Basic Query
Type natural language questions like:
- "What were total sales in Q1 2024?"
- "Show me customer retention trends"
- "Which products performed best last month?"

### Voice Queries
Click the microphone button and speak your query for hands-free operation.

### File Upload
Upload CSV files to analyze your own data:
1. Click the upload button
2. Select your CSV file
3. Ask questions about your uploaded data

### Testing Webhooks
Use the testing buttons in the interface to:
- Test webhook connectivity
- Debug environment variables
- Verify GET/POST functionality

## 🔧 Configuration

### Environment Variables
| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_N8N_WEBHOOK_URL` | n8n webhook endpoint URL | Yes |

### n8n Workflow Setup
1. Create a new n8n workflow
2. Add a Webhook trigger node
3. Configure the webhook URL
4. Add LangChain/OpenAI nodes for processing
5. Set up response formatting

## 📊 Data Flow

```
User Input (Text/Voice/File)
    ↓
Frontend Processing
    ↓
n8n Webhook
    ↓
LangChain + GPT-4
    ↓
SQL Generation & Execution
    ↓
Data Visualization
    ↓
Response Rendering
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/Govind0404/analytic-voice-buddy/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Govind0404/analytic-voice-buddy/discussions)
- **Documentation**: [Technical Write-Up](TECHNICAL_WRITEUP.md)

## 🎉 Acknowledgments

- OpenAI for GPT-4 and LangChain integration
- n8n team for workflow automation platform
- Chart.js community for data visualization
- shadcn/ui for beautiful UI components

---

**Built with ❤️ for modern business intelligence**

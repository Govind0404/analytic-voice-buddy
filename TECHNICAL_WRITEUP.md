# SalesChatGPT Technical Write-Up

## Project Overview
SalesChatGPT is a comprehensive analytics dashboard that integrates natural language processing with business intelligence capabilities. The application enables users to query sales data through conversational interfaces, supporting both text and voice inputs, with automatic data visualization and SQL query generation.

## 1. Base LLM Choice: OpenAI GPT-4 via LangChain

### Selection Rationale
We chose **OpenAI GPT-4** as our base Large Language Model (LLM) for the following reasons:

- **Advanced Reasoning Capabilities**: GPT-4 demonstrates superior performance in complex reasoning tasks, making it ideal for translating natural language queries into SQL statements and business insights.

- **Structured Output Support**: The model excels at generating structured responses, which is crucial for our application's requirement to return both natural language answers and structured data formats.

- **Multi-modal Understanding**: While our current implementation focuses on text, GPT-4's multi-modal capabilities provide a foundation for future enhancements including image and document analysis.

- **LangChain Integration**: We leverage LangChain's framework to enhance GPT-4 with tool calling, memory management, and output parsing capabilities.

## 2. Grounding Implementation: Retrieval-Augmented Generation (RAG)

### Approach
We implemented a multi-layer grounding system using:

- **SQL Query Templates**: Predefined templates for common business queries ensure consistent and accurate SQL generation
- **Schema-Aware Processing**: The system maintains knowledge of database structure and business rules
- **Template Retrieval**: Based on query classification, relevant templates are retrieved and used as grounding context
- **Fallback Mechanisms**: Robust error handling with fallback to sample data processing

### Key Benefits
- Ensures consistent table and column naming
- Maintains proper date formatting and aggregation
- Aligns business logic with actual data schema
- Provides reliable responses even when external services are unavailable

## 3. Attachment and Voice Handling

### File Upload Processing
- **CSV Support**: Users can upload CSV files for dynamic data analysis
- **FormData Integration**: Files are sent to n8n workflows via FormData POST requests
- **Data Flow**: Uploaded files are processed and integrated into the knowledge base for subsequent queries

### Voice Input Processing
- **Multi-Stage Pipeline**: Audio recording → Speech-to-text → Query processing → Response generation
- **Browser-Based**: Uses Web Speech API for real-time transcription
- **Server-Side**: Integrates with OpenAI Whisper API for high-accuracy transcription
- **Accessibility**: Supports text-to-speech for response playback

### Multi-Modal Integration
- **Context Preservation**: System maintains conversation context across different input modalities
- **Cross-Modal References**: Voice queries can reference uploaded files, text queries can request voice responses
- **Unified Processing**: All input types (text, voice, files) are processed through the same LLM pipeline

## 4. Technology Stack Overview

### Frontend Technologies
- **React 18 + TypeScript**: Modern, type-safe UI development
- **Vite**: Fast build tooling and development server
- **Chart.js + react-chartjs-2**: Dynamic data visualization
- **shadcn/ui**: Beautiful, accessible UI components
- **React Router DOM**: Client-side routing

### Backend & AI Technologies
- **OpenAI GPT-4**: Advanced language model for query processing
- **LangChain**: LLM orchestration and tool calling
- **n8n**: Workflow automation and webhook processing
- **Web Speech API**: Browser-based voice processing

### Data & Integration
- **SQL Templates**: Schema-aware query generation
- **RAG Pipeline**: Retrieval-augmented generation for accurate responses
- **Webhook Architecture**: Real-time frontend-backend communication

## 5. Key Features Delivered

### Core Functionality
- Natural language query processing with business context
- Automatic SQL generation and execution
- Dynamic data visualization (charts, tables, metrics)
- Voice input and output capabilities
- File upload and processing
- Real-time webhook integration

### User Experience
- Modern, responsive dashboard interface
- Three-panel layout (sidebar, chat, metrics)
- Dark/light theme support
- Conversation history management
- Error handling and fallback mechanisms

### Technical Excellence
- Type-safe development with TypeScript
- Modular component architecture
- Comprehensive error handling
- Environment-based configuration
- Scalable webhook architecture

This architecture provides a robust foundation for conversational business intelligence, combining the power of modern LLMs with practical business data analysis capabilities. 
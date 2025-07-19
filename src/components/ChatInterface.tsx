import { FC, useState, useRef, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Send, Bot, BarChart3 } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { VoiceRecorder } from './VoiceRecorder';
import { FileUploader } from './FileUploader';
import { ChatMessage as ChatMessageType, processQuery } from '../utils/queryProcessor';
import { useToast } from '../hooks/use-toast';

export const ChatInterface: FC = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedData, setUploadedData] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add welcome message on component mount
  useEffect(() => {
    const welcomeMessage: ChatMessageType = {
      id: 'welcome',
      type: 'assistant',
      content: 'Hello! I\'m your Sales AI Assistant. I can analyze your sales data and provide insights. Try asking me about "Q1 2024 sales", "sales by region", "top customers", or "sales pipeline". You can also upload CSV files or use voice input!',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { message, results } = await processQuery(content);
      
      const assistantMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: message,
        results,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error processing query:', error);
      const errorMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'I apologize, but I encountered an error while processing your request. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceTranscription = (transcript: string) => {
    setInput(transcript);
    toast({
      title: "Voice Transcribed",
      description: "Voice input has been converted to text. Click send to submit.",
    });
  };

  const handleFileUpload = (data: any[], filename: string) => {
    setUploadedData(data);
    const message = `I've uploaded ${filename} with ${data.length} rows of data. You can now ask me questions about this data.`;
    handleSendMessage(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(input);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Welcome Section - only show when no messages */}
      {messages.length === 1 && (
        <div className="flex-shrink-0 p-6 text-center border-b border-border">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary mx-auto mb-4">
              <BarChart3 className="h-6 w-6 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Welcome to SalesChatGPT</h2>
            <p className="text-muted-foreground mb-6">
              Intelligent sales data analysis with voice and file support. Try these examples:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                "What were total sales in Q1 2024?",
                "Show me sales by region",
                "Who are our top customers?",
                "Show me the sales pipeline"
              ].map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(prompt)}
                  className="p-3 text-sm text-left bg-muted/50 hover:bg-muted rounded-lg transition-colors border border-border/50"
                  disabled={isLoading}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="container mx-auto px-4 py-6 max-w-4xl">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            
            {isLoading && (
              <div className="flex justify-start mb-4">
                <Card className="p-4 bg-card">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4 animate-pulse text-primary" />
                    <span className="text-sm text-muted-foreground">Analyzing your query...</span>
                  </div>
                </Card>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="border-t bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about sales data, upload a CSV, or use voice input..."
                disabled={isLoading}
                className="min-h-[44px]"
              />
            </div>
            
            <div className="flex gap-2">
              <VoiceRecorder 
                onTranscriptionComplete={handleVoiceTranscription}
                disabled={isLoading}
              />
              <FileUploader 
                onDataProcessed={handleFileUpload}
                disabled={isLoading}
              />
              <Button
                onClick={() => handleSendMessage(input)}
                disabled={!input.trim() || isLoading}
                size="sm"
                className="min-h-[44px] px-4"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="mt-2 text-xs text-muted-foreground">
            Try: "What were total sales in Q1 2024?" • "Show me sales by region" • Upload CSV • Use voice input
          </div>
        </div>
      </div>
    </div>
  );
};
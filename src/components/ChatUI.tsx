import React, { useState, useRef, useEffect } from 'react';
import { triggerWebhook, uploadCsvToWebhook, N8nResponse } from '@/lib/n8n';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  data?: Array<Record<string, string | number | boolean>>;
  chart_type?: 'bar' | 'line' | 'pie';
  sql?: string;
}

const ChatUI: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await triggerWebhook(inputValue.trim());
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response.answer || 'No answer provided',
        data: response.data,
        chart_type: response.chart_type,
        sql: response.sql,
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast.error('Please select a CSV file');
      return;
    }

    setIsUploading(true);
    try {
      const response = await uploadCsvToWebhook(file);
      toast.success('CSV file uploaded successfully!');
      
      if (response.answer) {
        const aiMessage: Message = {
          id: Date.now().toString(),
          type: 'ai',
          content: response.answer,
          data: response.data,
          chart_type: response.chart_type,
          sql: response.sql,
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload CSV file. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const renderChart = (data: Array<Record<string, string | number | boolean>>, chartType: 'bar' | 'line' | 'pie') => {
    if (!data || data.length === 0) return null;

    const labels = Object.keys(data[0]).filter(key => key !== 'id');
    const datasets = labels.map((label, index) => ({
      label,
      data: data.map(row => row[label]),
      backgroundColor: `hsl(${217 + index * 60}, 91%, 60%)`,
      borderColor: `hsl(${217 + index * 60}, 91%, 60%)`,
      borderWidth: 1,
    }));

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: 'Data Visualization',
        },
      },
    };

    switch (chartType) {
      case 'bar':
        return <Bar 
          data={{
            labels: data.map((_, index) => `Row ${index + 1}`),
            datasets: datasets,
          }} 
          options={options} 
        />;
      case 'line':
        return <Line 
          data={{
            labels: data.map((_, index) => `Row ${index + 1}`),
            datasets: datasets,
          }} 
          options={options} 
        />;
      case 'pie':
        return <Pie 
          data={{
            labels: data.map((_, index) => `Row ${index + 1}`),
            datasets: [datasets[0]], // Pie charts only support one dataset
          }} 
          options={options} 
        />;
      default:
        return null;
    }
  };

  const renderTable = (data: Array<Record<string, string | number | boolean>>) => {
    if (!data || data.length === 0) return null;

    const headers = Object.keys(data[0]);

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full border border-border rounded-lg">
          <thead>
            <tr className="bg-muted">
              {headers.map((header) => (
                <th key={header} className="px-4 py-2 text-left font-medium border-b">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="hover:bg-muted/50">
                {headers.map((header) => (
                  <td key={header} className="px-4 py-2 border-b">
                    {String(row[header])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="chat-container max-w-4xl mx-auto p-4 h-screen flex flex-col">
      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 flex flex-col p-4">
          {/* Chat Messages */}
          <div className="chat-box flex-1 overflow-y-auto mb-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.type} flex ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  
                  {/* Render data table if present */}
                  {message.data && (
                    <div className="mt-4">
                      {renderTable(message.data)}
                    </div>
                  )}
                  
                  {/* Render chart if present */}
                  {message.chart_type && message.data && (
                    <div className="mt-4">
                      {renderChart(message.data, message.chart_type)}
                    </div>
                  )}
                  
                  {/* Render SQL if present */}
                  {message.sql && (
                    <details className="mt-4">
                      <summary className="cursor-pointer font-medium text-sm">
                        Show SQL
                      </summary>
                      <pre className="mt-2 p-3 bg-background border rounded text-xs overflow-x-auto">
                        {message.sql}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="message ai flex justify-start">
                <div className="bg-muted text-foreground p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question about your data..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
              size="icon"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              variant="outline"
              size="icon"
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatUI; 
import { FC } from 'react';
import { ChatMessage as ChatMessageType } from '../utils/queryProcessor';
import { Card } from './ui/card';
import { AnalyticsChart } from './AnalyticsChart';
import { AnalyticsTable } from './AnalyticsTable';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.type === 'user';
  
  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
        <Card className={`p-4 ${
          isUser 
            ? 'bg-primary text-primary-foreground ml-auto' 
            : 'bg-card text-card-foreground'
        }`}>
          <div className="text-sm font-medium mb-2">
            {isUser ? 'You' : 'Sales AI Assistant'}
          </div>
          <div className="text-sm leading-relaxed">
            {message.content}
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            {message.timestamp.toLocaleTimeString()}
          </div>
        </Card>
        
        {message.results && message.results.length > 0 && (
          <div className="mt-4 space-y-4">
            {message.results.map((result, index) => (
              <Card key={index} className="p-4">
                <h3 className="font-semibold text-lg mb-3">{result.title}</h3>
                {result.description && (
                  <p className="text-sm text-muted-foreground mb-3">{result.description}</p>
                )}
                
                {result.type === 'text' && (
                  <div className="text-2xl font-bold text-primary">
                    {result.data.formatted}
                  </div>
                )}
                
                {result.type === 'chart' && (
                  <AnalyticsChart data={result.data} />
                )}
                
                {result.type === 'table' && (
                  <AnalyticsTable data={result.data} />
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
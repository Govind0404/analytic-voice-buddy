import { FC, useState, ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { MetricsPanel } from './MetricsPanel';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/button';
import { Menu, X, BarChart3, MessageSquare } from 'lucide-react';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: ReactNode;
  showMetricsPanel?: boolean;
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  messageCount: number;
}

export const Layout: FC<LayoutProps> = ({ children, showMetricsPanel = true }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [metricsOpen, setMetricsOpen] = useState(showMetricsPanel);
  const [activeConversationId, setActiveConversationId] = useState('1');

  // Mock conversations data
  const [conversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'Q1 Sales Analysis',
      lastMessage: 'What were total sales in Q1 2024?',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      messageCount: 8
    },
    {
      id: '2',
      title: 'Customer Segmentation',
      lastMessage: 'Show me sales by region and customer type',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      messageCount: 12
    },
    {
      id: '3',
      title: 'Pipeline Review',
      lastMessage: 'Who are our top prospects this quarter?',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      messageCount: 5
    }
  ]);

  const handleNewConversation = () => {
    const newId = (conversations.length + 1).toString();
    setActiveConversationId(newId);
  };

  const handleDeleteConversation = (id: string) => {
    // In a real app, this would update the conversations state
    console.log('Delete conversation:', id);
  };

  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar */}
      <div className={cn(
        "transition-all duration-300 ease-in-out border-r border-border",
        sidebarOpen ? "w-80" : "w-0 overflow-hidden"
      )}>
        <Sidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={setActiveConversationId}
          onNewConversation={handleNewConversation}
          onDeleteConversation={handleDeleteConversation}
          className="h-full"
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
          <div className="h-full px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden"
              >
                {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                <h1 className="text-lg font-semibold">SalesChatGPT</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {showMetricsPanel && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMetricsOpen(!metricsOpen)}
                  className="hidden md:flex"
                >
                  <BarChart3 className="h-4 w-4" />
                </Button>
              )}
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 flex min-h-0">
          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {children}
          </div>

          {/* Metrics Panel */}
          {showMetricsPanel && (
            <div className={cn(
              "transition-all duration-300 ease-in-out border-l border-border bg-card/30",
              metricsOpen ? "w-80" : "w-0 overflow-hidden",
              "hidden md:block"
            )}>
              <div className="h-full p-4 overflow-y-auto">
                <MetricsPanel />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};
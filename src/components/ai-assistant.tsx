import { useState, useRef, useEffect, useCallback } from 'react';
import { Node, Edge } from 'reactflow';
import { 
  X, 
  Bot, 
  Send, 
  Lightbulb, 
  GitBranch, 
  Search, 
  MessageCircle,
  Sparkles,
  Target,
  TrendingUp
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';

interface AIAssistantProps {
  nodes: Node[];
  edges: Edge[];
  onAddNode: (shape: string) => void;
  onApplyLayout: (layout: string) => void;
  onClose: () => void;
}

interface ChatMessage {
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export function AIAssistant({ nodes, edges, onAddNode, onApplyLayout, onClose }: AIAssistantProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      type: 'ai',
      content: 'Hello! I\'m your AI assistant. I can help you with suggestions for new nodes, optimal layouts, and answer questions about your concept map.',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  const suggestions = [
    {
      icon: Lightbulb,
      title: 'Add Related Concepts',
      description: 'I can suggest new nodes based on your existing concepts',
      action: () => handleSuggestion('suggest-nodes'),
    },
    {
      icon: GitBranch,
      title: 'Optimize Layout',
      description: 'Let me recommend the best layout for your map structure',
      action: () => handleSuggestion('optimize-layout'),
    },
    {
      icon: Search,
      title: 'Analyze Map',
      description: 'Find missing connections or identify gaps in your concept map',
      action: () => handleSuggestion('analyze-map'),
    },
    {
      icon: TrendingUp,
      title: 'Expand Ideas',
      description: 'Suggest ways to elaborate on your selected concepts',
      action: () => handleSuggestion('expand-ideas'),
    },
  ];

  const handleSuggestion = useCallback((type: string) => {
    let response = '';
    
    switch (type) {
      case 'suggest-nodes':
        response = 'Based on your current nodes, I suggest adding: "Implementation Strategy", "Risk Assessment", and "Success Metrics". These would complement your existing concept map structure.';
        // Mock adding a node
        const timeout1 = setTimeout(() => onAddNode('rectangle'), 1000);
        timeoutRefs.current.push(timeout1);
        break;
      case 'optimize-layout':
        response = 'Your map would benefit from a radial layout with your main concept at the center. This will help show the relationships more clearly.';
        const timeout2 = setTimeout(() => onApplyLayout('radial'), 1000);
        timeoutRefs.current.push(timeout2);
        break;
      case 'analyze-map':
        response = `I analyzed your map with ${nodes.length} nodes and ${edges.length} connections. Consider adding connections between related concepts and grouping similar ideas together.`;
        break;
      case 'expand-ideas':
        response = 'To expand your concepts, consider adding sub-categories, examples, or implementation details for each main idea. This will create a more comprehensive map.';
        break;
    }

    const aiMessage: ChatMessage = {
      type: 'ai',
      content: response,
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, aiMessage]);
  }, [nodes.length, edges.length, onAddNode, onApplyLayout]);

  const handleSendMessage = useCallback(() => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, userMessage]);

    // Mock AI response
    const timeout = setTimeout(() => {
      const aiResponse: ChatMessage = {
        type: 'ai',
        content: 'That\'s an interesting question! Based on your concept map, I can see several opportunities for improvement. Would you like me to suggest specific additions or modifications?',
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);
    timeoutRefs.current.push(timeout);

    setInput('');
  }, [input]);

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-card border-l border-border shadow-lg z-50">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-500" />
            <h2 className="font-semibold">AI Assistant</h2>
            <Badge variant="secondary" className="text-xs">
              Expert Mode
            </Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Map Stats */}
        <div className="p-4 bg-muted/30">
          <h3 className="font-medium mb-2 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Map Overview
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Nodes:</span>
              <span className="ml-2 font-medium">{nodes.length}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Connections:</span>
              <span className="ml-2 font-medium">{edges.length}</span>
            </div>
          </div>
        </div>

        {/* Suggestions */}
        <div className="p-4 space-y-3">
          <h3 className="font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Smart Suggestions
          </h3>
          <div className="space-y-2">
            {suggestions.map((suggestion) => (
              <Card key={suggestion.title} className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardContent className="p-3" onClick={suggestion.action}>
                  <div className="flex items-start gap-3">
                    <suggestion.icon className="w-4 h-4 mt-0.5 text-blue-500" />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{suggestion.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {suggestion.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Separator />

        {/* Chat */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            <h3 className="font-medium">Chat with Map</h3>
          </div>

          <ScrollArea className="flex-1 px-4">
            <div className="space-y-4 pb-4">
              {chatMessages.map((message, index) => (
                <div
                  key={`${message.timestamp.getTime()}-${index}`}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg text-sm ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-muted border'
                    }`}
                  >
                    <p>{message.content}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Chat Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your map..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button onClick={handleSendMessage} size="sm">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
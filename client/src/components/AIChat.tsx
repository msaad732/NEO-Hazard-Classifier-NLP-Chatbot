import { useState, useRef, useEffect } from 'react';
import { GlassmorphicPanel } from './GlassmorphicPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  typing?: boolean;
}

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      content: 'PLANETARY DEFENCE HUB ONLINE. Ready to analyze asteroid threats and impact scenarios.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const simulateTyping = (text: string, messageId: string) => {
    let currentText = '';
    let index = 0;

    const typeInterval = setInterval(() => {
      if (index < text.length) {
        currentText += text[index];
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId ? { ...msg, content: currentText } : msg
          )
        );
        index++;
      } else {
        clearInterval(typeInterval);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId ? { ...msg, typing: false } : msg
          )
        );
        setIsTyping(false);
      }
    }, 30);
  };

  const handleSend = () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const responses = [
      'Based on current trajectory analysis, the asteroid poses a minimal threat. Estimated miss distance: 450,000 km.',
      'Impact probability calculated at 0.003%. Recommend continued monitoring for the next 72 hours.',
      'Simulating deflection scenarios... Nuclear option success rate: 67%. Kinetic impactor success rate: 82%.',
      'Historical data suggests similar objects have passed safely. However, I recommend activating early warning protocols.',
    ];

    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: '',
        typing: true,
      };
      setMessages((prev) => [...prev, aiMessage]);
      
      const response = responses[Math.floor(Math.random() * responses.length)];
      simulateTyping(response, aiMessage.id);
    }, 500);
  };

  return (
    <GlassmorphicPanel className="flex flex-col h-[600px]" data-testid="panel-chat">
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-primary/30">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <h2 className="text-xl font-bold text-primary font-sans">
          AI Defense Analyst
        </h2>
      </div>

      <ScrollArea className="flex-1 pr-4 mb-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              data-testid={`message-${message.role}-${message.id}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-md font-mono text-sm ${
                  message.role === 'user'
                    ? 'bg-accent/20 border border-accent text-foreground'
                    : 'bg-primary/10 border border-primary text-primary'
                }`}
              >
                {message.content}
                {message.typing && <span className="animate-pulse">_</span>}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="flex gap-2">
        <Input
          data-testid="input-chat"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Query defense systems..."
          className="flex-1 bg-input border-primary font-mono text-foreground"
          disabled={isTyping}
        />
        <Button
          data-testid="button-send"
          onClick={handleSend}
          disabled={isTyping || !input.trim()}
          size="icon"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </GlassmorphicPanel>
  );
}

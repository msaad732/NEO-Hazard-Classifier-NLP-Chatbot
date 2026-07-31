import { useState, useRef, useEffect, useCallback } from 'react';
import { Panel } from './Panel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowUp, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  streaming?: boolean;
  failed?: boolean;
}

const GREETING: Message = {
  id: 'greeting',
  role: 'assistant',
  content:
    'Console ready. Ask about tracked objects, impact scenarios, or deflection strategy.',
};

const PROMPTS = [
  'How close will Apophis pass in 2029?',
  'What is a kinetic impactor mission?',
  'Which objects here are flagged hazardous?',
];

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingRef = useRef<number | null>(null);

  useEffect(() => {
    const node = scrollRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages]);

  // The typewriter runs on an interval; without this it survives unmount and
  // keeps calling setState on a dead component.
  useEffect(() => {
    return () => {
      if (typingRef.current !== null) window.clearInterval(typingRef.current);
    };
  }, []);

  const streamIn = useCallback((text: string, id: string) => {
    if (typingRef.current !== null) window.clearInterval(typingRef.current);

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, content: text, streaming: false } : m)),
      );
      setBusy(false);
      return;
    }

    let index = 0;
    typingRef.current = window.setInterval(() => {
      // Step by a few characters so long answers do not take a minute to land.
      index = Math.min(index + 3, text.length);
      const slice = text.slice(0, index);
      const done = index >= text.length;

      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, content: slice, streaming: !done } : m)),
      );

      if (done && typingRef.current !== null) {
        window.clearInterval(typingRef.current);
        typingRef.current = null;
        setBusy(false);
      }
    }, 16);
  }, []);

  const send = useCallback(
    async (raw: string) => {
      const question = raw.trim();
      if (!question || busy) return;

      const userMessage: Message = {
        id: `u-${Date.now()}`,
        role: 'user',
        content: question,
      };
      setMessages((prev) => [...prev, userMessage]);
      setInput('');
      setBusy(true);

      const replyId = `a-${Date.now()}`;

      try {
        const response = await fetch('/api/chatbot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question }),
        });

        if (!response.ok) throw new Error(`Request failed with status ${response.status}`);

        const data = await response.json();
        const answer =
          data.response || data.answer || data.message || 'The service returned an empty answer.';

        setMessages((prev) => [
          ...prev,
          { id: replyId, role: 'assistant', content: '', streaming: true },
        ]);
        streamIn(answer, replyId);
      } catch (err) {
        console.error('Chatbot request failed:', err);
        setMessages((prev) => [
          ...prev,
          {
            id: replyId,
            role: 'assistant',
            content: 'Could not reach the analyst service. Check your connection and try again.',
            failed: true,
          },
        ]);
        setBusy(false);
      }
    },
    [busy, streamIn],
  );

  const reset = () => {
    if (typingRef.current !== null) {
      window.clearInterval(typingRef.current);
      typingRef.current = null;
    }
    setMessages([GREETING]);
    setInput('');
    setBusy(false);
  };

  const isFresh = messages.length === 1;

  return (
    <div className="mx-auto max-w-3xl">
      <Panel className="flex h-[min(72dvh,640px)] flex-col" flush data-testid="panel-chat">
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-foreground">
              Defence analyst
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Answers are generated and may be wrong. Verify before acting.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={reset}
            disabled={isFresh}
            data-testid="button-reset-chat"
          >
            <RotateCcw aria-hidden="true" />
            Clear
          </Button>
        </div>

        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn('flex', message.role === 'user' ? 'justify-end' : 'justify-start')}
              data-testid={`message-${message.role}-${message.id}`}
            >
              <div
                className={cn(
                  'max-w-[85%] rounded-md px-3.5 py-2.5 text-sm leading-relaxed',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-border bg-foreground/[0.03] text-foreground',
                  message.failed && 'border-status-critical/40 text-status-critical',
                )}
              >
                <span className="whitespace-pre-wrap">{message.content}</span>
                {message.streaming && (
                  <span className="animate-caret ml-0.5 inline-block" aria-hidden="true">
                    |
                  </span>
                )}
              </div>
            </div>
          ))}

          {isFresh && (
            <div className="pt-2">
              <p className="field-label">Try asking</p>
              <div className="mt-3 flex flex-col items-start gap-2">
                {PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => send(prompt)}
                    className="rounded-md border border-border px-3 py-1.5 text-left text-sm text-muted-foreground transition-colors hover:border-foreground/25 hover:text-foreground"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <form
          className="flex items-center gap-2 border-t border-border px-5 py-3"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <Input
            data-testid="input-chat"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about an object or a scenario"
            aria-label="Message the defence analyst"
            disabled={busy}
            className="flex-1"
          />
          <Button
            type="submit"
            size="icon"
            disabled={busy || !input.trim()}
            data-testid="button-send"
            aria-label="Send message"
          >
            <ArrowUp aria-hidden="true" />
          </Button>
        </form>
      </Panel>
    </div>
  );
}

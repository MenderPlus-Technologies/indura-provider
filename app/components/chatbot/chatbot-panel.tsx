'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Paperclip, Smile, Image as ImageIcon, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { apiPost } from '@/app/utils/api';
import { useToast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';

interface ChatbotPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface MendyResponse {
  response: string;
}

export const ChatbotPanel = ({ isOpen, onClose }: ChatbotPanelProps) => {
  const [input, setInput] = useState('');
  const [linkDraft, setLinkDraft] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hi, I\'m Mendy AI. How can I help you today?',
    },
  ]);
  const [isSending, setIsSending] = useState(false);
  const { showToast } = useToast();

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Mount/unmount with smooth enter/exit animations
  const [mounted, setMounted] = useState(isOpen);
  const [visible, setVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      // Let the DOM paint once before enabling the "visible" styles
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
      const timeout = setTimeout(() => setMounted(false), 200);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  const insertIntoInput = (snippet: string) => {
    // Insert text at the current cursor position in the textarea
    if (!textareaRef.current) {
      setInput((prev) => prev + snippet);
      return;
    }

    const el = textareaRef.current;
    const start = el.selectionStart ?? input.length;
    const end = el.selectionEnd ?? input.length;

    const nextValue = input.slice(0, start) + snippet + input.slice(end);
    setInput(nextValue);

    // Restore focus and place caret after inserted text
    requestAnimationFrame(() => {
      el.focus();
      const caretPos = start + snippet.length;
      el.selectionStart = caretPos;
      el.selectionEnd = caretPos;
    });
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
    };

    // Optimistically append user message
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setShowEmojiPicker(false);
    setShowLinkInput(false);
    setIsSending(true);

    try {
      // Route finance-related questions to the dedicated analysis endpoint
      const lower = trimmed.toLowerCase();
      const isFinanceQuestion = [
        'revenue',
        'profit',
        'loss',
        'income',
        'expense',
        'cash flow',
        'cashflow',
        'financial',
        'finances',
        'money',
        'transactions',
        'payments',
        'subscription revenue',
      ].some((keyword) => lower.includes(keyword));

      const endpoint = isFinanceQuestion ? '/ai/analyze-finances' : '/ai/chat/provider';

      const { data, error } = await apiPost<MendyResponse>(endpoint, {
        message: trimmed,
      });

      if (error || !data?.response) {
        showToast(error?.message || 'Mendy is unavailable right now. Please try again.', 'error');
        return;
      }

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.response,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      showToast('Failed to contact Mendy. Please check your connection and try again.', 'error');
    } finally {
      setIsSending(false);
    }
  };

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-45 bg-black/40 transition-opacity duration-200 ease-out',
          visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Chat Widget */}
      <div
        className={cn(
          'fixed inset-x-3 bottom-4 sm:inset-auto sm:bottom-6 sm:right-8 w-full sm:w-[720px] md:w-[550px] max-w-[95vw] max-h-[95vh] min-h-[680px] sm:min-h-[720px] bg-white dark:bg-gray-900 shadow-2xl rounded-2xl border border-gray-200 dark:border-gray-800 z-50 flex flex-col',
          'transition-all duration-200 ease-out',
          visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-3 scale-95'
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-800 rounded-t-2xl">
          <div className="w-10 h-10 bg-[#009688] rounded-lg flex items-center justify-center shrink-0">
            <Image
              src="/mendy-ai.svg"
              alt="Mendy AI"
              width={24}
              height={24}
              className="w-6 h-6"
            />
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-[#344054] dark:text-white text-base">Mendy AI</h2>
            <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#E7FEF8] dark:bg-teal-900/30 border border-[#C6EDE5] dark:border-teal-800 mt-1">
              <span className="text-xs font-medium text-[#287F6E] dark:text-teal-400">Always here to assist</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 cursor-pointer text-gray-700 dark:text-gray-300"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start ${
                  isUser ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] text-sm ${
                    isUser
                      ? 'bg-[#009688] text-white rounded-br-none'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.content}</p>
                </div>
              </div>
            );
          })}

          {/* Typing indicator for Mendy while awaiting response */}
          {isSending && (
            <div className="flex items-start justify-start">
              <div className="rounded-lg px-4 py-2 max-w-[80%] text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-tl-none">
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-300 animate-bounce [animation-delay:-0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-300 animate-bounce [animation-delay:-0.1s]" />
                  <span className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-300 animate-bounce" />
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-4 rounded-b-2xl space-y-2">
          {/* Text area */}
          <div className="px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Mendy anything..."
              className="w-full bg-transparent border-none outline-none text-sm leading-snug text-gray-900 dark:text-white placeholder:text-xs placeholder:text-gray-500 dark:placeholder:text-gray-400 resize-none max-h-32"
              rows={2}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
          </div>

          {/* Icons row + send */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowEmojiPicker(false);
                  setShowLinkInput((prev) => !prev);
                }}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors cursor-pointer"
                aria-label="Attach link"
              >
                <Paperclip className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLinkInput(false);
                  setShowEmojiPicker((prev) => !prev);
                }}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors cursor-pointer"
                aria-label="Insert emoji"
              >
                <Smile className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowEmojiPicker(false);
                  setShowLinkInput(false);
                  fileInputRef.current?.click();
                }}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors cursor-pointer"
                aria-label="Attach file"
              >
                <ImageIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={() => {
                  showToast('Files selected – this version only sends text to Mendy.', 'info');
                }}
              />
            </div>

            <Button
              onClick={handleSend}
              disabled={isSending || !input.trim()}
              className="bg-[#009688] hover:bg-[#008577] disabled:opacity-60 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              <span>Send</span>
            </Button>
          </div>

          {/* Inline link input */}
          {showLinkInput && (
            <div className="mt-1 flex items-center gap-2 px-1">
              <input
                type="url"
                value={linkDraft}
                onChange={(e) => setLinkDraft(e.target.value)}
                placeholder="Paste or type a link"
                className="flex-1 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#009688] focus:border-[#009688]"
              />
              <Button
                type="button"
                size="sm"
                disabled={!linkDraft.trim()}
                className="bg-[#009688] hover:bg-[#008577] text-white cursor-pointer text-xs px-3 py-1"
                onClick={() => {
                  if (!linkDraft.trim()) return;
                  insertIntoInput((input ? '\n' : '') + linkDraft.trim());
                  setLinkDraft('');
                  setShowLinkInput(false);
                }}
              >
                Add
              </Button>
            </div>
          )}

          {/* Simple emoji picker */}
          {showEmojiPicker && (
            <div className="mt-1 px-1">
              <div className="inline-flex flex-wrap gap-1 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1.5 text-lg">
                {['🙂', '😊', '🤝', '📊', '💰', '❤️', '👏', '👍'].map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    className="px-1 cursor-pointer hover:scale-110 transition-transform"
                    onClick={() => insertIntoInput(`${emoji} `)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

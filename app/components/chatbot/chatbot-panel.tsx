'use client';

import { useState } from 'react';
import { X, Paperclip, Smile, Image as ImageIcon, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatbotPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatbotPanel = ({ isOpen, onClose }: ChatbotPanelProps) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      // Handle send message logic here
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 bg-opacity-10 z-[45] transition-opacity"
        onClick={onClose}
      />

      {/* Side Panel */}
      <div className="fixed right-0 top-0 h-full w-[400px] bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-white">
          <div className="w-10 h-10 bg-[#009688] rounded-lg flex items-center justify-center shrink-0">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-gray-900 text-base">Medy Ai</h2>
            <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#E7FEF8] border border-[#C6EDE5] mt-1">
              <span className="text-xs font-medium text-[#287F6E]">Always here to assist</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 bg-white">
          <div className="flex items-start gap-2 mb-4">
            <div className="bg-gray-100 rounded-lg rounded-tl-none px-4 py-2 max-w-[80%]">
              <p className="text-sm text-gray-700">Hi, how can I help you today?</p>
            </div>
          </div>
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-200 bg-white p-4">
          <div className="mb-3">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ac vehicula mollis facilisi elementum. Pellentesque sollicitudin nulla tristique sit mauris. Cras leo morbi magna egestas pellentesque metus."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#009688] focus:border-[#009688] text-sm"
              rows={3}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                <Paperclip className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                <Smile className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                <ImageIcon className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <Button
              onClick={handleSend}
              className="bg-[#009688] hover:bg-[#008577] text-white px-6 py-2 rounded-lg cursor-pointer"
            >
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

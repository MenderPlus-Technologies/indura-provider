'use client';

import { useState } from 'react';
import { X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { type Member } from './member-utils';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipients: Member[];
  recipientType: 'all' | 'selected' | 'individual';
}

export const NotificationModal = ({ isOpen, onClose, recipients, recipientType }: NotificationModalProps) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [link, setLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) {
      console.log('Please fill in title and message');
      return;
    }

    setIsLoading(true);

    // Mock API call - simulate network delay
    setTimeout(() => {
      const success = Math.random() > 0.1; // 90% success rate for demo

      if (success) {
        console.log('Notification sent successfully', {
          title,
          message,
          link: link.trim() || undefined,
          recipientCount: recipients.length,
          recipientType,
        });
        // Reset form
        setTitle('');
        setMessage('');
        setLink('');
        setIsLoading(false);
        onClose();
      } else {
        console.log('Failed to send notification. Please try again.');
        setIsLoading(false);
      }
    }, 1500);
  };

  const handleCancel = () => {
    setTitle('');
    setMessage('');
    setLink('');
    onClose();
  };

  if (!isOpen) return null;

  const getRecipientText = () => {
    if (recipientType === 'all') {
      return 'All customers';
    } else if (recipientType === 'selected') {
      return `${recipients.length} selected customer${recipients.length !== 1 ? 's' : ''}`;
    } else {
      return recipients[0]?.name || 'Customer';
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 bg-opacity-10 z-45 transition-opacity"
        onClick={handleCancel}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Send Notification
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Sending to: {getRecipientText()}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              className="h-8 w-8 cursor-pointer text-gray-700 dark:text-gray-300"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Form */}
          <div className="flex-1 p-6 space-y-6">
            <div>
              <Label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter notification title"
                className="w-full"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="message" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Message <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter notification message"
                className="w-full min-h-32"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="link" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Optional Link/Action
              </Label>
              <Input
                id="link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://example.com (optional)"
                className="w-full"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Add a link or action URL that will be included in the notification
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              disabled={isLoading || !title.trim() || !message.trim()}
              className="bg-[#009688] hover:bg-[#008577] text-white cursor-pointer"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Notification
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

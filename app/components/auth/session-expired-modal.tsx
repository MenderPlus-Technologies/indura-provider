'use client';

import { AlertTriangle, Lock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

type SessionExpiredModalProps = {
  isOpen: boolean;
  onClose?: () => void;
  onReLogin: () => void;
};

export function SessionExpiredModal({ isOpen, onClose, onReLogin }: SessionExpiredModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40 transition-opacity" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-md flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-yellow-700 dark:text-yellow-300" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Session expired</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">For your security, we signed you out.</p>
              </div>
            </div>
            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 cursor-pointer text-gray-700 dark:text-gray-300"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                <Lock className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </div>
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  You’ve been inactive for <span className="font-semibold">10 minutes</span>. Please sign in again to
                  continue.
                </p>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Tip: Any activity (scrolling, typing, clicking) keeps your session active.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800">
            {onClose && (
              <Button variant="outline" onClick={onClose} className="cursor-pointer">
                Stay here
              </Button>
            )}
            <Button onClick={onReLogin} className="bg-[#009688] hover:bg-[#008577] text-white cursor-pointer">
              Sign in again
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}


'use client';

import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateProviderCustomerMutation } from '@/app/store/apiSlice';
import { useToast } from '@/components/ui/toast';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddCustomerModal = ({ isOpen, onClose, onSuccess }: AddCustomerModalProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  const { showToast } = useToast();
  const [createCustomer, { isLoading }] = useCreateProviderCustomerMutation();

  if (!isOpen) return null;

  const handleClose = () => {
    if (isLoading) return;
    setName('');
    setEmail('');
    setPhone('');
    setStatus('active');
    onClose();
  };

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !phone.trim()) {
      showToast('Please fill in name, email and phone', 'error');
      return;
    }

    try {
      const response = await createCustomer({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        status,
      }).unwrap();

      showToast(response.message || 'Customer added successfully', 'success');
      handleClose();
      onSuccess?.();
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || error?.message || 'Failed to add customer. Please try again.';
      showToast(errorMessage, 'error');
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 bg-opacity-10 z-45 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
            <div>
              <h2 className="text-lg font-semibold text-[#344054] dark:text-white">
                Add customer
              </h2>
              <p className="text-sm text-[#475467] dark:text-gray-400 mt-1">
                Create a new customer to start tracking their activity.
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-8 w-8 cursor-pointer text-gray-700 dark:text-gray-300"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Form */}
          <div className="flex-1 p-6 space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-[#344054] dark:text-gray-300 mb-2 block">
                Full name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Tunde Olusegun"
                className="w-full"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium text-[#344054] dark:text-gray-300 mb-2 block">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. tundeolusegun@example.com"
                className="w-full"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-sm font-medium text-[#344054] dark:text-gray-300 mb-2 block">
                Phone number
              </Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 0804xxxxxxx"
                className="w-full"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="status" className="text-sm font-medium text-[#344054] dark:text-gray-300 mb-2 block">
                Status
              </Label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm text-[#344054] dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-[#009688] hover:bg-[#008577] text-white cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isLoading ? 'Saving...' : 'Save customer'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};


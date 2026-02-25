'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  useGetProviderCustomerQuery,
  useUpdateProviderCustomerMutation,
} from '@/app/store/apiSlice';
import { useToast } from '@/components/ui/toast';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';

interface CustomerDetailsSheetProps {
  isOpen: boolean;
  customerId: string | null;
  onClose: () => void;
  onUpdated?: () => void;
}

export const CustomerDetailsModal = ({
  isOpen,
  customerId,
  onClose,
  onUpdated,
}: CustomerDetailsSheetProps) => {
  const { showToast } = useToast();

  const { data: customer, isLoading, isError, refetch } =
    useGetProviderCustomerQuery(customerId as string, {
      skip: !customerId || !isOpen,
    });

  const [updateCustomer, { isLoading: isUpdating }] =
    useUpdateProviderCustomerMutation();

  const [name, setName] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  useEffect(() => {
    if (customer && isOpen) {
      setName(customer.name || '');
      setStatus((customer.status as 'active' | 'inactive') || 'active');
    }
  }, [customer, isOpen]);

  if (!customerId) return null;

  const handleSave = async () => {
    if (!customerId) return;

    try {
      const response = await updateCustomer({
        customerId,
        name: name.trim(),
        status,
      }).unwrap();

      showToast(
        response.message || 'Customer updated successfully',
        'success'
      );
      await refetch();
      onUpdated?.();
      onClose();
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        'Failed to update customer. Please try again.';
      showToast(errorMessage, 'error');
    }
  };

  const isBusy = isLoading || isUpdating;

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isUpdating) {
          onClose();
        }
      }}
    >
      <SheetContent
        side="right"
        className="max-w-xl w-full border-l border-gray-200/80 dark:border-gray-800/80 flex flex-col p-0"
      >
        <SheetHeader className="px-6 py-4">
          <div className="flex flex-col gap-1">
            <SheetTitle className="text-[#344054] dark:text-white">
              Customer details
            </SheetTitle>
            <SheetDescription className="text-sm text-[#475467] dark:text-gray-400">
              View and update basic information for this customer.
            </SheetDescription>
          </div>
        </SheetHeader>

        {/* Body */}
        <div className="flex-1 px-6 py-4 space-y-4 overflow-y-auto">
            {isError && (
              <div className="mb-3 rounded-md bg-red-50 dark:bg-red-900/20 px-3 py-2 text-xs text-red-600 dark:text-red-300 flex items-center justify-between">
                <span>Failed to load customer details.</span>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="underline text-red-600 dark:text-red-300"
                >
                  Retry
                </button>
              </div>
            )}

            {isLoading && !customer ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-[#009688]" />
              </div>
            ) : customer ? (
              <>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label
                      htmlFor="name"
                      className="text-sm font-medium text-[#344054] dark:text-gray-300 mb-1.5 block"
                    >
                      Full name
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isBusy}
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-[#344054] dark:text-gray-300 mb-1.5 block"
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      value={customer.email}
                      disabled
                      className="bg-gray-50 dark:bg-gray-800"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="phone"
                      className="text-sm font-medium text-[#344054] dark:text-gray-300 mb-1.5 block"
                    >
                      Phone number
                    </Label>
                    <Input
                      id="phone"
                      value={customer.phone}
                      disabled
                      className="bg-gray-50 dark:bg-gray-800"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="status"
                      className="text-sm font-medium text-[#344054] dark:text-gray-300 mb-1.5 block"
                    >
                      Status
                    </Label>
                    <select
                      id="status"
                      value={status}
                      onChange={(e) =>
                        setStatus(e.target.value as 'active' | 'inactive')
                      }
                      disabled={isBusy}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm text-[#344054] dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100 dark:border-gray-800 mt-2">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-[#475467] dark:text-gray-400">
                      Source
                    </p>
                    <p className="text-sm text-[#344054] dark:text-white">
                      {customer.source || 'N/A'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-[#475467] dark:text-gray-400">
                      Has app account
                    </p>
                    <p className="text-sm text-[#344054] dark:text-white">
                      {customer.hasAppAccount ? 'Yes' : 'No'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-[#475467] dark:text-gray-400">
                      Created at
                    </p>
                    <p className="text-sm text-[#344054] dark:text-white">
                      {new Date(customer.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </>
            ) : null}
          </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-800">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isBusy}
            className="cursor-pointer"
          >
            Close
          </Button>
          <Button
            onClick={handleSave}
            disabled={isBusy}
            className="bg-[#009688] hover:bg-[#008577] text-white cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isBusy && <Loader2 className="h-4 w-4 animate-spin" />}
            {isBusy ? 'Saving...' : 'Save changes'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};


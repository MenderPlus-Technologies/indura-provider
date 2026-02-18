'use client';

import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { subscriptionPlans, type Subscription, deriveSubscriptionStatus } from './subscription-utils';
import { useGetProviderCustomersQuery, type ProviderCustomer } from '@/app/store/apiSlice';

interface CreateSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (subscription: Subscription) => void;
}

// Plan duration mapping (in days)
const planDurations: Record<string, number> = {
  'Monthly Membership': 30,
  'Annual Membership': 365,
  'Basic Plan': 30,
  'Pro Plan': 30,
  'Advanced Plan': 30,
  'Premium Plan': 30,
};

export const CreateSubscriptionModal = ({ isOpen, onClose, onSuccess }: CreateSubscriptionModalProps) => {
  const { data: customersData, isLoading: isLoadingCustomers, isError: isCustomersError, refetch } = useGetProviderCustomersQuery();
  const customers: ProviderCustomer[] = customersData?.customers ?? [];

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLoading = isSubmitting || isLoadingCustomers;

  // Auto-suggest end date when plan or start date changes
  useEffect(() => {
    if (selectedPlan && startDate) {
      const duration = planDurations[selectedPlan] || 30; // Default to 30 days
      const start = new Date(startDate);
      const end = new Date(start);
      end.setDate(end.getDate() + duration);
      setEndDate(end.toISOString().split('T')[0]);
    }
  }, [selectedPlan, startDate]);

  // Set default start date to today
  useEffect(() => {
    if (isOpen && !startDate) {
      const today = new Date();
      setStartDate(today.toISOString().split('T')[0]);
    }
  }, [isOpen, startDate]);

  const handleSubmit = async () => {
    if (!selectedCustomerId || !selectedPlan || !startDate || !endDate) {
      console.log('Please fill in all required fields');
      return;
    }

    const customer = customers.find(c => c._id === selectedCustomerId);
    if (!customer) {
      console.log('Selected customer not found');
      return;
    }

    setIsSubmitting(true);

    // Mock API call - simulate network delay
    setTimeout(() => {
      const success = Math.random() > 0.1; // 90% success rate for demo

      if (success) {
        const newSubscription: Subscription = {
          id: `sub-${Date.now()}`,
          memberName: customer.name,
          memberEmail: customer.email,
          plan: selectedPlan,
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
          status: deriveSubscriptionStatus(
            new Date(startDate).toISOString(),
            new Date(endDate).toISOString()
          ),
        };

        console.log('Subscription created successfully', newSubscription);
        onSuccess(newSubscription);
        
        // Reset form
        setSelectedCustomerId('');
        setSelectedPlan('');
        setStartDate('');
        setEndDate('');
        setNotes('');
        setIsSubmitting(false);
        onClose();
      } else {
        console.log('Failed to create subscription. Please try again.');
        setIsSubmitting(false);
      }
    }, 1500);
  };

  const handleCancel = () => {
    setSelectedCustomerId('');
    setSelectedPlan('');
    setStartDate('');
    setEndDate('');
    setNotes('');
    onClose();
  };

  if (!isOpen) return null;

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
                Create New Subscription
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Add a new subscription for a customer
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
              <Label htmlFor="member" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Customer <span className="text-red-500">*</span>
              </Label>
              <Select
                value={selectedCustomerId}
                onValueChange={setSelectedCustomerId}
                disabled={isLoading || customers.length === 0}
              >
                <SelectTrigger id="member" className="w-full">
                  <SelectValue placeholder={isLoadingCustomers ? "Loading customers..." : "Select a customer"} />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800">
                  {customers.map((customer) => (
                    <SelectItem key={customer._id} value={customer._id}>
                      {customer.name} ({customer.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="plan" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Plan <span className="text-red-500">*</span>
              </Label>
              <Select value={selectedPlan} onValueChange={setSelectedPlan} disabled={isLoading}>
                <SelectTrigger id="plan" className="w-full">
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800">
                  {subscriptionPlans.map((plan) => (
                    <SelectItem key={plan} value={plan}>
                      {plan}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Start Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="endDate" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  End Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full"
                  disabled={isLoading}
                  min={startDate}
                />
                {selectedPlan && startDate && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Auto-suggested based on {planDurations[selectedPlan] || 30} day duration
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="notes" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional notes about this subscription..."
                className="w-full min-h-24"
                disabled={isLoading}
              />
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
              onClick={handleSubmit}
              disabled={isLoading || !selectedCustomerId || !selectedPlan || !startDate || !endDate}
              className="bg-[#009688] hover:bg-[#008577] text-white cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                'Create Subscription'
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

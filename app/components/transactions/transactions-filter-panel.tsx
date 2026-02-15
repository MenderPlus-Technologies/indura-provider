'use client';

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Filter, Check } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export interface FilterState {
  status: string[];
  type: string[];
  search: string;
  minAmount: string;
  maxAmount: string;
  dateFrom: string;
  dateTo: string;
}

interface TransactionsFilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
}

export const TransactionsFilterPanel = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onReset,
}: TransactionsFilterPanelProps) => {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  const handleStatusToggle = (status: string) => {
    const newStatus = localFilters.status.includes(status)
      ? localFilters.status.filter(s => s !== status)
      : [...localFilters.status, status];
    
    setLocalFilters({ ...localFilters, status: newStatus });
  };

  const handleTypeToggle = (type: string) => {
    const newType = localFilters.type.includes(type)
      ? localFilters.type.filter(t => t !== type)
      : [...localFilters.type, type];
    
    setLocalFilters({ ...localFilters, type: newType });
  };

  const handleApply = () => {
    onFilterChange(localFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: FilterState = {
      status: [],
      type: [],
      search: '',
      minAmount: '',
      maxAmount: '',
      dateFrom: '',
      dateTo: '',
    };
    setLocalFilters(resetFilters);
    onReset();
    onClose();
  };

  const activeFilterCount = 
    localFilters.status.length +
    localFilters.type.length +
    (localFilters.search ? 1 : 0) +
    (localFilters.minAmount || localFilters.maxAmount ? 1 : 0) +
    (localFilters.dateFrom || localFilters.dateTo ? 1 : 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70" onClick={onClose}>
      <Card 
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-row items-center justify-between border-b border-gray-200 dark:border-gray-700 px-4 pb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Filter Transactions
            </h2>
            {activeFilterCount > 0 && (
              <Badge className="bg-[#009688] text-white">
                {activeFilterCount}
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <CardContent className="p-6 space-y-6">
          {/* Search */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Search
            </Label>
            <Input
              placeholder="Search by payer, email, or reference..."
              value={localFilters.search}
              onChange={(e) => setLocalFilters({ ...localFilters, search: e.target.value })}
              className="w-full"
            />
          </div>

          {/* Status Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </Label>
            <div className="flex flex-wrap gap-2">
              {['Settled', 'Pending', 'Failed'].map((status) => (
                <Button
                  key={status}
                  variant={localFilters.status.includes(status) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStatusToggle(status)}
                  className={`${
                    localFilters.status.includes(status)
                      ? 'bg-[#009688] hover:bg-[#008577] text-white'
                      : ''
                  }`}
                >
                  {localFilters.status.includes(status) && (
                    <Check className="h-3 w-3 mr-1" />
                  )}
                  {status}
                </Button>
              ))}
            </div>
          </div>

          {/* Type Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Type
            </Label>
            <div className="flex flex-wrap gap-2">
              {['credit', 'debit'].map((type) => (
                <Button
                  key={type}
                  variant={localFilters.type.includes(type) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTypeToggle(type)}
                  className={`capitalize ${
                    localFilters.type.includes(type)
                      ? 'bg-[#009688] hover:bg-[#008577] text-white'
                      : ''
                  }`}
                >
                  {localFilters.type.includes(type) && (
                    <Check className="h-3 w-3 mr-1" />
                  )}
                  {type}
                </Button>
              ))}
            </div>
          </div>

          {/* Amount Range */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Amount Range (₦)
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs text-gray-500 dark:text-gray-400">Min Amount</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={localFilters.minAmount}
                  onChange={(e) => setLocalFilters({ ...localFilters, minAmount: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-gray-500 dark:text-gray-400">Max Amount</Label>
                <Input
                  type="number"
                  placeholder="No limit"
                  value={localFilters.maxAmount}
                  onChange={(e) => setLocalFilters({ ...localFilters, maxAmount: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Date Range
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs text-gray-500 dark:text-gray-400">From</Label>
                <Input
                  type="date"
                  value={localFilters.dateFrom}
                  onChange={(e) => setLocalFilters({ ...localFilters, dateFrom: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-gray-500 dark:text-gray-400">To</Label>
                <Input
                  type="date"
                  value={localFilters.dateTo}
                  onChange={(e) => setLocalFilters({ ...localFilters, dateTo: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex-1 sm:flex-initial"
            >
              Reset
            </Button>
            <Button
              onClick={handleApply}
              className="flex-1 sm:flex-initial bg-[#009688] hover:bg-[#008577] text-white"
            >
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

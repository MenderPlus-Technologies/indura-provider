'use client';

import ProviderPayoutsModuleContent from '@/app/components/payouts/provider-payouts-module-content';
import { useGetProviderSettingsQuery } from '@/app/store/apiSlice';
import { Loader2 } from 'lucide-react';

export const PayoutsScreen = () => {
  const { data: settingsData, isLoading, isError, refetch } = useGetProviderSettingsQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 w-full">
        <Loader2 className="h-8 w-8 animate-spin text-[#009688]" />
      </div>
    );
  }

  if (isError || !settingsData) {
    return (
      <div className="flex flex-col items-center justify-center h-64 w-full gap-2">
        <span className="font-semibold text-gray-500 dark:text-gray-400 text-sm">
          Failed to load payouts
        </span>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-[#009688] text-white rounded-lg hover:bg-[#007a6b] transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return <ProviderPayoutsModuleContent settings={settingsData.payouts} />;
};

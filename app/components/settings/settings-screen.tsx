'use client';

import { useState } from "react";
import { SettingsTabs, type SettingsTab } from "./settings-tabs";
import GeneralTabContent from "./general-tab-content";
import AccountTabContent from "./account-tab-content";
import PayoutsTabContent from "./payouts-tab-content";
import PaymentBillingTabContent from "./payment-billing-tab-content";
import PlanPricingTabContent from "./plan-pricing-tab-content";
import TimeLanguageTabContent from "./time-language-tab-content";
import PasswordTabContent from "./password-tab-content";
import { useGetProviderSettingsQuery } from "@/app/store/apiSlice";
import { Loader2 } from "lucide-react";

export const SettingsScreen = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const { data: settingsData, isLoading, isError, refetch } = useGetProviderSettingsQuery();

  const renderTabContent = () => {
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
            Failed to load settings
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

    switch (activeTab) {
      case 'general':
        return <GeneralTabContent settings={settingsData.general} />;
      case 'account':
        return <AccountTabContent settings={settingsData.account} />;
      case 'payouts':
        return <PayoutsTabContent settings={settingsData.payouts} />;
      case 'payment-billing':
        return <PaymentBillingTabContent settings={settingsData.paymentBilling} />;
      // case 'plan-pricing':
      //   return <PlanPricingTabContent />;
      case 'time-language':
        return <TimeLanguageTabContent settings={settingsData.timeLanguage} />;
      case 'password':
        return <PasswordTabContent />;
      default:
        return <GeneralTabContent settings={settingsData.general} />;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full w-full bg-white dark:bg-gray-950">
      <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-y-auto">
        {renderTabContent()}
      </div>
    </div>
  );
};

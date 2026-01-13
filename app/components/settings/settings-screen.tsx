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

export const SettingsScreen = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralTabContent />;
      case 'account':
        return <AccountTabContent />;
      case 'payouts':
        return <PayoutsTabContent />;
      case 'payment-billing':
        return <PaymentBillingTabContent />;
      case 'plan-pricing':
        return <PlanPricingTabContent />;
      case 'time-language':
        return <TimeLanguageTabContent />;
      case 'password':
        return <PasswordTabContent />;
      default:
        return <GeneralTabContent />;
    }
  };

  return (
    <div className="flex h-full w-full bg-white">
      <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-y-auto">
        {renderTabContent()}
      </div>
    </div>
  );
};

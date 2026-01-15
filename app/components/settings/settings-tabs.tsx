'use client';

import { useState } from "react";
import { 
  Settings as SettingsIcon, 
  User, 
  Wallet, 
  CreditCard, 
  Package, 
  Globe, 
  Lock 
} from "lucide-react";

export type SettingsTab = 'general' | 'account' | 'payouts' | 'payment-billing' | 'plan-pricing' | 'time-language' | 'password';

interface SettingsTabsProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

const tabs = [
  { id: 'general' as SettingsTab, label: 'General', icon: SettingsIcon },
  { id: 'account' as SettingsTab, label: 'Account', icon: User },
  { id: 'payouts' as SettingsTab, label: 'Payouts', icon: Wallet },
  { id: 'payment-billing' as SettingsTab, label: 'Payment & Billing', icon: CreditCard },
  { id: 'plan-pricing' as SettingsTab, label: 'Plan & Pricing', icon: Package },
  { id: 'time-language' as SettingsTab, label: 'Time & Language', icon: Globe },
  { id: 'password' as SettingsTab, label: 'Password', icon: Lock },
];

export const SettingsTabs = ({ activeTab, onTabChange }: SettingsTabsProps) => {
  return (
    <aside className="w-full lg:w-64 bg-greyscale-25 dark:bg-gray-800/50 border-b lg:border-b-0 lg:border-r border-solid border-[#dfe1e6] dark:border-gray-700 h-auto lg:h-full flex flex-col">
      <nav className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible lg:flex-1 p-2 gap-2 lg:gap-0">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`whitespace-nowrap lg:w-full cursor-pointer flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-greyscale-0 dark:bg-gray-800 text-[#009688] dark:text-teal-400'
                  : 'text-greyscale-600 dark:text-gray-400 hover:bg-greyscale-0 dark:hover:bg-gray-800'
              }`}
            >
              {/* <Icon className="h-5 w-5" /> */}
              <span className="font-normal text-sm">
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

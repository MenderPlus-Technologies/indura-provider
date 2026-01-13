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
    <aside className="w-64 bg-greyscale-25 border-r border-solid border-[#dfe1e6] h-full flex flex-col">
     
      <nav className="flex-1 p-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full cursor-pointer flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-greyscale-0 text-[#009688]'
                  : 'text-greyscale-600 hover:bg-greyscale-0'
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

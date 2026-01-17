'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type ProviderType = 'Gym' | 'Fitness' | 'Wellness' | 'Clinic' | 'Hospital' | 'Other';

export interface ProviderCapabilities {
  supportsSubscriptions: boolean;
  supportsAppointments?: boolean;
  supportsInventory?: boolean;
  // Add more capabilities as needed
}

export interface ProviderInfo {
  id: string;
  name: string;
  type: ProviderType;
  capabilities: ProviderCapabilities;
}

interface ProviderContextType {
  provider: ProviderInfo;
  hasCapability: (capability: keyof ProviderCapabilities) => boolean;
  supportsSubscriptions: boolean;
}

const ProviderContext = createContext<ProviderContextType | undefined>(undefined);

// Mock provider data - in real app, this would come from API
// 
// To test different provider types, set localStorage.mockProviderType in browser console:
// - localStorage.setItem('mockProviderType', 'Gym') // Enables subscriptions
// - localStorage.setItem('mockProviderType', 'Fitness') // Enables subscriptions
// - localStorage.setItem('mockProviderType', 'Wellness') // Enables subscriptions
// - localStorage.setItem('mockProviderType', 'Clinic') // Disables subscriptions
// - localStorage.setItem('mockProviderType', 'Hospital') // Disables subscriptions
// Then refresh the page
const getMockProvider = (): ProviderInfo => {
  // For demo purposes, you can change this to test different provider types
  // Set to 'Gym' to enable subscriptions, or 'Clinic' to disable them
  const providerType = (typeof window !== 'undefined' && localStorage.getItem('mockProviderType')) as ProviderType || 'Gym';
  
  const providerTypes: Record<ProviderType, ProviderCapabilities> = {
    'Gym': {
      supportsSubscriptions: true,
      supportsAppointments: true,
      supportsInventory: false,
    },
    'Fitness': {
      supportsSubscriptions: true,
      supportsAppointments: true,
      supportsInventory: false,
    },
    'Wellness': {
      supportsSubscriptions: true,
      supportsAppointments: true,
      supportsInventory: false,
    },
    'Clinic': {
      supportsSubscriptions: false,
      supportsAppointments: true,
      supportsInventory: true,
    },
    'Hospital': {
      supportsSubscriptions: false,
      supportsAppointments: true,
      supportsInventory: true,
    },
    'Other': {
      supportsSubscriptions: false,
      supportsAppointments: false,
      supportsInventory: false,
    },
  };

  return {
    id: '1',
    name: 'Mallvose Official Store',
    type: providerType,
    capabilities: providerTypes[providerType],
  };
};

export function ProviderProvider({ children }: { children: React.ReactNode }) {
  const [provider, setProvider] = useState<ProviderInfo>(() => {
    if (typeof window === 'undefined') {
      // SSR fallback
      return {
        id: '1',
        name: 'Mallvose Official Store',
        type: 'Gym',
        capabilities: {
          supportsSubscriptions: true,
          supportsAppointments: true,
          supportsInventory: false,
        },
      };
    }
    return getMockProvider();
  });

  useEffect(() => {
    // Listen for provider type changes (for testing)
    const handleStorageChange = () => {
      setProvider(getMockProvider());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const hasCapability = (capability: keyof ProviderCapabilities): boolean => {
    return provider.capabilities[capability] === true;
  };

  const supportsSubscriptions = provider.capabilities.supportsSubscriptions;

  return (
    <ProviderContext.Provider value={{ provider, hasCapability, supportsSubscriptions }}>
      {children}
    </ProviderContext.Provider>
  );
}

export function useProvider() {
  const context = useContext(ProviderContext);
  if (context === undefined) {
    throw new Error('useProvider must be used within a ProviderProvider');
  }
  return context;
}

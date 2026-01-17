import { useProvider } from "@/app/contexts/provider-context";

/**
 * Hook to check if provider has a specific capability
 * Centralized utility for capability checks across the app
 */
export function useProviderCapability() {
  const { hasCapability, supportsSubscriptions, supportsTeamManagement } = useProvider();

  return {
    hasCapability,
    supportsSubscriptions,
    supportsTeamManagement,
    // Add more convenience methods as needed
    supportsAppointments: hasCapability('supportsAppointments'),
    supportsInventory: hasCapability('supportsInventory'),
  };
}

"use client"

import * as React from "react"
import { Store, X, Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { ProviderSettingsGeneral } from "@/app/store/apiSlice"
import { useGetCountriesQuery, useUpdateProviderGeneralSettingsMutation, useGetProviderSettingsQuery } from "@/app/store/apiSlice"
import { useToast } from "@/components/ui/toast"

interface ProviderFormData {
  facilityName: string
  facilityType: string
  providerDescription: string
  country: string
  city: string
  address: string
  postalCode: string
  services: string[]
}

interface GeneralTabContentProps {
  settings: ProviderSettingsGeneral
}

export default function GeneralTabContent({ settings }: GeneralTabContentProps) {
  const [formData, setFormData] = React.useState<ProviderFormData>({
    facilityName: settings.facilityName || "",
    facilityType: settings.facilityType || "",
    providerDescription: settings.providerDescription || "",
    country: settings.country || "",
    city: settings.city || "",
    address: settings.address || "",
    postalCode: settings.postalCode || "",
    services: settings.services || [],
  })

  const [serviceInput, setServiceInput] = React.useState("")
  const { showToast } = useToast()

  // Fetch countries
  const { data: countries = [], isLoading: isLoadingCountries } = useGetCountriesQuery();

  // Update mutation
  const [updateGeneralSettings, { isLoading: isUpdating }] = useUpdateProviderGeneralSettingsMutation();
  
  // Refetch settings after update
  const { refetch: refetchSettings } = useGetProviderSettingsQuery();

  // Update form data when settings change
  React.useEffect(() => {
    setFormData({
      facilityName: settings.facilityName || "",
      facilityType: settings.facilityType || "",
      providerDescription: settings.providerDescription || "",
      country: settings.country || "",
      city: settings.city || "",
      address: settings.address || "",
      postalCode: settings.postalCode || "",
      services: settings.services || [],
    })
  }, [settings])

  const handleAddService = () => {
    const trimmedService = serviceInput.trim()
    if (trimmedService && !formData.services.includes(trimmedService)) {
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, trimmedService]
      }))
      setServiceInput("")
    }
  }

  const handleServiceInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddService()
    }
  }

  const handleRemoveService = (serviceToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter(s => s !== serviceToRemove)
    }))
  }

  const handleSave = async () => {
    try {
      const response = await updateGeneralSettings({
        facilityName: formData.facilityName,
        facilityType: formData.facilityType,
        providerDescription: formData.providerDescription,
        country: formData.country,
        city: formData.city,
        address: formData.address,
        postalCode: formData.postalCode,
        services: formData.services,
      }).unwrap()

      showToast(response.message || 'General settings updated successfully', 'success')
      await refetchSettings()
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Failed to update general settings'
      showToast(errorMessage, 'error')
    }
  }

  const handleCancel = () => {
    // Reset form to original settings
    setFormData({
      facilityName: settings.facilityName || "",
      facilityType: settings.facilityType || "",
      providerDescription: settings.providerDescription || "",
      country: settings.country || "",
      city: settings.city || "",
      address: settings.address || "",
      postalCode: settings.postalCode || "",
      services: settings.services || [],
    })
    setServiceInput("")
  }

  return (
    <div className="w-full bg-[#fafafa] dark:bg-gray-950 pb-8">
      <div className="mx-auto max-w-[1400px] ">
        <div className="bg-white dark:bg-gray-900 ">
          {/* Provider Details Section */}
          <div className="border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
              <div className="w-full lg:w-[220px] shrink-0">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                  Provider details
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">Name</p>
              </div>

              <div className="flex-1 space-y-4 sm:space-y-6">
                <div>
                  <Label htmlFor="facilityName" className="text-xs sm:text-sm text-gray-500 font-normal">
                    Facility name
                  </Label>
                  <div className="relative mt-2">
                    <Store className="absolute left-3 sm:left-4 top-1/2 h-4 w-4 sm:h-[18px] sm:w-[18px] -translate-y-1/2 text-gray-400" />
                    <Input
                      id="facilityName"
                      value={formData.facilityName}
                      onChange={(e) => setFormData({ ...formData, facilityName: e.target.value })}
                      className="h-[44px] sm:h-[48px] pl-10 sm:pl-12 text-sm border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="facilityType" className="text-xs sm:text-sm text-gray-500 font-normal">
                    Facility type
                  </Label>
                  <Input
                    id="facilityType"
                    value={formData.facilityType}
                    onChange={(e) => setFormData({ ...formData, facilityType: e.target.value })}
                    placeholder="e.g., Clinic, Hospital, Facility, etc."
                    className="mt-2 h-[44px] sm:h-[48px] text-sm border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <Label htmlFor="providerDescription" className="text-xs sm:text-sm text-gray-500 font-normal">
                    Provider description
                  </Label>
                  <Textarea
                    id="providerDescription"
                    value={formData.providerDescription}
                    onChange={(e) => setFormData({ ...formData, providerDescription: e.target.value })}
                    className="mt-2 min-h-[120px] sm:min-h-[160px] resize-none text-sm border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Provider Address Section */}
          <div className="border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
              <div className="w-full lg:w-[220px] shrink-0">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                  Provider address
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-gray-500">
                  This address will appear on your provider bio
                </p>
              </div>

              <div className="flex-1 space-y-4 sm:space-y-6">
                <div>
                  <Label htmlFor="country" className="text-xs sm:text-sm text-gray-500 font-normal">
                    Country or region
                  </Label>
                  <Select 
                    value={formData.country} 
                    onValueChange={(value) => setFormData({ ...formData, country: value, city: "" })}
                    disabled={isLoadingCountries}
                  >
                    <SelectTrigger className="mt-2 h-[44px] sm:h-[48px] w-full text-sm border-gray-300 rounded-lg">
                      <SelectValue placeholder={isLoadingCountries ? "Loading countries..." : "Select country"}>
                        {formData.country || "Select country"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px] overflow-y-auto">
                      {isLoadingCountries ? (
                        <div className="flex items-center justify-center p-4">
                          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                        </div>
                      ) : (
                        countries.map((country) => (
                          <SelectItem key={country.code} value={country.name}>
                            {country.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="city" className="text-xs sm:text-sm text-gray-500 font-normal">
                    City
                  </Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Enter city name"
                    className="mt-2 h-[44px] sm:h-[48px] text-sm sm:text-[15px] border-gray-300 rounded-lg"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Label htmlFor="address" className="text-xs sm:text-sm text-gray-500 font-normal">
                      Address
                    </Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="mt-2 h-[44px] sm:h-[48px] text-sm sm:text-[15px] border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="w-full sm:w-[160px]">
                    <Label htmlFor="postalCode" className="text-xs sm:text-sm text-gray-500 font-normal">
                      Postal code
                    </Label>
                    <Input
                      id="postalCode"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className="mt-2 h-[44px] sm:h-[48px] text-sm sm:text-[15px] border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Provider Services Section */}
          <div className="border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
              <div className="w-full lg:w-[220px] shrink-0">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                  Provider services
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Select the services you offer
                </p>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <Label htmlFor="services" className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-normal">
                    Add provider service
                  </Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="services"
                      value={serviceInput}
                      onChange={(e) => setServiceInput(e.target.value)}
                      onKeyDown={handleServiceInputKeyDown}
                      placeholder="Type service name and press Enter"
                      className="h-[44px] sm:h-[48px] text-sm border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg"
                    />
                    <Button
                      type="button"
                      onClick={handleAddService}
                      disabled={!serviceInput.trim()}
                      className="h-[44px] sm:h-[48px] px-4 bg-teal-600 dark:bg-teal-500 text-white hover:bg-teal-700 dark:hover:bg-teal-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                    Type a service name and press Enter or click the + button to add
                  </p>
                </div>

                {formData.services.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.services.map((service) => (
                      <Badge
                        key={service}
                        variant="secondary"
                        className="h-[36px] rounded-md bg-gray-100 dark:bg-gray-800 px-3 text-sm font-normal text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {service}
                        <button
                          onClick={() => handleRemoveService(service)}
                          className="ml-2 hover:text-gray-900 dark:hover:text-white cursor-pointer"
                          type="button"
                        >
                          <X className="h-[14px] w-[14px]" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                {formData.services.length === 0 && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 italic">
                    No services added yet. Add services using the input above.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons - Now visible */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 bg-white dark:bg-gray-900 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isUpdating}
              className="h-[44px] w-full sm:w-auto px-6 text-sm font-medium border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isUpdating}
              className="h-[44px] w-full sm:w-auto bg-teal-600 dark:bg-teal-500 px-6 text-sm font-medium text-white hover:bg-teal-700 dark:hover:bg-teal-600 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
              {isUpdating ? 'Saving...' : 'Save Change'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
"use client"

import * as React from "react"
import { Store, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

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

export default function GeneralTabContent() {
  const [formData, setFormData] = React.useState<ProviderFormData>({
    facilityName: "Mallvose Official Store",
    facilityType: "Facility",
    providerDescription: "Facility",
    country: "United States",
    city: "Washington",
    address: "1111 Columbus Avenue",
    postalCode: "14999",
    services: ["Massage"],
  })

  const handleRemoveService = (serviceToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter(s => s !== serviceToRemove)
    }))
  }

  const handleSave = () => {
    console.log("Saving form data:", formData)
  }

  const handleCancel = () => {
    console.log("Cancelling form")
  }

  return (
    <div className="w-full bg-[#fafafa] pb-8">
      <div className="mx-auto max-w-[1400px]">
        <div className="bg-white shadow-sm">
          {/* Provider Details Section */}
          <div className="border-b border-gray-200 px-8 py-8">
            <div className="flex gap-12">
              <div className="w-[220px] flex-shrink-0">
                <h2 className="text-xl font-semibold text-gray-900">
                  Provider details
                </h2>
                <p className="mt-1 text-sm text-gray-500">Name</p>
              </div>

              <div className="flex-1 space-y-6">
                <div>
                  <Label htmlFor="facilityName" className="text-sm text-gray-500 font-normal">
                    Facility name
                  </Label>
                  <div className="relative mt-2">
                    <Store className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" />
                    <Input
                      id="facilityName"
                      value={formData.facilityName}
                      onChange={(e) => setFormData({ ...formData, facilityName: e.target.value })}
                      className="h-[48px] pl-12 text-sm border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="facilityType" className="text-[14px] text-gray-500 font-normal">
                    Facility type
                  </Label>
                  <Select value={formData.facilityType} onValueChange={(value) => setFormData({ ...formData, facilityType: value })}>
                    <SelectTrigger className="mt-2 h-[48px] w-full text-sm border-gray-300 rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Facility">Facility</SelectItem>
                      <SelectItem value="Clinic">Clinic</SelectItem>
                      <SelectItem value="Hospital">Hospital</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="providerDescription" className="text-[14px] text-gray-500 font-normal">
                    Provider description
                  </Label>
                  <Textarea
                    id="providerDescription"
                    value={formData.providerDescription}
                    onChange={(e) => setFormData({ ...formData, providerDescription: e.target.value })}
                    className="mt-2 min-h-[160px] resize-none text-sm border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Provider Address Section */}
          <div className="border-b border-gray-200 px-8 py-8">
            <div className="flex gap-12">
              <div className="w-[220px] flex-shrink-0">
                <h2 className="text-xl font-semibold text-gray-900">
                  Provider address
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  This address will appear on your provider bio
                </p>
              </div>

              <div className="flex-1 space-y-6">
                <div>
                  <Label htmlFor="country" className="text-[14px] text-gray-500 font-normal">
                    Country or region
                  </Label>
                  <Select value={formData.country} onValueChange={(value) => setFormData({ ...formData, country: value })}>
                    <SelectTrigger className="mt-2 h-[48px] w-full text-sm border-gray-300 rounded-lg">
                      <div className="flex items-center gap-2">
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="United States">
                        <div className="flex items-center gap-2">
                          <span>🇺🇸</span>
                          <span>United States</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Canada">
                        <div className="flex items-center gap-2">
                          <span>🇨🇦</span>
                          <span>Canada</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="city" className="text-[14px] text-gray-500 font-normal">
                    City
                  </Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="mt-2 h-[48px] text-[15px] border-gray-300 rounded-lg"
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="address" className="text-[14px] text-gray-500 font-normal">
                      Address
                    </Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="mt-2 h-[48px] text-[15px] border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="w-[160px]">
                    <Label htmlFor="postalCode" className="text-[14px] text-gray-500 font-normal">
                      Postal code
                    </Label>
                    <Input
                      id="postalCode"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className="mt-2 h-[48px] text-[15px] border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Provider Services Section */}
          <div className="border-b border-gray-200 px-8 py-8">
            <div className="flex gap-12">
              <div className="w-[220px] flex-shrink-0">
                <h2 className="text-xl font-semibold text-gray-900">
                  Provider services
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Select the services you offer
                </p>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <Label htmlFor="services" className="text-[14px] text-gray-500 font-normal">
                    Select providers service
                  </Label>
                  <Select>
                    <SelectTrigger className="mt-2 h-[48px] w-full text-sm border-gray-300 rounded-lg">
                      <SelectValue placeholder="Services" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Massage">Massage</SelectItem>
                      <SelectItem value="Spa">Spa</SelectItem>
                      <SelectItem value="Wellness">Wellness</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.services.map((service) => (
                    <Badge
                      key={service}
                      variant="secondary"
                      className="h-[36px] rounded-md bg-gray-100 px-3 text-sm font-normal text-gray-700 hover:bg-gray-100"
                    >
                      {service}
                      <button
                        onClick={() => handleRemoveService(service)}
                        className="ml-2 hover:text-gray-900"
                      >
                        <X className="h-[14px] w-[14px]" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons - Now visible */}
          <div className="flex justify-end gap-3 bg-white px-8 py-6">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="h-[44px] px-6 text-sm font-medium border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="h-[44px] bg-teal-600 px-6 text-sm font-medium text-white hover:bg-teal-700 rounded-lg"
            >
              Save Change
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
'use client';

import { useState } from 'react';
import { useGetCampaignsQuery, useGetCampaignQuery, type Campaign } from '@/app/store/apiSlice';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Search, Eye, X, Calendar, DollarSign, Users, Building, Tag, Megaphone } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ViewCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId: string | null;
}

export const CampaignsScreen = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewModalState, setViewModalState] = useState<{
    isOpen: boolean;
    campaignId: string | null;
  }>({
    isOpen: false,
    campaignId: null,
  });
  const limit = 10;

  const { data: campaignsData, isLoading, error, refetch } = useGetCampaignsQuery({
    page,
    limit,
    search: searchTerm || undefined,
  });

  // Safely extract campaigns array - handle different response structures
  const rawCampaigns: Campaign[] = (() => {
    if (Array.isArray(campaignsData)) {
      return campaignsData;
    }
    if (campaignsData && typeof campaignsData === 'object') {
      const data = campaignsData as { campaigns?: unknown; data?: unknown };
      if (Array.isArray(data.campaigns)) {
        return data.campaigns as Campaign[];
      }
      if (Array.isArray(data.data)) {
        return data.data as Campaign[];
      }
    }
    return [];
  })();

  // Map API response to component-friendly format
  const campaigns = rawCampaigns.map((campaign) => ({
    ...campaign,
    id: campaign._id || campaign.id || '',
    name: campaign.title || campaign.name || '',
    startDate: campaign.createdAt || campaign.startDate || '',
    endDate: campaign.deadline || campaign.endDate || '',
  }));

  const filteredCampaigns = campaigns.filter((campaign) =>
    campaign.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#009688]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-red-600 dark:text-red-400">Failed to load campaigns</p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

const ViewCampaignModal = ({ isOpen, onClose, campaignId }: ViewCampaignModalProps) => {
  const { data: responseData, isLoading, error } = useGetCampaignQuery(campaignId || '', {
    skip: !isOpen || !campaignId,
  });

  if (!isOpen || !campaignId) return null;

  // Handle nested response structure: { campaign: {...} } or direct campaign object
  const campaign = (() => {
    if (!responseData) return undefined;
    // Check if response is wrapped in 'campaign' property
    if (typeof responseData === 'object' && 'campaign' in responseData) {
      return (responseData as { campaign: Campaign }).campaign;
    }
    // Otherwise assume it's the campaign directly
    return responseData as Campaign;
  })();

  const campaignName = campaign?.title || campaign?.name || 'N/A';
  const description = campaign?.description || 'N/A';
  const status = campaign?.status || 'N/A';
  const startDate = campaign?.startDate || campaign?.createdAt;
  const endDate = campaign?.endDate || campaign?.deadline;
  const targetAmount = campaign?.targetAmount;
  const raisedAmount = campaign?.raisedAmount;
  const currency = campaign?.currency || 'NGN';
  const category = campaign?.category;
  const contributorsCount = campaign?.contributorsCount;
  const isFeatured = campaign?.isFeatured || false;
  const organizer = campaign?.organizerId;
  const beneficiaryId = campaign?.beneficiaryId;
  const createdAt = campaign?.createdAt ? new Date(campaign.createdAt).toLocaleString() : 'N/A';
  const updatedAt = campaign?.updatedAt ? new Date(campaign.updatedAt).toLocaleString() : null;

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return (
          <Badge className="inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-[100px] border border-solid bg-alertssuccess-0 border-[#c6ede5] text-alertssuccess-100">
            <div className="w-1 h-1 rounded-sm bg-alertssuccess-100" />
            <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-[length:var(--body-small-medium-font-size)] text-right tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] [font-style:var(--body-small-medium-font-style)]">
              Active
            </span>
          </Badge>
        );
      case 'completed':
        return (
          <Badge className="inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-[100px] border border-solid bg-blue-100 border-blue-200 text-blue-800">
            <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-[length:var(--body-small-medium-font-size)] text-right tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] [font-style:var(--body-small-medium-font-style)]">
              Completed
            </span>
          </Badge>
        );
      case 'paused':
        return (
          <Badge className="inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-[100px] border border-solid bg-alertswarning-0 border-[#fff1db] text-alertswarning-100">
            <div className="w-1 h-1 rounded-sm bg-alertswarning-100" />
            <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-[length:var(--body-small-medium-font-size)] text-right tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] [font-style:var(--body-small-medium-font-style)]">
              Paused
            </span>
          </Badge>
        );
      default:
        return <Badge>{status || 'Unknown'}</Badge>;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Campaign Details
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 cursor-pointer text-gray-700 dark:text-gray-300"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-[#009688]" />
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 dark:text-red-400">Failed to load campaign details</p>
              </div>
            ) : campaign ? (
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Campaign Name
                      </label>
                      <div className="mt-1 flex items-center gap-2">
                        <Megaphone className="h-4 w-4 text-gray-400" />
                        <p className="text-base text-gray-900 dark:text-white">
                          {campaignName}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Status
                      </label>
                      <div className="mt-1">
                        {getStatusBadge(status)}
                      </div>
                    </div>
                    {category && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          Category
                        </label>
                        <div className="mt-1 flex items-center gap-2">
                          <Tag className="h-4 w-4 text-gray-400" />
                          <p className="text-base text-gray-900 dark:text-white">
                            {category}
                          </p>
                        </div>
                      </div>
                    )}
                    {isFeatured && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          Featured
                        </label>
                        <div className="mt-1">
                          <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                            Yes
                          </Badge>
                        </div>
                      </div>
                    )}
                    <div className="md:col-span-2">
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Description
                      </label>
                      <div className="mt-1">
                        <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                          {description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                    Timeline
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {startDate && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          Start Date
                        </label>
                        <div className="mt-1 flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <p className="text-sm text-gray-900 dark:text-white">
                            {new Date(startDate).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}
                    {endDate && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          End Date
                        </label>
                        <div className="mt-1 flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <p className="text-sm text-gray-900 dark:text-white">
                            {new Date(endDate).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}
                    <div>
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Created Date
                      </label>
                      <div className="mt-1 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <p className="text-sm text-gray-900 dark:text-white">
                          {createdAt}
                        </p>
                      </div>
                    </div>
                    {updatedAt && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          Last Updated
                        </label>
                        <div className="mt-1 flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <p className="text-sm text-gray-900 dark:text-white">
                            {updatedAt}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Financial Information */}
                {(targetAmount !== undefined || raisedAmount !== undefined) && (
                  <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                      Financial Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {targetAmount !== undefined && (
                        <div>
                          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            Target Amount
                          </label>
                          <div className="mt-1 flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                            <p className="text-base text-gray-900 dark:text-white">
                              {currency} {targetAmount.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )}
                      {raisedAmount !== undefined && (
                        <div>
                          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            Raised Amount
                          </label>
                          <div className="mt-1 flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-green-500" />
                            <p className="text-base text-green-600 dark:text-green-400 font-semibold">
                              {currency} {raisedAmount.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )}
                      {targetAmount !== undefined && raisedAmount !== undefined && (
                        <div className="md:col-span-2">
                          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            Progress
                          </label>
                          <div className="mt-2">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                              <div
                                className="bg-[#009688] h-2.5 rounded-full"
                                style={{
                                  width: `${Math.min((raisedAmount / targetAmount) * 100, 100)}%`,
                                }}
                              />
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {((raisedAmount / targetAmount) * 100).toFixed(1)}% of target reached
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Additional Information */}
                {(organizer || beneficiaryId || contributorsCount !== undefined) && (
                  <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                      Additional Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {organizer && (
                        <div>
                          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            Organizer
                          </label>
                          <div className="mt-1 flex items-center gap-2">
                            <Building className="h-4 w-4 text-gray-400" />
                            <div className="flex items-center gap-2">
                              <p className="text-base text-gray-900 dark:text-white">
                                {organizer.name}
                              </p>
                              {organizer.isVerified && (
                                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 text-xs">
                                  Verified
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      {contributorsCount !== undefined && (
                        <div>
                          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            Contributors
                          </label>
                          <div className="mt-1 flex items-center gap-2">
                            <Users className="h-4 w-4 text-gray-400" />
                            <p className="text-base text-gray-900 dark:text-white">
                              {contributorsCount}
                            </p>
                          </div>
                        </div>
                      )}
                      {beneficiaryId && (
                        <div>
                          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            Beneficiary ID
                          </label>
                          <div className="mt-1">
                            <p className="text-base text-gray-900 dark:text-white font-mono text-sm">
                              {beneficiaryId}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800">
            <Button
              variant="outline"
              onClick={onClose}
              className="cursor-pointer"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return (
          <Badge className="inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-[100px] border border-solid bg-alertssuccess-0 border-[#c6ede5] text-alertssuccess-100">
            <div className="w-1 h-1 rounded-sm bg-alertssuccess-100" />
            <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-[length:var(--body-small-medium-font-size)] text-right tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] [font-style:var(--body-small-medium-font-style)]">
              Active
            </span>
          </Badge>
        );
      case 'completed':
        return (
          <Badge className="inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-[100px] border border-solid bg-blue-100 border-blue-200 text-blue-800">
            <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-[length:var(--body-small-medium-font-size)] text-right tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] [font-style:var(--body-small-medium-font-style)]">
              Completed
            </span>
          </Badge>
        );
      case 'paused':
        return (
          <Badge className="inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-[100px] border border-solid bg-alertswarning-0 border-[#fff1db] text-alertswarning-100">
            <div className="w-1 h-1 rounded-sm bg-alertswarning-100" />
            <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-[length:var(--body-small-medium-font-size)] text-right tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] [font-style:var(--body-small-medium-font-style)]">
              Paused
            </span>
          </Badge>
        );
      default:
        return <Badge>{status || 'Unknown'}</Badge>;
    }
  };

  return (
    <div className="flex flex-col w-full items-start bg-white dark:bg-gray-950 relative">
      <header className="h-[72px] flex items-center justify-between px-6 py-4 bg-greyscale-0 dark:bg-gray-900 border-b border-solid border-[#dfe1e6] dark:border-gray-800 w-full">
        <h1 className="font-heading-h4 font-[number:var(--heading-h4-font-weight)] text-greyscale-900 dark:text-white text-[length:var(--heading-h4-font-size)] tracking-[var(--heading-h4-letter-spacing)] leading-[var(--heading-h4-line-height)] [font-style:var(--heading-h4-font-style)]">
          Campaigns
        </h1>
        <div className="inline-flex items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            className="h-8 w-8 p-2 bg-greyscale-0 dark:bg-gray-800 rounded-lg border border-solid border-[#dfe1e6] dark:border-gray-700 shadow-shadow-xsmall cursor-pointer"
          >
            <Loader2 className="h-4 w-4 text-gray-700 dark:text-gray-300" />
          </Button>
        </div>
      </header>

      <div className="mt-4 px-4 sm:px-6 gap-4 sm:gap-6 justify-center w-full">
        <div className="bg-[#F9F9FB] dark:bg-gray-800/50 flex flex-col gap-2 items-center border border-[#DFE1E6] dark:border-gray-700 p-1 rounded-2xl">
          <Card className="flex flex-col shadow-none gap-1 p-1 w-full">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                  <Input
                    placeholder="Search campaigns..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setPage(1);
                    }}
                    className="pl-10 h-10 bg-greyscale-0 dark:bg-gray-800 border-[#dfe1e6] dark:border-gray-700 text-greyscale-900 dark:text-white"
                  />
                </div>
              </div>

              {filteredCampaigns.length === 0 ? (
                <div className="text-center py-12">
                  <p className="font-body-medium-regular text-greyscale-500 dark:text-gray-400">No campaigns found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <div className="bg-greyscale-0 dark:bg-gray-800 rounded-xl border border-solid border-[#dfe1e6] dark:border-gray-700">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-b border-solid border-[#dfe1e6] dark:border-gray-700">
                          <TableHead className="w-[246px] h-10 px-4 py-0">
                            <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-greyscale-500 dark:text-gray-400 text-[length:var(--body-small-medium-font-size)] tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] [font-style:var(--body-small-medium-font-style)]">
                              Name
                            </span>
                          </TableHead>
                          <TableHead className="w-60 h-10 px-4 py-0">
                            <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-greyscale-500 dark:text-gray-400 text-[length:var(--body-small-medium-font-size)] tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] [font-style:var(--body-small-medium-font-style)]">
                              Description
                            </span>
                          </TableHead>
                          <TableHead className="flex-1 h-10 px-4 py-0">
                            <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-greyscale-500 dark:text-gray-400 text-[length:var(--body-small-medium-font-size)] tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] [font-style:var(--body-small-medium-font-style)]">
                              Status
                            </span>
                          </TableHead>
                          <TableHead className="w-[178px] h-10 px-4 py-0">
                            <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-greyscale-500 dark:text-gray-400 text-[length:var(--body-small-medium-font-size)] tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] [font-style:var(--body-small-medium-font-style)]">
                              Start Date
                            </span>
                          </TableHead>
                          <TableHead className="w-[178px] h-10 px-4 py-0">
                            <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-greyscale-500 dark:text-gray-400 text-[length:var(--body-small-medium-font-size)] tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] [font-style:var(--body-small-medium-font-style)]">
                              End Date
                            </span>
                          </TableHead>
                          <TableHead className="w-[100px] h-10 px-4 py-0">
                            <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-greyscale-500 dark:text-gray-400 text-[length:var(--body-small-medium-font-size)] tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] [font-style:var(--body-small-medium-font-style)]">
                              Actions
                            </span>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCampaigns.map((campaign, index) => {
                          // Ensure unique key - use ID if available, otherwise use index with name
                          const uniqueKey = campaign.id 
                            ? `campaign-${campaign.id}` 
                            : `campaign-${index}-${campaign.name || 'unknown'}-${campaign.startDate || ''}`;
                          return (
                            <TableRow
                              key={uniqueKey}
                              className={
                                index < filteredCampaigns.length - 1
                                  ? "border-b border-solid border-[#dfe1e6] dark:border-gray-700"
                                  : ""
                              }
                            >
                              <TableCell className="h-12 px-4 py-0">
                                <span className="font-body-medium-semibold font-[number:var(--body-medium-semibold-font-weight)] text-greyscale-900 dark:text-white text-[length:var(--body-medium-semibold-font-size)] tracking-[var(--body-medium-semibold-letter-spacing)] leading-[var(--body-medium-semibold-line-height)] [font-style:var(--body-medium-semibold-font-style)]">
                                  {campaign.name}
                                </span>
                              </TableCell>
                              <TableCell className="h-12 px-4 py-0 max-w-md truncate">
                                <span className="font-body-medium-semibold font-[number:var(--body-medium-semibold-font-weight)] text-greyscale-900 dark:text-white text-[length:var(--body-medium-semibold-font-size)] tracking-[var(--body-medium-semibold-letter-spacing)] leading-[var(--body-medium-semibold-line-height)] [font-style:var(--body-medium-semibold-font-style)]">
                                  {campaign.description}
                                </span>
                              </TableCell>
                              <TableCell className="h-12 px-4 py-0">
                                {getStatusBadge(campaign.status)}
                              </TableCell>
                              <TableCell className="h-12 px-4 py-0">
                                <span className="font-body-medium-semibold font-[number:var(--body-medium-semibold-font-weight)] text-greyscale-900 dark:text-white text-[length:var(--body-medium-semibold-font-size)] tracking-[var(--body-medium-semibold-letter-spacing)] leading-[var(--body-medium-semibold-line-height)] [font-style:var(--body-medium-semibold-font-style)]">
                                  {new Date(campaign.startDate).toLocaleDateString()}
                                </span>
                              </TableCell>
                              <TableCell className="h-12 px-4 py-0">
                                <span className="font-body-medium-semibold font-[number:var(--body-medium-semibold-font-weight)] text-greyscale-900 dark:text-white text-[length:var(--body-medium-semibold-font-size)] tracking-[var(--body-medium-semibold-letter-spacing)] leading-[var(--body-medium-semibold-line-height)] [font-style:var(--body-medium-semibold-font-style)]">
                                  {campaign.endDate ? new Date(campaign.endDate).toLocaleDateString() : 'N/A'}
                                </span>
                              </TableCell>
                              <TableCell className="h-12 px-4 py-0">
                                <Button
                                  size="sm"
                                  onClick={() => setViewModalState({ isOpen: true, campaignId: campaign.id })}
                                  className="h-8 px-3 bg-[#009688] hover:bg-[#008577] text-white rounded-lg cursor-pointer"
                                  title="View campaign details"
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* View Campaign Modal */}
      <ViewCampaignModal
        isOpen={viewModalState.isOpen}
        onClose={() => setViewModalState({ isOpen: false, campaignId: null })}
        campaignId={viewModalState.campaignId}
      />
    </div>
  );
};

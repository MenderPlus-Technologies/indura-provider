'use client';

import { useState } from 'react';
import { useGetCampaignsQuery, useGetProviderQuery, useSearchProvidersQuery, type Campaign } from '@/app/store/apiSlice';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Search, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';

export const CampaignsScreen = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
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
                                  variant="outline"
                                  className="h-auto inline-flex h-8 items-center justify-center gap-2 px-2 py-1 bg-greyscale-0 dark:bg-gray-800 rounded-[10px] border border-solid border-[#dfe1e6] dark:border-gray-700 shadow-shadow-xsmall cursor-pointer"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                  <span className="font-body-medium-semibold font-[number:var(--body-medium-semibold-font-weight)] text-greyscale-900 dark:text-white text-[length:var(--body-medium-semibold-font-size)] text-center tracking-[var(--body-medium-semibold-letter-spacing)] leading-[var(--body-medium-semibold-line-height)] [font-style:var(--body-medium-semibold-font-style)]">
                                    View
                                  </span>
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
    </div>
  );
};

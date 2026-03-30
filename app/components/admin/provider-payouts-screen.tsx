'use client';

import { useMemo, useState } from 'react';
import {
  useGetAdminPayoutRequestsQuery,
  useReviewAdminPayoutRequestMutation,
  type AdminPayoutRequest,
} from '@/app/store/apiSlice';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/toast';
import { Loader2, RefreshCw, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProviderPayoutReviewModal } from '@/app/components/admin/provider-payout-review-modal';

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected';
const ITEMS_PER_PAGE = 10;

export const ProviderPayoutsScreen = () => {
  const { data, isLoading, error, refetch } = useGetAdminPayoutRequestsQuery();
  const [reviewPayout, { isLoading: isReviewing }] = useReviewAdminPayoutRequestMutation();
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [page, setPage] = useState(1);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    action: 'approve' | 'reject';
    requestId: string | null;
    providerName: string;
    amountLabel: string;
  }>({
    isOpen: false,
    action: 'approve',
    requestId: null,
    providerName: '',
    amountLabel: '',
  });

  const payoutRequests = useMemo(() => {
    const source = Array.isArray(data) ? data : [];
    return source.map((item) => {
      const id = item._id || item.id || '';
      const providerName =
        item.providerName ||
        item.provider?.name ||
        item.provider?.facilityName ||
        'Unknown provider';
      const amount = Number(item.amount || 0);
      const currency = item.currency || 'NGN';
      const status = (item.status || 'pending').toLowerCase();

      return {
        ...item,
        id,
        providerName,
        amount,
        currency,
        status,
      } as AdminPayoutRequest & {
        id: string;
        providerName: string;
        amount: number;
        currency: string;
        status: string;
      };
    });
  }, [data]);

  const filteredRequests = useMemo(() => {
    return payoutRequests.filter((request) => {
      const matchesSearch =
        request.providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [payoutRequests, searchTerm, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-[100px] border border-solid bg-green-200 border-[#c6ede5] text-green-700">
            <div className="w-1 h-1 rounded-sm bg-green-700" />
            <span>Approved</span>
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-[100px] border border-solid bg-red-200 border-[#f9d2d9] text-red-700">
            <div className="w-1 h-1 rounded-sm bg-red-700" />
            <span>Rejected</span>
          </Badge>
        );
      default:
        return (
          <Badge className="inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-[100px] border border-solid bg-orange-100 border-[#fff1db] text-orange-900">
            <div className="w-1 h-1 rounded-sm bg-orange-900" />
            <span>Pending</span>
          </Badge>
        );
    }
  };

  const openModal = (
    requestId: string,
    action: 'approve' | 'reject',
    providerName: string,
    amount: number,
    currency: string
  ) => {
    setModalState({
      isOpen: true,
      action,
      requestId,
      providerName,
      amountLabel: `${currency} ${amount.toLocaleString()}`,
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      action: 'approve',
      requestId: null,
      providerName: '',
      amountLabel: '',
    });
  };

  const handleReview = async () => {
    if (!modalState.requestId) return;
    try {
      await reviewPayout({ id: modalState.requestId, action: modalState.action }).unwrap();
      showToast(
        modalState.action === 'approve'
          ? 'Payout request approved successfully'
          : 'Payout request rejected successfully',
        'success'
      );
      closeModal();
      refetch();
    } catch (e) {
      const message = (e as { data?: { message?: string } })?.data?.message;
      showToast(message || 'Failed to review payout request', 'error');
    }
  };

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
        <p className="text-red-600 dark:text-red-400">Failed to load payout requests</p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full items-start bg-white dark:bg-gray-950 relative">
      <header className="h-auto sm:h-[72px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 px-4 sm:px-6 py-4 bg-greyscale-0 dark:bg-gray-900 border-b border-solid border-[#dfe1e6] dark:border-gray-800 w-full">
        <h1 className="text-gray-600 dark:text-white text-xl font-semibold">Provider Payouts</h1>
        <Button
          variant="outline"
          size="icon"
          onClick={() => refetch()}
          className="h-8 w-8 p-2 bg-greyscale-0 dark:bg-gray-800 rounded-lg border border-solid border-[#dfe1e6] dark:border-gray-700 cursor-pointer"
          title="Refresh payout requests"
        >
          <RefreshCw className="h-4 w-4 text-gray-700 dark:text-gray-300" />
        </Button>
      </header>

      <div className="mt-4 px-4 sm:px-6 w-full">
        <div className="bg-[#F9F9FB] dark:bg-gray-800/50 border border-[#DFE1E6] dark:border-gray-700 p-1 rounded-2xl">
          <Card className="flex flex-col shadow-none gap-1 p-1 w-full">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                  <Input
                    placeholder="Search by provider or request id..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setPage(1);
                    }}
                    className="pl-10 h-10 bg-greyscale-0 dark:bg-gray-800 border-[#dfe1e6] dark:border-gray-700 text-gray-600 dark:text-white"
                  />
                </div>
                <Select
                  value={statusFilter}
                  onValueChange={(value) => {
                    setStatusFilter(value as StatusFilter);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="h-10 w-[180px] bg-greyscale-0 dark:bg-gray-800 border-[#dfe1e6] dark:border-gray-700 text-gray-600 dark:text-white">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-[#dfe1e6] dark:border-gray-700">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {paginatedRequests.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">No payout requests found</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <div className="bg-greyscale-0 dark:bg-gray-800 rounded-xl border border-solid border-[#dfe1e6] dark:border-gray-700">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-b border-solid border-[#dfe1e6] dark:border-gray-700">
                            <TableHead className="px-4">Provider</TableHead>
                            <TableHead className="px-4">Amount</TableHead>
                            <TableHead className="px-4">Status</TableHead>
                            <TableHead className="px-4">Date</TableHead>
                            <TableHead className="px-4">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedRequests.map((request) => (
                            <TableRow key={request.id}>
                              <TableCell className="px-4 font-medium text-gray-700 dark:text-gray-200">
                                {request.providerName}
                              </TableCell>
                              <TableCell className="px-4 text-gray-700 dark:text-gray-200">
                                {request.currency} {request.amount.toLocaleString()}
                              </TableCell>
                              <TableCell className="px-4">{getStatusBadge(request.status)}</TableCell>
                              <TableCell className="px-4 text-gray-700 dark:text-gray-200">
                                {new Date(request.createdAt).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="px-4">
                                {request.status === 'pending' ? (
                                  <div className="flex items-center gap-2">
                                    <Button
                                      size="sm"
                                      onClick={() =>
                                        openModal(
                                          request.id,
                                          'approve',
                                          request.providerName,
                                          request.amount,
                                          request.currency
                                        )
                                      }
                                      className="h-8 px-3 bg-green-600 hover:bg-green-700 text-white rounded-lg cursor-pointer"
                                    >
                                      Approve
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        openModal(
                                          request.id,
                                          'reject',
                                          request.providerName,
                                          request.amount,
                                          request.currency
                                        )
                                      }
                                      className="h-8 px-3 border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950 cursor-pointer"
                                    >
                                      Reject
                                    </Button>
                                  </div>
                                ) : (
                                  <span className="text-xs text-gray-500 dark:text-gray-400">Reviewed</span>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Page {currentPage} of {totalPages}
                      </div>
                      <div className="inline-flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="h-8 w-8"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          className="h-8 w-8"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <ProviderPayoutReviewModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onConfirm={handleReview}
        action={modalState.action}
        providerName={modalState.providerName}
        amountLabel={modalState.amountLabel}
        isLoading={isReviewing}
      />
    </div>
  );
};

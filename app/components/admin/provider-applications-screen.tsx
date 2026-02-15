'use client';

import { useState } from 'react';
import {
  useApproveProviderApplicationMutation,
  useDeleteProviderApplicationMutation,
  useGetProviderApplicationsQuery,
  useRejectProviderApplicationMutation,
  type ProviderApplication,
} from '@/app/store/apiSlice';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/toast';
import { Eye, Loader2, RefreshCw, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ViewApplicationModal } from '@/app/components/admin/provider-application-view-sheet';
import { ConfirmationModal } from '@/app/components/admin/provider-application-confirmation-modal';

export const ProviderApplicationsScreen = () => {
  const { data: applicationsData, isLoading, error, refetch } = useGetProviderApplicationsQuery();
  const [approveApplication, { isLoading: isApproving }] = useApproveProviderApplicationMutation();
  const [rejectApplication, { isLoading: isRejecting }] = useRejectProviderApplicationMutation();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [viewModalState, setViewModalState] = useState<{
    isOpen: boolean;
    applicationId: string | null;
  }>({
    isOpen: false,
    applicationId: null,
  });

  const [deleteApplication, { isLoading: isDeleting }] = useDeleteProviderApplicationMutation();

  const [confirmationModalState, setConfirmationModalState] = useState<{
    isOpen: boolean;
    type: 'approve' | 'reject' | 'delete' | null;
    applicationId: string | null;
    providerName: string;
  }>({
    isOpen: false,
    type: null,
    applicationId: null,
    providerName: '',
  });

  // Safely extract applications array - handle different response structures
  const rawApplications: ProviderApplication[] = (() => {
    if (Array.isArray(applicationsData)) {
      return applicationsData;
    }
    if (applicationsData && typeof applicationsData === 'object') {
      const data = applicationsData as { applications?: unknown; data?: unknown };
      if (Array.isArray(data.applications)) {
        return data.applications as ProviderApplication[];
      }
      if (Array.isArray(data.data)) {
        return data.data as ProviderApplication[];
      }
    }
    return [];
  })();

  // Map API response to component-friendly format
  const applications = rawApplications.map((app) => ({
    ...app,
    id: app._id || app.id || '',
    providerName: app.facilityName || app.providerName || '',
    email: app.contactPerson?.email || app.email || '',
    submittedAt: app.createdAt || app.submittedAt || '',
  }));

  const filteredApplications = applications.filter((app) => {
    const providerName = app.providerName || app.facilityName || '';
    const email = app.email || app.contactPerson?.email || '';
    const facilityType = app.facilityType || '';
    const matchesSearch = providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facilityType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openViewModal = (id: string) => {
    setViewModalState({
      isOpen: true,
      applicationId: id,
    });
  };

  const closeViewModal = () => {
    setViewModalState({
      isOpen: false,
      applicationId: null,
    });
  };

  const openConfirmationModal = (type: 'approve' | 'reject' | 'delete', id: string, providerName: string) => {
    setConfirmationModalState({
      isOpen: true,
      type,
      applicationId: id,
      providerName,
    });
    closeViewModal();
  };

  const closeConfirmationModal = () => {
    setConfirmationModalState({
      isOpen: false,
      type: null,
      applicationId: null,
      providerName: '',
    });
  };

  const handleApprove = (id: string, providerName: string) => {
    openConfirmationModal('approve', id, providerName);
  };

  const handleReject = (id: string, providerName: string) => {
    openConfirmationModal('reject', id, providerName);
  };

  const handleDelete = (id: string, providerName: string) => {
    openConfirmationModal('delete', id, providerName);
  };

  const handleConfirm = async (reason?: string) => {
    if (!confirmationModalState.applicationId || !confirmationModalState.type) return;

    try {
      if (confirmationModalState.type === 'approve') {
        await approveApplication(confirmationModalState.applicationId).unwrap();
        showToast('Application approved successfully', 'success');
      } else if (confirmationModalState.type === 'reject') {
        if (!reason) {
          showToast('Rejection reason is required', 'error');
          return;
        }
        await rejectApplication({ id: confirmationModalState.applicationId, reason }).unwrap();
        showToast('Application rejected successfully', 'success');
      } else if (confirmationModalState.type === 'delete') {
        await deleteApplication(confirmationModalState.applicationId).unwrap();
        showToast('Application deleted successfully', 'success');
      }
      closeConfirmationModal();
      refetch();
    } catch (error) {
      const errorMessage = (error as { data?: { message?: string } })?.data?.message;
      showToast(
        errorMessage || (confirmationModalState.type === 'approve'
          ? 'Failed to approve application'
          : 'Failed to reject application'),
        'error'
      );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-[100px] border border-solid bg-green-200 border-[#c6ede5] text-green-700">
            <div className="w-1 h-1 rounded-sm bg-green-700" />
            <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-[length:var(--body-small-medium-font-size)] text-right tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] inter [font-style:var(--body-small-medium-font-style)]">
              Approved
            </span>
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-[100px] border border-solid bg-red-200 border-[#f9d2d9] text-red-700">
            <div className="w-1 h-1 rounded-sm bg-red-700" />
            <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-[length:var(--body-small-medium-font-size)] text-right tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] inter [font-style:var(--body-small-medium-font-style)]">
              Rejected
            </span>
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-[100px] border border-solid bg-orange-100 border-[#fff1db] text-orange-900">
            <div className="w-1 h-1 rounded-sm bg-orange-900" />
            <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-[length:var(--body-small-medium-font-size)] text-right tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] inter [font-style:var(--body-small-medium-font-style)]">
              Pending
            </span>
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
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
        <p className="text-red-600 dark:text-red-400">Failed to load applications</p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col  w-full items-start bg-white dark:bg-gray-950 relative">
      <header className="h-auto sm:h-[72px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 px-4 sm:px-6 py-4 bg-greyscale-0 dark:bg-gray-900 border-b border-solid border-[#dfe1e6] dark:border-gray-800 w-full">
        <h1 className="font-heading-h4 font-[number:var(--heading-h4-font-weight)] text-gray-600 dark:text-white text-[length:var(--heading-h4-font-size)] tracking-[var(--heading-h4-letter-spacing)] leading-[var(--heading-h4-line-height)] inter [font-style:var(--heading-h4-font-style)]">
          Provider Applications
        </h1>
        <div className="inline-flex items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            className="h-8 w-8 p-2 bg-greyscale-0 dark:bg-gray-800 rounded-lg border border-solid border-[#dfe1e6] dark:border-gray-700 shadow-shadow-xsmall cursor-pointer"
            title="Refresh applications"
          >
            <RefreshCw className="h-4 w-4 text-gray-700 dark:text-gray-300" />
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
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 bg-greyscale-0 dark:bg-gray-800 border-[#dfe1e6] dark:border-gray-700 text-gray-600 dark:text-white"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}>
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

          {filteredApplications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No applications found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="bg-greyscale-0 dark:bg-gray-800 rounded-xl border border-solid border-[#dfe1e6] dark:border-gray-700">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-solid border-[#dfe1e6] dark:border-gray-700">
                      <TableHead className="w-[200px] h-10 px-4 py-0">
                        <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-greyscale-500 dark:text-gray-400 text-[length:var(--body-small-medium-font-size)] tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] inter [font-style:var(--body-small-medium-font-style)]">
                          Provider Name
                        </span>
                      </TableHead>
                      <TableHead className="w-[150px] h-10 px-4 py-0">
                        <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-greyscale-500 dark:text-gray-400 text-[length:var(--body-small-medium-font-size)] tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] inter [font-style:var(--body-small-medium-font-style)]">
                          Provider Type
                        </span>
                      </TableHead>
                      <TableHead className="w-[150px] h-10 px-4 py-0">
                        <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-greyscale-500 dark:text-gray-400 text-[length:var(--body-small-medium-font-size)] tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] inter [font-style:var(--body-small-medium-font-style)]">
                          Status
                        </span>
                      </TableHead>
                      <TableHead className="w-[150px] h-10 px-4 py-0">
                        <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-greyscale-500 dark:text-gray-400 text-[length:var(--body-small-medium-font-size)] tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] inter [font-style:var(--body-small-medium-font-style)]">
                          Submitted
                        </span>
                      </TableHead>
                          <TableHead className="w-[180px] h-10 px-4 py-0">
                        <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-greyscale-500 dark:text-gray-400 text-[length:var(--body-small-medium-font-size)] tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] inter [font-style:var(--body-small-medium-font-style)]">
                          Actions
                        </span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.map((app, index) => {
                      const appId = app.id || app._id || `app-${index}`;
                      const providerName = app.providerName || app.facilityName || 'Unknown';
                      const facilityType = app.facilityType || 'N/A';
                      const submittedDate = app.submittedAt || app.createdAt || new Date().toISOString();
                      return (
                        <TableRow
                          key={appId}
                          className={
                            index < filteredApplications.length - 1
                              ? "border-b border-solid border-[#dfe1e6] dark:border-gray-700"
                              : ""
                          }
                        >
                          <TableCell className="h-12 px-4 py-0">
                            <span className="font-body-medium-semibold font-[number:var(--body-medium-semibold-font-weight)] text-gray-600 dark:text-white text-[length:var(--body-medium-semibold-font-size)] tracking-[var(--body-medium-semibold-letter-spacing)] leading-[var(--body-medium-semibold-line-height)] [font-style:var(--body-medium-semibold-font-style)]">
                              {providerName}
                            </span>
                          </TableCell>
                          <TableCell className="h-12 px-4 py-0">
                            <span className="font-body-medium-semibold font-[number:var(--body-medium-semibold-font-weight)] text-gray-600 dark:text-white text-[length:var(--body-medium-semibold-font-size)] tracking-[var(--body-medium-semibold-letter-spacing)] leading-[var(--body-medium-semibold-line-height)] [font-style:var(--body-medium-semibold-font-style)]">
                              {facilityType}
                            </span>
                          </TableCell>
                          <TableCell className="h-12 px-4 py-0">
                            {getStatusBadge(app.status)}
                          </TableCell>
                          <TableCell className="h-12 px-4 py-0">
                            <span className="font-body-medium-semibold font-[number:var(--body-medium-semibold-font-weight)] text-gray-600 dark:text-white text-[length:var(--body-medium-semibold-font-size)] tracking-[var(--body-medium-semibold-letter-spacing)] leading-[var(--body-medium-semibold-line-height)] [font-style:var(--body-medium-semibold-font-style)]">
                              {new Date(submittedDate).toLocaleDateString()}
                            </span>
                          </TableCell>
                          <TableCell className="h-12 px-4 py-0">
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                onClick={() => openViewModal(appId)}
                                className="h-8 px-3 bg-[#009688] hover:bg-[#008577] text-white rounded-lg cursor-pointer"
                                title="View application details"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(appId, providerName)}
                                className="h-8 px-3 border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950 cursor-pointer"
                                title="Delete application"
                              >
                                Delete
                              </Button>
                            </div>
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

      {/* View Application Modal */}
      <ViewApplicationModal
        isOpen={viewModalState.isOpen}
        onClose={closeViewModal}
        applicationId={viewModalState.applicationId}
        onApprove={handleApprove}
        onReject={handleReject}
        isApproving={isApproving}
        isRejecting={isRejecting}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModalState.isOpen}
        onClose={closeConfirmationModal}
        onConfirm={handleConfirm}
        type={confirmationModalState.type || 'approve'}
        providerName={confirmationModalState.providerName}
        isLoading={isApproving || isRejecting || isDeleting}
      />
    </div>
  );
};

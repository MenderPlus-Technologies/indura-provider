'use client';

import { useState } from 'react';
import { useGetProviderApplicationsQuery, useApproveProviderApplicationMutation, useRejectProviderApplicationMutation, type ProviderApplication } from '@/app/store/apiSlice';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/toast';
import { CheckCircle, XCircle, Loader2, Search, AlertTriangle, X, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: 'approve' | 'reject';
  providerName: string;
  isLoading?: boolean;
}

const ConfirmationModal = ({ isOpen, onClose, onConfirm, type, providerName, isLoading = false }: ConfirmationModalProps) => {
  if (!isOpen) return null;

  const isApprove = type === 'approve';
  const title = isApprove ? 'Approve Application' : 'Reject Application';
  const message = isApprove
    ? `Are you sure you want to approve the application for ${providerName}?`
    : `Are you sure you want to reject the application for ${providerName}?`;
  const confirmText = isApprove ? 'Approve' : 'Reject';
  const iconBgColor = isApprove ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30';
  const iconColor = isApprove ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  const buttonColor = isApprove
    ? 'bg-green-600 hover:bg-green-700 text-white'
    : 'bg-red-600 hover:bg-red-700 text-white';

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-md flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${iconBgColor} flex items-center justify-center`}>
                {isApprove ? (
                  <CheckCircle className={`h-5 w-5 ${iconColor}`} />
                ) : (
                  <AlertTriangle className={`h-5 w-5 ${iconColor}`} />
                )}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {title}
                </h2>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 cursor-pointer text-gray-700 dark:text-gray-300"
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
              {message}
            </p>
            {!isApprove && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This action cannot be undone. The application will be marked as rejected.
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className={`${buttonColor} cursor-pointer`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {isApprove ? 'Approving...' : 'Rejecting...'}
                </>
              ) : (
                confirmText
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export const ProviderApplicationsScreen = () => {
  const { data: applicationsData, isLoading, error, refetch } = useGetProviderApplicationsQuery();
  const [approveApplication, { isLoading: isApproving }] = useApproveProviderApplicationMutation();
  const [rejectApplication, { isLoading: isRejecting }] = useRejectProviderApplicationMutation();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'approve' | 'reject' | null;
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
    const matchesSearch = providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openModal = (type: 'approve' | 'reject', id: string, providerName: string) => {
    setModalState({
      isOpen: true,
      type,
      applicationId: id,
      providerName,
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      type: null,
      applicationId: null,
      providerName: '',
    });
  };

  const handleConfirm = async () => {
    if (!modalState.applicationId || !modalState.type) return;

    try {
      if (modalState.type === 'approve') {
        await approveApplication(modalState.applicationId).unwrap();
        showToast('Application approved successfully', 'success');
      } else {
        await rejectApplication(modalState.applicationId).unwrap();
        showToast('Application rejected successfully', 'success');
      }
      closeModal();
      refetch();
    } catch (error) {
      showToast(
        modalState.type === 'approve'
          ? 'Failed to approve application'
          : 'Failed to reject application',
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
            <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-[length:var(--body-small-medium-font-size)] text-right tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] [font-style:var(--body-small-medium-font-style)]">
              Approved
            </span>
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-[100px] border border-solid bg-red-200 border-[#f9d2d9] text-red-700">
            <div className="w-1 h-1 rounded-sm bg-red-700" />
            <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-[length:var(--body-small-medium-font-size)] text-right tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] [font-style:var(--body-small-medium-font-style)]">
              Rejected
            </span>
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-[100px] border border-solid bg-orange-100 border-[#fff1db] text-orange-900">
            <div className="w-1 h-1 rounded-sm bg-orange-900" />
            <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-[length:var(--body-small-medium-font-size)] text-right tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] [font-style:var(--body-small-medium-font-style)]">
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
        <h1 className="font-heading-h4 font-[number:var(--heading-h4-font-weight)] text-greyscale-900 dark:text-white text-[length:var(--heading-h4-font-size)] tracking-[var(--heading-h4-letter-spacing)] leading-[var(--heading-h4-line-height)] [font-style:var(--heading-h4-font-style)]">
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
                className="pl-10 h-10 bg-greyscale-0 dark:bg-gray-800 border-[#dfe1e6] dark:border-gray-700 text-greyscale-900 dark:text-white"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}>
              <SelectTrigger className="h-10 w-[180px] bg-greyscale-0 dark:bg-gray-800 border-[#dfe1e6] dark:border-gray-700 text-greyscale-900 dark:text-white">
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
                      <TableHead className="w-[246px] h-10 px-4 py-0">
                        <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-greyscale-500 dark:text-gray-400 text-[length:var(--body-small-medium-font-size)] tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] [font-style:var(--body-small-medium-font-style)]">
                          Provider Name
                        </span>
                      </TableHead>
                      <TableHead className="w-60 h-10 px-4 py-0">
                        <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-greyscale-500 dark:text-gray-400 text-[length:var(--body-small-medium-font-size)] tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] [font-style:var(--body-small-medium-font-style)]">
                          Email Address
                        </span>
                      </TableHead>
                      <TableHead className="flex-1 h-10 px-4 py-0">
                        <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-greyscale-500 dark:text-gray-400 text-[length:var(--body-small-medium-font-size)] tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] [font-style:var(--body-small-medium-font-style)]">
                          Status
                        </span>
                      </TableHead>
                      <TableHead className="w-[178px] h-10 px-4 py-0">
                        <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-greyscale-500 dark:text-gray-400 text-[length:var(--body-small-medium-font-size)] tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] [font-style:var(--body-small-medium-font-style)]">
                          Submitted
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
                    {filteredApplications.map((app, index) => {
                      const appId = app.id || app._id || `app-${index}`;
                      const providerName = app.providerName || app.facilityName || 'Unknown';
                      const email = app.email || app.contactPerson?.email || 'No email';
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
                            <span className="font-body-medium-semibold font-[number:var(--body-medium-semibold-font-weight)] text-greyscale-900 dark:text-white text-[length:var(--body-medium-semibold-font-size)] tracking-[var(--body-medium-semibold-letter-spacing)] leading-[var(--body-medium-semibold-line-height)] [font-style:var(--body-medium-semibold-font-style)]">
                              {providerName}
                            </span>
                          </TableCell>
                          <TableCell className="h-12 px-4 py-0">
                            <span className="font-body-medium-semibold font-[number:var(--body-medium-semibold-font-weight)] text-[#009688] dark:text-teal-400 text-[length:var(--body-medium-semibold-font-size)] tracking-[var(--body-medium-semibold-letter-spacing)] leading-[var(--body-medium-semibold-line-height)] [font-style:var(--body-medium-semibold-font-style)]">
                              {email}
                            </span>
                          </TableCell>
                          <TableCell className="h-12 px-4 py-0">
                            {getStatusBadge(app.status)}
                          </TableCell>
                          <TableCell className="h-12 px-4 py-0">
                            <span className="font-body-medium-semibold font-[number:var(--body-medium-semibold-font-weight)] text-greyscale-900 dark:text-white text-[length:var(--body-medium-semibold-font-size)] tracking-[var(--body-medium-semibold-letter-spacing)] leading-[var(--body-medium-semibold-line-height)] [font-style:var(--body-medium-semibold-font-style)]">
                              {new Date(submittedDate).toLocaleDateString()}
                            </span>
                          </TableCell>
                          <TableCell className="h-12 px-4 py-0">
                            <div className="flex gap-2">
                              {app.status === 'pending' && (
                                <>
                                  <Button
                                    size="icon"
                                    onClick={() => openModal('approve', appId, providerName)}
                                    disabled={isApproving || isRejecting}
                                    className="h-8 w-8 p-0 bg-green-200 hover:bg-green-200 text-green-700 rounded-lg cursor-pointer"
                                    title="Approve application"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    onClick={() => openModal('reject', appId, providerName)}
                                    disabled={isApproving || isRejecting}
                                    className="h-8 w-8 p-0 bg-red-200 hover:bg-red-200 text-red-700 rounded-lg cursor-pointer"
                                    title="Reject application"
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
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

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onConfirm={handleConfirm}
        type={modalState.type || 'approve'}
        providerName={modalState.providerName}
        isLoading={isApproving || isRejecting}
      />
    </div>
  );
};

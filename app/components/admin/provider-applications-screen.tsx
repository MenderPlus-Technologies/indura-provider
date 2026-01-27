'use client';

import { useState, useEffect } from 'react';
import { useGetProviderApplicationsQuery, useGetProviderApplicationQuery, useApproveProviderApplicationMutation, useRejectProviderApplicationMutation, type ProviderApplication } from '@/app/store/apiSlice';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/toast';
import { CheckCircle, XCircle, Loader2, Search, AlertTriangle, X, RefreshCw, Eye, Building, Mail, Phone, MapPin, Calendar, FileText, User, Globe } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface ViewApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: string | null;
  onApprove: (id: string, providerName: string) => void;
  onReject: (id: string, providerName: string) => void;
  isApproving: boolean;
  isRejecting: boolean;
}

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  type: 'approve' | 'reject';
  providerName: string;
  isLoading?: boolean;
}

const ViewApplicationModal = ({ isOpen, onClose, applicationId, onApprove, onReject, isApproving, isRejecting }: ViewApplicationModalProps) => {
  const { data: responseData, isLoading, error } = useGetProviderApplicationQuery(applicationId || '', {
    skip: !isOpen || !applicationId,
  });

  if (!isOpen || !applicationId) return null;

  // Handle nested response structure: { application: {...} }
  const app = (() => {
    if (!responseData) return undefined;
    // Check if response is wrapped in 'application' property
    if (typeof responseData === 'object' && 'application' in responseData) {
      return (responseData as { application: ProviderApplication }).application;
    }
    // Otherwise assume it's the application directly
    return responseData as ProviderApplication;
  })();
  const facilityName = app?.facilityName || app?.providerName || 'N/A';
  const facilityType = app?.facilityType || 'N/A';
  const contactPerson = app?.contactPerson;
  const contactName = contactPerson?.fullName || 'N/A';
  const contactEmail = contactPerson?.email || app?.email || 'N/A';
  const contactPhone = contactPerson?.phone || 'N/A';
  const contactRole = contactPerson?.role || 'N/A';
  const description = app?.description || 'N/A';
  const yearEstablished = app?.yearEstablished || 'N/A';
  const country = app?.country || 'N/A';
  const state = app?.state || 'N/A';
  const city = app?.city || 'N/A';
  const address = app?.address || 'N/A';
  const declarationAccepted = app?.declarationAccepted || false;
  const status = app?.status || 'pending';
  const createdAt = app?.createdAt ? new Date(app.createdAt).toLocaleString() : 'N/A';
  const updatedAt = app?.updatedAt ? new Date(app.updatedAt).toLocaleString() : 'N/A';
  const reviewedAt = app?.reviewedAt ? new Date(app.reviewedAt).toLocaleString() : null;
  const reviewedBy = app?.reviewedBy || null;

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
              Application Details
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 cursor-pointer text-gray-700 dark:text-gray-300"
              disabled={isApproving || isRejecting}
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
                <p className="text-red-600 dark:text-red-400">Failed to load application details</p>
              </div>
            ) : app ? (
              <div className="space-y-6">
                {/* Facility Information */}
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                    Facility Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Facility Name
                      </label>
                      <div className="mt-1 flex items-center gap-2">
                        <Building className="h-4 w-4 text-gray-400" />
                        <p className="text-base text-gray-900 dark:text-white">
                          {facilityName}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Facility Type
                      </label>
                      <div className="mt-1 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <p className="text-base text-gray-900 dark:text-white">
                          {facilityType}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Year Established
                      </label>
                      <div className="mt-1 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <p className="text-base text-gray-900 dark:text-white">
                          {yearEstablished}
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

                {/* Contact Person Information */}
                <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                    Contact Person
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Full Name
                      </label>
                      <div className="mt-1 flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <p className="text-base text-gray-900 dark:text-white">
                          {contactName}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Role
                      </label>
                      <div className="mt-1">
                        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                          {contactRole}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Email
                      </label>
                      <div className="mt-1 flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <p className="text-base text-[#009688] dark:text-teal-400">
                          {contactEmail}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Phone
                      </label>
                      <div className="mt-1 flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <p className="text-base text-gray-900 dark:text-white">
                          {contactPhone}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location Information */}
                <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                    Location
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Country
                      </label>
                      <div className="mt-1 flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <p className="text-base text-gray-900 dark:text-white">
                          {country}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        State
                      </label>
                      <div className="mt-1 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <p className="text-base text-gray-900 dark:text-white">
                          {state}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        City
                      </label>
                      <div className="mt-1 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <p className="text-base text-gray-900 dark:text-white">
                          {city}
                        </p>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Address
                      </label>
                      <div className="mt-1 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <p className="text-base text-gray-900 dark:text-white">
                          {address}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Application Metadata */}
                <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                    Application Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Submitted Date
                      </label>
                      <div className="mt-1 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <p className="text-sm text-gray-900 dark:text-white">
                          {createdAt}
                        </p>
                      </div>
                    </div>
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
                    {reviewedAt && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          Reviewed Date
                        </label>
                        <div className="mt-1 flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <p className="text-sm text-gray-900 dark:text-white">
                            {reviewedAt}
                          </p>
                        </div>
                      </div>
                    )}
                    {reviewedBy && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          Reviewed By
                        </label>
                        <div className="mt-1">
                          <p className="text-sm text-gray-900 dark:text-white">
                            {reviewedBy}
                          </p>
                        </div>
                      </div>
                    )}
                    <div>
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Declaration Accepted
                      </label>
                      <div className="mt-1 flex items-center gap-2">
                        {declarationAccepted ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-green-600 dark:text-green-400">Yes</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-500 dark:text-gray-400">No</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Footer with Actions */}
          {app && status === 'pending' && (
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isApproving || isRejecting}
                className="cursor-pointer"
              >
                Close
              </Button>
              <Button
                onClick={() => onReject(applicationId, facilityName)}
                disabled={isApproving || isRejecting}
                className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
              >
                {isRejecting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Rejecting...
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 mr-2" />
                    Decline
                  </>
                )}
              </Button>
              <Button
                onClick={() => onApprove(applicationId, facilityName)}
                disabled={isApproving || isRejecting}
                className="bg-green-600 hover:bg-green-700 text-white cursor-pointer"
              >
                {isApproving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Approving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </>
                )}
              </Button>
            </div>
          )}
          {app && status !== 'pending' && (
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800">
              <Button
                variant="outline"
                onClick={onClose}
                className="cursor-pointer"
              >
                Close
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, type, providerName, isLoading = false }: ConfirmationModalProps) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [reasonError, setReasonError] = useState('');

  // Reset form when modal opens/closes or type changes
  useEffect(() => {
    if (!isOpen) {
      setRejectionReason('');
      setReasonError('');
    }
  }, [isOpen, type]);

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

  const handleConfirmClick = () => {
    if (!isApprove && !rejectionReason.trim()) {
      setReasonError('Rejection reason is required');
      return;
    }
    setReasonError('');
    onConfirm(rejectionReason.trim() || undefined);
  };

  const handleClose = () => {
    setRejectionReason('');
    setReasonError('');
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={handleClose}
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
              onClick={handleClose}
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
              <>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  This action cannot be undone. The application will be marked as rejected.
                </p>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rejection Reason <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    value={rejectionReason}
                    onChange={(e) => {
                      setRejectionReason(e.target.value);
                      if (reasonError) setReasonError('');
                    }}
                    placeholder="Please provide a reason for rejecting this application..."
                    className={`min-h-[100px] w-full bg-greyscale-0 dark:bg-gray-800 border-[#dfe1e6] dark:border-gray-700 text-greyscale-900 dark:text-white ${
                      reasonError ? 'border-red-500 dark:border-red-500' : ''
                    }`}
                    disabled={isLoading}
                  />
                  {reasonError && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {reasonError}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmClick}
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
  const [viewModalState, setViewModalState] = useState<{
    isOpen: boolean;
    applicationId: string | null;
  }>({
    isOpen: false,
    applicationId: null,
  });

  const [confirmationModalState, setConfirmationModalState] = useState<{
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

  const openConfirmationModal = (type: 'approve' | 'reject', id: string, providerName: string) => {
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

  const handleConfirm = async (reason?: string) => {
    if (!confirmationModalState.applicationId || !confirmationModalState.type) return;

    try {
      if (confirmationModalState.type === 'approve') {
        await approveApplication(confirmationModalState.applicationId).unwrap();
        showToast('Application approved successfully', 'success');
      } else {
        if (!reason) {
          showToast('Rejection reason is required', 'error');
          return;
        }
        await rejectApplication({ id: confirmationModalState.applicationId, reason }).unwrap();
        showToast('Application rejected successfully', 'success');
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
                      <TableHead className="w-[200px] h-10 px-4 py-0">
                        <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-greyscale-500 dark:text-gray-400 text-[length:var(--body-small-medium-font-size)] tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] [font-style:var(--body-small-medium-font-style)]">
                          Provider Name
                        </span>
                      </TableHead>
                      <TableHead className="w-[150px] h-10 px-4 py-0">
                        <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-greyscale-500 dark:text-gray-400 text-[length:var(--body-small-medium-font-size)] tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] [font-style:var(--body-small-medium-font-style)]">
                          Provider Type
                        </span>
                      </TableHead>
                      <TableHead className="w-[150px] h-10 px-4 py-0">
                        <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-greyscale-500 dark:text-gray-400 text-[length:var(--body-small-medium-font-size)] tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] [font-style:var(--body-small-medium-font-style)]">
                          Status
                        </span>
                      </TableHead>
                      <TableHead className="w-[150px] h-10 px-4 py-0">
                        <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-greyscale-500 dark:text-gray-400 text-[length:var(--body-small-medium-font-size)] tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] [font-style:var(--body-small-medium-font-style)]">
                          Submitted
                        </span>
                      </TableHead>
                      <TableHead className="w-[120px] h-10 px-4 py-0">
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
                            <span className="font-body-medium-semibold font-[number:var(--body-medium-semibold-font-weight)] text-greyscale-900 dark:text-white text-[length:var(--body-medium-semibold-font-size)] tracking-[var(--body-medium-semibold-letter-spacing)] leading-[var(--body-medium-semibold-line-height)] [font-style:var(--body-medium-semibold-font-style)]">
                              {providerName}
                            </span>
                          </TableCell>
                          <TableCell className="h-12 px-4 py-0">
                            <span className="font-body-medium-semibold font-[number:var(--body-medium-semibold-font-weight)] text-greyscale-900 dark:text-white text-[length:var(--body-medium-semibold-font-size)] tracking-[var(--body-medium-semibold-letter-spacing)] leading-[var(--body-medium-semibold-line-height)] [font-style:var(--body-medium-semibold-font-style)]">
                              {facilityType}
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
                            <Button
                              size="sm"
                              onClick={() => openViewModal(appId)}
                              className="h-8 px-3 bg-[#009688] hover:bg-[#008577] text-white rounded-lg cursor-pointer"
                              title="View application details"
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
        isLoading={isApproving || isRejecting}
      />
    </div>
  );
};

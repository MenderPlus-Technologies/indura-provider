'use client';

import { useGetProviderApplicationQuery, type ProviderApplication } from '@/app/store/apiSlice';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import {
  Building,
  Calendar,
  CheckCircle,
  FileText,
  Globe,
  Loader2,
  Mail,
  MapPin,
  Phone,
  User,
  X,
  XCircle,
} from 'lucide-react';
import { JSX } from 'react';

export interface ViewApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: string | null;
  onApprove: (id: string, providerName: string) => void;
  onReject: (id: string, providerName: string) => void;
  isApproving: boolean;
  isRejecting: boolean;
}

export const ViewApplicationModal = ({
  isOpen,
  onClose,
  applicationId,
  onApprove,
  onReject,
  isApproving,
  isRejecting,
}: ViewApplicationModalProps): JSX.Element | null => {
  const { data: responseData, isLoading, error } = useGetProviderApplicationQuery(applicationId || '', {
    skip: !isOpen || !applicationId,
  });

  // Handle nested response structure: { application: {...} }
  const app = (() => {
    if (!responseData) return undefined;
    if (typeof responseData === 'object' && responseData !== null && 'application' in responseData) {
      const wrapped = responseData as unknown as { application: ProviderApplication };
      return wrapped.application;
    }
    return responseData as ProviderApplication;
  })();

  if (!isOpen || !applicationId) return null;

  const facilityName = app?.facilityName || app?.providerName || 'N/A';
  const facilityType = app?.facilityType || app?.providerType || 'N/A';
  const contactPerson = app?.contactPerson;
  const contactName = contactPerson?.fullName || app?.contactFullName || 'N/A';
  const contactEmail = contactPerson?.email || app?.email || 'N/A';
  const contactPhone = contactPerson?.phone || app?.contactPhoneNumber || app?.phoneNumber || 'N/A';
  const contactRole = contactPerson?.role || app?.contactRole || 'N/A';
  const description = app?.description || app?.serviceDescription || 'N/A';
  const yearEstablished = app?.yearEstablished || 'N/A';
  const country = app?.country || 'N/A';
  const state = app?.state || 'N/A';
  const cityOrLga = app?.city || app?.lga || 'N/A';
  const address = app?.address || 'N/A';
  const declarationAccepted = app?.declarationAccepted || app?.agreeToTerms || false;
  const consentToVerification = app?.consentToVerification ?? false;
  const status = app?.status || 'pending';
  const createdAt = app?.createdAt ? new Date(app.createdAt).toLocaleString() : 'N/A';
  const updatedAt = app?.updatedAt ? new Date(app.updatedAt).toLocaleString() : 'N/A';
  const reviewedAt = app?.reviewedAt ? new Date(app.reviewedAt).toLocaleString() : null;

  const reviewedBy = (() => {
    const reviewedByValue = app?.reviewedBy;
    if (!reviewedByValue) return null;
    if (typeof reviewedByValue === 'string') return reviewedByValue;
    if (typeof reviewedByValue === 'object') {
      const reviewedByObj = reviewedByValue as { name?: string; email?: string; _id?: string };
      return reviewedByObj.name || reviewedByObj.email || reviewedByObj._id || 'Unknown';
    }
    return String(reviewedByValue);
  })();

  const documents = app?.documents as
    | {
        operatingLicense?: string;
        cacCertificate?: string;
        [key: string]: unknown;
      }
    | undefined;

  const getStatusBadge = (currentStatus: string) => {
    switch (currentStatus) {
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
        return <Badge>{currentStatus}</Badge>;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="flex flex-col p-0">
        <SheetHeader className="px-6 py-4">
          <div className="flex flex-col gap-1">
            <SheetTitle>Application Details</SheetTitle>
            {app && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 inter">
                  {facilityName}
                </span>
                {getStatusBadge(status)}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {app && status === 'pending' && (
              <>
                <Button
                  onClick={() => onReject(applicationId, facilityName)}
                  disabled={isApproving || isRejecting}
                  className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                  size="sm"
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
                  size="sm"
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
              </>
            )}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onClose}
              className="h-8 w-8 cursor-pointer text-gray-700 dark:text-gray-300"
              disabled={isApproving || isRejecting}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        {/* Scrollable Content */}
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
                <h3 className="text-base font-semibold text-gray-600 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 inter">
                  Facility Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide inter">
                      Facility Name
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      <Building className="h-4 w-4 text-gray-400" />
                      <p className="text-base text-gray-600 dark:text-white inter">
                        {facilityName}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide inter">
                      Facility Type
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <p className="text-base text-gray-600 dark:text-white inter">
                        {facilityType}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide inter">
                      Year Established
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <p className="text-base text-gray-600 dark:text-white inter">
                        {yearEstablished}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide inter">
                      Status
                    </label>
                    <div className="mt-1">
                      {getStatusBadge(status)}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide inter">
                      Description
                    </label>
                    <div className="mt-1">
                      <p className="text-sm text-gray-600 dark:text-white whitespace-pre-wrap inter">
                        {description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Person Information */}
              <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-base font-semibold text-gray-600 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 inter">
                  Contact Person
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide inter">
                      Full Name
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <p className="text-base text-gray-600 dark:text-white inter">
                        {contactName}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide inter">
                      Role
                    </label>
                    <div className="mt-1">
                      <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                        {contactRole}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide inter">
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
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide inter">
                      Phone
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <p className="text-base text-gray-600 dark:text-white inter">
                        {String(contactPhone)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-base font-semibold text-gray-600 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 inter">
                  Location
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide inter">
                      Country
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <p className="text-base text-gray-600 dark:text-white inter">
                        {country}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide inter">
                      State
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <p className="text-base text-gray-600 dark:text-white inter">
                        {state}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide inter">
                      City / LGA
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <p className="text-base text-gray-600 dark:text-white inter">
                        {cityOrLga}
                      </p>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide inter">
                      Address
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <p className="text-base text-gray-600 dark:text-white inter">
                        {address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents */}
              {documents && (documents.operatingLicense || documents.cacCertificate) && (
                <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-base font-semibold text-gray-600 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 inter">
                    Documents
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {documents.operatingLicense && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide inter">
                          Operating License
                        </label>
                        <div className="mt-1 flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <a
                            href={documents.operatingLicense}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-[#009688] dark:text-teal-400 underline break-all"
                          >
                            View document
                          </a>
                        </div>
                      </div>
                    )}
                    {documents.cacCertificate && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide inter">
                          CAC Certificate
                        </label>
                        <div className="mt-1 flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <a
                            href={documents.cacCertificate}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-[#009688] dark:text-teal-400 underline break-all"
                          >
                            View document
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Application Metadata */}
              <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-base font-semibold text-gray-600 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 inter">
                  Application Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide inter">
                      Submitted Date
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <p className="text-sm text-gray-600 dark:text-white">
                        {createdAt}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide inter">
                      Last Updated
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <p className="text-sm text-gray-600 dark:text-white">
                        {updatedAt}
                      </p>
                    </div>
                  </div>
                  {reviewedAt && (
                    <div>
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide inter">
                        Reviewed Date
                      </label>
                      <div className="mt-1 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <p className="text-sm text-gray-600 dark:text-white">
                          {reviewedAt}
                        </p>
                      </div>
                    </div>
                  )}
                  {reviewedBy && (
                    <div>
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide inter">
                        Reviewed By
                      </label>
                      <div className="mt-1">
                        <p className="text-sm text-gray-600 dark:text-white">
                          {reviewedBy}
                        </p>
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide inter">
                      Declaration Accepted
                    </label>
                    <div className="mt-1 flex items-centered gap-2">
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
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide inter">
                      Consent to Verification
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      {consentToVerification ? (
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
      </SheetContent>
    </Sheet>
  );
}


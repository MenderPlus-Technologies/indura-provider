'use client';

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { MembersHeader } from "./members-header";
import { TotalMembersCard } from "./total-members-card";
import { MembersTable } from "./members-table";
import { MembersPagination } from "./members-pagination";
import { NotificationModal } from "./notification-modal";
import { membersData, type Member } from "./member-utils";

export const MembersScreen = () => {
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [notificationRecipients, setNotificationRecipients] = useState<Member[]>([]);
  const [notificationType, setNotificationType] = useState<'all' | 'selected' | 'individual'>('all');

  const handleSendNotification = (type: 'all' | 'selected') => {
    if (type === 'all') {
      setNotificationRecipients(membersData);
      setNotificationType('all');
    } else {
      setNotificationRecipients(selectedMembers);
      setNotificationType('selected');
    }
    setIsNotificationModalOpen(true);
  };

  const handleIndividualNotification = (member: Member) => {
    setNotificationRecipients([member]);
    setNotificationType('individual');
    setIsNotificationModalOpen(true);
  };

  const handleCloseNotificationModal = () => {
    setIsNotificationModalOpen(false);
    setNotificationRecipients([]);
  };

  return (
    <div className="flex flex-col w-full items-start bg-white dark:bg-gray-950 relative">
      <MembersHeader 
        onSendNotification={handleSendNotification}
        hasSelectedMembers={selectedMembers.length > 0}
      />

      <div className="mt-4 px-4 sm:px-6 gap-4 sm:gap-6 justify-center w-full">
        <div className="bg-[#F9F9FB] dark:bg-gray-800/50 flex flex-col gap-2 items-center border border-[#DFE1E6] dark:border-gray-700 p-1 rounded-2xl">
          <TotalMembersCard />

          <Card className="flex flex-col shadow-none gap-1 p-1 w-full">
            <div className="overflow-x-auto">
              <MembersTable 
                onIndividualNotification={handleIndividualNotification}
                selectedMembers={selectedMembers}
                onSelectionChange={setSelectedMembers}
              />
            </div>
            <MembersPagination />
          </Card>
        </div>
      </div>

      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={handleCloseNotificationModal}
        recipients={notificationRecipients}
        recipientType={notificationType}
      />
    </div>
  );
};

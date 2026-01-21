'use client';

import { useState, useMemo } from 'react';
import {
  useGetUsersQuery,
  useUpdateUserStatusMutation,
  useUpdateUserRoleMutation,
  useSoftDeleteUserMutation,
  useHardDeleteUserMutation,
} from '@/app/store/apiSlice';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/toast';
import { Loader2, Search, MoreVertical, Trash2, UserX, Shield, ChevronLeft, ChevronRight, RefreshCw, Users, Building2, UserCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

type UserRoleTab = 'all' | 'user' | 'provider_staff' | 'admin';

export const UsersScreen = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<UserRoleTab>('all');
  const limit = 10;

  const { data, isLoading, error, refetch } = useGetUsersQuery({
    page,
    limit: 1000, // Fetch all users to filter by role
    search: searchTerm || undefined,
  });

  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateUserStatusMutation();
  const [updateRole, { isLoading: isUpdatingRole }] = useUpdateUserRoleMutation();
  const [softDelete, { isLoading: isSoftDeleting }] = useSoftDeleteUserMutation();
  const [hardDelete, { isLoading: isHardDeleting }] = useHardDeleteUserMutation();
  const { showToast } = useToast();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const allUsers = data?.users || [];
  
  // Filter users by role and search term
  const filteredUsers = useMemo(() => {
    let filtered = allUsers;
    
    // Filter by role
    if (activeTab !== 'all') {
      filtered = filtered.filter((user) => user.role === activeTab);
    }
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((user) => {
        const email = typeof user.email === 'string' ? user.email.toLowerCase() : '';
        const name = typeof user.name === 'string' ? user.name.toLowerCase() : '';
        const phone = typeof user.phone === 'string' ? user.phone.toLowerCase() : '';
        return email.includes(searchLower) || name.includes(searchLower) || phone.includes(searchLower);
      });
    }
    
    return filtered;
  }, [allUsers, activeTab, searchTerm]);

  // Paginate filtered users
  const paginatedUsers = useMemo(() => {
    const startIndex = (page - 1) * limit;
    return filteredUsers.slice(startIndex, startIndex + limit);
  }, [filteredUsers, page, limit]);

  const total = filteredUsers.length;
  const totalPages = Math.ceil(total / limit);

  // Count users by role
  const roleCounts = useMemo(() => {
    return {
      all: allUsers.length,
      user: allUsers.filter((u) => u.role === 'user').length,
      provider_staff: allUsers.filter((u) => u.role === 'provider_staff').length,
      admin: allUsers.filter((u) => u.role === 'admin').length,
    };
  }, [allUsers]);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await updateStatus({ id, status }).unwrap();
      showToast(`User ${status === 'active' ? 'activated' : 'suspended'} successfully`, 'success');
      refetch();
    } catch (error) {
      showToast('Failed to update user status', 'error');
    }
  };

  const handleUpdateRole = async (id: string, role: string) => {
    if (!confirm(`Are you sure you want to change this user's role to ${role}?`)) {
      return;
    }
    try {
      await updateRole({ id, role }).unwrap();
      showToast('User role updated successfully', 'success');
      refetch();
    } catch (error) {
      showToast('Failed to update user role', 'error');
    }
  };

  const handleSoftDelete = async (id: string) => {
    if (!confirm('Are you sure you want to soft delete this user?')) {
      return;
    }
    try {
      setSelectedId(id);
      await softDelete(id).unwrap();
      showToast('User soft deleted successfully', 'success');
      refetch();
    } catch (error) {
      showToast('Failed to delete user', 'error');
    } finally {
      setSelectedId(null);
    }
  };

  const handleHardDelete = async (id: string) => {
    if (!confirm('WARNING: This will permanently delete the user. This action cannot be undone. Are you sure?')) {
      return;
    }
    try {
      setSelectedId(id);
      await hardDelete(id).unwrap();
      showToast('User permanently deleted', 'success');
      refetch();
    } catch (error) {
      showToast('Failed to delete user', 'error');
    } finally {
      setSelectedId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-[100px] border border-solid bg-alertssuccess-0 border-[#c6ede5] text-alertssuccess-100">
            <div className="w-1 h-1 rounded-sm bg-alertssuccess-100" />
            <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-[length:var(--body-small-medium-font-size)] text-right tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] [font-style:var(--body-small-medium-font-style)]">
              Active
            </span>
          </Badge>
        );
      case 'suspended':
        return (
          <Badge className="inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-[100px] border border-solid bg-alertswarning-0 border-[#fff1db] text-alertswarning-100">
            <div className="w-1 h-1 rounded-sm bg-alertswarning-100" />
            <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-[length:var(--body-small-medium-font-size)] text-right tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] [font-style:var(--body-small-medium-font-style)]">
              Suspended
            </span>
          </Badge>
        );
      case 'deleted':
        return (
          <Badge className="inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-[100px] border border-solid bg-alertserror-0 border-[#f9d2d9] text-alertserror-100">
            <div className="w-1 h-1 rounded-sm bg-alertserror-100" />
            <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-[length:var(--body-small-medium-font-size)] text-right tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] [font-style:var(--body-small-medium-font-style)]">
              Deleted
            </span>
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <Badge className="inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-[100px] border border-solid bg-purple-100 border-purple-200 text-purple-800 dark:bg-purple-900/30 dark:border-purple-800 dark:text-purple-300">
            <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-[length:var(--body-small-medium-font-size)] text-right tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] [font-style:var(--body-small-medium-font-style)]">
              Admin
            </span>
          </Badge>
        );
      case 'provider_staff':
        return (
          <Badge className="inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-[100px] border border-solid bg-blue-100 border-blue-200 text-blue-800 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300">
            <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-[length:var(--body-small-medium-font-size)] text-right tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] [font-style:var(--body-small-medium-font-style)]">
              Provider Staff
            </span>
          </Badge>
        );
      case 'user':
        return (
          <Badge className="inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-[100px] border border-solid bg-gray-100 border-gray-200 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
            <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-[length:var(--body-small-medium-font-size)] text-right tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] [font-style:var(--body-small-medium-font-style)]">
              User
            </span>
          </Badge>
        );
      default:
        return <Badge>{role}</Badge>;
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
        <p className="text-red-600 dark:text-red-400">Failed to load users</p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full items-start bg-white dark:bg-gray-950 relative">
      <header className="h-auto sm:h-[72px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 px-4 sm:px-6 py-4 bg-greyscale-0 dark:bg-gray-900 border-b border-solid border-[#dfe1e6] dark:border-gray-800 w-full">
        <h1 className="font-heading-h4 font-[number:var(--heading-h4-font-weight)] text-greyscale-900 dark:text-white text-[length:var(--heading-h4-font-size)] tracking-[var(--heading-h4-letter-spacing)] leading-[var(--heading-h4-line-height)] [font-style:var(--heading-h4-font-style)]">
          User Management
        </h1>
        <div className="inline-flex items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            className="h-8 w-8 p-2 bg-greyscale-0 dark:bg-gray-800 rounded-lg border border-solid border-[#dfe1e6] dark:border-gray-700 shadow-shadow-xsmall cursor-pointer"
            title="Refresh users"
          >
            <RefreshCw className="h-4 w-4 text-gray-700 dark:text-gray-300" />
          </Button>
        </div>
      </header>

      {/* Role Tabs */}
      <div className="w-full border-b border-solid border-[#dfe1e6] dark:border-gray-800 bg-greyscale-0 dark:bg-gray-900">
        <div className="flex items-center gap-1 px-4 sm:px-6 overflow-x-auto">
          {[
            { id: 'all' as UserRoleTab, label: 'All Users', icon: Users, count: roleCounts.all },
            { id: 'user' as UserRoleTab, label: 'Regular Users', icon: UserCheck, count: roleCounts.user },
            { id: 'provider_staff' as UserRoleTab, label: 'Provider Staff', icon: Building2, count: roleCounts.provider_staff },
            { id: 'admin' as UserRoleTab, label: 'Admins', icon: Shield, count: roleCounts.admin },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setPage(1);
                }}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                  isActive
                    ? 'border-[#009688] text-[#009688] dark:text-teal-400 dark:border-teal-400'
                    : 'border-transparent text-greyscale-600 dark:text-gray-400 hover:text-greyscale-900 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-body-medium-semibold font-[number:var(--body-medium-semibold-font-weight)] text-[length:var(--body-medium-semibold-font-size)] tracking-[var(--body-medium-semibold-letter-spacing)] leading-[var(--body-medium-semibold-line-height)] [font-style:var(--body-medium-semibold-font-style)]">
                  {tab.label}
                </span>
                <Badge className={`px-1.5 py-0.5 rounded-full text-xs ${
                  isActive
                    ? 'bg-[#009688] text-white dark:bg-teal-400 dark:text-teal-900'
                    : 'bg-greyscale-100 dark:bg-gray-700 text-greyscale-600 dark:text-gray-400'
                }`}>
                  {tab.count}
                </Badge>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 px-4 sm:px-6 gap-4 sm:gap-6 justify-center w-full">
        <div className="bg-[#F9F9FB] dark:bg-gray-800/50 flex flex-col gap-2 items-center border border-[#DFE1E6] dark:border-gray-700 p-1 rounded-2xl">
          <Card className="flex flex-col shadow-none gap-1 p-1 w-full">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                  <Input
                    placeholder="Search by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setPage(1);
                    }}
                    className="pl-10 h-10 bg-greyscale-0 dark:bg-gray-800 border-[#dfe1e6] dark:border-gray-700 text-greyscale-900 dark:text-white"
                  />
                </div>
              </div>

              {paginatedUsers.length === 0 ? (
                <div className="text-center py-12">
                  <p className="font-body-medium-regular text-greyscale-500 dark:text-gray-400">
                    {searchTerm ? 'No users found matching your search' : `No ${activeTab === 'all' ? '' : activeTab.replace('_', ' ')} users found`}
                  </p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <div className="bg-greyscale-0 dark:bg-gray-800 rounded-xl border border-solid border-[#dfe1e6] dark:border-gray-700">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-b border-solid border-[#dfe1e6] dark:border-gray-700">
                            <TableHead className="w-[200px] h-10 px-4 py-0">
                              <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-greyscale-500 dark:text-gray-400 text-[length:var(--body-small-medium-font-size)] tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] [font-style:var(--body-small-medium-font-style)]">
                                Name
                              </span>
                            </TableHead>
                            <TableHead className="w-[220px] h-10 px-4 py-0">
                              <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-greyscale-500 dark:text-gray-400 text-[length:var(--body-small-medium-font-size)] tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] [font-style:var(--body-small-medium-font-style)]">
                                Email
                              </span>
                            </TableHead>
                            <TableHead className="w-[140px] h-10 px-4 py-0">
                              <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-greyscale-500 dark:text-gray-400 text-[length:var(--body-small-medium-font-size)] tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] [font-style:var(--body-small-medium-font-style)]">
                                Phone
                              </span>
                            </TableHead>
                            <TableHead className="w-[120px] h-10 px-4 py-0">
                              <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-greyscale-500 dark:text-gray-400 text-[length:var(--body-small-medium-font-size)] tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] [font-style:var(--body-small-medium-font-style)]">
                                Role
                              </span>
                            </TableHead>
                            <TableHead className="w-[100px] h-10 px-4 py-0">
                              <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-greyscale-500 dark:text-gray-400 text-[length:var(--body-small-medium-font-size)] tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] [font-style:var(--body-small-medium-font-style)]">
                                Status
                              </span>
                            </TableHead>
                            <TableHead className="w-[140px] h-10 px-4 py-0">
                              <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-greyscale-500 dark:text-gray-400 text-[length:var(--body-small-medium-font-size)] tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] [font-style:var(--body-small-medium-font-style)]">
                                Created
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
                          {paginatedUsers.map((user, index) => {
                            const userAny = user as any;
                            const userId = userAny._id || userAny.id || `user-${index}`;
                            const userEmail = typeof userAny.email === 'string' ? userAny.email : 'unknown';
                            const userName = typeof userAny.name === 'string' ? userAny.name : 'N/A';
                            const userPhone = typeof userAny.phone === 'string' ? userAny.phone : 'N/A';
                            const userRole = typeof userAny.role === 'string' ? userAny.role : 'user';
                            const userStatus = typeof userAny.status === 'string' ? userAny.status : 'active';
                            const userCreatedAt = userAny.createdAt;
                            const isProviderAdmin = userAny.isProviderAdmin === true;
                            
                            return (
                            <TableRow
                              key={userId}
                              className={
                                index < paginatedUsers.length - 1
                                  ? "border-b border-solid border-[#dfe1e6] dark:border-gray-700"
                                  : ""
                              }
                            >
                              <TableCell className="h-12 px-4 py-0">
                                <div className="flex flex-col">
                                  <span className="font-body-medium-semibold font-[number:var(--body-medium-semibold-font-weight)] text-greyscale-900 dark:text-white text-[length:var(--body-medium-semibold-font-size)] tracking-[var(--body-medium-semibold-letter-spacing)] leading-[var(--body-medium-semibold-line-height)] [font-style:var(--body-medium-semibold-font-style)]">
                                    {userName}
                                  </span>
                                  {isProviderAdmin && (
                                    <Badge className="mt-1 w-fit px-1.5 py-0 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                      Provider Admin
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="h-12 px-4 py-0">
                                <span className="font-body-medium-semibold font-[number:var(--body-medium-semibold-font-weight)] text-[#009688] dark:text-teal-400 text-[length:var(--body-medium-semibold-font-size)] tracking-[var(--body-medium-semibold-letter-spacing)] leading-[var(--body-medium-semibold-line-height)] [font-style:var(--body-medium-semibold-font-style)]">
                                  {userEmail}
                                </span>
                              </TableCell>
                              <TableCell className="h-12 px-4 py-0">
                                <span className="font-body-medium-semibold font-[number:var(--body-medium-semibold-font-weight)] text-greyscale-900 dark:text-white text-[length:var(--body-medium-semibold-font-size)] tracking-[var(--body-medium-semibold-letter-spacing)] leading-[var(--body-medium-semibold-line-height)] [font-style:var(--body-medium-semibold-font-style)]">
                                  {userPhone}
                                </span>
                              </TableCell>
                              <TableCell className="h-12 px-4 py-0">
                                {getRoleBadge(userRole)}
                              </TableCell>
                              <TableCell className="h-12 px-4 py-0">
                                {getStatusBadge(userStatus)}
                              </TableCell>
                              <TableCell className="h-12 px-4 py-0">
                                <span className="font-body-medium-semibold font-[number:var(--body-medium-semibold-font-weight)] text-greyscale-900 dark:text-white text-[length:var(--body-medium-semibold-font-size)] tracking-[var(--body-medium-semibold-letter-spacing)] leading-[var(--body-medium-semibold-line-height)] [font-style:var(--body-medium-semibold-font-style)]">
                                  {userCreatedAt ? new Date(userCreatedAt).toLocaleDateString() : 'N/A'}
                                </span>
                              </TableCell>
                              <TableCell className="h-12 px-4 py-0">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    >
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border-[#dfe1e6] dark:border-gray-700">
                              {userStatus !== 'active' && (
                                <DropdownMenuItem
                                  onClick={() => handleUpdateStatus(userId, 'active')}
                                  disabled={isUpdatingStatus}
                                  className="cursor-pointer"
                                >
                                  <UserX className="h-4 w-4 mr-2" />
                                  Activate
                                </DropdownMenuItem>
                              )}
                              {userStatus !== 'suspended' && (
                                <DropdownMenuItem
                                  onClick={() => handleUpdateStatus(userId, 'suspended')}
                                  disabled={isUpdatingStatus}
                                  className="cursor-pointer"
                                >
                                  <UserX className="h-4 w-4 mr-2" />
                                  Suspend
                                </DropdownMenuItem>
                              )}
                              {userRole !== 'admin' && (
                                <DropdownMenuItem
                                  onClick={() => handleUpdateRole(userId, 'admin')}
                                  disabled={isUpdatingRole}
                                  className="cursor-pointer"
                                >
                                  <Shield className="h-4 w-4 mr-2" />
                                  Make Admin
                                </DropdownMenuItem>
                              )}
                              {userRole !== 'provider_staff' && (
                                <DropdownMenuItem
                                  onClick={() => handleUpdateRole(userId, 'provider_staff')}
                                  disabled={isUpdatingRole}
                                  className="cursor-pointer"
                                >
                                  <Shield className="h-4 w-4 mr-2" />
                                  Make Provider Staff
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() => handleSoftDelete(userId)}
                                disabled={isSoftDeleting && selectedId === userId}
                                className="text-red-600 dark:text-red-400 cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Soft Delete
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleHardDelete(userId)}
                                disabled={isHardDeleting && selectedId === userId}
                                className="text-red-600 dark:text-red-400 cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Hard Delete
                              </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 p-4 w-full bg-greyscale-0 dark:bg-gray-800 rounded-xl border border-solid border-[#dfe1e6] dark:border-gray-700 mt-4">
                      <div className="inline-flex justify-center gap-2 items-center">
                        <div className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm">
                          Page {page} of {totalPages} ({total} total)
                        </div>
                      </div>
                      <div className="inline-flex items-start gap-[5px] overflow-x-auto">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          disabled={page === 1}
                          className="h-8 w-8 p-2.5 bg-greyscale-0 dark:bg-gray-800 rounded-lg overflow-hidden border border-solid border-[#dfe1e6] dark:border-gray-700 shadow-[0px_1px_2px_#0d0d120f] cursor-pointer"
                        >
                          <ChevronLeft className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                        </Button>
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                          const pageNum = i + 1;
                          return (
                            <Button
                              key={pageNum}
                              variant={page === pageNum ? "default" : "outline"}
                              onClick={() => setPage(pageNum)}
                              className={page === pageNum 
                                ? "h-8 w-8 p-2.5 bg-[#009688] hover:bg-[#008577] rounded-lg overflow-hidden shadow-drop-shadow cursor-pointer"
                                : "h-8 w-8 p-2.5 bg-greyscale-0 dark:bg-gray-800 rounded-lg overflow-hidden border border-solid border-[#dfe1e6] dark:border-gray-700 shadow-[0px_1px_2px_#0d0d120f] cursor-pointer"
                              }
                            >
                              <span className={page === pageNum 
                                ? "text-white text-sm font-medium"
                                : "text-greyscale-900 dark:text-white text-sm font-medium"
                              }>
                                {pageNum}
                              </span>
                            </Button>
                          );
                        })}
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                          disabled={page === totalPages}
                          className="h-8 w-8 p-2.5 bg-greyscale-0 dark:bg-gray-800 rounded-lg overflow-hidden border border-solid border-[#dfe1e6] dark:border-gray-700 shadow-[0px_1px_2px_#0d0d120f] cursor-pointer"
                        >
                          <ChevronRight className="h-4 w-4 text-gray-700 dark:text-gray-300" />
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
    </div>
  );
};

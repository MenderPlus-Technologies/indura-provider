'use client';

import { useState, useMemo } from 'react';
import { useModerateForumPostMutation, useGetForumPostQuery, useGetForumPostsQuery } from '@/app/store/apiSlice';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/toast';
import { Loader2, Pin, Lock, Unlock, Trash2, Search, Eye, X, AlertTriangle, RefreshCw, MessageSquare, Eye as EyeIcon, Heart, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  action: 'pin' | 'unpin' | 'lock' | 'unlock' | 'delete';
  postTitle: string;
  isLoading?: boolean;
}

const ConfirmationModal = ({ isOpen, onClose, onConfirm, action, postTitle, isLoading = false }: ConfirmationModalProps) => {
  if (!isOpen) return null;

  const getActionDetails = () => {
    switch (action) {
      case 'pin':
        return {
          title: 'Pin Post',
          message: `Are you sure you want to pin "${postTitle}"?`,
          confirmText: 'Pin',
          iconBgColor: 'bg-blue-100 dark:bg-blue-900/30',
          iconColor: 'text-blue-600 dark:text-blue-400',
          buttonColor: 'bg-blue-600 hover:bg-blue-700 text-white',
          icon: Pin,
        };
      case 'unpin':
        return {
          title: 'Unpin Post',
          message: `Are you sure you want to unpin "${postTitle}"?`,
          confirmText: 'Unpin',
          iconBgColor: 'bg-gray-100 dark:bg-gray-800',
          iconColor: 'text-gray-600 dark:text-gray-400',
          buttonColor: 'bg-gray-600 hover:bg-gray-700 text-white',
          icon: Unlock,
        };
      case 'lock':
        return {
          title: 'Lock Post',
          message: `Are you sure you want to lock "${postTitle}"? Users will not be able to comment.`,
          confirmText: 'Lock',
          iconBgColor: 'bg-orange-100 dark:bg-orange-900/30',
          iconColor: 'text-orange-600 dark:text-orange-400',
          buttonColor: 'bg-orange-600 hover:bg-orange-700 text-white',
          icon: Lock,
        };
      case 'unlock':
        return {
          title: 'Unlock Post',
          message: `Are you sure you want to unlock "${postTitle}"?`,
          confirmText: 'Unlock',
          iconBgColor: 'bg-green-100 dark:bg-green-900/30',
          iconColor: 'text-green-600 dark:text-green-400',
          buttonColor: 'bg-green-600 hover:bg-green-700 text-white',
          icon: Unlock,
        };
      case 'delete':
        return {
          title: 'Delete Post',
          message: `Are you sure you want to delete "${postTitle}"? This action cannot be undone.`,
          confirmText: 'Delete',
          iconBgColor: 'bg-red-100 dark:bg-red-900/30',
          iconColor: 'text-red-600 dark:text-red-400',
          buttonColor: 'bg-red-600 hover:bg-red-700 text-white',
          icon: AlertTriangle,
        };
    }
  };

  const details = getActionDetails();
  const Icon = details.icon;

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
              <div className={`w-10 h-10 rounded-full ${details.iconBgColor} flex items-center justify-center`}>
                <Icon className={`h-5 w-5 ${details.iconColor}`} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {details.title}
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
              {details.message}
            </p>
            {action === 'delete' && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This action cannot be undone. The post will be permanently removed.
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
              className={`${details.buttonColor} cursor-pointer`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                details.confirmText
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

interface ViewForumModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string | null;
}

const ViewForumModal = ({ isOpen, onClose, postId }: ViewForumModalProps) => {
  const { data: forumData, isLoading, error } = useGetForumPostQuery(postId || '', {
    skip: !isOpen || !postId,
  });

  if (!isOpen || !postId) return null;

  const post = forumData?.post;
  const comments = forumData?.comments || [];
  const authorName = typeof post?.author === 'object' && post?.author?.name 
    ? post.author.name 
    : typeof post?.author === 'string' 
    ? post.author 
    : 'Unknown';
  const authorRole = typeof post?.author === 'object' && post?.author?.role 
    ? post.author.role 
    : '';

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Forum Post Details
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
                <p className="text-red-600 dark:text-red-400">Failed to load forum post details</p>
              </div>
            ) : post ? (
              <div className="space-y-6">
                {/* Post Details */}
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Title
                    </label>
                    <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                      {post.title || 'N/A'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Author
                      </label>
                      <div className="mt-1 flex items-center gap-2">
                        <p className="text-base text-gray-900 dark:text-white">
                          {authorName}
                        </p>
                        {authorRole && (
                          <Badge className="text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                            {authorRole}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {post.category && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          Category
                        </label>
                        <div className="mt-1 flex items-center gap-2">
                          <Tag className="h-4 w-4 text-gray-400" />
                          <p className="text-base text-gray-900 dark:text-white">
                            {post.category}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Content
                    </label>
                    <div className="mt-1 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <p className="text-base text-gray-900 dark:text-white whitespace-pre-wrap leading-relaxed">
                        {post.content || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Status:</label>
                      <div className="flex gap-2">
                        {post.isPinned && (
                          <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                            Pinned
                          </Badge>
                        )}
                        {post.isLocked && (
                          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                            Locked
                          </Badge>
                        )}
                        {!post.isPinned && !post.isLocked && (
                          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                            Normal
                          </Badge>
                        )}
                      </div>
                    </div>
                    {post.viewCount !== undefined && (
                      <div className="flex items-center gap-2">
                        <EyeIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {post.viewCount} {post.viewCount === 1 ? 'view' : 'views'}
                        </span>
                      </div>
                    )}
                    {post.likes && Array.isArray(post.likes) && (
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Created: {post.createdAt ? new Date(post.createdAt).toLocaleString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Comments Section */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MessageSquare className="h-5 w-5 text-gray-400" />
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                      Comments ({comments.length})
                    </h3>
                  </div>
                  
                  {comments.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-sm text-gray-500 dark:text-gray-400">No comments yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {comments.map((comment: any) => {
                        const commentId = comment._id || comment.id || '';
                        const commentAuthor = typeof comment.author === 'object' && comment.author?.name
                          ? comment.author.name
                          : 'Unknown';
                        const commentAuthorRole = typeof comment.author === 'object' && comment.author?.role
                          ? comment.author.role
                          : '';
                        const commentContent = typeof comment.content === 'string' ? comment.content : 'N/A';
                        const commentCreatedAt = comment.createdAt || '';
                        const commentLikes = Array.isArray(comment.likes) ? comment.likes.length : 0;

                        return (
                          <div
                            key={commentId}
                            className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                  {commentAuthor}
                                </p>
                                {commentAuthorRole && (
                                  <Badge className="text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                                    {commentAuthorRole}
                                  </Badge>
                                )}
                              </div>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {commentCreatedAt ? new Date(commentCreatedAt).toLocaleString() : 'N/A'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 whitespace-pre-wrap">
                              {commentContent}
                            </p>
                            {commentLikes > 0 && (
                              <div className="flex items-center gap-1 mt-2">
                                <Heart className="h-3 w-3 text-gray-400" />
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {commentLikes} {commentLikes === 1 ? 'like' : 'likes'}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No data available</p>
              </div>
            )}
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

export const ForumScreen = () => {
  const { data: forumPostsData, isLoading, error, refetch } = useGetForumPostsQuery();
  const [moderatePost, { isLoading: isModerating }] = useModerateForumPostMutation();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    action: 'pin' | 'unpin' | 'lock' | 'unlock' | 'delete' | null;
    postId: string | null;
    postTitle: string;
  }>({
    isOpen: false,
    action: null,
    postId: null,
    postTitle: '',
  });
  const [viewModalState, setViewModalState] = useState<{
    isOpen: boolean;
    postId: string | null;
  }>({
    isOpen: false,
    postId: null,
  });

  // Safely extract posts array - handle different response structures
  const posts = useMemo(() => {
    if (Array.isArray(forumPostsData)) {
      return forumPostsData;
    }
    if (forumPostsData && typeof forumPostsData === 'object') {
      const data = forumPostsData as { posts?: unknown; data?: unknown };
      if (Array.isArray(data.posts)) {
        return data.posts;
      }
      if (Array.isArray(data.data)) {
        return data.data;
      }
    }
    return [];
  }, [forumPostsData]);

  const filteredPosts = useMemo(() => {
    if (!searchTerm) return posts;
    const searchLower = searchTerm.toLowerCase();
    return posts.filter((post: any) => {
      const title = typeof post.title === 'string' ? post.title.toLowerCase() : '';
      const content = typeof post.content === 'string' ? post.content.toLowerCase() : '';
      const author = typeof post.author === 'string' ? post.author.toLowerCase() : '';
      return title.includes(searchLower) || content.includes(searchLower) || author.includes(searchLower);
    });
  }, [posts, searchTerm]);

  const openConfirmationModal = (id: string, action: 'pin' | 'unpin' | 'lock' | 'unlock' | 'delete', title: string) => {
    setModalState({
      isOpen: true,
      action,
      postId: id,
      postTitle: title,
    });
  };

  const closeConfirmationModal = () => {
    setModalState({
      isOpen: false,
      action: null,
      postId: null,
      postTitle: '',
    });
  };

  const handleConfirmModeration = async () => {
    if (!modalState.postId || !modalState.action) return;

    try {
      await moderatePost({ id: modalState.postId, action: modalState.action }).unwrap();
      showToast(`Post ${modalState.action}ed successfully`, 'success');
      closeConfirmationModal();
      refetch(); // Refetch posts to get updated data
    } catch (error) {
      showToast(`Failed to ${modalState.action} post`, 'error');
    }
  };

  const openViewModal = (id: string) => {
    setViewModalState({
      isOpen: true,
      postId: id,
    });
  };

  const closeViewModal = () => {
    setViewModalState({
      isOpen: false,
      postId: null,
    });
  };

  return (
    <div className="flex flex-col w-full items-start bg-white dark:bg-gray-950 relative">
      <header className="h-[72px] flex items-center justify-between px-6 py-4 bg-greyscale-0 dark:bg-gray-900 border-b border-solid border-[#dfe1e6] dark:border-gray-800 w-full">
        <h1 className="font-heading-h4 font-[number:var(--heading-h4-font-weight)] text-greyscale-900 dark:text-white text-[length:var(--heading-h4-font-size)] tracking-[var(--heading-h4-letter-spacing)] leading-[var(--heading-h4-line-height)] [font-style:var(--heading-h4-font-style)]">
          Forum Moderation
        </h1>
        <div className="inline-flex items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            className="h-8 w-8 p-2 bg-greyscale-0 dark:bg-gray-800 rounded-lg border border-solid border-[#dfe1e6] dark:border-gray-700 shadow-shadow-xsmall cursor-pointer"
            title="Refresh posts"
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
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-10 bg-greyscale-0 dark:bg-gray-800 border-[#dfe1e6] dark:border-gray-700 text-greyscale-900 dark:text-white"
                  />
                </div>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-[#009688]" />
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <p className="text-red-600 dark:text-red-400">Failed to load forum posts</p>
                  <Button onClick={() => refetch()}>Retry</Button>
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="font-body-medium-regular text-greyscale-500 dark:text-gray-400">
                    {searchTerm ? 'No posts found matching your search' : 'No forum posts found'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <div className="bg-greyscale-0 dark:bg-gray-800 rounded-xl border border-solid border-[#dfe1e6] dark:border-gray-700">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-b border-solid border-[#dfe1e6] dark:border-gray-700">
                          <TableHead className="w-[246px] h-10 px-4 py-0">
                            <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-greyscale-500 dark:text-gray-400 text-[length:var(--body-small-medium-font-size)] tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] [font-style:var(--body-small-medium-font-style)]">
                              Title
                            </span>
                          </TableHead>
                          <TableHead className="w-60 h-10 px-4 py-0">
                            <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-greyscale-500 dark:text-gray-400 text-[length:var(--body-small-medium-font-size)] tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] [font-style:var(--body-small-medium-font-style)]">
                              Author
                            </span>
                          </TableHead>
                          <TableHead className="flex-1 h-10 px-4 py-0">
                            <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-greyscale-500 dark:text-gray-400 text-[length:var(--body-small-medium-font-size)] tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] [font-style:var(--body-small-medium-font-style)]">
                              Status
                            </span>
                          </TableHead>
                          <TableHead className="w-[178px] h-10 px-4 py-0">
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
                        {filteredPosts.map((post: any, index: number) => {
                          const postId = post._id || post.id || `post-${index}`;
                          const postTitle = typeof post.title === 'string' ? post.title : 'Untitled';
                          const postAuthor = typeof post.author === 'string' ? post.author : 'Unknown';
                          const postCreatedAt = post.createdAt || new Date().toISOString();
                          const isPinned = post.isPinned === true;
                          const isLocked = post.isLocked === true;
                          
                          return (
                          <TableRow
                            key={postId}
                            className={
                              index < filteredPosts.length - 1
                                ? "border-b border-solid border-[#dfe1e6] dark:border-gray-700"
                                : ""
                            }
                          >
                            <TableCell className="h-12 px-4 py-0">
                              <span className="font-body-medium-semibold font-[number:var(--body-medium-semibold-font-weight)] text-greyscale-900 dark:text-white text-[length:var(--body-medium-semibold-font-size)] tracking-[var(--body-medium-semibold-letter-spacing)] leading-[var(--body-medium-semibold-line-height)] [font-style:var(--body-medium-semibold-font-style)]">
                                {postTitle}
                              </span>
                            </TableCell>
                            <TableCell className="h-12 px-4 py-0">
                              <span className="font-body-medium-semibold font-[number:var(--body-medium-semibold-font-weight)] text-[#009688] dark:text-teal-400 text-[length:var(--body-medium-semibold-font-size)] tracking-[var(--body-medium-semibold-letter-spacing)] leading-[var(--body-medium-semibold-line-height)] [font-style:var(--body-medium-semibold-font-style)]">
                                {postAuthor}
                              </span>
                            </TableCell>
                            <TableCell className="h-12 px-4 py-0">
                              <div className="flex gap-2">
                                {isPinned && (
                                  <Badge className="inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-[100px] border border-solid bg-orange-100 border-[#fff1db] text-orange-900 dark:bg-orange-900/30 dark:text-orange-300">
                                    <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-[length:var(--body-small-medium-font-size)] text-right tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] [font-style:var(--body-small-medium-font-style)]">
                                      Pinned
                                    </span>
                                  </Badge>
                                )}
                                {isLocked && (
                                  <Badge className="inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-[100px] border border-solid bg-red-200 border-[#f9d2d9] text-red-700 dark:bg-red-900/30 dark:text-red-300">
                                    <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-[length:var(--body-small-medium-font-size)] text-right tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] [font-style:var(--body-small-medium-font-style)]">
                                      Locked
                                    </span>
                                  </Badge>
                                )}
                                {!isPinned && !isLocked && (
                                  <Badge className="inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-[100px] border border-solid bg-gray-100 border-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                    <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-[length:var(--body-small-medium-font-size)] text-right tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] [font-style:var(--body-small-medium-font-style)]">
                                      Normal
                                    </span>
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="h-12 px-4 py-0">
                              <span className="font-body-medium-semibold font-[number:var(--body-medium-semibold-font-weight)] text-greyscale-900 dark:text-white text-[length:var(--body-medium-semibold-font-size)] tracking-[var(--body-medium-semibold-letter-spacing)] leading-[var(--body-medium-semibold-line-height)] [font-style:var(--body-medium-semibold-font-style)]">
                                {new Date(postCreatedAt).toLocaleDateString()}
                              </span>
                            </TableCell>
                            <TableCell className="h-12 px-4 py-0">
                              <div className="flex gap-2">
                                <Button
                                  size="icon"
                                  variant="outline"
                                  onClick={() => openViewModal(postId)}
                                  className="h-8 w-8 p-0 bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-300 rounded-lg cursor-pointer"
                                  title="View post details"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {isPinned ? (
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => openConfirmationModal(postId, 'unpin', postTitle)}
                                    disabled={isModerating}
                                    className="h-8 w-8 p-0 bg-greyscale-0 dark:bg-gray-800 rounded-lg border border-solid border-[#dfe1e6] dark:border-gray-700 cursor-pointer"
                                    title="Unpin post"
                                  >
                                    <Unlock className="h-4 w-4" />
                                  </Button>
                                ) : (
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => openConfirmationModal(postId, 'pin', postTitle)}
                                    disabled={isModerating}
                                    className="h-8 w-8 p-0 bg-greyscale-0 dark:bg-gray-800 rounded-lg border border-solid border-[#dfe1e6] dark:border-gray-700 cursor-pointer"
                                    title="Pin post"
                                  >
                                    <Pin className="h-4 w-4" />
                                  </Button>
                                )}
                                {isLocked ? (
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => openConfirmationModal(postId, 'unlock', postTitle)}
                                    disabled={isModerating}
                                    className="h-8 w-8 p-0 bg-greyscale-0 dark:bg-gray-800 rounded-lg border border-solid border-[#dfe1e6] dark:border-gray-700 cursor-pointer"
                                    title="Unlock post"
                                  >
                                    <Unlock className="h-4 w-4" />
                                  </Button>
                                ) : (
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => openConfirmationModal(postId, 'lock', postTitle)}
                                    disabled={isModerating}
                                    className="h-8 w-8 p-0 bg-greyscale-0 dark:bg-gray-800 rounded-lg border border-solid border-[#dfe1e6] dark:border-gray-700 cursor-pointer"
                                    title="Lock post"
                                  >
                                    <Lock className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button
                                  size="icon"
                                  variant="destructive"
                                  onClick={() => openConfirmationModal(postId, 'delete', postTitle)}
                                  disabled={isModerating}
                                  className="h-8 w-8 p-0 bg-red-200 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-300 rounded-lg cursor-pointer"
                                  title="Delete post"
                                >
                                  <Trash2 className="h-4 w-4" />
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

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={closeConfirmationModal}
        onConfirm={handleConfirmModeration}
        action={modalState.action || 'pin'}
        postTitle={modalState.postTitle}
        isLoading={isModerating}
      />

      {/* View Forum Modal */}
      <ViewForumModal
        isOpen={viewModalState.isOpen}
        onClose={closeViewModal}
        postId={viewModalState.postId}
      />
    </div>
  );
};

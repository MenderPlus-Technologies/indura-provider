'use client';

import { useState } from 'react';
import { useModerateForumPostMutation } from '@/app/store/apiSlice';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/toast';
import { Loader2, Pin, Lock, Unlock, Trash2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

// Mock data - replace with actual API call when endpoint is available
const mockForumPosts = [
  {
    id: '1',
    title: 'Welcome to the Forum',
    content: 'This is a sample post',
    author: 'user@example.com',
    isPinned: false,
    isLocked: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Important Announcement',
    content: 'This is an important announcement',
    author: 'admin@example.com',
    isPinned: true,
    isLocked: false,
    createdAt: new Date().toISOString(),
  },
];

export const ForumScreen = () => {
  const [moderatePost, { isLoading: isModerating }] = useModerateForumPostMutation();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [posts, setPosts] = useState(mockForumPosts);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleModeration = async (id: string, action: 'pin' | 'unpin' | 'lock' | 'unlock' | 'delete') => {
    if (action === 'delete' && !confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      setSelectedId(id);
      await moderatePost({ id, action }).unwrap();
      
      // Update local state
      setPosts((prev) => {
        if (action === 'delete') {
          return prev.filter((p) => p.id !== id);
        }
        return prev.map((p) => {
          if (p.id === id) {
            if (action === 'pin') return { ...p, isPinned: true };
            if (action === 'unpin') return { ...p, isPinned: false };
            if (action === 'lock') return { ...p, isLocked: true };
            if (action === 'unlock') return { ...p, isLocked: false };
          }
          return p;
        });
      });

      showToast(`Post ${action}ed successfully`, 'success');
    } catch (error) {
      showToast(`Failed to ${action} post`, 'error');
    } finally {
      setSelectedId(null);
    }
  };

  return (
    <div className="flex flex-col w-full items-start bg-white dark:bg-gray-950 relative">
      <header className="h-[72px] flex items-center justify-between px-6 py-4 bg-greyscale-0 dark:bg-gray-900 border-b border-solid border-[#dfe1e6] dark:border-gray-800 w-full">
        <h1 className="font-heading-h4 font-[number:var(--heading-h4-font-weight)] text-greyscale-900 dark:text-white text-[length:var(--heading-h4-font-size)] tracking-[var(--heading-h4-letter-spacing)] leading-[var(--heading-h4-line-height)] [font-style:var(--heading-h4-font-style)]">
          Forum Moderation
        </h1>
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

              {filteredPosts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="font-body-medium-regular text-greyscale-500 dark:text-gray-400">No posts found</p>
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
                        {filteredPosts.map((post, index) => (
                          <TableRow
                            key={post.id}
                            className={
                              index < filteredPosts.length - 1
                                ? "border-b border-solid border-[#dfe1e6] dark:border-gray-700"
                                : ""
                            }
                          >
                            <TableCell className="h-12 px-4 py-0">
                              <span className="font-body-medium-semibold font-[number:var(--body-medium-semibold-font-weight)] text-greyscale-900 dark:text-white text-[length:var(--body-medium-semibold-font-size)] tracking-[var(--body-medium-semibold-letter-spacing)] leading-[var(--body-medium-semibold-line-height)] [font-style:var(--body-medium-semibold-font-style)]">
                                {post.title}
                              </span>
                            </TableCell>
                            <TableCell className="h-12 px-4 py-0">
                              <span className="font-body-medium-semibold font-[number:var(--body-medium-semibold-font-weight)] text-[#009688] dark:text-teal-400 text-[length:var(--body-medium-semibold-font-size)] tracking-[var(--body-medium-semibold-letter-spacing)] leading-[var(--body-medium-semibold-line-height)] [font-style:var(--body-medium-semibold-font-style)]">
                                {post.author}
                              </span>
                            </TableCell>
                            <TableCell className="h-12 px-4 py-0">
                              <div className="flex gap-2">
                                {post.isPinned && (
                                  <Badge className="inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-[100px] border border-solid bg-alertswarning-0 border-[#fff1db] text-alertswarning-100">
                                    <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-[length:var(--body-small-medium-font-size)] text-right tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] [font-style:var(--body-small-medium-font-style)]">
                                      Pinned
                                    </span>
                                  </Badge>
                                )}
                                {post.isLocked && (
                                  <Badge className="inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-[100px] border border-solid bg-alertserror-0 border-[#f9d2d9] text-alertserror-100">
                                    <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-[length:var(--body-small-medium-font-size)] text-right tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] [font-style:var(--body-small-medium-font-style)]">
                                      Locked
                                    </span>
                                  </Badge>
                                )}
                                {!post.isPinned && !post.isLocked && (
                                  <Badge className="inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-[100px] border border-solid bg-greyscale-100 border-greyscale-200 text-greyscale-800">
                                    <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-[length:var(--body-small-medium-font-size)] text-right tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] [font-style:var(--body-small-medium-font-style)]">
                                      Normal
                                    </span>
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="h-12 px-4 py-0">
                              <span className="font-body-medium-semibold font-[number:var(--body-medium-semibold-font-weight)] text-greyscale-900 dark:text-white text-[length:var(--body-medium-semibold-font-size)] tracking-[var(--body-medium-semibold-letter-spacing)] leading-[var(--body-medium-semibold-line-height)] [font-style:var(--body-medium-semibold-font-style)]">
                                {new Date(post.createdAt).toLocaleDateString()}
                              </span>
                            </TableCell>
                            <TableCell className="h-12 px-4 py-0">
                              <div className="flex gap-2">
                                {post.isPinned ? (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleModeration(post.id, 'unpin')}
                                    disabled={isModerating && selectedId === post.id}
                                    className="h-8 w-8 p-2 bg-greyscale-0 dark:bg-gray-800 rounded-lg border border-solid border-[#dfe1e6] dark:border-gray-700 cursor-pointer"
                                  >
                                    {isModerating && selectedId === post.id ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <Unlock className="h-4 w-4" />
                                    )}
                                  </Button>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleModeration(post.id, 'pin')}
                                    disabled={isModerating && selectedId === post.id}
                                    className="h-8 w-8 p-2 bg-greyscale-0 dark:bg-gray-800 rounded-lg border border-solid border-[#dfe1e6] dark:border-gray-700 cursor-pointer"
                                  >
                                    {isModerating && selectedId === post.id ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <Pin className="h-4 w-4" />
                                    )}
                                  </Button>
                                )}
                                {post.isLocked ? (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleModeration(post.id, 'unlock')}
                                    disabled={isModerating && selectedId === post.id}
                                    className="h-8 w-8 p-2 bg-greyscale-0 dark:bg-gray-800 rounded-lg border border-solid border-[#dfe1e6] dark:border-gray-700 cursor-pointer"
                                  >
                                    {isModerating && selectedId === post.id ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <Unlock className="h-4 w-4" />
                                    )}
                                  </Button>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleModeration(post.id, 'lock')}
                                    disabled={isModerating && selectedId === post.id}
                                    className="h-8 w-8 p-2 bg-greyscale-0 dark:bg-gray-800 rounded-lg border border-solid border-[#dfe1e6] dark:border-gray-700 cursor-pointer"
                                  >
                                    {isModerating && selectedId === post.id ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <Lock className="h-4 w-4" />
                                    )}
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleModeration(post.id, 'delete')}
                                  disabled={isModerating && selectedId === post.id}
                                  className="h-8 w-8 p-2 bg-alertserror-100 hover:bg-alertserror-100/90 rounded-lg cursor-pointer"
                                >
                                  {isModerating && selectedId === post.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                                  ) : (
                                    <Trash2 className="h-4 w-4 text-white" />
                                  )}
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
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

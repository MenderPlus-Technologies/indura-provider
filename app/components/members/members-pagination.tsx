'use client';

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MembersPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const MembersPagination = ({ currentPage, totalPages, onPageChange }: MembersPaginationProps) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage <= 3) {
        // Near the beginning
        for (let i = 2; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In the middle
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  if (totalPages <= 1) {
    return null; // Don't show pagination if there's only one page or no pages
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 p-4 w-full bg-greyscale-0 dark:bg-gray-800 rounded-xl border border-solid border-[#dfe1e6] dark:border-gray-700">
      <div className="inline-flex justify-center gap-2 items-center">
        <div className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm">
          Page {currentPage} of {totalPages}
        </div>
      </div>
      <div className="inline-flex items-start gap-[5px] overflow-x-auto">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="h-8 w-8 p-2.5 bg-greyscale-0 dark:bg-gray-800 rounded-lg overflow-hidden border border-solid border-[#dfe1e6] dark:border-gray-700 shadow-[0px_1px_2px_#0d0d120f] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4 text-gray-700 dark:text-gray-300" />
        </Button>
        
        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <div key={`ellipsis-${index}`} className="flex flex-col w-8 h-8 items-center justify-center gap-2.5 p-2.5 bg-greyscale-0 dark:bg-gray-800 rounded-lg">
                <span className="flex items-center justify-center text-gray-900 dark:text-white text-xs font-medium">
                  ...
                </span>
              </div>
            );
          }
          
          const pageNum = page as number;
          const isActive = pageNum === currentPage;
          
          return (
            <Button
              key={pageNum}
              variant="outline"
              onClick={() => onPageChange(pageNum)}
              className={`h-8 w-8 p-2.5 rounded-lg overflow-hidden border border-solid shadow-[0px_1px_2px_#0d0d120f] cursor-pointer ${
                isActive
                  ? 'bg-[#009688] hover:bg-[#008577] border-[#009688] text-white'
                  : 'bg-greyscale-0 dark:bg-gray-800 border-[#dfe1e6] dark:border-gray-700'
              }`}
            >
              <span className={`text-sm font-medium ${
                isActive
                  ? 'text-white'
                  : 'text-gray-900 dark:text-white'
              }`}>
                {pageNum}
              </span>
            </Button>
          );
        })}
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="h-8 w-8 p-2.5 bg-greyscale-0 dark:bg-gray-800 rounded-lg overflow-hidden border border-solid border-[#dfe1e6] dark:border-gray-700 shadow-[0px_1px_2px_#0d0d120f] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-4 w-4 text-gray-700 dark:text-gray-300" />
        </Button>
      </div>
    </div>
  );
};

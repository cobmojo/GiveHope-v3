import { useMemo } from 'react';

interface UsePaginationParams {
  currentPage: number;
  totalPages: number;
  paginationItemsToDisplay?: number;
}

export function usePagination({ currentPage, totalPages, paginationItemsToDisplay = 5 }: UsePaginationParams) {
  return useMemo(() => {
    const pages: number[] = [];
    let showLeftEllipsis = false;
    let showRightEllipsis = false;

    if (totalPages <= paginationItemsToDisplay + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const maxPagesToShow = paginationItemsToDisplay;
      pages.push(1);
      pages.push(totalPages);

      let start = Math.max(2, currentPage - Math.floor(maxPagesToShow/2));
      let end = Math.min(totalPages - 1, currentPage + Math.floor(maxPagesToShow/2));

      if (currentPage - 1 <= Math.floor(maxPagesToShow/2)) {
        end = 1 + maxPagesToShow;
      }
      if (totalPages - currentPage <= Math.floor(maxPagesToShow/2)) {
        start = totalPages - maxPagesToShow;
      }

      if (start <= 1) start = 2;
      if (end >= totalPages) end = totalPages - 1;

      showLeftEllipsis = start > 2;
      showRightEllipsis = end < totalPages - 1;

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      pages.sort((a, b) => a - b);
    }

    return { pages, showLeftEllipsis, showRightEllipsis };
  }, [currentPage, totalPages, paginationItemsToDisplay]);
}

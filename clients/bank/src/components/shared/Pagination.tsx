import { FC } from 'react';
import { Stack, Pagination as P, PaginationProps } from '@mui/material';
import { StackTypeMap } from '@mui/system';

interface PaginationImportation {
  count: number;
  page: number;
  onPageChange: (page: number) => void;
  paginationProps?: PaginationProps;
  stackProps?: StackTypeMap<{}, 'div'>;
}

const Pagination: FC<PaginationImportation> = ({
  count,
  page,
  paginationProps = {},
  stackProps = {},
  onPageChange,
}) => {
  return (
    <Stack spacing={2} alignItems="center" {...stackProps}>
      <P
        count={count}
        page={page}
        size="small"
        onChange={(_, page) => onPageChange(page)}
        {...paginationProps}
      />
    </Stack>
  );
};

export default Pagination;

import { StyledComponent } from '@emotion/styled';
import { Badge, styled } from '@mui/material';
import { Theme, MUIStyledCommonProps } from '@mui/system';
import { FC } from 'react';

const BadgeWrapper = styled('div')(({ theme }) => ({
  position: 'absolute',
  zIndex: '1',
  top: '-32px',
  right: '-10px',
  '.css-1c32n2y-MuiBadge-root': {
    display: 'unset',
  },
  '.css-106c1u2-MuiBadge-badge': {
    display: 'unset',
    position: 'unset',
    padding: '2px 6px',
  },
}));

interface CountBadgeImportation
  extends Partial<
    StyledComponent<
      MUIStyledCommonProps<Theme>,
      React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
      {}
    >
  > {
  page: number;
  take: number;
  index: number;
}

const CountBadge: FC<CountBadgeImportation> = ({ take, page, index, ...rest }) => {
  return (
    <BadgeWrapper {...rest}>
      <Badge max={Infinity} badgeContent={page * take - take + index + 1} color="primary"></Badge>
    </BadgeWrapper>
  );
};

export default CountBadge;

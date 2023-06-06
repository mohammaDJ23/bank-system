import { Skeleton as Sklton, styled, SkeletonProps } from '@mui/material';
import { FC } from 'react';

const StyledSkeleton = styled(Sklton)<SkeletonProps>(({ theme, width, height }) => ({
  width,
  height,
  transform: 'scale(1)',
}));

const Skeleton: FC<SkeletonProps> = props => {
  return <StyledSkeleton {...props} />;
};

export default Skeleton;

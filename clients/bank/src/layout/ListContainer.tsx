import { styled, Box } from '@mui/material';
import { FC, PropsWithChildren, useEffect, useRef } from 'react';
import { useAction } from '../hooks';

const Container = styled('div')(({ theme }) => ({
  width: '100vw',
  height: '100vh',
  overflow: 'hidden',
}));

const Wrapper = styled('div')(({ theme }) => ({
  width: '100%',
  height: 'calc(100% - 64px)',
  overflow: 'auto',
  [theme.breakpoints.down('sm')]: {
    height: 'calc(100% - 48px)',
  },
}));

const Content = styled('div')(({ theme }) => ({
  width: '100%',
  height: '100%',
  margin: 'auto',
  wordBreak: 'break-word',
  transition: 'all 0.3s',
  padding: '0 16px 32px 16px',
  [theme.breakpoints.up('xl')]: {
    maxWidth: '1000px',
  },
  [theme.breakpoints.down('xl')]: {
    maxWidth: '900px',
  },
  [theme.breakpoints.down('lg')]: {
    maxWidth: '800px',
  },
  [theme.breakpoints.down('md')]: {
    maxWidth: '700px',
    padding: '0 16px 16px 16px',
  },
}));

const ListContainer: FC<PropsWithChildren> = ({ children }) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const { setListContainerElement } = useAction();

  useEffect(() => {
    if (wrapperRef.current) {
      setListContainerElement(wrapperRef.current);
    }
  }, []);

  return (
    <Container>
      <Wrapper ref={wrapperRef}>
        <Content>
          <Box pb="16px">{children}</Box>
        </Content>
      </Wrapper>
    </Container>
  );
};

export default ListContainer;

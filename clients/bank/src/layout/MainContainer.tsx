import { styled, Box } from '@mui/material';
import { FC, PropsWithChildren } from 'react';

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
  wordBreak: 'break-all',
  transition: 'all 0.3s',
  padding: '16px 24px',
  [theme.breakpoints.up('xl')]: {
    maxWidth: '1550px',
  },
  [theme.breakpoints.down('xl')]: {
    maxWidth: '100%',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '16px',
  },
}));

const MainContainer: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Container>
      <Wrapper>
        <Content>
          <Box pb="16px">{children}</Box>
        </Content>
      </Wrapper>
    </Container>
  );
};

export default MainContainer;

import { FC, useEffect, useState, useRef, PropsWithChildren } from 'react';
import { Box } from '@mui/material';
import { AddCircle, Close } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

interface AddCircleWrapperAttr {
  isActive: boolean;
}

const AddCircleWrapper = styled(Box)<AddCircleWrapperAttr>(({ theme, isActive }) => ({
  position: 'fixed',
  left: '20px',
  zIndex: '1',
  cursor: 'pointer',
  transition: 'bottom 0.3s, left 0.3s',
  [theme.breakpoints.up('lg')]: {
    bottom: isActive ? '-50px' : '20px',
  },
  [theme.breakpoints.down('lg')]: {
    bottom: isActive ? '-50px' : '20px',
  },
  [theme.breakpoints.down('md')]: {
    bottom: '-50px',
  },
}));

interface FiltersWrapperAttr {
  isActive: boolean;
}

const FiltersWrapper = styled(Box)<FiltersWrapperAttr>(({ theme, isActive }) => ({
  position: 'fixed',
  bottom: isActive ? '20px' : '-500px',
  right: '-20px',
  left: '20px',
  zIndex: '2',
  transition: 'bottom 0.3s, left 0.3s',
  width: 'calc(100% - 40px)',
  maxWidth: '330px',
  height: 'calc(100% - 40px - 64px)',
  maxHeight: '360px',
  overflowY: 'auto',
  boxShadow: '0px 5px 15px 0px rgba(0,0,0,0.2)',
  backgroundColor: 'white',
  borderRadius: '4px',
  padding: '8px 16px',
}));

const FiltersContent = styled(Box)(({ theme }) => ({
  overflow: 'hidden',
}));

const Filter: FC<PropsWithChildren> = ({ children }) => {
  const touchStartYPositionRef = useRef<number>(0);
  const [isFilterOpened, setIsFilterOpened] = useState(false);

  useEffect(() => {
    function touchStartProcess(event: TouchEvent) {
      touchStartYPositionRef.current = event.changedTouches[0].clientY;
    }

    function touchMoveProcess(event: TouchEvent) {
      if (event.changedTouches[0].clientY < touchStartYPositionRef.current) {
        touchStartYPositionRef.current = event.changedTouches[0].clientY;
        setIsFilterOpened(true);
      }
    }

    function touchEndProcess(event: TouchEvent) {
      if (event.changedTouches[0].clientY > touchStartYPositionRef.current) {
        touchStartYPositionRef.current = 0;
        setIsFilterOpened(false);
      }
    }

    function keyupProcess(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsFilterOpened(false);
      }
    }

    document.addEventListener('keyup', keyupProcess, false);
    document.addEventListener('touchstart', touchStartProcess, false);
    document.addEventListener('touchmove', touchMoveProcess, false);
    document.addEventListener('touchend', touchEndProcess, false);
    return () => {
      document.removeEventListener('keyup', keyupProcess, false);
      document.removeEventListener('touchstart', touchStartProcess, false);
      document.removeEventListener('touchmove', touchMoveProcess, false);
      document.removeEventListener('touchend', touchEndProcess, false);
    };
  }, []);

  return (
    <>
      <FiltersWrapper isActive={isFilterOpened}>
        <FiltersContent>
          <Box display="flex" alignItems="center" justifyContent="end" onClick={() => setIsFilterOpened(false)}>
            <Close />
          </Box>
          {children}
        </FiltersContent>
      </FiltersWrapper>

      <AddCircleWrapper isActive={isFilterOpened} onClick={() => setIsFilterOpened(!isFilterOpened)}>
        <AddCircle fontSize="medium" color="primary" />
      </AddCircleWrapper>
    </>
  );
};

export default Filter;

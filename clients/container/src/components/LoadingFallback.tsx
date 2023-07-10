import { FC } from 'react';
import { ClipLoader } from 'react-spinners';

const LoadingFallback: FC = () => {
  return (
    <ClipLoader
      size="30px"
      color="#20a0ff"
      cssOverride={{
        position: 'fixed',
        zIndex: 1000,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    />
  );
};

export default LoadingFallback;

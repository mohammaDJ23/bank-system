import { Loading } from 'element-react';

const LoadingFallback = () => {
  return (
    <Loading
      style={{ position: 'fixed', top: '25px', left: 0, width: '100%', height: '100%', zIndex: 9 }}
      fullscreen={true}
    />
  );
};

export default LoadingFallback;

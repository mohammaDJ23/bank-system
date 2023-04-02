import { Card as C, CardProps } from '@mui/material';
import { FC, PropsWithChildren } from 'react';

interface CardImportation extends CardProps {}

const Card: FC<PropsWithChildren<CardImportation>> = ({ children, ...rest }) => {
  return (
    <C
      {...rest}
      style={{
        width: '100%',
        boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.1)',
        border: '1px solid rgba(0,0,0,0.1)',
        borderRadius: '6px',
        ...rest.style,
      }}
    >
      {children}
    </C>
  );
};

export default Card;

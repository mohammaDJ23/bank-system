import { Card as C, CardProps } from '@mui/material';
import { FC, PropsWithChildren } from 'react';

interface CardImportation extends CardProps {}

const Card: FC<PropsWithChildren<CardImportation>> = ({ children, ...rest }) => {
  return <C {...rest}>{children}</C>;
};

export default Card;

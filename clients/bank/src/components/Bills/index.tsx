import { useAction, usePaginationList, useRequest } from '../../hooks';
import ListContainer from '../../layout/ListContainer';
import { BillList } from '../../lib';
import { BillsApi } from '../../apis';
import List from './List';
import { FC } from 'react';
import Navigation from '../../layout/Navigation';
import { Typography } from '@mui/material';
import { ModalNames } from '../../store';

const BillsContent: FC = () => {
  const { showModal } = useAction();
  const { isInitialApiProcessing } = useRequest();
  const billListInstance = usePaginationList(BillList);
  const isInitialBillsApiProcessing = isInitialApiProcessing(BillsApi);
  const billsTotal = billListInstance.getTotal();

  const menuOptions = [<Typography onClick={() => showModal(ModalNames.BILL_FILTERS)}>Filters</Typography>];

  return (
    <Navigation title={`Bills ${!isInitialBillsApiProcessing ? `(${billsTotal})` : ''}`} menuOptions={menuOptions}>
      <ListContainer>
        <List />
      </ListContainer>
    </Navigation>
  );
};

export default BillsContent;

import { useAction, usePaginationList, useRequest } from '../../hooks';
import ListContainer from '../../layout/ListContainer';
import { DeletedBillList } from '../../lib';
import { DeletedBillListApi } from '../../apis';
import List from './List';
import { FC } from 'react';
import Navigation from '../../layout/Navigation';
import { Typography } from '@mui/material';
import { ModalNames } from '../../store';

const DeletedBillListContent: FC = () => {
  const { showModal } = useAction();
  const { isInitialApiProcessing } = useRequest();
  const deletedBillListInstance = usePaginationList(DeletedBillList);
  const isInitialDeletedBillListApiProcessing = isInitialApiProcessing(DeletedBillListApi);
  const billsTotal = deletedBillListInstance.getTotal();

  const menuOptions = [<Typography onClick={() => showModal(ModalNames.DELETED_BILL_FILTERS)}>Filters</Typography>];

  return (
    <Navigation
      title={`Deleted bills ${!isInitialDeletedBillListApiProcessing ? `(${billsTotal})` : ''}`}
      menuOptions={menuOptions}
    >
      <ListContainer>
        <List />
      </ListContainer>
    </Navigation>
  );
};

export default DeletedBillListContent;

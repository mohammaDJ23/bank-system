import { PropsWithChildren, FC } from 'react';
import { ListItem, ListItemButton, ListItemText } from '@mui/material';
import { Box } from '@mui/system';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { BillObj, getDynamicPath, Pathes } from '../../lib';
import Card from './Card';
import CountBadge from './CountBadge';
import { usePaginationList } from '../../hooks';

interface BillCardImportation extends PropsWithChildren {
  bill: BillObj;
  index: number;
  listInfo: ReturnType<ReturnType<typeof usePaginationList>['getFullInfo']>;
}

const BillCard: FC<BillCardImportation> = ({ bill, index, listInfo }) => {
  const navigate = useNavigate();

  return (
    <Card
      key={index}
      variant="outlined"
      sx={{ my: '20px', position: 'relative', overflow: 'visible' }}
      onClick={() => {
        const path = bill.deletedAt ? Pathes.DELETED_BILL : Pathes.BILL;
        navigate(getDynamicPath(path, { id: bill.id }));
      }}
    >
      <ListItemButton>
        <ListItem disablePadding sx={{ my: '10px' }}>
          <Box display="flex" flexDirection="column" alignItems="start" width="100%" gap="10px">
            <Box component="div">
              <ListItemText
                primaryTypographyProps={{ fontSize: '14px', mb: '10px' }}
                secondaryTypographyProps={{ fontSize: '12px' }}
                sx={{ margin: '0' }}
                primary={`${bill.receiver} received ${bill.amount} at ${moment(bill.date).format('ll')}`}
                secondary={bill.description}
              />
            </Box>

            <Box component="div" alignSelf="end">
              <ListItemText
                secondaryTypographyProps={{ fontSize: '10px' }}
                secondary={
                  bill.deletedAt
                    ? `${moment(bill.deletedAt).format('lll')} was deleted.`
                    : new Date(bill.updatedAt) > new Date(bill.createdAt)
                    ? `updated at ${moment(bill.updatedAt).fromNow()}`
                    : `${moment(bill.createdAt).fromNow()}`
                }
              />
            </Box>
          </Box>

          <CountBadge index={index} page={listInfo.page} take={listInfo.take} />
        </ListItem>
      </ListItemButton>
    </Card>
  );
};

export default BillCard;

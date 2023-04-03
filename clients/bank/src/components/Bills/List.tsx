import { FC } from 'react';
import { Box, Card, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import CountBadge from '../CountBadge';
import Pagination from '../Pagination';
import { BillObj, Pathes } from '../../lib';
import { usePaginationList } from '../../hooks';

interface BillListImportation {
  listInstance: ReturnType<typeof usePaginationList<BillObj>>;
  onPageChange: (newPage: number) => void;
}

const BillList: FC<BillListImportation> = ({ listInstance, onPageChange }) => {
  const navigate = useNavigate();
  const listInfo = listInstance.getFullInfo();

  return (
    <>
      <List>
        {listInfo.list.map((bill, index) => (
          <Card
            key={index}
            variant="outlined"
            sx={{ my: '20px', position: 'relative', overflow: 'visible' }}
            onClick={() => navigate(Pathes.BILL.replace(':id', bill.id))}
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
                        new Date(bill.updatedAt) > new Date(bill.createdAt)
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
        ))}
      </List>

      <Pagination page={listInfo.page} count={listInfo.count} onPageChange={onPageChange} />
    </>
  );
};

export default BillList;

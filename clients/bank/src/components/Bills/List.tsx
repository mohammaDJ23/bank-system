import { FC } from 'react';
import { Box, Card, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import CountBadge from '../CountBadge';
import Pagination from '../Pagination';
import { BillObj } from '../../lib';

interface BillListImportation {
  list: BillObj[];
  take: number;
  page: number;
  count: number;
  onPageChange: (newPage: number) => void;
}

const BillList: FC<BillListImportation> = ({ list, take, page, count, onPageChange }) => {
  const navigate = useNavigate();

  return (
    <>
      <List>
        {list.map((bill, index) => (
          <Card
            key={index}
            variant="outlined"
            sx={{ my: '20px', position: 'relative', overflow: 'visible' }}
            onClick={() => navigate(`/bank/bills/${bill.id}`)}
          >
            <ListItemButton>
              <ListItem disablePadding sx={{ my: '10px' }}>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="start"
                  width="100%"
                  gap="10px"
                >
                  <Box component="div">
                    <ListItemText
                      primaryTypographyProps={{ fontSize: '14px', mb: '10px' }}
                      secondaryTypographyProps={{ fontSize: '12px' }}
                      sx={{ margin: '0' }}
                      primary={`${bill.receiver} received ${bill.amount} at ${moment(
                        bill.date
                      ).format('ll')}`}
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

                <CountBadge index={index} page={page} take={take} />
              </ListItem>
            </ListItemButton>
          </Card>
        ))}
      </List>

      <Pagination page={page} count={count} onPageChange={onPageChange} />
    </>
  );
};

export default BillList;

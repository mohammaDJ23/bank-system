import {
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Box,
  Card,
  Stack,
  Pagination,
} from '@mui/material';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { useList } from '../../hooks';
import ListContainer from '../../layout/ListContainer';
import { BillList, BillObj } from '../../lib';
import EmptyList from '../EmptyList';
import Skeleton from '../Skeleton';
import { Apis } from '../../apis';
import CountBadge from '../CountBadge';

const BillsContent = () => {
  const navigate = useNavigate();
  const { list, take, count, page, isEmptyList, isListProcessing, onPageChange } = useList<BillObj>(
    { initialList: new BillList(), apiName: Apis.BILLS }
  );

  function skeleton() {
    return (
      <List>
        {Array(take)
          .fill(null)
          .map((_, i) => (
            <ListItem
              key={i}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                my: '25px',
                alignItems: 'start',
                px: '0',
              }}
            >
              <Box maxWidth="600px" width="100%" height="14px">
                <Skeleton width="100%" height="100%" />
              </Box>
              <Box maxWidth="350px" width="100%" height="12px">
                <Skeleton width="100%" height="100%" />
              </Box>
              <Box alignSelf="end" maxWidth="150px" width="100%" height="10px">
                <Skeleton width="100%" height="100%" />
              </Box>
            </ListItem>
          ))}
      </List>
    );
  }

  function billList() {
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

        <Stack spacing={2} alignItems="center">
          <Pagination
            count={count}
            page={page}
            size="small"
            onChange={(_, page) => onPageChange(page)}
          />
        </Stack>
      </>
    );
  }

  return (
    <ListContainer>
      {isListProcessing() ? skeleton() : isEmptyList ? <EmptyList /> : billList()}
    </ListContainer>
  );
};

export default BillsContent;

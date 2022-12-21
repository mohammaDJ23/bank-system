import {
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Box,
  Card,
  Badge,
  styled,
  Skeleton,
  SkeletonProps,
} from '@mui/material';
import moment from 'moment';
import { useList } from '../../hooks';
import ListContainer from '../../layout/ListContainer';
import { BillList, BillObj } from '../../lib';
import EmptyList from '../EmptyList';

const BadgeWrapper = styled('div')(({ theme }) => ({
  position: 'absolute',
  zIndex: '1',
  top: '-32px',
  right: '-10px',
  '.css-1c32n2y-MuiBadge-root': {
    display: 'unset',
  },
  '.css-106c1u2-MuiBadge-badge': {
    display: 'unset',
    position: 'unset',
    padding: '2px 6px',
  },
}));

const StyledSkeleton = styled(Skeleton)<SkeletonProps>(({ theme, width, height }) => ({
  width,
  height,
  transform: 'scale(1)',
}));

const BillsContent = () => {
  const { list, take, isEmptyList } = useList<BillObj>(new BillList());
  const isListProcessing = false;

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
                <StyledSkeleton width="100%" height="100%" />
              </Box>
              <Box maxWidth="350px" width="100%" height="12px">
                <StyledSkeleton width="100%" height="100%" />
              </Box>
              <Box alignSelf="end" maxWidth="150px" width="100%" height="10px">
                <StyledSkeleton width="100%" height="100%" />
              </Box>
            </ListItem>
          ))}
      </List>
    );
  }

  function billList() {
    return (
      <List>
        {list.map((bill, index) => (
          <Card
            key={index}
            variant="outlined"
            sx={{ my: '20px', position: 'relative', overflow: 'visible' }}
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

                <BadgeWrapper>
                  <Badge max={Infinity} badgeContent={index + 1} color="primary"></Badge>
                </BadgeWrapper>
              </ListItem>
            </ListItemButton>
          </Card>
        ))}
      </List>
    );
  }

  return (
    <ListContainer>
      {isListProcessing ? skeleton() : isEmptyList ? <EmptyList /> : billList()}
    </ListContainer>
  );
};

export default BillsContent;

import { FC, useCallback, useEffect } from 'react';
import { Box, Card, List as MuiList, ListItem, ListItemButton, ListItemText, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import CountBadge from '../CountBadge';
import Pagination from '../Pagination';
import { BillList, BillListFilters, BillObj, getTime, isoDate, Pathes } from '../../lib';
import { useForm, usePaginationList, useRequest } from '../../hooks';
import { BillsApi, BillsApiConstructorType } from '../../apis';
import Skeleton from './Skeleton';
import EmptyList from './EmptyList';
import Filter from '../Filter';
import { ModalNames } from '../../store';

const List: FC = () => {
  const navigate = useNavigate();
  const { request, isInitialApiProcessing, isApiProcessing } = useRequest();
  const billListInstance = usePaginationList(BillList);
  const billListFiltersFormInstance = useForm(BillListFilters);
  const billListFiltersForm = billListFiltersFormInstance.getForm();
  const billListInfo = billListInstance.getFullInfo();
  const isInitialBillsApiProcessing = isInitialApiProcessing(BillsApi);
  const isBillsApiProcessing = isApiProcessing(BillsApi);

  const getBillsList = useCallback(
    (options: Partial<BillsApiConstructorType> = {}) => {
      const apiData = Object.assign(
        { take: billListInfo.take, page: billListInfo.page, ...options },
        billListFiltersForm
      );
      const billsApi = new BillsApi<BillObj>(apiData);
      billsApi.setInitialApi(!!apiData.isInitialApi);

      request<[BillObj[], number], BillObj>(billsApi).then(response => {
        const [list, total] = response.data;
        billListInstance.insertNewList({ list, total, page: apiData.page });
      });
    },
    [billListInfo, billListInstance, billListFiltersForm, request]
  );

  useEffect(() => {
    getBillsList({ isInitialApi: true });
  }, []);

  const changePage = useCallback(
    (newPage: number) => {
      billListInstance.onPageChange(newPage);

      if (billListInstance.isNewPageEqualToCurrentPage(newPage) || isBillsApiProcessing) return;

      if (!billListInstance.isNewPageExist(newPage)) getBillsList({ page: newPage });
    },
    [isBillsApiProcessing, billListInstance, getBillsList]
  );

  const billListFilterFormSubmition = useCallback(() => {
    billListFiltersFormInstance.onSubmit(() => {
      const newPage = 1;
      billListInstance.onPageChange(newPage);
      getBillsList({ page: newPage });
    });
  }, [billListFiltersFormInstance, billListInstance, getBillsList]);

  return (
    <>
      {isInitialBillsApiProcessing || isBillsApiProcessing ? (
        <Skeleton take={billListInfo.take} />
      ) : billListInstance.isListEmpty() ? (
        <EmptyList />
      ) : (
        <>
          <MuiList>
            {billListInfo.list.map((bill, index) => (
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

                    <CountBadge index={index} page={billListInfo.page} take={billListInfo.take} />
                  </ListItem>
                </ListItemButton>
              </Card>
            ))}
          </MuiList>

          <Pagination page={billListInfo.page} count={billListInfo.count} onPageChange={changePage} />
        </>
      )}

      <Filter name={ModalNames.BILL_FILTERS}>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          display="flex"
          flexDirection="column"
          gap="20px"
          onSubmit={event => {
            event.preventDefault();
            billListFilterFormSubmition();
          }}
        >
          <TextField
            label="Search"
            variant="standard"
            type="text"
            fullWidth
            value={billListFiltersForm.q}
            onChange={event => billListFiltersFormInstance.onChange('q', event.target.value)}
            helperText={billListFiltersFormInstance.getInputErrorMessage('q')}
            error={billListFiltersFormInstance.isInputInValid('q')}
            name="q"
            placeholder="first name, last name, phone"
            disabled={isBillsApiProcessing}
          />
          <TextField
            label="From date"
            type="date"
            variant="standard"
            value={billListFiltersForm.fromDate ? isoDate(billListFiltersForm.fromDate) : ''}
            onChange={event => billListFiltersFormInstance.onChange('fromDate', getTime(event.target.value))}
            helperText={billListFiltersFormInstance.getInputErrorMessage('fromDate')}
            error={billListFiltersFormInstance.isInputInValid('fromDate')}
            InputLabelProps={{ shrink: true }}
            name="fromDate"
            disabled={isBillsApiProcessing}
          />
          <TextField
            label="To date"
            type="date"
            variant="standard"
            value={billListFiltersForm.toDate ? isoDate(billListFiltersForm.toDate) : ''}
            onChange={event => billListFiltersFormInstance.onChange('toDate', getTime(event.target.value))}
            helperText={billListFiltersFormInstance.getInputErrorMessage('toDate')}
            error={billListFiltersFormInstance.isInputInValid('toDate')}
            InputLabelProps={{ shrink: true }}
            name="toDate"
            disabled={isBillsApiProcessing}
          />
          <Box component="div" display="flex" alignItems="center" gap="10px" marginTop="20px">
            <Button
              disabled={isBillsApiProcessing || !billListFiltersFormInstance.isFormValid()}
              variant="contained"
              size="small"
              type="submit"
              sx={{ textTransform: 'capitalize' }}
            >
              Filter
            </Button>
            <Button
              disabled={false}
              variant="outlined"
              size="small"
              type="button"
              sx={{ textTransform: 'capitalize' }}
              onClick={() => billListFiltersFormInstance.resetForm()}
            >
              Reset
            </Button>
          </Box>
        </Box>
      </Filter>
    </>
  );
};

export default List;

import { FC, useCallback, useEffect } from 'react';
import { Box, List as MuiList, TextField, Button } from '@mui/material';
import Pagination from '../shared/Pagination';
import { BillList, BillListFilters, BillObj, getTime, isoDate } from '../../lib';
import { useForm, usePaginationList, useRequest } from '../../hooks';
import { BillsApi, BillsApiConstructorType } from '../../apis';
import BillsSkeleton from '../shared/BillsSkeleton';
import EmptyList from './EmptyList';
import Filter from '../shared/Filter';
import { ModalNames } from '../../store';
import BillCard from '../shared/BiilCard';

const List: FC = () => {
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
        <BillsSkeleton take={billListInfo.take} />
      ) : billListInstance.isListEmpty() ? (
        <EmptyList />
      ) : (
        <>
          <MuiList>
            {billListInfo.list.map((bill, index) => (
              <BillCard key={index} index={index} bill={bill} listInfo={billListInfo} />
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
            placeholder="amount, receiver, description"
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

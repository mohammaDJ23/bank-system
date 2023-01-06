import {
  HistoryActions,
  ListContainerActions,
  ModalActions,
  SpecificDetailsActions,
  PaginationListActions,
  RequestProcessActions,
} from './';

export type RootActions =
  | ModalActions
  | RequestProcessActions
  | ListContainerActions
  | HistoryActions
  | SpecificDetailsActions
  | PaginationListActions;

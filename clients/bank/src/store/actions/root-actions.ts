import { HistoryActions, ListContainerActions, ModalActions, SpecificDetailsActions } from './';
import { RequestProcessActions } from './requestProcess';

export type RootActions =
  | ModalActions
  | RequestProcessActions
  | ListContainerActions
  | HistoryActions
  | SpecificDetailsActions;

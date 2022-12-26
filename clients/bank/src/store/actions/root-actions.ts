import { ListContainerActions, ModalActions } from './';
import { RequestProcessActions } from './requestProcess';

export type RootActions = ModalActions | RequestProcessActions | ListContainerActions;

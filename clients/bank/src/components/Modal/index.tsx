import { FC } from 'react';
import { Dialog } from 'element-react';
import { Button } from '@mui/material';

interface ModalImportation {
  title: string | JSX.Element;
  isActive: boolean;
  body: string | JSX.Element;
  isLoading: boolean;
  onCancel(): void;
  onConfirm(): void;
}

const Modal: FC<Partial<ModalImportation>> = ({
  title = 'Confirmation',
  isActive = false,
  body = 'Are you sure to do the process?',
  isLoading = false,
  onCancel = () => {},
  onConfirm = () => {},
}) => {
  return (
    /**@ts-ignore */
    <Dialog
      /**@ts-ignore */
      title={title}
      size="tiny"
      visible={isActive}
      onCancel={isLoading ? () => {} : onCancel}
      lockScroll={false}
      style={{ maxWidth: '484px', width: '100%' }}
    >
      {/**@ts-ignore */}
      <Dialog.Body>
        <span>{body}</span>
      </Dialog.Body>
      {/**@ts-ignore */}
      <Dialog.Footer className="dialog-footer">
        <Button
          sx={{ textTransform: 'capitalize' }}
          variant="outlined"
          disabled={isLoading}
          onClick={isLoading ? () => {} : onCancel}
        >
          Cancel
        </Button>
        <Button
          sx={{ textTransform: 'capitalize' }}
          variant="contained"
          disabled={isLoading}
          onClick={isLoading ? () => {} : onConfirm}
        >
          Confirm
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
};

export default Modal;

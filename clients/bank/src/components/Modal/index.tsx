import { FC } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

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
    <Dialog open={isActive} onClose={onCancel}>
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{body}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          sx={{ textTransform: 'capitalize', marginRight: '10px' }}
          variant="outlined"
          size="small"
          disabled={isLoading}
          onClick={isLoading ? () => {} : onCancel}
        >
          Disagree
        </Button>
        <Button
          sx={{ textTransform: 'capitalize' }}
          variant="contained"
          size="small"
          disabled={isLoading}
          onClick={isLoading ? () => {} : onConfirm}
        >
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Modal;

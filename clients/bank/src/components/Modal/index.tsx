import { FC } from 'react';
import { Button, Dialog } from 'element-react';

interface ModalImportation {
  title?: string | JSX.Element;
  isActive?: boolean;
  body?: string | JSX.Element;
  isLoading?: boolean;
  onCancel?(): void;
  onConfirm?(): void;
}

const Modal: FC<ModalImportation> = ({
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
      onCancel={onCancel}
      lockScroll={false}
      style={{ maxWidth: '484px', width: '100%' }}
    >
      {/**@ts-ignore */}
      <Dialog.Body>
        <span>{body}</span>
      </Dialog.Body>
      {/**@ts-ignore */}
      <Dialog.Footer className="dialog-footer">
        {/**@ts-ignore */}
        <Button onClick={onCancel}>Cancel</Button>

        {/**@ts-ignore */}
        <Button type="primary" onClick={onConfirm}>
          Confirm
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
};

export default Modal;

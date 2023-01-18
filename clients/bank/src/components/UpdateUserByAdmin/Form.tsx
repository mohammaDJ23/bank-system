import { FC } from 'react';
import { Button, Form as ReactElementForm, Input, Select } from 'element-react';
import { getUserRoles, Rules, UpdateUserByAdmin } from '../../lib';
import Modal from '../Modal';
import { ModalNames } from '../../store';

interface FormImportation {
  onChange: (key: keyof UpdateUserByAdmin, value: any) => void;
  form: UpdateUserByAdmin;
  isFormProcessing: boolean;
  formRef: (el: ReactElementForm | null) => void;
  rules: Rules;
  onSubmitWithConfirmation: () => void;
  resetForm: () => void;
  isConfirmationModalActive: () => boolean;
  hideModal: (name: ModalNames) => void;
  onSubmit: () => void;
}

const Form: FC<FormImportation> = ({
  form,
  isFormProcessing,
  formRef,
  rules,
  onChange,
  onSubmitWithConfirmation,
  resetForm,
  isConfirmationModalActive,
  hideModal,
  onSubmit,
}) => {
  return (
    <>
      {/**@ts-ignore */}
      <ReactElementForm
        ref={formRef}
        model={form}
        rules={rules}
        labelPosition="top"
        labelWidth="120"
      >
        {/**@ts-ignore */}
        <ReactElementForm.Item style={{ marginBottom: '32px' }} label="First name" prop="firstName">
          <Input
            type="text"
            onChange={value => onChange('firstName', value)}
            value={form.firstName}
            disabled={isFormProcessing}
          ></Input>
        </ReactElementForm.Item>

        {/**@ts-ignore */}
        <ReactElementForm.Item style={{ marginBottom: '32px' }} label="Last name" prop="lastName">
          <Input
            type="text"
            onChange={value => onChange('lastName', value)}
            value={form.lastName}
            disabled={isFormProcessing}
          ></Input>
        </ReactElementForm.Item>

        {/**@ts-ignore */}
        <ReactElementForm.Item style={{ marginBottom: '32px' }} label="Email" prop="email">
          <Input
            type="email"
            onChange={value => onChange('email', value)}
            value={form.email}
            disabled={isFormProcessing}
          ></Input>
        </ReactElementForm.Item>

        {/**@ts-ignore */}
        <ReactElementForm.Item style={{ marginBottom: '32px' }} label="Phone" prop="phone">
          <Input
            onChange={value => onChange('phone', value)}
            value={form.phone}
            disabled={isFormProcessing}
          ></Input>
        </ReactElementForm.Item>

        {/**@ts-ignore */}
        <ReactElementForm.Item style={{ marginBottom: '32px' }} label="Role" prop="role">
          {/**@ts-ignore */}
          <Select
            placeholder="Select a role"
            value={form.role}
            clearable
            onChange={value => onChange('role', value)}
            style={{ width: '100%' }}
            disabled={isFormProcessing}
          >
            {getUserRoles().map(el => (
              <Select.Option key={el.value} label={el.label} value={el.value} />
            ))}
          </Select>
        </ReactElementForm.Item>

        {/**@ts-ignore */}
        <ReactElementForm.Item style={{ marginBottom: '32px' }}>
          {/**@ts-ignore */}
          <Button
            loading={isFormProcessing}
            disabled={isFormProcessing}
            type="primary"
            onClick={() => onSubmitWithConfirmation()}
          >
            Update
          </Button>

          {/**@ts-ignore */}
          <Button
            loading={isFormProcessing}
            disabled={isFormProcessing}
            onClick={() => resetForm()}
          >
            Reset
          </Button>
        </ReactElementForm.Item>
      </ReactElementForm>

      <Modal
        isLoading={isFormProcessing}
        isActive={isConfirmationModalActive()}
        onCancel={() => hideModal(ModalNames.CONFIRMATION)}
        onConfirm={() => onSubmit()}
      />
    </>
  );
};

export default Form;

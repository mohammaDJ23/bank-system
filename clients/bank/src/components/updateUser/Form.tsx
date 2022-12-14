import React, { FC } from 'react';
import { Button, Form as ReactElementForm, Input, Select } from 'element-react';
import { getUserRoles, Rules, UpdateUserByAdmin, UpdateUserByUser } from '../../lib';
import { Apis } from '../../apis';
import Modal from '../Modal';
import { ModalNames } from '../../store';
import { CreateAxiosDefaults } from 'axios';

interface FormImportation {
  onChange: (key: string, value: any) => void;
  form: UpdateUserByUser | UpdateUserByAdmin;
  isFormProcessing: boolean;
  formRef: React.MutableRefObject<ReactElementForm | null>;
  rules: Rules;
  isUserAdmin: boolean;
  currentApi: Apis;
  onSubmitWithConfirmation: () => void;
  resetForm: (apiName: Apis) => void;
  isConfirmationModalActive: () => boolean;
  hideModal: (name: ModalNames) => void;
  onSubmit: (currentApi: Apis, config?: CreateAxiosDefaults) => void;
}

const Form: FC<FormImportation> = ({
  form,
  isFormProcessing,
  formRef,
  rules,
  isUserAdmin,
  currentApi,
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

        {isUserAdmin && (
          /**@ts-ignore */
          <ReactElementForm.Item style={{ marginBottom: '32px' }} label="Role" prop="role">
            {/**@ts-ignore */}
            <Select
              placeholder="Select a role"
              value={(form as UpdateUserByAdmin).role}
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
        )}

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
            onClick={() => resetForm(currentApi)}
          >
            Reset
          </Button>
        </ReactElementForm.Item>
      </ReactElementForm>

      <Modal
        isLoading={isFormProcessing}
        isActive={isConfirmationModalActive()}
        onCancel={() => hideModal(ModalNames.CONFIRMATION)}
        onConfirm={() => onSubmit(currentApi, { baseURL: process.env.USER_SERVICE })}
      />
    </>
  );
};

export default Form;

import { Button, Input, Form as ReactElementForm } from 'element-react';
import { Apis } from '../../apis';
import { Rules, UpdateBill } from '../../lib';
import { FC } from 'react';

interface FormImportation {
  onChange: (key: string, value: any) => void;
  form: UpdateBill;
  isFormProcessing: boolean;
  formRef: React.MutableRefObject<ReactElementForm | null>;
  rules: Rules;
  onSubmitWithConfirmation: () => void;
  resetForm: (apiName: Apis) => void;
}

const Form: FC<FormImportation> = ({
  onChange,
  onSubmitWithConfirmation,
  resetForm,
  form,
  isFormProcessing,
  formRef,
  rules,
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
        <ReactElementForm.Item style={{ marginBottom: '32px' }} label="Amount" prop="amount">
          <Input
            type="number"
            onChange={value => onChange('amount', value)}
            value={form.amount}
            disabled={isFormProcessing}
          ></Input>
        </ReactElementForm.Item>

        {/**@ts-ignore */}
        <ReactElementForm.Item style={{ marginBottom: '32px' }} label="Receiver" prop="receiver">
          <Input
            type="text"
            onChange={value => onChange('receiver', value)}
            value={form.receiver}
            disabled={isFormProcessing}
          ></Input>
        </ReactElementForm.Item>

        {/**@ts-ignore */}
        <ReactElementForm.Item style={{ marginBottom: '32px' }} label="Date" prop="date">
          <Input
            type="date"
            onChange={value => onChange('date', value)}
            value={form.date}
            disabled={isFormProcessing}
          ></Input>
        </ReactElementForm.Item>

        {/**@ts-ignore */}
        <ReactElementForm.Item
          style={{ marginBottom: '32px' }}
          label="Description"
          prop="description"
        >
          <Input
            type="textarea"
            autosize={{ minRows: 5 }}
            onChange={value => onChange('description', value)}
            value={form.description}
            disabled={isFormProcessing}
          ></Input>
        </ReactElementForm.Item>

        {/**@ts-ignore */}
        <ReactElementForm.Item style={{ marginBottom: '32px' }}>
          {/**@ts-ignore */}
          <Button
            type="primary"
            onClick={() => onSubmitWithConfirmation()}
            disabled={isFormProcessing}
          >
            Update
          </Button>

          {/**@ts-ignore */}
          <Button onClick={() => resetForm()} disabled={isFormProcessing}>
            Reset
          </Button>
        </ReactElementForm.Item>
      </ReactElementForm>
    </>
  );
};

export default Form;

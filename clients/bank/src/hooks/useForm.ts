import { Form } from 'element-react';
import { useState, useRef } from 'react';
import { copyConstructor, Form as FormConstructor } from '../lib';
import { ModalNames } from '../store';
import { useAction } from './useActions';
import { useSelector } from '../hooks';

interface FormInstance extends FormConstructor {}

export function useForm<T extends FormInstance>(initialForm: T) {
  const [form, setForm] = useState<T>(initialForm);
  const formRef = useRef<Form | null>(null);
  const rules = form.getRules();
  const { showModal } = useAction();
  const { modals } = useSelector();

  function onChange(name: string, value: any) {
    setForm(prevState => {
      return Object.assign(copyConstructor<T>(prevState), {
        [name]: value,
      });
    });
  }

  function onSubmit(callback: () => void) {
    if (!formRef.current) return;

    formRef.current.validate(valid => {
      if (valid) {
        callback.call({});
      }
    });
  }

  function onSubmitWithConfirmation() {
    if (!formRef.current) return;

    formRef.current.validate(valid => {
      if (valid) {
        showModal(ModalNames.CONFIRMATION);
      }
    });
  }

  function resetForm() {
    if (!formRef.current) return;

    formRef.current.resetFields();

    setForm(prevState => {
      return Object.assign(copyConstructor<T>(prevState), initialForm);
    });
  }

  function isConfirmationModalActive() {
    return !!modals[ModalNames.CONFIRMATION];
  }

  return {
    resetForm,
    onChange,
    onSubmit,
    onSubmitWithConfirmation,
    isConfirmationModalActive,
    form,
    formRef,
    rules,
  };
}

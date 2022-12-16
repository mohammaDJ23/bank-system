import { Form } from 'element-react';
import { useState, useRef } from 'react';
import { Form as FormConstructor } from '../lib';
import { ModalNames } from '../store';
import { useAction } from './useActions';
import { useSelector } from '../hooks';

interface FormInstance extends FormConstructor {}

interface Constuctor {
  new (...args: any[]): {};
}

export function useForm<T extends FormInstance>(initialForm: T) {
  const [form, setForm] = useState<T>(initialForm);
  const formRef = useRef<Form | null>(null);
  const rules = form.getRules();
  const { showModal } = useAction();
  const { modals } = useSelector();

  function copyConstructor(instance: T) {
    const copy = new (instance.constructor as Constuctor)(instance);
    return Object.assign(copy, instance);
  }

  function onChange(name: string, value: any) {
    setForm(prevState => {
      return Object.assign(copyConstructor(prevState), {
        [name]: value,
      });
    });
  }

  function onSubmit() {
    if (!formRef.current) return;

    formRef.current.validate(valid => {
      if (valid) {
        console.log('submit!!');
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
      return Object.assign(copyConstructor(prevState), initialForm);
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

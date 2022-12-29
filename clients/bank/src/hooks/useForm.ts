import { Form } from 'element-react';
import { useState, useRef } from 'react';
import { copyConstructor, Form as FormConstructor } from '../lib';
import { ModalNames } from '../store';
import { useAction } from './useActions';
import { useSelector } from '../hooks';
import { apis, Apis, ResetApi } from '../apis';
import { CreateAxiosDefaults } from 'axios';

interface FormInstance extends FormConstructor {}

export function useForm<T extends FormInstance>(initialForm: T) {
  const [form, setForm] = useState<T>(initialForm);
  const formRef = useRef<Form | null>(null);
  const rules = form.getRules();
  const { showModal } = useAction();
  const { modals } = useSelector();
  const { asyncOp } = useAction();
  const { loadings } = useSelector();

  function onChange(name: string, value: any) {
    setForm(prevState => {
      const constructedForm = copyConstructor<T>(prevState);
      const newState = Object.assign(constructedForm, { [name]: value });
      constructedForm.cachInput(name, value);
      return newState;
    });
  }

  function onSubmit(apiName: Apis, config?: CreateAxiosDefaults) {
    if (!formRef.current || isFormProcessing(apiName)) return;

    formRef.current.validate(valid => {
      if (valid) {
        asyncOp(async (dispatch, store) => {
          form.beforeSubmition(dispatch, store);
          await ResetApi.req(apis[apiName](form as T as any), config);
          form.afterSubmition(dispatch, store);
          resetForm(apiName);
        }, apiName);
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

  function resetForm(apiName: Apis) {
    if (!formRef.current || isFormProcessing(apiName)) return;

    formRef.current.resetFields();

    setForm(prevState => {
      const constructedForm = copyConstructor<T>(prevState);
      const resetedForm = constructedForm.resetCach<T>();
      const newState = Object.assign(constructedForm, resetedForm);
      return newState;
    });
  }

  function initializeForm(form: T) {
    setForm(form);
  }

  function isConfirmationModalActive() {
    return !!modals[ModalNames.CONFIRMATION];
  }

  function isFormProcessing(apiName: Apis) {
    return !!loadings[apiName];
  }

  return {
    resetForm,
    onChange,
    onSubmit,
    onSubmitWithConfirmation,
    isConfirmationModalActive,
    isFormProcessing,
    initializeForm,
    form,
    formRef,
    rules,
  };
}

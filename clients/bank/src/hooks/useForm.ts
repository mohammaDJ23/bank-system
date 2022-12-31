import { Form } from 'element-react';
import { useState, useRef, useCallback, useEffect } from 'react';
import { copyConstructor, Form as FormConstructor } from '../lib';
import { ModalNames } from '../store';
import { useAction } from './useActions';
import { useRequest, useSelector } from '../hooks';
import { apis, Apis } from '../apis';
import { CreateAxiosDefaults } from 'axios';

interface FormInstance extends FormConstructor {}

export function useForm<T extends FormInstance>(initialForm: T) {
  const [form, setForm] = useState<T>(initialForm);
  const formRef = useRef<Form | null>(null);
  const rules = form.getRules();
  const { showModal, hideModal } = useAction();
  const { modals } = useSelector();
  const { request, isApiProcessing } = useRequest();

  useEffect(() => {
    return () => {
      form.resetCach();
    };
  }, []);

  const onChange = useCallback((name: string, value: any) => {
    setForm(prevState => {
      const constructedForm = copyConstructor<T>(prevState);
      const newState = Object.assign(constructedForm, { [name]: value });
      constructedForm.cachInput(name, value);
      return newState;
    });
  }, []);

  const isFormProcessing = useCallback(
    (apiName: Apis) => {
      return isApiProcessing(apiName);
    },
    [isApiProcessing]
  );

  const resetForm = useCallback(
    (apiName: Apis) => {
      if (!formRef.current || isFormProcessing(apiName)) return;

      formRef.current.resetFields();

      setForm(prevState => {
        const constructedForm = copyConstructor<T>(prevState);
        const resetedForm = constructedForm.resetCach<T>();
        const newState = Object.assign(constructedForm, resetedForm);
        return newState;
      });
    },
    [isFormProcessing]
  );

  const isConfirmationModalActive = useCallback(() => {
    return !!modals[ModalNames.CONFIRMATION];
  }, [modals]);

  const onSubmit = useCallback(
    (apiName: Apis, config?: CreateAxiosDefaults) => {
      if (!formRef.current || isFormProcessing(apiName)) return;

      formRef.current.validate(valid => {
        if (valid) {
          request<T, T>({
            data: apis[apiName](form as T as any),
            apiName,
            config,
            beforeRequest(dispatch, store) {
              form.beforeSubmition(dispatch, store);
            },
            afterRequest(response, dispatch, store) {
              form.afterSubmition(dispatch, store);
              resetForm(apiName);
              if (isConfirmationModalActive()) hideModal(ModalNames.CONFIRMATION);
            },
          });
        }
      });
    },
    [isFormProcessing, resetForm, isConfirmationModalActive, hideModal, request, form]
  );

  const onSubmitWithConfirmation = useCallback(() => {
    if (!formRef.current) return;

    formRef.current.validate(valid => {
      if (valid) {
        showModal(ModalNames.CONFIRMATION);
      }
    });
  }, [showModal]);

  const initializeForm = useCallback((form: T) => {
    setForm(form);
  }, []);

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

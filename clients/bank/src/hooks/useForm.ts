import { Form } from 'element-react';
import { useRef, useMemo } from 'react';
import { Constructor, Form as FormConstructor } from '../lib';
import { ModalNames } from '../store';
import { useAction } from './useActions';
import { useSelector } from '../hooks';

interface FormInstance extends FormConstructor {}

interface FormRef {
  [key: string]: Form;
}

export type UseFormExportation = ReturnType<typeof useForm>;
export type UseFormCallbackExportation = ReturnType<UseFormExportation>;

export function useForm() {
  const formRef = useRef<FormRef>({});
  const { showModal, setForm, onChange: changeInput, resetForm: resettingForm } = useAction();
  const { modals, forms } = useSelector();

  return useMemo(
    function () {
      return function <T extends FormInstance>(initialForm: Constructor<T>) {
        function getFormName() {
          return initialForm.name;
        }

        function getForm(): T {
          return forms[getFormName()] as T;
        }

        function getFormRef(): Form | null {
          return formRef.current[getFormName()] || null;
        }

        function initializeForm(form: T) {
          setForm<T>(form);
        }

        function onChange(key: keyof T, value: any) {
          changeInput({ form: initialForm, key, value });
        }

        function resetForm() {
          const formRef = getFormRef();
          if (formRef) {
            formRef.resetFields();
            resettingForm(initialForm);
          }
        }

        function getRules() {
          return getForm().getRules();
        }

        function resetCach() {
          return getForm().resetCach();
        }

        function setFormRef(el: Form | null) {
          if (el) formRef.current[getFormName()] = el;
        }

        function confirmation() {
          const formRef = getFormRef();
          if (formRef)
            formRef.validate(valid => {
              if (valid) showModal(ModalNames.CONFIRMATION);
            });
        }

        function onSubmit(cb: () => Promise<void> | void) {
          const formRef = getFormRef();
          if (formRef)
            formRef.validate(valid => {
              if (valid) cb.call({});
            });
        }

        function isConfirmationActive() {
          return !!modals[ModalNames.CONFIRMATION];
        }

        return {
          initializeForm,
          onChange,
          resetForm,
          setFormRef,
          resetCach,
          getRules,
          confirmation,
          onSubmit,
          isConfirmationActive,
          getFormRef,
          getForm,
        };
      };
    },
    [modals, forms, showModal, resettingForm, changeInput, setForm]
  );
}

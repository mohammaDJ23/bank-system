import { useMemo } from 'react';
import { Constructor, Form as FormConstructor } from '../lib';
import { ModalNames } from '../store';
import { useAction } from './useActions';
import { useSelector } from '../hooks';

interface FormInstance extends FormConstructor {}

export type UseFormExportation = ReturnType<typeof useForm>;

export function useForm<T extends FormInstance>(initialForm: Constructor<T>) {
  const { showModal, setForm, onChange: changeInput, resetForm: resettingForm } = useAction();
  const { modals, forms } = useSelector();

  return useMemo(
    function () {
      function getFormName() {
        return initialForm.name;
      }

      function getForm(): T {
        return forms[getFormName()] as T;
      }

      function initializeForm(form: T) {
        setForm<T>(form);
      }

      function onChange(key: keyof T, value: any) {
        changeInput({ form: initialForm, key, value });
      }

      function resetForm() {
        resettingForm(initialForm);
        getForm().resetInputsValidation();
      }

      function getRules() {
        return getForm().getRules();
      }

      function resetCach() {
        return getForm().resetCach();
      }

      function isFormValid() {
        return getForm().isFormValid();
      }

      function confirmation() {
        if (isFormValid()) showModal(ModalNames.CONFIRMATION);
      }

      function onSubmit(cb: () => Promise<void> | void) {
        if (isFormValid()) cb.call({});
      }

      function isConfirmationActive() {
        return !!modals[ModalNames.CONFIRMATION];
      }

      function getInputErrorMessage(key: keyof T) {
        return getForm().getInputValidation(key).errorMessage;
      }

      function isInputInValid(key: keyof T) {
        return !!getForm().getInputValidation(key).errorMessage;
      }

      return {
        initializeForm,
        onChange,
        resetForm,
        resetCach,
        getRules,
        confirmation,
        onSubmit,
        isConfirmationActive,
        getForm,
        getInputErrorMessage,
        isInputInValid,
        isFormValid,
      };
    },
    [modals, forms, initialForm, showModal, resettingForm, changeInput, setForm]
  );
}

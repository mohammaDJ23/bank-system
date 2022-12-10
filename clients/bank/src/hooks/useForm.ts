import { Form } from 'element-react';
import { useState, useRef } from 'react';
import { Form as FormConstructor } from '../lib';

interface FormInstance extends FormConstructor {}

interface Constuctor<T extends FormInstance = FormInstance> {
  new (...args: any[]): T;
}

export function useForm<T extends FormInstance>(initialForm: Constuctor<T>) {
  const [form, setForm] = useState<T>(new initialForm());
  const formRef = useRef<Form | null>(null);
  const rules = form.getRules();

  function copyConstructor(instance: T) {
    const copy = new (instance.constructor as Constuctor)();
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
      } else {
        console.log('error submit!!');
        return false;
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

  return { resetForm, onChange, onSubmit, form, formRef, rules };
}

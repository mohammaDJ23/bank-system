import { matchPath, PathMatch } from 'react-router-dom';
import {
  Constructor,
  getInitialInputsValue,
  LocalStorage,
  routes,
  getInputRules,
  getInputsRules,
  getCachedInputs,
  getInputsValidation,
  getInitialInputValidation,
  InputsValidation,
  setInputsValidation,
} from '../';

export abstract class Form {
  getPrototype(): object {
    return this.constructor.prototype;
  }

  getConstructorName(): string {
    return this.constructor.name;
  }

  getRule(key: string) {
    return getInputRules(key, this.getPrototype());
  }

  getRules() {
    return getInputsRules(this.getPrototype());
  }

  getParam(param: string): string {
    let currentMatchPath: PathMatch<string> | null = null;
    let findedParam: string = '';

    routes.forEach(route => {
      currentMatchPath = matchPath(route.path, window.location.pathname);
      if (currentMatchPath && typeof currentMatchPath.params[param] === 'string')
        findedParam = currentMatchPath.params[param] as string;
    });

    return findedParam;
  }

  cachInput(key: keyof this, value: any): void {
    const cachedInputs = getCachedInputs(this.getPrototype());
    const isInputCached = cachedInputs.has(key as string);
    if (isInputCached) {
      const cachedForm = this.getCachedForm();
      const newCachedForm = Object.assign(cachedForm, { [key]: value });
      this.setCacheableFrom(newCachedForm);
    }
  }

  getCachedForm(): this {
    return LocalStorage.getItem(this.getConstructorName()) || {};
  }

  setCacheableFrom(value: this) {
    LocalStorage.setItem(this.getConstructorName(), value);
  }

  clearCachedForm() {
    LocalStorage.removeItem(this.getConstructorName());
  }

  clearCachedInput(key: keyof this) {
    const cachedForm = this.getCachedForm();
    if (cachedForm[key]) delete cachedForm[key];
    this.setCacheableFrom(cachedForm);
  }

  getCachedInput(name: keyof this): any {
    const cachedForm = this.getCachedForm();
    return cachedForm[name] || this[name];
  }

  resetCach<T extends Form>(): T {
    const inputs = getInitialInputsValue(this.getPrototype());
    for (let key in inputs) this[key as keyof this] = inputs[key];
    this.clearCachedForm();
    return new (this.constructor as Constructor)() as T;
  }

  getInputValidation(key: keyof this) {
    return this.getInputsValidation()[key as string];
  }

  getInputsValidation() {
    return getInputsValidation(this.getPrototype());
  }

  setInputsValidation(value: InputsValidation) {
    setInputsValidation(value, this.getPrototype());
  }

  isFormValid() {
    let isFormValid: boolean = true;
    for (const key in this) {
      for (const ruleFn of this.getRule(key)) {
        isFormValid = isFormValid && !!!ruleFn(this[key]);
      }
    }
    return isFormValid;
  }

  resetInputsValidation() {
    const inputsValidation = this.getInputsValidation();
    for (const key in inputsValidation) inputsValidation[key] = getInitialInputValidation();
    this.setInputsValidation(inputsValidation);
  }
}

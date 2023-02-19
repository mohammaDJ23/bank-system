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
  InputValidation,
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
      const constructorName = this.getConstructorName();
      const cachedForm = LocalStorage.getItem(constructorName) || {};
      const newCachedForm = Object.assign(cachedForm, { [key]: value });
      LocalStorage.setItem(constructorName, newCachedForm);
    }
  }

  getCachedInput(name: keyof this): any {
    const cachedForm: this = LocalStorage.getItem(this.getConstructorName()) || {};
    return cachedForm[name] || this[name];
  }

  resetCach<T extends Form>(): T {
    const inputs = getInitialInputsValue(this.getPrototype());
    for (let key in inputs) this[key as keyof this] = inputs[key];
    LocalStorage.removeItem(this.getConstructorName());
    return new (this.constructor as Constructor)() as T;
  }

  getInputValidation(key: keyof this) {
    return this.getInputsValidation()[key as string];
  }

  getInputsValidation() {
    return getInputsValidation(this.getPrototype());
  }

  isFormValid() {
    let isFormValid: boolean = true;
    const inputsValidation = this.getInputsValidation();
    for (const key in inputsValidation) isFormValid = isFormValid && inputsValidation[key].isValid;
    return isFormValid;
  }
}

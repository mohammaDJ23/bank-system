import { getCacheableInputList } from '../decorators/cacheInput';
import { getInputsRules } from '../decorators/defineInputRules';
import { LocalStorage } from '../storage';

export class Form {
  getConstructorName() {
    return this.constructor.name;
  }

  getConstructor() {
    return this.constructor;
  }

  getInputName(inputName = '') {
    if (!(inputName in this)) throw new Error('Invalid input.');
    return inputName;
  }

  getCacheableInputList() {
    return getCacheableInputList(this.getConstructor());
  }

  getCachedForm() {
    return LocalStorage.getItem(this.getConstructorName()) || {};
  }

  isInputCacheable(key) {
    return this.getCacheableInputList().indexOf(key) !== -1;
  }

  getCachedInput(key) {
    if (this.isInputCacheable(key)) return this.getCachedForm()[key] || this[key];
    return this[key];
  }

  cacheInput(key, value) {
    if (this.isInputCacheable(key))
      LocalStorage.setItem(
        this.getConstructorName(),
        Object.assign(this.getCachedForm(), { [key]: value })
      );
  }

  getInputsRules() {
    return getInputsRules(this.getConstructor());
  }

  getInputRules(key) {
    const inputRules = this.getInputsRules();
    if (key in inputRules) return inputRules[key];
    else return [];
  }

  clearCachedForm() {
    LocalStorage.clear(this.getConstructorName());
  }

  bindInputsRules() {
    const rules = this.getInputsRules();
    for (let input in rules) {
      rules[input] = rules[input].map(fn => fn.bind(this));
    }
  }

  static getPrototype() {
    return Form.prototype;
  }
}

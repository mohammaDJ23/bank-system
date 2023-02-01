import { LocalStorage } from '../storage';
import { metadataTypes } from '../types';

export class Form {
  getConstructorName() {
    return this.constructor.name;
  }

  getConstructorPrototype() {
    return this.constructor.prototype;
  }

  getInputName(inputName = '') {
    if (!(inputName in this)) throw new Error('Invalid input.');
    return inputName;
  }

  getCacheableInputList() {
    return Reflect.getMetadata(metadataTypes.CACHE_INPUT, this.getConstructorPrototype()) || [];
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

  getInputRules(key) {
    const inputRules =
      Reflect.getMetadata(metadataTypes.INPUT_RULES, this.getConstructorPrototype()) || {};
    if (key in inputRules) return inputRules[key];
    else return [];
  }

  clearCachedForm() {
    LocalStorage.clear(this.getConstructorName());
  }
}

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
    if (this.isInputCacheable(key)) return this.getCachedForm()[key] || null;
    else return this[key] || null;
  }

  cacheInput(key, value) {
    if (this.isInputCacheable(key))
      LocalStorage.setItem(
        this.getConstructorName(),
        Object.assign(this.getCachedForm(), { [key]: value })
      );
  }
}

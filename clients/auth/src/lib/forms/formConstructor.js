import { LocalStorage } from '../storage';

export class Form {
  static {
    this.prototype.inputsValidationStore = new Map();
    Object.freeze(this.prototype);
  }

  getConstructorName() {
    return this.constructor.name;
  }

  getInputsValidationStore(constructorName = this.getConstructorName()) {
    return this.inputsValidationStore.get(constructorName) || {};
  }

  setInputValidationStore(inputs = {}, constructorName = this.getConstructorName()) {
    this.inputsValidationStore.set(constructorName, inputs);
  }

  getInputName(inputName = '') {
    if (!(inputName in this)) {
      throw new Error('Invalid input.');
    }

    return inputName;
  }

  isInputValid(inputName, callback = function (value = null) {}) {
    inputName = this.getInputName(inputName);
    const isInputValid = !!callback.call(Object.freeze(this), this[inputName]);
    let inputs = this.getInputsValidationStore();
    inputs = Object.assign(inputs, { [inputName]: isInputValid });
    this.setInputValidationStore(inputs);
    return isInputValid;
  }

  isFormValid() {
    const inputs = this.getInputsValidationStore();
    let isValid = !!Object.keys(inputs).length;

    for (const input in inputs) {
      isValid = isValid && inputs[input];
    }

    return isValid;
  }

  setCachedInput(key) {
    const cachedInput = LocalStorage.getItem(key);
    if (cachedInput) this[key] = cachedInput;
  }
}

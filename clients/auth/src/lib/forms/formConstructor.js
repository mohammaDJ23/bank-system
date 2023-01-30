import { LocalStorage } from '../storage';

export class Form {
  getConstructorName() {
    return this.constructor.name;
  }

  getInputName(inputName = '') {
    if (!(inputName in this)) throw new Error('Invalid input.');
    return inputName;
  }
}

import { matchPath, PathMatch } from 'react-router-dom';
import { Constructor, FormMetadataTypes, LocalStorage, routes, Rule, Rules } from '../';

export class Form {
  getPrototype(): object {
    return this.constructor.prototype;
  }

  getConstructorName(): string {
    return this.constructor.name;
  }

  getRule(key: string): Rule[] {
    return Reflect.getMetadata(key, this.getPrototype()) || [];
  }

  getRules(): Rules {
    return Reflect.getMetadata(FormMetadataTypes.FORM_RULES, this.getPrototype()) || {};
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

  cachInput(key: string, value: any): void {
    const constructorName = this.getConstructorName();
    const cachedForm = LocalStorage.getItem(constructorName) || {};
    const newCachedForm = Object.assign(cachedForm, { [key]: value });
    LocalStorage.setItem(constructorName, newCachedForm);
  }

  getCachedInput(name: keyof this): any {
    const cachedForm: this = LocalStorage.getItem(this.getConstructorName()) || {};
    return cachedForm[name] || this[name];
  }

  resetCach<T extends Form>(): T {
    const initialInputs = Reflect.getMetadata(FormMetadataTypes.VALUES, this.getPrototype()) || {};
    for (let key in initialInputs) this[key as keyof this] = initialInputs[key];
    LocalStorage.removeItem(this.getConstructorName());
    return new (this.constructor as Constructor)() as T;
  }
}

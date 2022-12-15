import { matchPath, PathMatch } from 'react-router-dom';
import { FormMetadataTypes, routes, Rule, Rules } from '../';

export class Form {
  getPrototype(): object {
    return this.constructor.prototype;
  }

  getRule(key: string): Rule[] {
    return Reflect.getMetadata(key, this.getPrototype()) || [];
  }

  getRules(): Rules {
    return Reflect.getMetadata(FormMetadataTypes.FORM_RULES, this.getPrototype()) || {};
  }

  setPropWithParam(param: string): string {
    let currentMatchPath: PathMatch<string> | null = null;
    let findedParam: string = '';

    routes.forEach(route => {
      currentMatchPath = matchPath(route.path, window.location.pathname);
      if (currentMatchPath && typeof currentMatchPath.params[param] === 'string')
        findedParam = currentMatchPath.params[param] as string;
    });

    return findedParam;
  }
}

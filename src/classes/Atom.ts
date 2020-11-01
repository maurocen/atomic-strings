import IAtom from '../interfaces/IAtom';
import ITemplate from '../interfaces/ITemplate';

import Errorable from './Errorable';

import { isValidAtomKey, isValidAtomValue } from '../utils/atomHelpers';

class Atom extends Errorable implements IAtom {
  _key: string;
  _value: string | ITemplate;

  constructor(key : string, value : string | ITemplate) {
    super();

    if (!(isValidAtomKey(key) && isValidAtomValue(value))) {
      this.throw('Missing key or value')
    }

    this._key = key;
    this._value = value;
  }

  getKey() : string {
    return this._key;
  }

  getValue() : string {
    const valueAsTemplate = this._value as ITemplate;

    if (valueAsTemplate.getValue) {
      return valueAsTemplate.getValue();
    }

    return this._value as string;
  }

  throw(message : string) : void {
    super.throw('Atom', message);
  }

  static validate(key : string | IAtom, value : string | ITemplate) : void {
    if (!(key instanceof Atom)) {
      if (isValidAtomKey(key as string)) {
        if (!isValidAtomValue(value)) {
          throw('Invalid value');
        }
      } else {
        throw('Invalid key');
      }
    }
  }
}

export default Atom;

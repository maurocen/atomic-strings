import IAtom from "../interfaces/IAtom";
import ITemplate from "../interfaces/ITemplate";

import Atom from "./Atom";
import Errorable from "./Errorable";

import { replaceAllOccurences } from "../utils/stringHelpers";
import { isValidTemplate } from "../utils/templateHelpers";

class Template extends Errorable implements ITemplate {
  _template : string;
  _atoms : Record<string, IAtom>;

  constructor(template : string, atoms = {}) {
    super();

    this.validateTemplate(template);
    this.validateAtoms(atoms);
    this._template = template;
    this._atoms = atoms;
  }

  getAtoms() : Record<string, IAtom> {
    return this._atoms;
  }

  getTemplate() : string {
    return this._template;
  }

  getValue() : string {
    let returnString = this._template;

    Object.values(this._atoms).forEach((atom) => {
      returnString = replaceAllOccurences(returnString, atom);
    });

    return returnString;
  }

  setAtom(key : string | IAtom, value?: ITemplate | string) : ITemplate {
    Atom.validate(key, value);

    if (key instanceof Atom) {
      this._atoms[key.getKey()] = key;
    } else {
      const keyAsString = key as string;
      const newAtom = new Atom(keyAsString, value);

      this._atoms[keyAsString] = newAtom;
    }

    return this;
  }

  setTemplate(template: string) : ITemplate {
    this.validateTemplate(template);

    this._template = template;

    return this;
  }

  throw(message : string) : void {
    super.throw('Template', message);
  }

  validateAtoms(atoms : Record<string, IAtom>) : void {
    Object.entries(atoms).forEach(([key, atom]) => {
      Atom.validate(key, atom.getValue());
    });
  }

  validateTemplate(template : string) : void {
    if (!isValidTemplate(template)) {
      this.throw('Missing template');
    }
  }
}

export default Template;

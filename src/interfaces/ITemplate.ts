import IAtom from './IAtom';
import IErrorable from './IErrorable';

export default interface ITemplate extends IErrorable {
  getTemplate: () => string,
  getValue: () => string,
  setAtom: (key: string | IAtom, value: string | ITemplate) => ITemplate,
  setTemplate: (template: string) => ITemplate,
}

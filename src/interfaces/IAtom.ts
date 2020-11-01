import IErrorable from "./IErrorable";

export default interface IAtom extends IErrorable {
  getKey : () => string,
  getValue : () => string,
}

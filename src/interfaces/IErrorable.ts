export default interface IErrorable {
  throw : (className : string, message : string) => void;
}

import IErrorable from "../interfaces/IErrorable";

class Errorable implements IErrorable {
  throw(className : string, message : string) : void {
    throw new Error(`${className} error: ${message}`);
  }
}

export default Errorable;

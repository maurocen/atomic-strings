import IAtom from "../interfaces/IAtom"

export function replaceAllOccurences(input : string, atom : IAtom) : string {
  let returnString = input;

  returnString = returnString.replace(new RegExp(`{{${atom.getKey()}}}`), atom.getValue());

  return returnString;
}

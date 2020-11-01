import Template from "../classes/Template";
import ITemplate from "../interfaces/ITemplate";

export function isValidAtomKey(key : string) : boolean {
  return !!(key && key.trim());
}

export function isValidAtomValue(value : string | ITemplate) : boolean {
  const valueAsString = value as string;

  if (!value) {
    return false;
  }

  if (valueAsString.trim && valueAsString.trim()) {
    return true;
  }

  if (value instanceof Template && value.getValue().trim()) {
    return true;
  }
}

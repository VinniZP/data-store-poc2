import { PersistStorage } from "./persistence";

export class LocalPersistStorage implements PersistStorage {

  get(key: string) {
    return JSON.parse(localStorage.getItem(key) || '{}');
  }

  set(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
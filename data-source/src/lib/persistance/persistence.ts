import { effect } from '@angular/core';

export interface PersistStorage {
  get(key: string): any;
  set(key: string, value: any): void;
}

export interface Persistable<T = any> {
  persistKey: string;
  restoreMeta(meta: T): void;
  saveMeta(): T;
}

export function persist<T extends Persistable[]>(
  config: {
    key: string;
    storage: PersistStorage;
    debounce?: number;
  },
  ...persistables: T
) {
  const data = config.storage.get(config.key);
  if (data) {
    persistables.forEach((persistable) => {
      if (data[persistable.persistKey]) {
        persistable.restoreMeta(data[persistable.persistKey]);
      }
    });
  }
  effect((onCleanup) => {
    persistables.forEach((persistable) => {
      data[persistable.persistKey] = persistable.saveMeta();
    });
    const id = setTimeout(() => {
      config.storage.set(config.key, data);
    }, config.debounce ?? 50);
    onCleanup(() => clearTimeout(id));
  });
}

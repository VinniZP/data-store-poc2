import { signal } from "@angular/core";

export abstract class DataPlugin<ResultData, Meta = unknown> {
  readonly propertyName!: string;
  meta = signal({} as Meta);

  apply<TMeta extends Meta>(data: ResultData[], meta: TMeta): ResultData[] {
    return data;
  }

  updateMeta(fn: (meta: Meta) => void) {
      this.meta.mutate(fn);
  }

  setMeta(meta: Meta) {
    this.meta.set(meta);
  }

  getMeta() {
    return this.meta();
  }

  abstract restoreMeta(meta: Partial<Meta>): void;

}
import { Persistable, DataPlugin } from "@vc/data-source";
import { signal } from "@angular/core";

export interface SortMeta {
  field: string;
  direction: 'asc' | 'desc';
}

export class SortPlugin<T = any> extends DataPlugin<T, SortMeta> implements Persistable<SortMeta> {
  persistKey = 'sort';
  override propertyName = 'pagination' as const;
  override meta = signal<SortMeta>({
    direction: 'asc',
    field: ''
  })

  override apply<TMeta extends SortMeta>(data: T[], meta: TMeta): T[] {
    return data.sort((a: any, b: any) => {
      if(!meta.field) return 0;
      if (a[meta.field] > b[meta.field]) {
        return meta.direction === 'asc' ? 1 : -1;
      }
      if (a[meta.field] < b[meta.field]) {
        return meta.direction === 'asc' ? -1 : 1;
      }
      return 0;
    });
  }

  setSort(field: SortMeta['field'], direction: SortMeta['direction']): void {
    this.meta.mutate(m => {
      m.field = field;
      m.direction = direction;
    });
  }

  restoreMeta(meta: Partial<SortMeta>): void {
    this.meta.mutate(m => {
      m.field = meta.field ?? m.field;
      m.direction = meta.direction ?? m.direction;
    });
  }

  saveMeta(): SortMeta {
    return this.meta();
  }
}
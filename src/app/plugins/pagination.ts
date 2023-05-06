import { Persistable, DataPlugin } from "@vc/data-source";
import { signal } from "@angular/core";

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
}

export class PaginationPlugin<T> extends DataPlugin<T, PaginationMeta> implements Persistable<PaginationMeta> {
  override propertyName = 'pagination' as const;
  override meta = signal<PaginationMeta>({
    page: 1,
    pageSize: 10,
    total: 0
  })
  persistKey = 'pagination';

  override apply<TMeta extends PaginationMeta>(data: T[], meta: TMeta): T[] {
    return data.slice((meta.page - 1) * meta.pageSize, meta.page * meta.pageSize);
  }

  override restoreMeta(meta: Partial<PaginationMeta>): void {
    this.meta.mutate(m => {
      m.page = +(meta.page ?? m.page);
      m.pageSize = +(meta.pageSize ?? m.pageSize);
      m.total = +(meta.total ?? m.total);
    })
  }


  saveMeta(): PaginationMeta {
    return this.meta();
  }
}
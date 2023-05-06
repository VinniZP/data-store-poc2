import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import { of } from 'rxjs';
import { CommonModule, NgForOf } from '@angular/common';
import { PaginationPlugin } from './plugins/pagination';
import {
  createDataSource,
  LocalPersistStorage,
  persist,
  PluginMetaUnion,
} from '@vc/data-source';
import { SortPlugin } from './plugins/sort';
import { RouterPersistStorage } from "../../data-source/src/lib/persistance/router-storage.persist";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

@Component({
  standalone: true,
  imports: [NxWelcomeComponent, RouterModule, CommonModule, NgForOf],
  selector: 'vinni-components-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'vinni-components';

  pagination = new PaginationPlugin();
  sort = new SortPlugin();
  dataSource = createDataSource(
    {
      name: 'test',
      provider: {
        load: (meta) => {
          return of(
            new Array(100).fill(0).map((_, i) => ({
              id: i,
              title: `test ${i} ` + meta?.page,
              completed: Math.random() > 0.5,
            })) as Todo[]
          );
        },
      },
    },
    this.sort,
    this.pagination,
  );
  storage: RouterPersistStorage;

  constructor() {
    this.storage = new RouterPersistStorage();
    persist(
      {
        key: 'test',
        storage: this.storage,
        debounce: 1000
      },
      this.pagination
    );
  }

  logData() {
    this.storage.get('test');
    const a = {
      page: 1,
      pageSize: 10,
      total: 0,
      field: 'test',
      direction: 'asc',
    } satisfies PluginMetaUnion<[PaginationPlugin<any>, SortPlugin<any>]>;
    console.log(this.dataSource.meta());
  }

  next() {
    this.pagination.updateMeta((meta) => {
      meta.page++;
    });
  }

  prev() {
    this.pagination.updateMeta((meta) => {
      meta.page--;
    });
  }

  toggleSort(id: string) {
    this.sort.updateMeta((meta) => {
      if (meta.field === id) {
        meta.direction = meta.direction === 'asc' ? 'desc' : 'asc';
      } else {
        meta.field = id;
        meta.direction = 'asc';
      }
    });
  }
}

import { DataPlugin } from './dataPlugin';

export type PluginMeta<T> = T extends DataPlugin<any, infer Meta>
  ? Meta
  : never;

// union to intersection of plugin meta types
export type PluginMetaUnion<T extends DataPlugin<any, any>[]> = T extends [
  infer Head,
  ...infer Tail
]
  ? Head extends DataPlugin<any, any>
    ? Tail extends DataPlugin<any, any>[]
      ? PluginMeta<Head> & PluginMetaUnion<Tail>
      : never
    : never
  : object;

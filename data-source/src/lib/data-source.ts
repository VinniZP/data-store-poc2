import { DataProvider } from "./provider";
import { computed, DestroyRef, effect, inject, Signal, signal } from "@angular/core";
import { DataPlugin } from "./dataPlugin";
import { PluginMetaUnion } from "./types";

export interface DataSourceConfig<Meta, ResultData> {
  name: string;
  provider: DataProvider<Meta, ResultData>,
}

export function createDataSource<ResultData, Plugins extends DataPlugin<any, any>[], Meta = PluginMetaUnion<Plugins>>(
  config: DataSourceConfig<Meta, ResultData>,
  ...plugins: Plugins
) {
  const initialData = signal([] as ResultData[]);
  const meta = createMetaSignal<Plugins, Meta>(plugins);

  loadData<ResultData, Meta>(config, initialData, meta);

  const data = applyPluginsToData<ResultData, Meta>(initialData, meta, plugins);

  return {
    data,
    meta
  };
}

function createMetaSignal<Plugins extends DataPlugin<any, any>[], Meta>(
  plugins: Plugins
): Signal<Meta> {
  return computed(() => {
    return plugins.reduce(
      (acc, plugin) => ({ ...acc, ...plugin.meta() }),
      {} as Meta
    ) as Meta;
  });
}

function loadData<ResultData, Meta>(
  config: DataSourceConfig<Meta, ResultData>,
  initialData: ReturnType<typeof signal>,
  meta: Signal<Meta>
) {
  effect(
    (onCleanup) => {
      const loadSub = config.provider.load(meta()).subscribe({
        next: (result) => {
          initialData.set(result);
        }
      });
      onCleanup(() => {
        loadSub.unsubscribe();
      });
    },
    { allowSignalWrites: true }
  );
}

function applyPluginsToData<ResultData, Meta>(
  initialData: Signal<ResultData[]>,
  meta: Signal<Meta>,
  plugins: DataPlugin<any, any>[]
) {
  return computed(() => {
    return plugins.reduce((result, plugin) => plugin.apply(result, meta()), initialData());
  });
}
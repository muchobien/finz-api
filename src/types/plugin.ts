export type PluginConfig<T = {}> = {
  prefix?: string;
  name?: string;
  dependencies?: string[];
} & T;

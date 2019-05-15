declare namespace createStore {
  export type Dispatch = (event: PropertyKey, data?: unknown) => void;

  export interface Store<State = unknown> {
    readonly on: (
      event: PropertyKey,
      handler: (state: Readonly<State>, data: any
    ) => Partial<State> | Promise<void> | null) => () => void;
    readonly dispatch: Dispatch;
    readonly get: () => State;
  }

  export type Module<State> = (store: Store<State>) => void;
}

declare namespace StoreonLocalStorage {
  export interface Config {
    key?: string;
  }
}

/**
 * Storeon module to persist state to local storage
 *
 * @param {String[]} paths The keys of state object
 *    that will be store in local storage
 * @param {Config} config The config object
 * @param {String} [config.key='storeon'] The default key
 *    to use in local storage
 */
declare function persistState<State>(
  paths?: string[],
  config?: StoreonLocalStorage.Config
): createStore.Module<State>;

export = persistState;

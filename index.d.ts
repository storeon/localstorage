import createStore from 'storeon';

declare namespace StoreonLocalStorage {
  export interface Config {
    key?: string;
  }
}

/**
 * Storeon module to persist state to local storage
 *
 * @param {String[]|RegExp[]} paths The keys of state object
 *    that will be store in local storage
 * @param {Config} config The config object
 * @param {String} [config.key='storeon'] The default key
 *    to use in local storage
 */
declare function persistState<State>(
  paths?: string[]|RegExp[],
  config?: StoreonLocalStorage.Config
): createStore.Module<State>;

export = persistState;

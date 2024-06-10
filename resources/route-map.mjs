import { Home } from "./session/borderControl.mjs";
class RouteMap {
  #routes;
  constructor() {
    this.#routes = new Map();
  }
  static ifLoggedIn = Home;
  /**
   * @param {object} routes
   */
  set secureRoutes(routes) {
    for (const [key, arr] of Object.entries(routes)) {
      this.#routes.set(key, [RouteMap.ifLoggedIn, ...arr]);
    }
  }
  /**
   * @param {object} routes
   */
  set insecureRoutes(routes) {
    for (const [key, arr] of Object.entries(routes)) {
      this.#routes.set(key, arr);
    }
  }
  /**
   * @param {string} routes
   */
  get(key) {
    return this.#routes.get(key);
  }
  /**
   * @param {array} keys
   * @param {array} fns
   */
  addCommonPrefix(keys, fns) {
    keys.forEach((key) => this.#routes.set(key, fns.concat(this.#routes.get(key))));
  }
  /**
   * @param {array} keys
   * @param {array} fns
   */
  addCommonSuffix(keys, fns) {
    keys.forEach((key) => this.#routes.set(key, this.#routes.get(key).concat(fns)));
  }
}

export { RouteMap };

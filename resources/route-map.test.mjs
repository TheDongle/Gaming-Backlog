import { expect, jest, test } from "@jest/globals";
import { ifLoggedIn } from "./session/borderControl.mjs";
import { RouteMap } from "./route-map.mjs";

describe("Route Map", () => {
  let routeMap;
  const secure = [{ Hello: ["do", "something"] }, { World: ["do", "something", "else"] }];
  const insecure = [{ Good: ["a", "thing"] }, { Bye: ["and", "another", "thing"] }];
  beforeAll(() => {
    routeMap = new RouteMap();
    routeMap.secureRoutes = Object.assign({}, ...secure);
    routeMap.insecureRoutes = Object.assign({}, ...insecure);
  });
  test("Initiated", () => {
    expect(routeMap).toBeInstanceOf(RouteMap);
  });
  test("Set + and Get Routes", () => {
    expect(routeMap.get("Hello")).toContain("do");
    expect(routeMap.get("Hello")).toContain("something");
    expect(routeMap.get("World")).toContain("else");
    expect(routeMap.get("Hello")).not.toContain("else");
  });
  test("Insecure Routes should contain set params", () => {
    expect(routeMap.get("Good")).toEqual(expect.arrayContaining(["a", "thing"]));
    expect(routeMap.get("Bye")).toEqual(expect.arrayContaining(["and", "another", "thing"]));
  });
  test("Secure routes should contain 'ifLoggedIn' function", () => {
    expect(routeMap.get("Hello")).toContain(ifLoggedIn);
    expect(routeMap.get("World")).toContain(ifLoggedIn);
  });
  test("'ifLoggedIn' should be at the start of array", () => {
    expect(routeMap.get("Hello")[0]).toBe(ifLoggedIn);
    expect(routeMap.get("World")[0]).toBe(ifLoggedIn);
  });
  test("Add Common Prefix", () => {
    routeMap.addCommonPrefix(["Good", "Bye"], ["Friends"]);
    expect(routeMap.get("Good")[0]).toBe("Friends")
    expect(routeMap.get("Bye")[0]).toBe("Friends")
  });
  test("Add Common Suffix", () => {
    routeMap.addCommonSuffix(["Good", "Bye"], ["Amigos"]);
    expect(routeMap.get("Good").at(-1)).toBe("Amigos")
    expect(routeMap.get("Bye").at(-1)).toBe("Amigos")
  });
});

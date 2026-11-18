import assert from "node:assert";

const runtimes = new WeakMap();

function isFunction(fn) {
  return typeof fn === "function";
}

export default function lastRun(fn, timeResolution) {
  assert(isFunction(fn), "Only functions can check lastRun");

  const time = runtimes.get(fn);

  if (time == null) {
    return;
  }

  const resolution = parseInt(timeResolution, 10) || 1;

  return time - (time % resolution);
}

export function capture(fn, timestamp) {
  assert(isFunction(fn), "Only functions can be captured");

  timestamp = timestamp || Date.now();

  runtimes.set(fn, timestamp);
}

export function release(fn) {
  assert(isFunction(fn), "Only functions can be captured");

  runtimes.delete(fn);
}

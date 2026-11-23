/** @type {WeakMap<Function, number>} */
const runtimes = new WeakMap();

/**
 * @param {unknown} fn
 * @param {string} operation
 */
function validateFn(fn, operation) {
  if (typeof fn !== "function") {
    throw new TypeError(`${operation} requires a function`);
  }
}
/**
 * Retrieve the last time a function was run.
 *
 * @param {Function} fn The function to inspect.
 * @param {string | number} [timeResolution] Resolution of returned timestamp.
 * @returns {number | undefined} Timestamp of the last time the function was captured.
 */
export default function lastRun(fn, timeResolution) {
  validateFn(fn, "lastRun");

  const time = runtimes.get(fn);

  if (time == null) {
    return;
  }
  const resolution = parseInt((timeResolution = "1"), 10) || 1;

  return time - (time % resolution);
}
/**
 * Stores a timestamp for the given function.
 *
 * @param {Function} fn The function to track.
 * @param {number} [timestamp] Override of current time.
 */
export function capture(fn, timestamp) {
  validateFn(fn, "capture");

  timestamp = timestamp || Date.now();

  runtimes.set(fn, timestamp);
}
/**
 * Drops a timestamp for the given function.
 *
 * @param {Function} fn The function to untrack.
 */
export function release(fn) {
  validateFn(fn, "release");

  runtimes.delete(fn);
}

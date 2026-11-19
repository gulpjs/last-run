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
 *  Retrieve the last time a function was run.
 *
 * @param {Function} fn The user-provided function.
 * @param {string | number} [timeResolution] resolution of returned timestamp.
 * @returns {number | undefined} timestamp of the last time the function was captured.
 */
export default function lastRun(fn, timeResolution) {
  validateFn(fn, "lastRun");

  const time = runtimes.get(fn);

  if (time == null) {
    return;
  }
  // @ts-expect-error - parseInt coerces its argument to a string
  const resolution = parseInt(timeResolution, 10) || 1;

  return time - (time % resolution);
}
/**
 * Capture timestamp of a function.
 *
 * @param {Function} fn The user-provided function.
 * @param {number} [timestamp] optional override of current time.
 * @returns {void}
 */
export function capture(fn, timestamp) {
  validateFn(fn, "capture");

  timestamp = timestamp || Date.now();

  runtimes.set(fn, timestamp);
}
/**
 * Remove a given function last run timestamp.
 *
 * @param {Function} fn The user-provided function.
 * @returns {void}
 */
export function release(fn) {
  validateFn(fn, "release");

  runtimes.delete(fn);
}

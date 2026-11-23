/** @type {WeakMap<Function, number>} */
const runtimes = new WeakMap();

/**
 * @param {unknown} fn The function to validate.
 * @param {string} operation The calling function's name for the error message.
 */
function validateFn(fn, operation) {
  if (typeof fn !== "function") {
    throw new TypeError(`${operation} requires a function`);
  }
}
/**
 * @param {unknown} timeResolution The timeResolution to parse.
 * @returns {number} The parsed and defaulted resolution.
 */
function parseTimeResolution(timeResolution) {
  if (typeof timeResolution === "number") {
    return timeResolution || 1;
  }

  if (typeof timeResolution === "string") {
    return parseInt(timeResolution, 10) || 1;
  }

  return 1;
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
  const resolution = parseTimeResolution(timeResolution);

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

/**
 *  Retrieve the last time a function was run.
 *
 * @param {Function} fn The user-provided function.
 * @param {string | number} [timeResolution] resolution of returned timestamp.
 * @returns {number | undefined} timestamp of the last time the function was captured.
 */
export default function lastRun(fn: Function, timeResolution?: string | number): number | undefined;
/**
 * Capture timestamp of a function.
 *
 * @param {Function} fn The user-provided function.
 * @param {number} [timestamp] optional override of current time.
 * @returns {void}
 */
export function capture(fn: Function, timestamp?: number): void;
/**
 * Remove a given function last run timestamp.
 *
 * @param {Function} fn The user-provided function.
 * @returns {void}
 */
export function release(fn: Function): void;
//# sourceMappingURL=index.d.ts.map
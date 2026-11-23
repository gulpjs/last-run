/**
 * Retrieve the last time a function was run.
 *
 * @param {Function} fn The function to inspect.
 * @param {string | number} [timeResolution] Resolution of returned timestamp.
 * @returns {number | undefined} Timestamp of the last time the function was captured.
 */
export default function lastRun(fn: Function, timeResolution?: string | number): number | undefined;
/**
 * Stores a timestamp for the given function.
 *
 * @param {Function} fn The function to track.
 * @param {number} [timestamp] Override of current time.
 */
export function capture(fn: Function, timestamp?: number): void;
/**
 * Drops a timestamp for the given function.
 *
 * @param {Function} fn The function to untrack.
 */
export function release(fn: Function): void;
//# sourceMappingURL=index.d.ts.map
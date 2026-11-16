"use strict";

const assert = require("assert");

const runtimes = new WeakMap();

function isFunction(fn) {
  return typeof fn === "function";
}

function lastRun(fn, timeResolution) {
  assert(isFunction(fn), "Only functions can check lastRun");

  let time = runtimes.get(fn);

  if (time == null) {
    return;
  }

  const resolution = parseInt(timeResolution, 10) || 1;

  return time - (time % resolution);
}

function capture(fn, timestamp) {
  assert(isFunction(fn), "Only functions can be captured");

  timestamp = timestamp || Date.now();

  runtimes.set(fn, timestamp);
}

function release(fn) {
  assert(isFunction(fn), "Only functions can be captured");

  runtimes.delete(fn);
}

lastRun.capture = capture;
lastRun.release = release;

module.exports = lastRun;

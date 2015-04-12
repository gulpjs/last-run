'use strict';

var assert = require('assert');

var WM = require('es6-weak-map');
var defaultResolution = require('default-resolution');

var nativeRegex = /[native code]/;

// workaround until https://github.com/medikoo/es6-weak-map/pull/4 is merged
function hasWeakMap(){
  return (global.WeakMap && nativeRegex.test(global.WeakMap.toString()));
}

// workaround until https://github.com/medikoo/es6-weak-map/pull/4 is merged
var runtimes = new (hasWeakMap() ? global.WeakMap : WM)();

function isFunction(fn){
  return (typeof fn === 'function');
}

function isExtensible(fn){
  if(hasWeakMap()){
    // native weakmap doesn't care about extensible
    return true;
  }

  return Object.isExtensible(fn);
}

function lastRun(fn, timeResolution){
  assert(isFunction(fn), 'Only functions can check lastRun');
  assert(isExtensible(fn), 'Only extensible functions can check lastRun');

  var time = runtimes.get(fn);

  if(time == null){
    return;
  }

  if(timeResolution == null){
    timeResolution = defaultResolution();
  } else {
    timeResolution = parseInt(timeResolution, 10);
  }

  if(timeResolution){
    return time - (time % timeResolution);
  }

  return time;
}

function capture(fn){
  assert(isFunction(fn), 'Only functions can be captured');
  assert(isExtensible(fn), 'Only extensible functions can be captured');

  runtimes.set(fn, Date.now());
}

function release(fn){
  assert(isFunction(fn), 'Only functions can be captured');
  assert(isExtensible(fn), 'Only extensible functions can be captured');

  runtimes.delete(fn);
}

lastRun.capture = capture;
lastRun.release = release;

module.exports = lastRun;

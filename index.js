'use strict';

var assert = require('assert');

var WM = require('es6-weak-map');
var hasNativeWeakmap = require('es6-weak-map/is-native-implemented');
var defaultResolution = require('default-resolution');

var runtimes = new WM();

function isFunction(fn){
  return (typeof fn === 'function');
}

function isExtensible(fn){
  if(hasNativeWeakmap){
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

lastRun.capture = capture;

module.exports = lastRun;

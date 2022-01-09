'use strict';

var expect = require('expect');

var lastRun = require('../');

describe('lastRun', function () {

  var since;

  beforeEach(function (done) {
    since = Date.now();
    done();
  });

  it('should record function capture time', function (done) {
    function test() { }

    var beforeRun = Date.now();

    lastRun.capture(test);

    var justRun = lastRun(test);
    var afterRun = Date.now();
    expect(justRun).toBeGreaterThanOrEqual(beforeRun);
    expect(justRun).toBeLessThanOrEqual(afterRun);
    done();
  });

  it('should accept a timestamp', function (done) {
    function test() { }

    lastRun.capture(test, since);

    expect(lastRun(test)).toEqual(since);
    done();
  });

  it('removes last run time with release method', function (done) {
    function test() { }

    var beforeRun = Date.now();

    lastRun.capture(test);

    var justRun = lastRun(test);
    var afterRun = Date.now();
    expect(justRun).toBeGreaterThanOrEqual(beforeRun);
    expect(justRun).toBeLessThanOrEqual(afterRun);

    lastRun.release(test);

    expect(lastRun(test)).toBeUndefined();
    done();
  });

  it('does not error on release if not captures', function (done) {
    function test() { }

    lastRun.release(test);

    expect(lastRun(test)).toBeUndefined();
    done();
  });

  it('should return undefined for a function not captured', function (done) {
    function test() { }

    expect(lastRun(test)).toBeUndefined();
    done();
  });

  it('should throw on non-functions', function (done) {
    function obj() {
      lastRun({});
    }

    function str() {
      lastRun('wat');
    }

    function num() {
      lastRun(1);
    }

    function undef() {
      lastRun(undefined);
    }

    function nul() {
      lastRun(null);
    }

    expect(obj).toThrow('Only functions can check lastRun');
    expect(str).toThrow('Only functions can check lastRun');
    expect(num).toThrow('Only functions can check lastRun');
    expect(undef).toThrow('Only functions can check lastRun');
    expect(nul).toThrow('Only functions can check lastRun');
    done();
  });

  it('works with anonymous functions', function (done) {
    var test = function () { };

    var beforeRun = Date.now();

    lastRun.capture(test);

    var justRun = lastRun(test);
    var afterRun = Date.now();
    expect(justRun).toBeGreaterThanOrEqual(beforeRun);
    expect(justRun).toBeLessThanOrEqual(afterRun);
    done();
  });

  it('should give time with 1s resolution', function (done) {
    var resolution = 1000; // 1s
    since = Date.now();
    since = since - (since % resolution);

    function test() { }
    lastRun.capture(test);

    expect(lastRun(test, resolution)).toEqual(since);
    done();
  });

  it('should accept a string for resolution', function (done) {
    var resolution = '1000'; // 1s
    since = Date.now();
    since = since - (since % 1000);

    function test() { }
    lastRun.capture(test);

    expect(lastRun(test, resolution)).toEqual(since);
    done();
  });

  it('should use default resolution when forced to 0ms resolution', function (done) {
    var resolution = 0;

    function test() { }
    lastRun.capture(test);

    expect(lastRun(test, resolution)).toEqual(since);
    done();
  });

});

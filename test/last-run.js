'use strict';

var expect = require('expect');

var defaultResolution = require('default-resolution');

var lastRun = require('../');

describe('lastRun', function() {

  var since;

  beforeEach(function(done) {
    since = Date.now();
    // Account for default resolution
    since = since - (since % defaultResolution());
    done();
  });

  it('should record function capture time', function(done) {
    function test() {}

    lastRun.capture(test);

    expect(lastRun(test)).toExist();
    expect(lastRun(test)).toBeLessThanOrEqualTo(Date.now());
    done();
  });

  it('should accept a timestamp', function(done) {
    function test() {}

    lastRun.capture(test, since);

    expect(lastRun(test)).toExist();
    expect(lastRun(test)).toEqual(since);
    done();
  });

  it('removes last run time with release method', function(done) {
    function test() {}

    lastRun.capture(test);

    expect(lastRun(test)).toExist();

    lastRun.release(test);

    expect(lastRun(test)).toNotExist();
    done();
  });

  it('does not error on release if not captures', function(done) {
    function test() {}

    lastRun.release(test);

    expect(lastRun(test)).toNotExist();
    done();
  });

  it('should return undefined for a function not captured', function(done) {
    function test() {}

    expect(lastRun(test)).toNotExist();
    done();
  });

  it('should throw on non-functions', function(done) {
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

  it('works with anonymous functions', function(done) {
    var test = function() {};

    lastRun.capture(test);

    expect(lastRun(test)).toExist();
    expect(lastRun(test)).toBeLessThanOrEqualTo(Date.now());
    done();
  });

  it('should give time with 1s resolution', function(done) {
    var resolution = 1000; // 1s
    since = Date.now();
    since = since - (since % resolution);

    function test() {}
    lastRun.capture(test);

    expect(lastRun(test, resolution)).toEqual(since);
    done();
  });

  it('should accept a string for resolution', function(done) {
    var resolution = '1000'; // 1s
    since = Date.now();
    since = since - (since % 1000);

    function test() {}
    lastRun.capture(test);

    expect(lastRun(test, resolution)).toEqual(since);
    done();
  });

  it('should use default resolution when forced to 0ms resolution', function(done) {
    var resolution = 0;

    function test() {}
    lastRun.capture(test);

    expect(lastRun(test, resolution)).toEqual(since);
    done();
  });

  it('throws on non-enumerable functions when using weakmap shim', function(done) {

    function extensions() {
      var test = function() {};
      Object.preventExtensions(test);
      lastRun.capture(test);
    }

    function seal() {
      var test = function() {};
      Object.seal(test);
      lastRun.capture(test);
    }

    function freeze() {
      var test = function() {};
      Object.freeze(test);
      lastRun.capture(test);
    }

    if (/v0.10/.test(process.version)) {
      expect(extensions).toThrow('Only extensible functions can be captured');
      expect(seal).toThrow('Only extensible functions can be captured');
      expect(freeze).toThrow('Only extensible functions can be captured');
    } else {
      expect(extensions).toNotThrow();
      expect(seal).toNotThrow();
      expect(freeze).toNotThrow();
    }
    done();
  });

});

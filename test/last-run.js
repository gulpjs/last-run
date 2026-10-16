"use strict";

var assert = require("node:assert");
var { beforeEach, describe, it } = require("node:test");

var lastRun = require("../");

describe("lastRun", function () {
  var since;

  beforeEach(function () {
    since = Date.now();
  });

  it("should record function capture time", function () {
    function test() {}

    var beforeRun = Date.now();

    lastRun.capture(test);

    var afterRun = Date.now();
    assert.ok(lastRun(test) >= beforeRun);
    assert.ok(lastRun(test) <= afterRun);
  });

  it("should accept a timestamp", function () {
    function test() {}

    lastRun.capture(test, since);
    assert.deepStrictEqual(lastRun(test), since);
  });

  it("removes last run time with release method", function () {
    function test() {}

    var beforeRun = Date.now();

    lastRun.capture(test);

    var afterRun = Date.now();

    assert.ok(lastRun(test) >= beforeRun);
    assert.ok(lastRun(test) <= afterRun);

    lastRun.release(test);

    assert.deepStrictEqual(lastRun.release(test), undefined);
  });

  it("does not error on release if not captures", function () {
    function test() {}

    lastRun.release(test);

    assert.deepStrictEqual(lastRun(test), undefined);
  });

  it("should return undefined for a function not captured", function () {
    function test() {}

    assert.deepStrictEqual(lastRun(test), undefined);
  });

  it("should throw on non-functions", function () {
    function obj() {
      lastRun({});
    }

    function str() {
      lastRun("wat");
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

    assert.throws(obj, {
      name: "AssertionError",
      code: "ERR_ASSERTION",
      message: "Only functions can check lastRun",
    });

    assert.throws(str, {
      name: "AssertionError",
      code: "ERR_ASSERTION",
      message: "Only functions can check lastRun",
    });

    assert.throws(num, {
      name: "AssertionError",
      code: "ERR_ASSERTION",
      message: "Only functions can check lastRun",
    });

    assert.throws(undef, {
      name: "AssertionError",
      code: "ERR_ASSERTION",
      message: "Only functions can check lastRun",
    });

    assert.throws(nul, {
      name: "AssertionError",
      code: "ERR_ASSERTION",
      message: "Only functions can check lastRun",
    });
  });

  it("works with anonymous functions", function () {
    var test = function () {};

    var beforeRun = Date.now();

    lastRun.capture(test);

    var justRun = lastRun(test);
    var afterRun = Date.now();
    assert.ok(justRun >= beforeRun);
    assert.ok(justRun <= afterRun);
  });

  it("should give time with 1s resolution", function () {
    var resolution = 1000; // 1s
    since = Date.now();
    since = since - (since % resolution);

    function test() {}
    lastRun.capture(test);

    assert.deepStrictEqual(lastRun(test, resolution), since);
  });

  it("should accept a string for resolution", function () {
    var resolution = "1000"; // 1s
    since = Date.now();
    since = since - (since % 1000);

    function test() {}
    lastRun.capture(test);
    var result = lastRun(test, resolution);

    assert.deepStrictEqual(result, since);
  });

  it("should use default resolution when forced to 0ms resolution", function () {
    var resolution = 0;

    function test() {}
    lastRun.capture(test);

    assert.ok(lastRun(test, resolution) >= since);
  });
});

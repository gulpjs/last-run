import assert from "node:assert";
import { beforeEach, describe, it } from "node:test";

import lastRun, { capture, release } from "../index.js";

describe("capture", function () {
  it("rejects non-functions", function () {
    for (const value of [{}, "wat", 1, undefined, null]) {
      assert.throws(() => capture(value), {
        name: "TypeError",
        message: "capture requires a function",
      });
    }
  });

  it("should record function capture time", function () {
    function test() {}

    const beforeRun = Date.now();

    capture(test);

    const afterRun = Date.now();
    assert.ok(lastRun(test) >= beforeRun);
    assert.ok(lastRun(test) <= afterRun);
  });

  it("should accept a timestamp", function () {
    function test() {}
    capture(test, 1234567);
    assert.deepStrictEqual(lastRun(test), 1234567);
  });
});

describe("lastRun", function () {
  let since;

  beforeEach(function () {
    since = Date.now();
  });

  it("rejects non-functions", function () {
    for (const value of [{}, "wat", 1, undefined, null]) {
      assert.throws(() => capture(value), {
        name: "TypeError",
        message: "capture requires a function",
      });
    }
  });

  it("should return undefined for a function not captured", function () {
    function test() {}

    assert.deepStrictEqual(lastRun(test), undefined);
  });

  it("rejects non-functions", function () {
    for (const value of [{}, "wat", 1, undefined, null]) {
      assert.throws(() => lastRun(value), {
        name: "TypeError",
        message: "lastRun requires a function",
      });
    }
  });

  it("works with anonymous functions", function () {
    const test = function () {};

    const beforeRun = Date.now();

    capture(test);

    const justRun = lastRun(test);
    const afterRun = Date.now();
    assert.ok(justRun >= beforeRun);
    assert.ok(justRun <= afterRun);
  });

  it("should give time with 1s resolution", function () {
    const resolution = 1000; // 1s
    since = Date.now();
    since = since - (since % resolution);

    function test() {}
    capture(test);

    assert.deepStrictEqual(lastRun(test, resolution), since);
  });

  it("should accept a string for resolution", function () {
    const resolution = "1000"; // 1s
    since = Date.now();
    since = since - (since % 1000);

    function test() {}
    capture(test);
    const result = lastRun(test, resolution);

    assert.deepStrictEqual(result, since);
  });

  it("should use default resolution when forced to 0ms resolution", function () {
    const resolution = 0;

    function test() {}
    capture(test);

    assert.ok(lastRun(test, resolution) >= since);
  });

  it("should use default resolution when given a unparsable resolution", function () {
    const resolution = "a";

    function test() {}
    capture(test);

    assert.ok(lastRun(test, resolution) >= since);
  });
});

describe("release", function () {
  it("rejects non-functions", function () {
    for (const value of [{}, "wat", 1, undefined, null]) {
      assert.throws(() => release(value), {
        name: "TypeError",
        message: "release requires a function",
      });
    }
  });

  it("removes last run time with release method", function () {
    function test() {}

    const beforeRun = Date.now();

    capture(test);

    const afterRun = Date.now();

    assert.ok(lastRun(test) >= beforeRun);
    assert.ok(lastRun(test) <= afterRun);

    release(test);

    assert.deepStrictEqual(release(test), undefined);
  });

  it("does not error on release if not captures", function () {
    function test() {}

    release(test);

    assert.deepStrictEqual(lastRun(test), undefined);
  });
});

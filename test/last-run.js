'use strict';

var lab = exports.lab = require('lab').script();
var code = require('code');

var lastRun = require('../');

lab.describe('lastRun', function() {

  lab.it('should record function capture time', function(done){
    function test(){}

    var since = Date.now();
    lastRun.capture(test);

    code.expect(lastRun(test)).to.exist();
    code.expect(lastRun(test)).to.be.within(since, Date.now());
    done();
  });

  lab.it('should accept a timestamp', function(done){
    function test(){}

    var since = Date.now() - 5000;
    lastRun.capture(test, since);

    code.expect(lastRun(test)).to.exist();
    code.expect(lastRun(test)).to.equal(since);
    done();
  });

  lab.it('removes last run time with release method', function(done){
    function test(){}

    lastRun.capture(test);

    code.expect(lastRun(test)).to.exist();

    lastRun.release(test);

    code.expect(lastRun(test)).to.not.exist();
    done();
  });

  lab.it('does not error on release if not captures', function(done){
    function test(){}

    lastRun.release(test);

    code.expect(lastRun(test)).to.not.exist();
    done();
  });

  lab.it('should return undefined for a function not captured', function(done){
    function test(){}

    code.expect(lastRun(test)).to.not.exist();
    done();
  });

  lab.it('should throw on non-functions', function(done){
    function obj(){
      lastRun({});
    }

    function str(){
      lastRun('wat');
    }

    function num(){
      lastRun(1);
    }

    function undef(){
      lastRun(undefined);
    }

    function nul(){
      lastRun(null);
    }

    code.expect(obj).to.throw('Only functions can check lastRun');
    code.expect(str).to.throw('Only functions can check lastRun');
    code.expect(num).to.throw('Only functions can check lastRun');
    code.expect(undef).to.throw('Only functions can check lastRun');
    code.expect(nul).to.throw('Only functions can check lastRun');
    done();
  });

  lab.it('works with anonymous functions', function(done){
    var test = function(){};

    var since = Date.now();
    lastRun.capture(test);

    code.expect(lastRun(test)).to.exist();
    code.expect(lastRun(test)).to.be.within(since, Date.now());
    done();
  });

  lab.it('should give time with 1s resolution', function(done){
    var resolution = 1000; // 1s
    var since = Date.now();
    var expected = since - (since % resolution);

    function test(){}
    lastRun.capture(test);

    code.expect(lastRun(test, resolution)).to.equal(expected);
    done();
  });

  lab.it('should accept a string for resolution', function(done){
    var resolution = '1000'; // 1s
    var since = Date.now();
    var expected = since - (since % resolution);

    function test(){}
    lastRun.capture(test);

    code.expect(lastRun(test, resolution)).to.equal(expected);
    done();
  });

  lab.it('throws on non-enumerable functions when using weakmap shim', function(done){

    function extensions(){
      var test = function(){};
      Object.preventExtensions(test);
      lastRun.capture(test);
    }

    function seal(){
      var test = function(){};
      Object.seal(test);
      lastRun.capture(test);
    }

    function freeze(){
      var test = function(){};
      Object.freeze(test);
      lastRun.capture(test);
    }

    if(/v0.10/.test(process.version)){
      code.expect(extensions).to.throw('Only extensible functions can be captured');
      code.expect(seal).to.throw('Only extensible functions can be captured');
      code.expect(freeze).to.throw('Only extensible functions can be captured');
    } else {
      code.expect(extensions).to.not.throw();
      code.expect(seal).to.not.throw();
      code.expect(freeze).to.not.throw();
    }
    done();
  });

});

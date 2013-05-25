
var promisify = require('../');

var tests = 8;

function pass(){
  --tests || console.log('all pass');
}

function assert(expr){
  if (!expr) throw new Error('failed');
}

function add(a, b, cb){
  setTimeout(function(){
    try {
      if ('number' != typeof a) throw new TypeError('expecting a number');
      if ('number' != typeof b) throw new TypeError('expecting a number');
      cb(null, a+b);
    }
    catch(err) {
      cb(err);
    }
  }, 0);
}

var _add = promisify(add);

add('1', 5, function(err, res){
  assert(err instanceof TypeError);
  pass();
});

add(2, 4, function(err, res){
  assert(6===res);
  pass();
});


_add('1', 5, function(err, res){
  assert(err instanceof TypeError);
  pass();
});

_add(2,4).when(function(err, res){
  assert(6===res);
  pass();
});

_add(_add(2,3),4).when(function(err, res){
  assert(9===res);
  pass();
});

_add(_add(2,3),'4').when(function(err, res){
  assert(err instanceof TypeError);
  pass();
});

_add(_add(2,'3'),4).when(function(err, res){
  assert(err instanceof TypeError);
  pass();
});

var math = {};
math.scale = 1.5;
math.add = add;
math.mul = function(a, b, cb){
  cb(null, a*b*this.scale);
};

var p = promisify(math);
p.mul(p.add(1, 2), 2).when(function(err, res){
  assert(9===res);
  pass();
});


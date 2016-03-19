'use strict';
var _ = require('underscore');

exports.getTerms = function (query) {
  return exports.getParsedObjects(query).bind(this, function (key, value) {
    var result = {};
    result.term = {};
    result.term[key] = value;
    return result;
  });
};

exports.getParsedObjects = function (query) {
  return function (funcKV, possible) {
    return _.reduce(exports.filterOutKeysFromObj(query, function (qPair) {
      return (possible.indexOf(qPair[0]) > -1);
    }), function (memo, value) {
      if (funcKV && value) {
        memo.push(funcKV(value.key, value.value));
      }
      return memo;
    }
    , []);
  };
};

exports.filterOutKeysFromObj = function (obj, filterAsPair) {
  return _.chain(obj)
    .pairs()
    .filter(filterAsPair)
    .reduce(function (memo, value) {
      memo[value[0]] = value[1];
      return memo;
    }, {})
    .value();
};

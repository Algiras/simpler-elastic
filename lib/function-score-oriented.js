'use strict';
var _ = require('underscore');

exports.createSearchFuncCollection = function (query) {
  return function () {
    var result = {};
    _.each(arguments, function (value) {
      var keyValue = query[value.prop];
      if (!_.isUndefined(keyValue)) {
        result[keyValue.key] = {
          origin: keyValue.value,
          scale: value.scale,
          offset: value.offset,
          decay: value.decay
        };
      }
    });
    return result;
  };
};

exports.filterOutUselessQueries = function (possible) {
  return function () {
    return _.chain(Array.prototype.slice.call(arguments)).filter(function (value) {
      return _.intersection(value.using, possible).length === value.using.length;
    }).map(function (value) {
      delete value.using;
      return value;
    }).value();
  };
};

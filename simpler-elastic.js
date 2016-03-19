'use strict';
var _ = require('underscore');
var functionScoreOriented = require('./lib/function-score-oriented');
var queryOriented = require('./lib/query-oriented');

var transformQuery = function (query, map) {
  var queryMap = {};
  _.each(query, function (value, key) {
    queryMap[key] = {
      key: map[key],
      value: value
    };
  });

  return {
    getTerms: queryOriented.getTerms(queryMap),
    filterQuery: functionScoreOriented.filterOutUselessQueries(Object.keys(query)),
    mapCreatedFuncCollection: functionScoreOriented.createSearchFuncCollection(queryMap),
    getParsedObjects: queryOriented.getParsedObjects(queryMap),
    value: queryMap
  };
};

module.exports = {
  transformQuery: transformQuery,
  getTerms: queryOriented.getTerms,
  filterQuery: functionScoreOriented.filterOutUselessQueries,
  mapCreatedFuncCollection: functionScoreOriented.createSearchFuncCollection,
  getParsedObjects: queryOriented.getParsedObjects
};

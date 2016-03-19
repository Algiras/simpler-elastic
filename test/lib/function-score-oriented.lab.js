/*eslint sort-vars:0*/
'use strict';

var Code = require('code');
var Lab = require('lab');
var lab = exports.lab = Lab.script();
var functionScoreOriented = require('../../lib/function-score-oriented');

var suite = lab.suite;
var test = lab.test;
var expect = Code.expect;

suite('Function Score Oriented', function () {
  suite('createSearchFuncCollection', function () {
    var createSearchFuncCollection = functionScoreOriented.createSearchFuncCollection;

    test('should return a function that you can pass any number of arguments and it returns function_score object',
      function (done) {
        var prop = {
            key: 'awesome',
            value: 1
          },
          scale = 2,
          offset = 21,
          decay = 0.33,
          query = {
            'awesome': prop
          };

        var mappedSearchFunc = createSearchFuncCollection(query);
        var searchFunc = mappedSearchFunc(
          {prop: 'awesome', scale: scale, offset: offset, decay: decay},
          {prop: 'shouldNotBeHere', scale: 0, offset: 0, decay: 0});
        var testCase = {};
        testCase[prop.key] = {
          origin: prop.value,
          scale: scale,
          offset: offset,
          decay: decay
        };
        expect(testCase).to.deep.equal(searchFunc);
        done();
      }
    );
  });

  suite('filterOutUselessQueries', function () {
    var filterOutUselessQueries = functionScoreOriented.filterOutUselessQueries;
    test('should remove useless queries(that don\'t have sufficient params)', function (done) {
      var clean = filterOutUselessQueries(['make']);
      var result = clean(
        {using: ['make']}, //, offset : 0, decay : 0},
        {using: ['awesome']} //, offset : 0, decay : 0},
      );

      expect(result.length).to.equal(1);

      done();
    });
  });
});

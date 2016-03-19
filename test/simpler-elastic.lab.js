/*eslint sort-vars:0*/
'use strict';

var Code = require('code');
var Lab = require('lab');
var lab = exports.lab = Lab.script();
var simplerElastic = require('../simpler-elastic');

var suite = lab.suite;
var test = lab.test;
//var before = lab.before;
//var after = lab.after;
var expect = Code.expect;

suite('Simpler Elastic', function () {
  suite('Transform Query', function () {
    var transformQuery = simplerElastic.transformQuery;

    test('should transform query to key value object with new mapped key inside as key and value as value', function (done) {
      var query = {
        a: 1,
        b: 2
      };

      var map = {
        a: 'alfa',
        b: 'beta'
      };

      var result = transformQuery(query, map);
      var testCase = {
        a: {
          key: 'alfa',
          value: 1
        },
        b: {
          key: 'beta',
          value: 2
        }
      };

      expect(testCase).to.be.deep.equal(result.value);
      done();
    });
  });
});

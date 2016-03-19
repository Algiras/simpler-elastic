/*eslint sort-vars:0*/
'use strict';

var Code = require('code');
var Lab = require('lab');
var lab = exports.lab = Lab.script();
var queryOriented = require('../../lib/query-oriented');

var suite = lab.suite;
var test = lab.test;
var expect = Code.expect;

suite('Query Oriented', function () {
  suite('getParsedObjects', function () {
    var getParsedObjects = queryOriented.getParsedObjects;

    test('Create parsed Objects object for filtered search', function (done) {
      var query = {
          a: {
            key: 'a',
            value: Math.random()
          },
          b: {
            key: 'b',
            value: Math.random()
          }
        },
        possible = ['b'];

      var termFunc = function (key, value) {
        var result = {};
        result.term = {};
        result.term[key] = value;
        return result;

      };
      var terms = getParsedObjects(query)(termFunc, possible);
      var testCase = [
        {
          term: {
            'b': query.b.value
          }
        }
      ];

      var noFuncParse = getParsedObjects(query)(null, possible);
      var noQueryParse = getParsedObjects()(termFunc, possible);

      expect(testCase).to.deep.equal(terms);
      expect([]).to.deep.equal(noFuncParse);
      expect([]).to.deep.equal(noQueryParse);

      done();
    });
  });

  suite('filterOutKeysFromObj', function () {
    var filterOutKeysFromObj = queryOriented.filterOutKeysFromObj;

    test('Filter out keys that don\'t match filter function', function (done) {

      var obj = {
        a: 1,
        b: 2
      };

      var filter = function (keyValueArray) {
        //var key = keyValueArray[0]; // leave it for reference of use
        var value = keyValueArray[1];

        return value > 1;
      };

      var filteredObj = filterOutKeysFromObj(obj, filter);
      var testCase = {
        b: 2
      };

      expect(testCase).to.deep.equal(filteredObj);

      done();
    });
  });

  suite('getTerms', function () {
    var getTerms = queryOriented.getTerms;
    test('Create parsed Objects object for filtered search', function (done) {
      var query = {
          a: {
            key: 'a',
            value: Math.random()
          },
          b: {
            key: 'b',
            value: Math.random()
          }
        },
        possible = ['b'];

      var terms = getTerms(query)(possible);
      var testCase = [
        {
          term: {
            'b': query.b.value
          }
        }
      ];

      expect(testCase).to.deep.equal(terms);

      done();
    });

  });
});

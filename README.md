Simpler-elastic
=============
Library created to simplify work with Elasticsearch Queries.

```sh
npm install # to get all the dependencies
npm install --global gulp # if you don't have gulp globally installed
gulp # to start automatic watching/linting/testing
```

##Task List
* Create automatic Doc generation
* Provide more comments supporting JsDoc guidelines
* Add more functionality like [getRange](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-range-query.html), [query_string](https://www.elastic.co/guide/en/elasticsearch/reference/1.6/query-dsl-query-string-query.html) and many more...

##Usage
* `transformQuery` is used to *prepare* data to be used with current library. You can think of it as **_.chain()** in [***underscore***](http://underscorejs.org/#chaining).
    * **Prerequisites**:
        * Query from your api that looks like:
        ```javascript
        { id : 1, name : 'AK' }
        ```
        * Map for your query:
        ```javascript
        { id : 'boat.id', name : 'seller.name' }
        ```
    * **Result**:
    ```javascript
    {
        getTerms : [Function],
        filterQuery : [Function],
        mapCreatedFuncCollection : [Function],
        value : { id : { key : 'boat.id', value : 1 }, name : { key : 'seller.name', value : 'AK'}} 
    }
    ```
    
* `getTerms` is used to extract terms from a **transformed Query** Object. The main reason for having it is to remove the *copy/paste* code for escaping properties that aren't there and focus on writing a *good looking* **Query**.
    * **Prerequisites**:
        * transformedQuery from `transformQuery` Function. You can chain it, because it's already in object that `transformQuery` returns, or you can extract it using '.value' syntax. (You should use API names so the query would be easily readable)
        * Query parameters in an **Array**
        ```javascript
        ['id', 'name', 'willNotBeAdded']
        ```
    * **Result**:
    ```javascript
        [
            { term : { 'boat.id' : 1}},
            { term : { 'seller.name' : 'AK'}}
        ]
    ```
    * **Example Query usage**:
    ```javascript
    var transQuery = transformQuery(query, articleToElasticMap);
    var query = {
        "bool" : {
            "must" : transQuery.getTerms(["id"]),
            "must_not" : transQuery.getTerms(["seller.name"])
        }
    };
    ```
    
* `filterQuery` is used when using **function_score** functionality in **Elastic search** and you don't want to get **errors** on queries that are missing parameters from the API.
    * **Prerequisites**:
        * First call (if you're not chaining)
            * Array of properties that can be used
            ```javascript
                ['name`]
            ```
        * Last call
            * Any number of arguments in following format:
            ```javsacript
                { anyNameParams : '2' using : ['name']},
                { anyNameParams : '3' using : ['notName']},
            ```
    * **Result**:
    ```javascript
        [
            { anyNameParams : '2'}
        ]
    ```
    * **Example Query usage**:
    ```javascript
    var transQuery = transformQuery(query, articleToElasticMap);
    var query = {
        functions : transQuery.filterQuery(
        {
                /* Name */
                filter: {
                  bool: {
                    must: transQuery.getTerms(['name'])
                  }
                },
                using: ['name'],
                weight: 14
              }
        )
    };
    ```    

* `mapCreatedFuncCollection` is used when you need to create [**Function_score**](https://www.elastic.co/guide/en/elasticsearch/reference/1.6/query-dsl-function-score-query.html) decay functions.
    * **Prerequisites**:
        * First call (if you're not chaining) is transformQuery. If you use chaining you can skip this.
        * Last call
            * Any number of arguments in following format:
            ```javsacript
                {
                    prop: 'year',
                    scale: 3,
                    decay: 0.1,
                    offset : 0
                }
            ```
    * **Result**:
    ```javascript
        {
            year : {
                origin : 1970 // Value of the year property from API
                scale: 3,
                decay: 0.1,
                offset : 0
            }
        }
    ```
    * **Example Query usage**:
    ```javascript
    var transQuery = transformQuery(query, articleToElasticMap);
    var query = {
        functions: filterQuery(
              {
                /* Make/Model/ModelYear/Length ±10% */
                filter: {
                  bool: {
                    must: transQuery.getTerms(['year', 'make', 'model'])
                  }
                },
                gauss: transQuery.mapCreatedFuncCollection(
                    {
                      prop: 'boatLength',
                      scale: tenthOfLength,
                      decay: 0.5
                    }
                ),
                using: ['make', 'model', 'year', 'boatLength'],
                weight: 13
              },
    };
    ```
    
* `getParsedObjects` is used when you want something that is like `getTerms`, but with a bit different object structure. 
    * **Prerequisites**:
        * transformedQuery from `transformQuery` Function. You can chain it, because it's already in object that `transformQuery` returns, or you can extract it using '.value' syntax. (You should use API names so the query would be easily readable)
        * Query parameters in an **Array**
        ```javascript
        // transform function
        function (key, value) {
              var result = {};
              result.term = {};
              result.term[key] = value;
              return result;
        }
        //possible keys
        ['id', 'name', 'willNotBeAdded']
        ```
    * **Result**:
    ```javascript
        [
            { term : { 'boat.id' : 1}},
            { term : { 'seller.name' : 'AK'}}
        ]
    ```
    * **Example Query usage**:
    ```javascript
    var transQuery = transformQuery(query, articleToElasticMap);
    var getTerms = transQuery.getParsedObjects.bind(this, function (key, value) {
          var result = {};
          result.term = {};
          result.term[key] = value;
          return result;
    });
    var query = {
        "bool" : {
            "must" : getTerms(["id"]),
            "must_not" : getTerms(["seller.name"])
        }
    };
    ```

'use strict';

/**
 * @ngdoc service
 * @name ts5App.itemsFactory
 * @description
 * # itemsFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('itemsFactory', function ($resource, baseUrl) {

    // API URL
    var url = baseUrl + '/api/retail-items1';

    return $resource(url, {}, {
          query: { 
            method:'GET', 
            isArray:false
          }
    }); 

  });

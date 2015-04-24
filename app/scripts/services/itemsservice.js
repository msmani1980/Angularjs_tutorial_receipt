'use strict';

/**
 * @ngdoc service
 * @name ts5App.itemsService
 * @description
 * # itemsService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('itemsService', function ($resource,baseUrl) {

    // API URL
    var url = baseUrl + '/api/retail-items1';

    return $resource(url, {}, {
          query: { 
            method:'GET', 
            isArray:false
          }
    }); 

  });

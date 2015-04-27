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

    // Returns the $resource with a specific URL 
    function returnResource(url, isArray) {

      var resourceURL = baseUrl + url;

      return $resource(resourceURL, {}, {
          query: { 
            method:'GET', 
            isArray:isArray
          }
        });

    } 

    return {
      items: returnResource('/api/retail-items1'),
      itemTypes: returnResource('/api/records/item-types', true),
      characteristics: returnResource('/api/records/characteristics', true),
      allergens: returnResource('/api/records/allergens', true)
    };

  });
    

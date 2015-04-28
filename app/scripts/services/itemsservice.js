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

    // Public API

    // example: itemService.items.query(function(){ .. })
    // example: itemService.units.weight.query(function(){ .. })

    return {
      items: returnResource('/api/retail-items1'),
      itemTypes: returnResource('/api/records/item-types', true),
      characteristics: returnResource('/api/records/characteristics', true),
      allergens: returnResource('/api/records/allergens', true),
      priceTypes: returnResource('/api/records/price-types', true),
      units: {
        dimension: returnResource('/api/units?unitType=dimension'),
        weight: returnResource('/api/units?unitType=weight'),
        volume: returnResource('/api/units?unitType=volume')
      }
    };

  });
    

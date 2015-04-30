'use strict';

/**
 * @ngdoc service
 * @name ts5App.itemsFactory
 * @description
 * # itemsFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('itemsFactory', function ($resource, baseUrl, itemsService) {

  	// just returns the service for now, we don't have anything to extend yet.
    return itemsService;

  });

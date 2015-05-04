'use strict';

/**
 * @ngdoc service
 * @name ts5App.itemTypesService
 * @description
 * # itemTypes
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('itemTypesService', function ($resource,baseUrl) {

  var resourceURL = baseUrl + '/api/records/item-types';

  var endpoint = $resource(resourceURL, {}, {
      query: { 
        method:'GET', 
        isArray:true
      } 
  });

  // Get a list of item types
  var getItemTypes = function(successCallBack,failureCallBack) {
  	console.log(successCallBack);
 	return endpoint.query(successCallBack,failureCallBack);

  };

  // Public API
  return {
  	getItemTypes: getItemTypes,
  };

});
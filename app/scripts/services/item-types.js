'use strict';

/**
 * @ngdoc service
 * @name ts5App.itemTypesService
 * @description
 * # itemTypesService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('itemTypesService', function ($resource, baseUrl) {

    var requestURL = baseUrl + '/api/records/item-types/:id';
    var requestParameters = {
      id: '@id'
    };

    var actions = {
      getItemTypesList: {
        method: 'GET',
        isArray: true
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    var getItemTypesList = function (payload) {
      return requestResource.getItemTypesList(payload).$promise;
    };

    return {
      getItemTypesList: getItemTypesList
    };

});
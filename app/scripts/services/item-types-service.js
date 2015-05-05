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

    var requestURL = baseUrl + '/api/records/item-types/:id';
    var requestParameters = {
      id: '@id',
      limit: 50
    };

    var actions = {
      getItemTypesList: {
        method: 'GET'
      },
      getItemType: {
        method: 'GET'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    var getItemTypesList = function (payload) {
      return requestResource.getItemTypesList(payload).$promise;
    };

    var getItemType = function (menuId) {
      return requestResource.getItemType({id: menuId}).$promise;
    };

    return {
      getItemTypesList: getItemTypesList,
      getItemType: getItemType
    };

});
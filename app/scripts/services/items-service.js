'use strict';

/**
 * @ngdoc service
 * @name ts5App.itemsService
 * @description
 * # itemsService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('itemsService', function ($resource, ENV) {

    var requestURL = ENV.apiUrl + '/api/retail-items/:fetchFromMaster/:id';
    var requestParameters = {
      id: '@id',
      limit: 50
    };

    var actions = {
      getItemsList: {
        method: 'GET'
      },
      getItem: {
        method: 'GET'
      },
      createItem: {
        method: 'POST'
      },
      updateItem: {
        method: 'PUT'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    var getItemsList = function (searchParameters, fetchFromMaster) {
      searchParameters.fetchFromMaster = fetchFromMaster ? 'master' : null;
      var payload = {};
      angular.extend(payload, searchParameters);
      return requestResource.getItemsList(payload).$promise;
    };

    var getItem = function (id) {
      return requestResource.getItem({id: id}).$promise;
    };

    var createItem = function (payload) {
      return requestResource.createItem(payload).$promise;
    };

    var updateItem = function (payload) {
      return requestResource.updateItem(payload).$promise;
    };

    return {
      getItemsList: getItemsList,
      getItem: getItem,
      createItem: createItem,
      updateItem: updateItem
    };

  });

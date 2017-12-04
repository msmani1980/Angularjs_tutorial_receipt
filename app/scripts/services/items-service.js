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

    var requestURL = ENV.apiUrl + '/rsvr/api/retail-items/:fetchFromMaster/:id';
    var requestParameters = {
      id: '@id'
    };

    var actions = {
      getItemsList: {
        method: 'GET',
        headers: {}
      },
      getItem: {
        method: 'GET'
      },
      createItem: {
        method: 'POST'
      },
      updateItem: {
        method: 'PUT'
      },
      removeItem: {
        method: 'DELETE'
      },
      getItemsByCateringStationId: {
        method: 'GET'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    var getItemsList = function (searchParameters, fetchFromMaster) {
      var _requestResource = requestResource;
      actions.getItemsList.headers = {};
      if (angular.isDefined(searchParameters.companyId)) {
        actions.getItemsList.headers = { companyId: searchParameters.companyId };
        _requestResource = $resource(requestURL, requestParameters, actions);
      }

      searchParameters.fetchFromMaster = fetchFromMaster ? 'master' : null;
      if (angular.isDefined(searchParameters.categoryId)) {
        searchParameters.categoryId = searchParameters.categoryId;  
      }

      var payload = {};
      angular.extend(payload, searchParameters);
      return _requestResource.getItemsList(payload).$promise;
    };

    var getItem = function (id) {
      return requestResource.getItem({ id: id }).$promise;
    };

    var getMasterItem = function (id) {
      var payload = {
        fetchFromMaster: 'master',
        id: id
      };
      return requestResource.getItem(payload).$promise;
    };

    var createItem = function (payload) {
      return requestResource.createItem(payload).$promise;
    };

    var updateItem = function (id, payload) {
      return requestResource.updateItem({ id: id }, payload).$promise;
    };

    var removeItem = function (id) {
      return requestResource.removeItem({ id: id }).$promise;
    };

    return {
      getItemsList: getItemsList,
      getItem: getItem,
      getMasterItem: getMasterItem,
      createItem: createItem,
      updateItem: updateItem,
      removeItem: removeItem
    };

  });

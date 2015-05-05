'use strict';

/**
 * @ngdoc service
 * @name ts5App.allergensService
 * @description
 * # allergensService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('allergensService', function ($resource,baseUrl) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var requestURL = baseUrl + '/api/records/allergens/:id';
    var requestParameters = {
      id: '@id',
      limit: 50
    };

    var actions = {
      getAllergensList: {
        method: 'GET',
        isArray: true
      },
      getAllergen: {
        method: 'GET'
      },
      createAllergen: {
        method: 'POST'
      },
      updateAllergen: {
        method: 'PUT'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    var getAllergensList = function (payload) {
      return requestResource.getAllergensList(payload).$promise;
    };

    var getAllergen = function (id) {
      return requestResource.getAllergen({id: id}).$promise;
    };

    var createAllergen = function (payload) {
      return requestResource.createAllergen(payload).$promise;
    };

    var updateAllergen = function (payload) {
      return requestResource.updateAllergen(payload).$promise;
    };

    return {
      getAllergensList: getAllergensList,
      getAllergen: getAllergen,
      createAllergen:createAllergen,
      updateAllergen: updateAllergen
    };

  });
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
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    var getAllergensList = function (payload) {
      return requestResource.getAllergensList(payload).$promise;
    };

    return {
      getAllergensList: getAllergensList
    };

  });
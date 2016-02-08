'use strict';

/**
 * @ngdoc service
 * @name ts5App.taxTypesService
 * @description
 * # taxTypesService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('taxTypesService', function ($resource, ENV, GlobalMenuService) {

    var requestURL = ENV.apiUrl + '/api/companies/:companyId/tax-types/:id';
    var requestParameters = {
      id: '@id',
      companyId: '@companyId'
    };

    var actions = {
      getTaxTypesList: {
        method: 'GET'
      }
    };

    var requestResource = function () {
      requestParameters.companyId = GlobalMenuService.company.get();
      return $resource(requestURL, requestParameters, actions);
    };

    var getTaxTypesList = function (payload) {
      return requestResource().getTaxTypesList(payload).$promise;
    };

    return {
      getTaxTypesList: getTaxTypesList
    };

  });

'use strict';

/**
 * @ngdoc service
 * @name ts5App.taxTypesService
 * @description
 * # taxTypesService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('taxTypesService', function ($resource, baseUrl,GlobalMenuService) {

  	var company = GlobalMenuService.company.get();

    var requestURL = baseUrl + '/api/companies/'+company.id+'/tax-types/:id';
    var requestParameters = {
      id: '@id'
    };

    var actions = {
      getTaxTypesList: {
        method: 'GET'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    var getTaxTypesList = function (payload) {
      return requestResource.getTaxTypesList(payload).$promise;
    };

    return {
      getTaxTypesList: getTaxTypesList
    };

});
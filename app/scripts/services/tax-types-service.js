'use strict';

/**
 * @ngdoc service
 * @name ts5App.taxTypesService
 * @description
 * # taxTypesService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('taxTypesService', function ($resource, ENV,GlobalMenuService) {

    // TODO: Refactor so the company object is returned, right now it's retruning a num so ember will play nice
  	var companyId = GlobalMenuService.company.get();

    var requestURL = ENV.apiUrl + '/api/companies/'+companyId+'/tax-types/:id';
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

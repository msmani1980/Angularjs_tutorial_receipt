'use strict';

/**
 * @ngdoc service
 * @name ts5App.stationsService
 * @description
 * # stationsService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('stationsService', function ($resource, baseUrl,GlobalMenuService) {

  	var company = GlobalMenuService.company.get();

    var requestURL = baseUrl + '/api/companies/'+company.id+'/stations/:id';
    var requestParameters = {
      id: '@id'
    };

    var actions = {
      getStationsList: {
        method: 'GET'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    var getStationsList = function (payload) {
      return requestResource.getStationsList(payload).$promise;
    };

    return {
      getStationsList: getStationsList
    };

});
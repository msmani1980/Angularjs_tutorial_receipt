'use strict';

/**
 * @ngdoc service
 * @name ts5App.stationsService
 * @description
 * # stationsService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('stationsService', function ($resource, ENV,GlobalMenuService) {

    // TODO: Refactor so the company object is returned, right now it's retruning a num so ember will play nice
  	var companyId = GlobalMenuService.company.get();

    var requestURL = ENV.apiUrl + '/api/companies/'+companyId+'/stations/:id';
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

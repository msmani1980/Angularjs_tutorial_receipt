'use strict';

/**
 * @ngdoc service
 * @name ts5App.cabinClassesService
 * @description
 * # cabinClassesService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('cabinClassesService', function ($resource, ENV, globalMenuService) {
    var requestURL = ENV.apiUrl + '/rsvr/api/companies/:companyId/cabin-classes';

    var requestParameters = {};

    var actions = {
      getCabinClasses: {
        method: 'GET'
      }
    };
    
    var requestResource = function () {
      requestParameters.companyId = globalMenuService.company.get();
      return $resource(requestURL, requestParameters, actions);
    };
      
    function getCabinClassesList(payload) {
      return requestResource().getCabinClasses(payload).$promise;
    }

    return {
      getCabinClassesList: getCabinClassesList
    };
  });

'use strict';

/**
 * @ngdoc service
 * @name ts5App.eposConfigService
 * @description
 * # eposConfigService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('eposConfigService', function ($resource, ENV) {

    var eposConfigRequestURL = ENV.apiUrl + '/rsvr/api/companies/epos-config/module/:id';
    
    var eposConfigManagementActions = {
      getModules: {
        method: 'GET',
        headers: {}
      }
    };

    var eposConfigRequestResource = $resource(eposConfigRequestURL, null, eposConfigManagementActions);

    var getModules = function(payload) {
      return eposConfigRequestResource.getModules(payload).$promise;
    };

    return {
      getModules: getModules
    };
   
  });

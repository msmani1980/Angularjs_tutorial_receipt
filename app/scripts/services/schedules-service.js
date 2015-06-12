'use strict';

/**
 * @ngdoc service
 * @name ts5App.schedulesService
 * @description
 * # schedulesService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('schedulesService', function ($resource, ENV) {

    var schedulesRequestURL = ENV.apiUrl + '/api/companies/:id/schedules/distinct';

    var schedulesActions = {
      getSchedules: {
        method: 'GET'
      }
    };
    var schedulesRequestResource = $resource(schedulesRequestURL, null, schedulesActions);

    var getSchedules = function (companyId) {
      var payload = {id:companyId};
      return schedulesRequestResource.getSchedules(payload).$promise;
    };

    return {
      getSchedules: getSchedules
    };

  });

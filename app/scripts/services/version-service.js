'use strict';

/**
 * @ngdoc service
 * @name ts5App.versionService
 * @description
 * # versionService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('versionService', function ($resource, ENV) {
    var requestURL = ENV.apiUrl + '/check/project/info';
    var requestParameters = {};

    var actions = {
      getProjectInfo: {
        method: 'GET'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    var getProjectInfo = function () {
      return requestResource.getProjectInfo().$promise;
    };

    return {
      getProjectInfo: getProjectInfo
    };
  });

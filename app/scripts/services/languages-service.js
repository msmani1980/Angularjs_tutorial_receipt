'use strict';

/**
 * @ngdoc service
 * @name ts5App.allergensService
 * @description
 * # allergensService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('languagesService', function ($resource, ENV) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var requestURL = ENV.apiUrl + '/rsvr/api/records/languages';
    var requestParameters = {};

    var actions = {
      getLanguagesList: {
        method: 'GET'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    var getLanguagesList = function () {
      return requestResource.getLanguagesList().$promise;
    };

    return {
      getLanguagesList: getLanguagesList
    };

  });

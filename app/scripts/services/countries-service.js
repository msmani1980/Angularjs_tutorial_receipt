'use strict';

/**
 * @ngdoc service
 * @name ts5App.countriesService
 * @description
 * # countriesService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('countriesService', function($resource, ENV) {
    var requestURL = ENV.apiUrl + '/api/countries';

    var requestParameters = {
      limit: 300
    };

    var actions = {
      getCountriesList: {
        method: 'GET',
        isArray: false
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    var getCountriesList = function() {
      return requestResource.getCountriesList().$promise;
    };

    return {
      getCountriesList: getCountriesList
    };

  });

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
    var requestURL = ENV.apiUrl + '/rsvr/api/countries';
    var regionsCityRequestURL = ENV.apiUrl + '/rsvr/api/countries/regions/cities';

    var requestParameters = {
      limit: 300
    };

    var actions = {
      getCountriesList: {
        method: 'GET',
        isArray: false
      },
      getRegionsCityList: {
        method: 'GET',
        isArray: false
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);
    var requestRegionsCityResource = $resource(regionsCityRequestURL, requestParameters, actions);

    var getCountriesList = function(payload) {
      return requestResource.getCountriesList(payload).$promise;
    };

    var getCities = function(payload) {
      return requestRegionsCityResource.getRegionsCityList(payload).$promise;
    };

    return {
      getCountriesList: getCountriesList,
      getCities: getCities
    };

  });

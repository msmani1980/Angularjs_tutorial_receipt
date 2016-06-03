'use strict';

/**
 * @ngdoc service
 * @name ts5App.companyTypesService
 * @description
 * # companyTypesService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('companyTypesService', function ($resource, ENV) {
    var requestURL = ENV.apiUrl + '/rsvr/api/records/company-types';
    var requestParameters = {};

    var actions = {
      getTypes: {
        method: 'GET',
        isArray: true
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    function getCompanyTypes() {
      return requestResource.getTypes().$promise;
    }

    return {
      getCompanyTypes: getCompanyTypes
    };
  });

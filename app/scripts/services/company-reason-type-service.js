'use strict';

/**
 * @ngdoc service
 * @name ts5App.companyReasonTypeService
 * @description
 * # companyReasonTypeService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('companyReasonTypeService', function ($resource, ENV) {

    var requestURL = ENV.apiUrl + '/api/company-reason-types/:id';

    var requestParameters = {
      id: '@id'
    };

    var actions = {
      getAll: {
        method: 'GET'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    function getAll() {
      return requestResource.getAll().$promise;
    }

    return {
      getAll: getAll
    };

  });

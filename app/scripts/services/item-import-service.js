'use strict';

/**
 * @ngdoc service
 * @name ts5App.itemImportService
 * @description
 * # itemImportService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('itemImportService', function ($resource, ENV) {
    var requestURL = ENV.apiUrl + '/api/retail-items/import';

    var requestParameters = {};

    var actions = {
      importItems: {
        method: 'POST'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    function importItems(payload) {
      return requestResource.importItems(payload).$promise;
    }

    return {
      importItems: importItems
    };

  });

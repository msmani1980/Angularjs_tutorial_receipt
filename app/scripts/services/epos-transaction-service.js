'use strict';

/**
 * @ngdoc service
 * @name ts5App.eposTransactionService
 * @description
 * # eposTransactionService
 * Service in the ts5App.
 */
angular.module('ts5App')
    .service('eposTransactionService', function ($http, $resource, ENV) {

      var requestURL = ENV.apiUrl + '/rsvr/api/epos';
      var requestParameters = {
        limit: 50
      };

      var actions = {
        getEposTransactionList: {
          method: 'GET'
        }
      };

      var requestResource = $resource(requestURL, requestParameters, actions);

      function getEposTransactionList(payload) {
        return requestResource.getEposTransactionList(payload).$promise;

      }

      return {
        getEposTransactionList:getEposTransactionList
      };
    });
   

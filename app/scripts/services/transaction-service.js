'use strict';

/**
 * @ngdoc service
 * @name ts5App.transactionService
 * @description
 * # transactionService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('transactionService', function ($http, $resource, ENV) {

    var requestURL = ENV.apiUrl + '/api/transactions';
    var requestParameters = {
      limit: 50
    };

    var actions = {
      getTransactionList: {
        method: 'GET'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    function getTransactionList(){
      return requestResource.getTransactionList().$promise;

    }

    return {
      getTransactionList:getTransactionList
    }
  });

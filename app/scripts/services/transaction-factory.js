'use strict';

/**
 * @ngdoc service
 * @name ts5App.transactionFactory
 * @description
 * # transactionFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('transactionFactory', function (transactionService) {

    function getTransactionList (payload) {
      return transactionService.getTransactionList(payload);
    }

    return {
      getTransactionList: getTransactionList
    };
  });

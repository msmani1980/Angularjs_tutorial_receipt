'use strict';

/**
 * @ngdoc service
 * @name ts5App.eposTransactionFactory
 * @description
 * # eposTransactionFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
      .factory('eposTransactionFactory', function (eposTransactionService) {

        function getEposTransactionList (payload) {
          return eposTransactionService.getEposTransactionList(payload);
        }

        return {
          getEposTransactionList: getEposTransactionList

        };

      });

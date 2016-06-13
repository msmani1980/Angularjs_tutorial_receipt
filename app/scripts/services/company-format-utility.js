'use strict';

/**
 * @ngdoc service
 * @name ts5App.companyFormatUtility
 * @description
 * # companyFormatUtility
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('companyFormatUtility', function (identityAccessFactory, lodash) {
    function getStoredFormatList() {
      var formatList = identityAccessFactory.getSessionObject().companyFormatList;
      if (formatList) {
        return lodash.object(lodash.map(formatList, function (item) {
          return [item.format.dataType, item.format.format];
        }));
      }

      return {
        DATE: 'MM/DD/YYYY',
        CURRENCY: '%.2f'
      };
    }

    function getDateFormat() {
      return getStoredFormatList().DATE.toUpperCase();
    }

    function getCurrencyFormat() {
      return getStoredFormatList().CURRENCY;
    }

    return {
      getDateFormat: getDateFormat,
      getCurrencyFormat: getCurrencyFormat
    };
  });

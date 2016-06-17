'use strict';

/**
 * @ngdoc service
 * @name ts5App.companyFormatUtility
 * @description
 * # companyFormatUtility
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('companyFormatUtility', function (globalMenuService) {
    var defaultFormat = {
      DATE: 'MM/DD/YYYY',
      CURRENCY: '%.2f'
    };

    function getStoredFormatList() {
      return globalMenuService.getCompanyData().formatList || defaultFormat;
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

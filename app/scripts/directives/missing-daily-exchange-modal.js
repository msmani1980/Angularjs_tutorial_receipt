'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:missingDailyExchangeModal
 * @description
 * # missingDailyExchangeModal
 */
angular.module('ts5App')
  .directive('missingDailyExchangeModal', function (cashBagFactory, GlobalMenuService, dateUtility) {

    function getExchangeRateHandler(dataFromAPI) {
      if (!dataFromAPI.dailyExchangeRates || dataFromAPI.dailyExchangeRates.length === 0) {
        angular.element('.missing-daily-exchange-modal').modal('show');
      }
    }

    function checkForDailyExchangeRate() {
      var companyId = GlobalMenuService.getCompanyData().chCompany.companyId;
      var dailyExchangeDate = dateUtility.formatDateForAPI(dateUtility.now(), 'x');

      cashBagFactory.getDailyExchangeRates(companyId, dailyExchangeDate).then(getExchangeRateHandler, getExchangeRateHandler);
    }

    function missingDailyExchangeController($scope, $location) {
      $scope.goToPage = function (pageUrl) {
        angular.element('.missing-daily-exchange-modal').removeClass('fade').modal('hide');
        $location.path(pageUrl);
      };

      checkForDailyExchangeRate();
    }

    return {
      templateUrl: '/views/directives/missing-daily-exchange-modal.html',
      restrict: 'E',
      scope: true,
      controller: missingDailyExchangeController
    };
  });

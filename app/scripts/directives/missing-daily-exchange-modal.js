'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:missingDailyExchangeModal
 * @description
 * # missingDailyExchangeModal
 */
angular.module('ts5App')
  .directive('missingDailyExchangeModal', function (cashBagFactory, globalMenuService, dateUtility, $q) {

    var checkDeferred;

    function getExchangeRateHandler(dataFromAPI) {
      if (!dataFromAPI.dailyExchangeRates || dataFromAPI.dailyExchangeRates.length === 0) {
        angular.element('.missing-daily-exchange-modal').modal('show');
        checkDeferred.reject(dataFromAPI);
        return;
      }

      checkDeferred.resolve(dataFromAPI);
    }

    function checkForDailyExchangeRate() {
      checkDeferred = $q.defer();
      var companyId = globalMenuService.getCompanyData().chCompany.companyId;
      var dailyExchangeDate = dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker());
      cashBagFactory.getDailyExchangeRates(companyId, dailyExchangeDate).then(getExchangeRateHandler, getExchangeRateHandler);
      return checkDeferred.promise;
    }

    function missingDailyExchangeController($scope, $location) {
      $scope.goToPage = function (pageUrl) {
        angular.element('.missing-daily-exchange-modal').removeClass('fade').modal('hide');
        $location.path(pageUrl);
      };

      if ($scope.checkOnLoad) {
        checkForDailyExchangeRate();
      }

      $scope.$parent.checkForDailyExchangeRate = checkForDailyExchangeRate;
    }

    return {
      templateUrl: '/views/directives/missing-daily-exchange-modal.html',
      restrict: 'E',
      scope: {
        checkOnLoad: '='
      },
      controller: missingDailyExchangeController
    };
  });

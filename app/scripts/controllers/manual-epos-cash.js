'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ManualEposCashCtrl
 * @description
 * # ManualEposCashCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ManualEposCashCtrl', function ($scope, $routeParams, $q, manualEposFactory) {

    //function showLoadingModal(text) {
    //  angular.element('#loading').modal('show').find('p').text(text);
    //}

    function hideLoadingModal() {
      angular.element('#loading').modal('hide');
    }

    function showErrors(dataFromAPI) {
      hideLoadingModal();
      $scope.displayError = true;
      $scope.errorResponse = dataFromAPI;
    }

    function completeInit(responseCollection) {
      console.log(responseCollection);
    }

    function makeInitPromises(responseFromAPI) {
      $scope.cashBagList = angular.copy(responseFromAPI.response);

      var promises = [
        manualEposFactory.getCurrencyList()
      ];
      angular.forEach($scope.cashBagList, function (cashBag) {
        promises.push(manualEposFactory.getCashBagCashList(cashBag.id));
        promises.push(manualEposFactory.getCashBag(cashBag.id));
      });

      $q.all(promises).then(completeInit, showErrors);
    }

    function init() {
      manualEposFactory.getCashBagForStoreInstance($routeParams.storeInstanceId).then(makeInitPromises, showErrors);

      //manualEposFactory.getCashList().then(function(response) {
      //  $scope.companyCashList = angular.copy(response);
      //});
    }

    init();

  });

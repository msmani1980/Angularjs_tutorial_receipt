'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ManualEposEntryCtrl
 * @description
 * # ManualEposEntryCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ManualEposEntryCtrl', function ($scope, $q, manualEposFactory, $location, $routeParams) {

    function showLoadingModal(text) {
      angular.element('#loading').modal('show').find('p').text(text);
    }

    function hideLoadingModal() {
      angular.element('#loading').modal('hide');
    }

    $scope.navigateToForm = function (formName) {
      $location.path('manual-epos-' + formName + '/' + $routeParams.cashBagId);
    };

    $scope.isFormVerified = function (formName) {
      return (angular.isDefined($scope.isVerified) ? $scope.isVerified[formName] : false);
    };

    function setVerification(dataFromAPI) {
      var cashBagVerification = angular.copy(dataFromAPI);
      $scope.isVerified = {
        cash: !!cashBagVerification.cashVerifiedOn,
        credit: !!cashBagVerification.creditCardVerifiedOn,
        discount: !!cashBagVerification.discountVerifiedOn,
        promotion: !!cashBagVerification.promoVerifiedOn,
        virtual: !!cashBagVerification.virtualItemVerifiedOn,
        voucher: !!cashBagVerification.voucherItemsVerifiedOn
      };
    }

    function getCashBagVerification() {
      manualEposFactory.checkCashBagVerification($routeParams.cashBagId).then(setVerification);
    }

    function setCashBag(dataFromAPI) {
      $scope.cashBag = angular.copy(dataFromAPI);
    }

    function getCashBag() {
      manualEposFactory.getCashBag($routeParams.cashBagId).then(setCashBag);
    }

    function completeInit() {
      hideLoadingModal();
    }

    function init() {
      showLoadingModal('Loading Cash Bag...');
      $scope.viewName = 'Manual ePOS Data Entry';
      $scope.cashBagId = $routeParams.cashBagId;

      var initPromises = [
        getCashBag(),
        getCashBagVerification()
      ];
      $q.all(initPromises).then(completeInit);
    }

    init();
  });

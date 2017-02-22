'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ManualEposEntryCtrl
 * @description
 * # ManualEposEntryCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ManualEposEntryCtrl', function ($scope, $q, manualEposFactory, $location, $routeParams, lodash, dateUtility) {

    function showLoadingModal(text) {
      angular.element('#loading').modal('show').find('p').text(text);
    }

    function hideLoadingModal() {
      angular.element('#loading').modal('hide');
    }

    function showErrors(dataFromAPI) {
      hideLoadingModal();
      $scope.displayError = true;
      $scope.errorResponse = dataFromAPI;
      $scope.disableAll = true;
    }

    $scope.navigateToForm = function (formName) {
      $location.path('manual-epos-' + formName + '/' + $routeParams.cashBagId);
    };

    $scope.isFormVerified = function (formName) {
      return (angular.isDefined($scope.isVerified) ? $scope.isVerified[formName] : false);
    };

    $scope.doesFormHaveChanges = function (formName) {
      return angular.isDefined($scope.containsChanges) ? !$scope.isFormVerified(formName) && $scope.containsChanges[formName] : false;
    };

    $scope.getVerifyAll = function () {
        return $scope.isConfirmed;
      };

    $scope.shouldDisableForm = function (formName) {
      return ($scope.isConfirmed) ? !$scope.isFormVerified(formName) : false;
    };

    $scope.unconfirmAll = function () {
      showLoadingModal('Unconfirming');
      var unconfirmPromises = [
        manualEposFactory.unverifyCashBag($routeParams.cashBagId, 'CONFIRMED')
      ];

      $q.all(unconfirmPromises).then(init, showErrors);
    };

    $scope.confirmAll = function () {
      showLoadingModal('Confirming');
      manualEposFactory.verifyCashBag($routeParams.cashBagId, 'CONFIRMED').then(init, showErrors);
    };

    function areAllChangesVerified() {
      var formList = ['cash', 'credit', 'virtual', 'voucher', 'discount', 'promotion'];
      var unverifiedChangesExist = false;
      angular.forEach(formList, function (formName) {
        var isFormInvalid = ($scope.doesFormHaveChanges(formName)) ? !$scope.isFormVerified(formName) : false;
        unverifiedChangesExist = unverifiedChangesExist || isFormInvalid;
      });

      return unverifiedChangesExist;
    }

    function setVerificationData(dataFromAPI) {
      if (!$scope.isConfirmed) {
        return;
      }

      var dateAndTime = dateUtility.formatTimestampForApp(dataFromAPI.verificationConfirmedOn);
      $scope.confirmedInfo = {
        confirmedBy: (dataFromAPI.verificationConfirmedBy) ? dataFromAPI.verificationConfirmedBy.firstName + ' ' + dataFromAPI.verificationConfirmedBy.lastName : 'Unknown User',
        confirmedTimestamp: (!!dateAndTime) ? dateAndTime.replace(' ', ' at ') : 'Unknown Date'
      };
    }

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
      $scope.isConfirmed = !!cashBagVerification.verificationConfirmedOn;
      setVerificationData(dataFromAPI);
    }

    function groupItemList(itemListFromAPI, itemTypeList) {
      var virtualItemTypeId = lodash.findWhere(itemTypeList, { name: 'Virtual' }).id;
      var voucherItemTypeId = lodash.findWhere(itemTypeList, { name: 'Voucher' }).id;
      var groupedItemList = lodash.groupBy(angular.copy(itemListFromAPI.response), function (item) {
        return item.itemTypeId;
      });

      return {
        virtual: groupedItemList[virtualItemTypeId],
        voucher: groupedItemList[voucherItemTypeId]
      };
    }

    function completeInit(responseCollection) {
      $scope.cashBag = angular.copy(responseCollection[0]);
      setVerification(responseCollection[1]);
      var groupedItemList = groupItemList(responseCollection[6], responseCollection[7]);

      $scope.containsChanges = {
        cash: responseCollection[2].meta.count > 0,
        credit: responseCollection[3].meta.count > 0,
        discount: responseCollection[4].meta.count > 0,
        promotion: responseCollection[5].meta.count > 0,
        voucher: !!groupedItemList.voucher,
        virtual: !!groupedItemList.virtual
      };

      $scope.readyToConfirm = areAllChangesVerified();
      hideLoadingModal();
    }

    function init() {
      showLoadingModal('Loading Cash Bag....');
      $scope.viewName = 'Manual ePOS Data Entry';
      $scope.cashBagId = $routeParams.cashBagId;

      var initPromises = [
        manualEposFactory.getCashBag($routeParams.cashBagId),
        manualEposFactory.checkCashBagVerification($routeParams.cashBagId),
        manualEposFactory.getCashBagCashList($routeParams.cashBagId),
        manualEposFactory.getCashBagCreditList($routeParams.cashBagId),
        manualEposFactory.getCashBagDiscountList($routeParams.cashBagId),
        manualEposFactory.getCashBagPromotionList($routeParams.cashBagId),
        manualEposFactory.getCashBagItemList($routeParams.cashBagId),
        manualEposFactory.getItemTypes()
      ];

      $q.all(initPromises).then(completeInit);
    }

    init();
  });

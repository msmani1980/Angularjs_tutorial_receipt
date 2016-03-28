'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ManualEposEntryCtrl
 * @description
 * # ManualEposEntryCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ManualEposEntryCtrl', function($scope, $q, manualEposFactory) {

    var panelNames = [{
      name: 'Cash',
      show: false,
      verified: false
    }, {
      name: 'Credit Card',
      show: false,
      verified: false
    }, {
      name: 'Discounts',
      show: false,
      verified: false
    }, {
      name: 'Promotions',
      show: false,
      verified: true
    }, {
      name: 'Virtual Items',
      show: false,
      verified: false
    }, {
      name: 'Voucher Items',
      show: false,
      verified: false
    }];

    function setScopeVariables() {
      $scope.viewName = 'Manual ePOS Data Entry';

      //set data
      $scope.currencyObj = {
        promotions: {
          currency: angular.copy($scope.currencyList[1])
        },
        voucherItems: {
          currency: angular.copy($scope.currencyList[1])
        },
        virtualItems: {
          currency: angular.copy($scope.currencyList[1])
        },
        discounts: {
          currency: angular.copy($scope.currencyList[1])
        }
      };

      //set panel data
      $scope.panelNames = panelNames;
      $scope.showAll = false;
    }

    function checkPanelForAttr(name, attr) {
      var payload = [];
      angular.forEach($scope.panelNames, function(panel) {
        if (panel.name === name && panel[attr] === true) {
          payload.push(panel.name);
        }
      });

      return (payload.length > 0);
    }

    function setScopeData(response, name) {
      $scope[name] = angular.copy(response);
    }

    function createPromisesForData() {
      return [
        manualEposFactory.getCurrencyList().then(function(response) {
          setScopeData(response, 'currencyList');
        }),

        manualEposFactory.getPromotionsList().then(function(response) {
          setScopeData(response, 'promotionsList');
        }),

        manualEposFactory.getPromotionsList().then(function(response) {
          setScopeData(response, 'companyPromotionsList');
        }),

        manualEposFactory.getVoucherItemsList().then(function(response) {
          setScopeData(response, 'companyVoucherItemsList');
        }),

        manualEposFactory.getVirtualItemsList().then(function(response) {
          setScopeData(response, 'companyVirtualItemsList');
        }),

        manualEposFactory.getDiscountsList().then(function(response) {
          setScopeData(response, 'companyDiscountsList');
        }),

        manualEposFactory.getCashList().then(function(response) {
          setScopeData(response, 'companyCashList');
        }),

        manualEposFactory.getCreditList().then(function(response) {
          setScopeData(response, 'companyCreditCardList');
        })

      ];
    }

    function promisesForData() {
      var promises = createPromisesForData();
      $q.all(promises).then(setScopeVariables);
    }

    promisesForData();

    // Always place $scope functions at the end of the controller
    $scope.shouldShowPanel = function(name) {
      return checkPanelForAttr(name, 'show');
    };

    $scope.panelIsVerified = function(name) {
      return checkPanelForAttr(name, 'verified');
    };

    $scope.verifyPanel = function(name) {
      angular.forEach($scope.panelNames, function(panel) {
        if (panel.name === name) {
          if (panel.verified === true) {
            panel.verified = false;
          } else {
            panel.verified = true;
          }
        }
      });
    };

  });

'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ManualEposEntryCtrl
 * @description
 * # ManualEposEntryCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ManualEposEntryCtrl', function($scope) {

    var promotionsList = {
      promotions: [{
        benefitTypeId: 1,
        benefitTypeName: 'Discount',
        catalogCount: 2,
        companyId: 403,
        id: 117,
        description: 'Buy 4 drinks get 20% off',
        discountTypeId: 1,
        discountTypeName: 'Percentage',
        endDate: '2015-09-19',
        startDate: '2015-01-01',
        promotionCode: 'PM001',
        promotionName: 'Buy 4 drinks get 20 percent off',
        promotionTypeId: 1,
        promotionTypeName: ' Product Purchase',
        quantity: 2,
        price: 10.11,
        currencyValue: 20.00,
        audValue: 23.75
      }, {
        benefitTypeId: 1,
        benefitTypeName: ' Discount',
        catalogCount: 7,
        companyId: 403,
        id: 118,
        description: 'Buy 2 items get 10 percent off',
        discountTypeId: 1,
        discountTypeName: 'Percentage',
        endDate: '2018-12-31',
        startDate: '2015-01-01',
        promotionCode: 'PM002',
        promotionName: 'Buy 2 items get 10 percent off',
        promotionTypeId: 1,
        promotionTypeName: 'Product Purchase',
        quantity: 2,
        price: 10.11,
        currencyValue: 20.00,
        audValue: 23.75
      }, {
        benefitTypeId: 1,
        benefitTypeName: ' Discount',
        catalogCount: 0,
        companyId: 403,
        id: 119,
        description: 'randomdata',
        discountTypeId: 1,
        discountTypeName: 'Percentage',
        endDate: '2015-05-29',
        startDate: '2015-01-01',
        promotionCode: ' TEXT',
        promotionName: 'randomdata',
        promotionTypeId: 1,
        promotionTypeName: 'Product Purchase',
        quantity: 2,
        price: 10.11,
        currencyValue: 20.00,
        audValue: 23.75
      }],
      meta: {
        count: 3,
        limit: 3,
        start: 0
      }
    };

    var currencyList = {
      response: [{
        id: 1,
        companyId: 2,
        code: 'USD',
        name: 'dollar'
      }, {
        id: 57,
        companyId: 2,
        code: 'GBP',
        name: 'GreatBritishPound'
      }, {
        id: 58,
        companyId: 2,
        code: 'EUR',
        name: 'EURO'
      }, {
        id: 63,
        companyId: 2,
        code: 'NOK',
        name: 'NOK'
      }],
      meta: {
        count: 4,
        limit: 4,
        start: 0
      }
    };

    var companyCashList = {
      response: [{
        id: 1,
        companyId: 2,
        code: 'USD',
        name: 'dollar',
        amount: 2.00,
        audValue: 3.50
      }, {
        id: 57,
        companyId: 2,
        code: 'GBP',
        name: 'GreatBritishPound',
        amount: 2.00,
        audValue: 3.50
      }, {
        id: 58,
        companyId: 2,
        code: 'EUR',
        name: 'EURO',
        amount: 2.00,
        audValue: 3.50
      }, {
        id: 63,
        companyId: 2,
        code: 'NOK',
        name: 'NOK',
        amount: 2.00,
        audValue: 3.50
      }],
      meta: {
        count: 4,
        limit: 4,
        start: 0
      }
    };

    var companyCreditCardList = {
      response: [{
        id: 1,
        companyId: 2,
        code: 'USD',
        name: 'dollar',
        amount: 2.00,
        audValue: 3.50
      }, {
        id: 57,
        companyId: 2,
        code: 'GBP',
        name: 'GreatBritishPound',
        amount: 2.00,
        audValue: 3.50
      }],
      meta: {
        count: 2,
        limit: 2,
        start: 0
      }
    };

    var voucherItemsList = {
      vouchers: [{
        endDate: '2015-05-29',
        startDate: '2015-01-01',
        voucherCode: ' V10',
        voucherName: '10 Off Vocucher',
        voucherTypeId: 1,
        quantity: 2,
        price: 10.00,
        currencyValue: 20.00,
        audValue: 23.75
      }, {
        endDate: '2015-05-29',
        startDate: '2015-01-01',
        voucherCode: ' V30',
        voucherName: '30 Off Vocucher',
        voucherTypeId: 1,
        quantity: 2,
        price: 5.00,
        currencyValue: 50.00,
        audValue: 57.25
      }, {
        endDate: '2015-05-29',
        startDate: '2015-01-01',
        voucherCode: 'IV1',
        voucherName: 'Item Voucher 1',
        voucherTypeId: 1,
        quantity: null,
        price: null,
        currencyValue: null,
        audValue: null
      }],
      meta: {
        count: 3,
        limit: 3,
        start: 0
      }
    };

    var virtualItemsList = {
      items: [{
        companyId: 403,
        itemCode: 'Mov230',
        itemName: 'Movie Ticket',
        itemTypeName: 'Virtual',
        itemTypeId: 2,
        categoryName: 'Virtual Items',
        salesCategoryId: 231,
        sellingPoint: 'Virtual',
        stockOwnerCode: null,
        onBoardName: ' Movie Ticket',
        currentPrice: null,
        description: 'Movie Ticket',
        imageUrl: ' https://s3.amazonaws.com/ts5-qa-portal-images/item-511b8541-418d-4600-9339-de993d1a82e4.png',
        startDate: '2015-06-01',
        endDate: '2018-12-31',
        keywords: 'Movie',
        isPrintReceipt: true,
        id: 405,
        itemMasterId: 38,
        subViewItems: null,
        quantity: 2,
        price: 5.00,
        currencyValue: 50.00,
        audValue: 57.25
      }, {
        companyId: 403,
        itemCode: 'Mov230',
        itemName: 'Video',
        itemTypeName: 'Virtual',
        itemTypeId: 2,
        categoryName: 'Virtual Items',
        salesCategoryId: 231,
        sellingPoint: 'Virtual',
        stockOwnerCode: null,
        onBoardName: ' Movie Ticket',
        currentPrice: null,
        description: 'Movie Ticket',
        imageUrl: ' https://s3.amazonaws.com/ts5-qa-portal-images/item-511b8541-418d-4600-9339-de993d1a82e4.png',
        startDate: '2015-06-01',
        endDate: '2018-12-31',
        keywords: 'Movie',
        isPrintReceipt: true,
        id: 405,
        itemMasterId: 38,
        subViewItems: null,
        quantity: 2,
        price: 5.00,
        currencyValue: 50.00,
        audValue: 57.25
      }, {
        companyId: 403,
        itemCode: 'Mov230',
        itemName: 'Video Game',
        itemTypeName: 'Virtual',
        itemTypeId: 2,
        categoryName: 'Virtual Items',
        salesCategoryId: 231,
        sellingPoint: 'Virtual',
        stockOwnerCode: null,
        onBoardName: ' Movie Ticket',
        currentPrice: null,
        description: 'Movie Ticket',
        imageUrl: ' https://s3.amazonaws.com/ts5-qa-portal-images/item-511b8541-418d-4600-9339-de993d1a82e4.png',
        startDate: '2015-06-01',
        endDate: '2018-12-31',
        keywords: 'Movie',
        isPrintReceipt: true,
        id: 405,
        itemMasterId: 38,
        subViewItems: null,
        quantity: null,
        price: null,
        currencyValue: null,
        audValue: null
      }],
      meta: {
        count: 3,
        limit: 3,
        start: 0
      }
    };

    var discountsList = {
      voucher: [{
        endDate: '2015-05-29',
        startDate: '2015-01-01',
        discountCode: ' V10',
        discountName: '10 Off Vocucher',
        discountTypeId: 1,
        quantity: 2,
        price: 10.00,
        currencyValue: 20.00,
        audValue: 23.75
      }, {
        endDate: '2015-05-29',
        startDate: '2015-01-01',
        discountCode: ' V30',
        discountName: '30 Off Vocucher',
        discountTypeId: 1,
        quantity: 2,
        price: 5.00,
        currencyValue: 50.00,
        audValue: 57.25
      }, {
        endDate: '2015-05-29',
        startDate: '2015-01-01',
        discountCode: 'IV1',
        discountName: 'Item Voucher 1',
        discountTypeId: 1,
        quantity: null,
        price: null,
        currencyValue: null,
        audValue: null
      }],
      coupon: [{
        endDate: '2015-05-29',
        startDate: '2015-01-01',
        discountCode: ' V10',
        discountName: '10 Off Coupon',
        discountTypeId: 1,
        quantity: 2,
        price: 10.00,
        currencyValue: 20.00,
        audValue: 23.75
      }, {
        endDate: '2015-05-29',
        startDate: '2015-01-01',
        discountCode: ' V30',
        discountName: '30 Off Coupon',
        discountTypeId: 1,
        quantity: 2,
        price: 5.00,
        currencyValue: 50.00,
        audValue: 57.25
      }, {
        endDate: '2015-05-29',
        startDate: '2015-01-01',
        discountCode: 'IV1',
        discountName: 'Item Coupon 1',
        discountTypeId: 1,
        quantity: null,
        price: null,
        currencyValue: null,
        audValue: null
      }],
      meta: {
        count: 3,
        limit: 3,
        start: 0
      }
    };

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

      //set dependencies
      $scope.currencyList = currencyList.response;
      $scope.promotionsList = promotionsList.promotions;
      $scope.companyPromotionsList = promotionsList.promotions;
      $scope.companyVoucherItemsList = voucherItemsList.vouchers;
      $scope.companyVirtualItemsList = virtualItemsList.items;
      $scope.companyDiscountsList = discountsList;
      $scope.companyCashList = companyCashList.response;
      $scope.companyCreditCardList = companyCreditCardList.response;

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

    setScopeVariables();

    // Always place $scope vars at the end of the controller
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

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
        count: 5,
        limit: 5,
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

    $scope.viewName = 'Manual ePOS Data Entry';

    //set dependencies
    $scope.currencyList = currencyList.response;
    $scope.promotionsList = promotionsList.promotions;
    $scope.companyPromotionsList = promotionsList.promotions;

    //set data
    $scope.currency = $scope.currencyList[1];

  });

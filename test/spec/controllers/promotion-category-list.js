'use strict';

describe('Controller: PromotionCategoryListCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/promotion-categories.json'));

  var PromotionCategoryListCtrl;
  var promotionCategoryFactory;
  var promotionCategoriesDeferred;
  var promotionCategoriesResponseJSON;
  var dateUtility;
  var lodash;
  var location;
  var scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($q, $controller, $rootScope, $injector, $location) {
    inject(function (_servedPromotionCategories_) {
      promotionCategoriesResponseJSON = _servedPromotionCategories_;
    });

    location = $location;
    promotionCategoryFactory = $injector.get('promotionCategoryFactory');
    dateUtility = $injector.get('dateUtility');
    lodash = $injector.get('lodash');
    scope = $rootScope.$new();

    promotionCategoriesDeferred = $q.defer();
    promotionCategoriesDeferred.resolve(promotionCategoriesResponseJSON);

    spyOn(promotionCategoryFactory, 'getPromotionCategoryList').and.returnValue(promotionCategoriesDeferred.promise);

    PromotionCategoryListCtrl = $controller('PromotionCategoryListCtrl', {
      $scope: scope
    });

    scope.$digest();
  }));

  describe('initialize data', function () {
  });
});

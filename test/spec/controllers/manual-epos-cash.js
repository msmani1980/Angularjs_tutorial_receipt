'use strict';

describe('Controller: ManualEposCashCtrl', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('template-module'));


  var ManualEposCashCtrl,
    manualEposFactory,
    controller,
    scope;

  beforeEach(inject(function ($q, $controller, $rootScope, $injector) {

    //inject(function(_servedExpandedSalesCategories_) {
    //  salesCategoriesJSON = _servedExpandedSalesCategories_;
    //});

    manualEposFactory = $injector.get('manualEposFactory');
    controller = $controller;

    //salesCategoriesDeferred = $q.defer();
    //salesCategoriesDeferred.resolve(salesCategoriesJSON);
    //spyOn(categoryFactory, 'getCategoryList').and.returnValue(salesCategoriesDeferred.promise);

    scope = $rootScope.$new();
    ManualEposCashCtrl = $controller('ManualEposCashCtrl', {
      $scope: scope
    });
    scope.$digest();

  }));

  describe('init', function () {
    it('should get cash bag', function () {

    });

    it('should get the store instance tied to the cash bag' , function () {

    });

    it('should get a list of currencies', function () {

    });

    it('should get cash bag cash', function () {

    });

    it('should get daily exchange rates', function () {

    });

    it('should check the cash bag verification', function () {

    });

    it('should set the base currency', function () {

    });

    it('should attach a list of active currencies to scope', function () {

    });
  });

  describe('convert cash amount', function () {

  });

  describe('sum converted amounts', function () {

  });

  describe('saving cash bag cash', function () {
    it('should call create for new entries', function () {

    });

    it('should call update for existing entries', function () {

    });

  });


});

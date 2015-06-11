'use strict';

describe('The Stock Owner Item Create Controller', function () {

  // load the controller's module
  beforeEach(module('ts5App', 'template-module'));
  beforeEach(module(
    'served/price-types.json'
  ));

  var $rootScope,
    $scope,
    $controller,
    $location,
    StockOwnerItemCreateCtrl,
    $httpBackend;

  beforeEach(inject(function (_$rootScope_, _$controller_, $injector) {
    $httpBackend = $injector.get('$httpBackend');
    //FIXME: Test these calls on the controller
    $httpBackend.whenGET(/./).respond(200, '');
    $location = $injector.get('$location');
    $location.path('/stock-owner-item-create');
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $controller = _$controller_;
    StockOwnerItemCreateCtrl = $controller('StockOwnerItemCreateCtrl', {
      '$rootScope': $rootScope,
      '$scope': $scope
    });
  }));

  describe('The StockOwnerItemCreateCtrl', function () {

    it('should be defined', function () {
      expect(StockOwnerItemCreateCtrl).toBeDefined();
    });

    it('should have a the route /stock-owner-item-create', function () {
      expect($location.path()).toBe('/stock-owner-item-create');
    });

  });

  describe('formData collection', function () {

    it('should be defined', function () {
      expect($scope.formData).toBeDefined();
    });

    it('should have a startDate property', function () {
      expect($scope.formData.startDate).toBeDefined();
    });

    it('should have an endDate property', function () {
      expect($scope.formData.endDate).toBeDefined();
    });

    it('should have an qrCodeValue property', function () {
      expect($scope.formData.qrCodeValue).toBeDefined();
    });

    it('should have a qrCodeImgUrl property', function () {
      expect($scope.formData.qrCodeImgUrl).toBeDefined();
    });

    it('should have an tags property that is an empty array', function () {
      expect($scope.formData.tags).toBeDefined();
      expect($scope.formData.tags).toEqual([]);
    });

    it('should have an allergens property that is an empty array',
      function () {
        expect($scope.formData.allergens).toBeDefined();
        expect($scope.formData.allergens).toEqual([]);
      });

    it('should have an characteristics property that is an empty array',
      function () {
        expect($scope.formData.characteristics).toBeDefined();
        expect($scope.formData.characteristics).toEqual([]);
      });

    it('should have an substitutions property that is an empty array',
      function () {
        expect($scope.formData.substitutions).toBeDefined();
        expect($scope.formData.substitutions).toEqual([]);
      });

    it('should have an recommendations property that is an empty array',
      function () {
        expect($scope.formData.recommendations).toBeDefined();
        expect($scope.formData.recommendations).toEqual([]);
      });
    it(
      'should have an globalTradeNumbers property that is an empty array',
      function () {
        expect($scope.formData.globalTradeNumbers).toBeDefined();
        expect($scope.formData.globalTradeNumbers).toEqual([]);
      });

    it(
      'should have a costPrices property that is an array with one price group object inside it',
      function () {
        expect($scope.formData.costPrices).toBeDefined();
        expect($scope.formData.costPrices.length).toBe(1);
      });

  });

  describe('view', function () {

    var $templateCache,
      $compile,
      html,
      view;

    beforeEach(inject(function (_$templateCache_, _$compile_) {
      $templateCache = _$templateCache_;
      $compile = _$compile_;
      html = $templateCache.get(
        '/views/stock-owner-item-create.html');
      var compiled = $compile(angular.element(html))($scope);
      view = angular.element(compiled[0]);
      //$scope.$digest();
    }));

    it('should be defined', function () {
      expect(view).toBeDefined();
    });

    it('should have an ng-form directive', function () {
      expect(view.find('ng-form').length).toEqual(1);
    });

    describe('UI for price', function () {

      it('should have a header', function () {
        expect(view.find('#price-and-tax').length).toEqual(1);
      });

      it('should have a header with the correct label', function () {
        expect(view.find('#price-and-tax').text()).toEqual(
          'Price');
      });

      describe('price group button', function () {

        var priceGroupBtn;

        beforeEach(function () {
          priceGroupBtn = view.find('#add-price-group');
        });

        it('should be present in the DOM', function () {
          expect(priceGroupBtn.length).toEqual(1);
        });

        it('should have the correct label', function () {
          expect(priceGroupBtn.text().trim()).toEqual(
            'Add Price Type');
        });

        it('should have an ng-click', function () {
          expect(priceGroupBtn.attr('ng-click')).toEqual(
            'addPriceGroup()');
        });

      });

    });

  });

  /*
   * Price Groups
   */

  describe('Price Groups |', function () {

    var priceTypesJSON,
      response,
      testObject;

    // Inject the service and responshandler
    beforeEach(inject(function () {

      // Inject the JSON fixtures
      inject(function (_servedPriceTypes_) {
        priceTypesJSON = _servedPriceTypes_;
      });

      spyOn(StockOwnerItemCreateCtrl, 'getPriceTypesList').and.callFake(
        function () {
          return priceTypesJSON;
        });

      response = StockOwnerItemCreateCtrl.getPriceTypesList();

      testObject = response[0];

    }));

    it('should have a getPriceTypesList method', function () {
      expect(StockOwnerItemCreateCtrl.getPriceTypesList).toBeDefined();
    });

    it('should have a getPriceTypesList method', function () {
      expect(StockOwnerItemCreateCtrl.getPriceTypesList).toHaveBeenCalled();
    });

    it('should have a response ', function () {
      expect(response).toBeDefined();
      expect(response.length).toBeGreaterThan(0);
    });

    it('should have contain a price type object in the response ',
      function () {
        expect(testObject).toBeDefined();
        expect(testObject.id).toBeDefined();
        expect(testObject.id).toEqual(jasmine.any(Number));
      });

    it('should have a price type object with an id ', function () {
      expect(testObject.id).toBeDefined();
      expect(testObject.id).toEqual(jasmine.any(Number));
    });

    it('should have a price type object with an name ', function () {
      expect(testObject.name).toBeDefined();
      expect(testObject.name).toEqual(jasmine.any(String));
      expect(testObject.name.length).toBeGreaterThan(1);
    });

  });

});

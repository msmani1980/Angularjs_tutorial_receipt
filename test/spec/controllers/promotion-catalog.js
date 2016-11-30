'use strict';

describe('Controller: PromotionCatalogCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/promotion-list.json'));
  beforeEach(module('served/promotion-catalog.json'));

  var PromotionCatalogCtrl;
  var promotionCatalogFactory;

  var promotionCatalogDeferred;
  var promotionCatalogResponseJSON;

  var promotionListDeferred;
  var promotionListResponseJSON;

  var routeParams;
  var dateUtility;
  var lodash;
  var location;
  var scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($q, $controller, $rootScope, $injector, $location) {
    inject(function (_servedPromotionList_, _servedPromotionCatalog_) {
      promotionCatalogResponseJSON = _servedPromotionCatalog_;
      promotionListResponseJSON = _servedPromotionList_;
    });

    location = $location;
    promotionCatalogFactory = $injector.get('promotionCatalogFactory');
    dateUtility = $injector.get('dateUtility');
    lodash = $injector.get('lodash');
    scope = $rootScope.$new();

    promotionCatalogDeferred = $q.defer();
    promotionCatalogDeferred.resolve(promotionCatalogResponseJSON);
    promotionListDeferred = $q.defer();
    promotionListDeferred.resolve(promotionListResponseJSON);


    spyOn(promotionCatalogFactory, 'getPromotionList').and.returnValue(promotionListDeferred.promise);
    spyOn(promotionCatalogFactory, 'getPromotionCatalog').and.returnValue(promotionCatalogDeferred.promise);
    spyOn(promotionCatalogFactory, 'createPromotionCatalog').and.returnValue(promotionCatalogDeferred.promise);
    spyOn(promotionCatalogFactory, 'updatePromotionCatalog').and.returnValue(promotionCatalogDeferred.promise);
    spyOn(promotionCatalogFactory, 'deletePromotionCatalog').and.returnValue(promotionCatalogDeferred.promise);
    spyOn(location, 'path').and.callThrough();

    routeParams = {
      id: '123',
      action: 'edit'
    };

    PromotionCatalogCtrl = $controller('PromotionCatalogCtrl', {
      $scope: scope,
      $routeParams: routeParams
    });

    scope.$digest();
  }));

  describe('initializeData', function () {
    it('should get promotion category by id if in edit mode', function () {
      expect(promotionCatalogFactory.getPromotionCatalog).toHaveBeenCalledWith(routeParams.id);
      expect(scope.promotionCatalog).toBeDefined();
    });

    describe('format promotion catalog', function () {
      it('should format start and end date for app', function () {
        var expectedStartDate = dateUtility.formatDateForApp(promotionCatalogResponseJSON.startDate);
        var expectedEndDate = dateUtility.formatDateForApp(promotionCatalogResponseJSON.endDate);

        expect(scope.promotionCatalog.startDate).toEqual(expectedStartDate);
        expect(scope.promotionCatalog.endDate).toEqual(expectedEndDate);
      });

      it('should format promotions and add to catalogPromotionList', function () {
        scope.$digest();
        expect(scope.catalogPromotionList.length).toEqual(promotionCatalogResponseJSON.companyPromotionCatalogOrderCatalogs.length);

        var responsePromotion = lodash.findWhere(promotionCatalogResponseJSON.companyPromotionCatalogOrderCatalogs, { id: scope.catalogPromotionList[0].recordId });
        expect(scope.catalogPromotionList[0].selectedPromotion).toBeDefined();
        expect(scope.catalogPromotionList[0].selectedPromotion.id).toEqual(responsePromotion.promotionId);
      });
    });

    it('should set viewOnly and editOnly variables', function () {
      scope.$digest();
      expect(scope.isViewOnly).toBeDefined();
      expect(scope.disableEditField).toBeDefined();
    });

    describe('view only and disable edit variables', function () {
      it('should set viewOnly to true on edit if record is in the past', function () {
        scope.$digest();
        scope.promotionCatalog = { startDate: '10/20/1980', endDate: '11/21/1981' };
        PromotionCatalogCtrl.setViewVariables();

        expect(scope.isViewOnly).toEqual(true);
      });

      it('should not disable edit fields if record is in the future', function () {
        scope.$digest();
        scope.promotionCatalog = { startDate: '10/20/2050', endDate: '11/21/2051' };
        PromotionCatalogCtrl.setViewVariables();

        expect(scope.disableEditField).toEqual(false);
      });

      it('should disable edit fields for active records', function () {
        scope.$digest();
        scope.promotionCatalog = { startDate: '10/20/1980', endDate: '11/21/2051' };
        PromotionCatalogCtrl.setViewVariables();

        expect(scope.disableEditField).toEqual(true);
        expect(scope.isViewOnly).toEqual(false);
      });
    });
  });

  describe('adding and removing items', function () {
    beforeEach(function () {
      scope.catalogPromotionList = [{ sortOrder: 1, selectedPromotion: { id: 123 } }];
    });

    it('should add empty item to item list with correct sort order', function () {
      scope.addItem();
      expect(scope.catalogPromotionList.length).toEqual(2);
      expect(scope.catalogPromotionList[1].sortOrder).toEqual(2);
    });

    it('should remove the given item from the list', function () {
      var oldItem = scope.catalogPromotionList[0];
      scope.removePromotion(oldItem);
      expect(scope.catalogPromotionList.length).toEqual(0);
    });
  });

  describe('selecting items', function () {
    it('should refresh promotion list if date changes', function () {
      scope.$digest();
      scope.promotionCatalog.startDate = '10/10/2016';
      scope.promotionCatalog.endDate = '10/15/2016';
      scope.$digest();

      var expectedPayload = {
        startDate: '20161010',
        endDate: '20161015'
      };

      expect(promotionCatalogFactory.getPromotionList).toHaveBeenCalledWith(expectedPayload);
    });

  });

  describe('saving promotion catalog', function () {
    beforeEach(function () {
      scope.promotionCatalogForm = {
        $valid: true
      };

      scope.promotionCatalog = {
        promotionCatalogName: 'testNewPromotionCatalog',
        startDate: '10/20/2020',
        endDate: '10/25/2020'
      };

      scope.catalogPromotionList = [{
        selectedPromotion: { id: 456 },
        sortOrder: 1,
        recordId: 234
      }];
    });

    it('should call update if editing', function () {
      scope.save();
      expect(promotionCatalogFactory.updatePromotionCatalog).toHaveBeenCalled();
    });

    it('should format payload and catalog list', function () {
      scope.save();
      var expectedPromotionList = [{
        promotionId: 456,
        sortOrder: 1,
        id: 234
      }];

      var expectedPayload = {
        id: parseInt(routeParams.id),
        startDate: '20201020',
        endDate: '20201025',
        promotionCatalogName: 'testNewPromotionCatalog',
        companyPromotionCatalogOrderCatalogs: expectedPromotionList
      };

      expect(promotionCatalogFactory.updatePromotionCatalog).toHaveBeenCalledWith(routeParams.id, expectedPayload);
    });

    it('should navigate to list page after save', function () {
      scope.save();
      scope.$digest();
      expect(location.path).toHaveBeenCalledWith('promotion-catalog-list');
    });

    it('should throw and error if item list is empty', function () {
      scope.catalogPromotionList = [{}];
      scope.save();
      expect(scope.errorCustom).toBeDefined();
      expect(scope.displayError).toEqual(true);
    });
  });
});

'use strict';

describe('Controller: PromotionCatalogConjunctionCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/promotion-list.json'));
  beforeEach(module('served/promotion-catalog.json'));
  beforeEach(module('served/promotion-catalog-conjunction.json'));

  var PromotionCatalogConjunctionCtrl;
  var promotionCatalogFactory;

  var promotionCatalogDeferred;
  var promotionCatalogResponseJSON;

  var promotionCatalogConjunctionDeferred;
  var promotionCatalogConjunctionResponseJSON;

  var promotionListDeferred;
  var promotionListResponseJSON;

  var routeParams;
  var dateUtility;
  var lodash;
  var location;
  var scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($q, $controller, $rootScope, $injector, $location) {
    inject(function (_servedPromotionList_, _servedPromotionCatalog_, _servedPromotionCatalogConjunction_) {
      promotionListResponseJSON = _servedPromotionList_;
      promotionCatalogResponseJSON = _servedPromotionCatalog_;
      promotionCatalogConjunctionResponseJSON = _servedPromotionCatalogConjunction_;
    });

    location = $location;
    promotionCatalogFactory = $injector.get('promotionCatalogFactory');
    dateUtility = $injector.get('dateUtility');
    lodash = $injector.get('lodash');
    scope = $rootScope.$new();

    promotionCatalogDeferred = $q.defer();
    promotionCatalogDeferred.resolve(promotionCatalogResponseJSON);
    spyOn(promotionCatalogFactory, 'getPromotionCatalog').and.returnValue(promotionCatalogDeferred.promise);

    promotionCatalogConjunctionDeferred = $q.defer();
    promotionCatalogConjunctionDeferred.resolve(promotionCatalogConjunctionResponseJSON);
    spyOn(promotionCatalogFactory, 'getPromotionCatalogConjunction').and.returnValue(promotionCatalogConjunctionDeferred.promise);
    spyOn(promotionCatalogFactory, 'updatePromotionCatalogConjunction').and.returnValue(promotionCatalogConjunctionDeferred.promise);
    spyOn(promotionCatalogFactory, 'createPromotionCatalogConjunction').and.returnValue(promotionCatalogConjunctionDeferred.promise);
    spyOn(promotionCatalogFactory, 'deletePromotionCatalogConjunction').and.returnValue(promotionCatalogConjunctionDeferred.promise);

    promotionListDeferred = $q.defer();
    promotionListDeferred.resolve(promotionListResponseJSON);
    spyOn(promotionCatalogFactory, 'getPromotionList').and.returnValue(promotionListDeferred.promise);

    spyOn(location, 'path').and.callThrough();

    routeParams = {
      id: '123',
      action: 'edit'
    };

    PromotionCatalogConjunctionCtrl = $controller('PromotionCatalogConjunctionCtrl', {
      $scope: scope,
      $routeParams: routeParams
    });

    scope.$digest();
  }));

  describe('initializeData', function () {

    it('should initialize conjunction list', function () {
      expect(scope.conjunctionList).toBeDefined();
    });

    it('should get promotion catalog', function () {
      expect(promotionCatalogFactory.getPromotionCatalog).toHaveBeenCalledWith(routeParams.id);
    });

    it('should format start and end dates for promotion catalog', function () {
      scope.$digest();
      expect(scope.promotionCatalog).toBeDefined();
      expect(dateUtility.isDateValidForApp(scope.promotionCatalog.startDate)).toEqual(true);
      expect(dateUtility.isDateValidForApp(scope.promotionCatalog.endDate)).toEqual(true);
    });

    it('should get a list of promotions active on catalog dates', function () {
      scope.$digest();
      var expectedPayload = {
        startDate: dateUtility.formatDateForAPI(scope.promotionCatalog.startDate),
        endDate: dateUtility.formatDateForAPI(scope.promotionCatalog.endDate)
      };

      expect(promotionCatalogFactory.getPromotionList).toHaveBeenCalledWith(expectedPayload);
    });

    it('should filter promotion lists by promotions in the catalog', function () {
      scope.$digest();
      expect(scope.selectedPromotionList).toBeDefined();
      expect(scope.selectedPromotionList.length < promotionListResponseJSON.promotions.length);

      var promotionCatalogMatch = lodash.findWhere(scope.promotionCatalog.companyPromotionCatalogOrderCatalogs, { promotionId: scope.selectedPromotionList[0].id });
      expect(promotionCatalogMatch).toBeDefined();
    });

    it('should get promotion conjunction if action is edit or view', function () {
      expect(promotionCatalogFactory.getPromotionCatalogConjunction).toHaveBeenCalledWith(routeParams.id);
    });

    it('should set page to viewOnly if page is view or promotion catalog is not in the future', function () {
      scope.$digest();
      scope.promotionCatalog = { startDate: '10/20/2050', endDate: '10/25/2060' };
      PromotionCatalogConjunctionCtrl.setViewVariables();
      expect(scope.isViewOnly).toEqual(false);

      scope.promotionCatalog = { startDate: '10/20/1950', endDate: '10/25/1960' };
      PromotionCatalogConjunctionCtrl.setViewVariables();
      expect(scope.isViewOnly).toEqual(true);

      scope.promotionCatalog = { startDate: '10/20/1950', endDate: '10/25/2060' };
      PromotionCatalogConjunctionCtrl.setViewVariables();
      expect(scope.isViewOnly).toEqual(true);
    });

    describe('format promotion conjunction', function () {
      beforeEach(function () {
        scope.$digest();
      });

      it('should attach full promotion object to each parent promotion', function () {
        expect(scope.conjunctionList.length).toEqual(promotionCatalogConjunctionResponseJSON.companyPromotionCatalogConjunctions.length);

        var firstPromotionParent = promotionCatalogConjunctionResponseJSON.companyPromotionCatalogConjunctions[0];
        var promotionCatalogMatch = lodash.findWhere(scope.promotionCatalog.companyPromotionCatalogOrderCatalogs, { promotionId: scope.conjunctionList[0].selectedPromotion.id });
        expect(scope.conjunctionList[0].selectedPromotion).toBeDefined();
        expect(scope.conjunctionList[0].recordId).toEqual(firstPromotionParent.id);
        expect(promotionCatalogMatch).toBeDefined();
      });

      it('should attach available promotions list to parent', function () {
        expect(scope.conjunctionList[0].filteredChildPromotionList).toBeDefined();
        expect(scope.conjunctionList[0].filteredChildPromotionList.length > 0).toEqual(true);
      });

      it('should attach full promotion object to each child promotion', function () {
        var firstPromotionParentChild = promotionCatalogConjunctionResponseJSON.companyPromotionCatalogConjunctions[0].conjunctions[0];
        var promotionCatalogMatch = lodash.findWhere(scope.promotionCatalog.companyPromotionCatalogOrderCatalogs,
          { promotionId: scope.conjunctionList[0].childPromotions[0].selectedPromotion.id });
        expect(scope.conjunctionList[0].childPromotions[0].selectedPromotion).toBeDefined();
        expect(scope.conjunctionList[0].childPromotions[0].recordId).toEqual(firstPromotionParentChild.id);
        expect(promotionCatalogMatch).toBeDefined();
      });

      it('should attach all child promotions to the parent', function () {
        var firstPromotionParent = promotionCatalogConjunctionResponseJSON.companyPromotionCatalogConjunctions[0];
        expect(scope.conjunctionList[0].childPromotions.length).toEqual(firstPromotionParent.conjunctions.length);
      });

      it('should filter available promotions to select after parent and children have been set', function () {
        var expectedParentListFilteredLength = scope.selectedPromotionList.length - scope.conjunctionList.length;
        expect(scope.filteredPromotionList.length).toEqual(expectedParentListFilteredLength);
      });
    });
  });

  describe('adding and removing parent promotions', function () {
    beforeEach(function () {
      scope.conjunctionList = [];
      scope.newConjunction();
    });
    it('should add a new record to conjunction list when adding a parent promotion', function () {
      expect(scope.conjunctionList.length).toEqual(1);
      expect(scope.conjunctionList[0].index).toEqual(0);
    });

    it('should attach a child list with one record to new parent promotion', function () {
      expect(scope.conjunctionList.length).toEqual(1);
    });

    it('should attach a list of available promotions to new parent promotion', function () {
      expect(scope.conjunctionList[0].childPromotions).toBeDefined();
      expect(scope.conjunctionList[0].childPromotions.length).toEqual(1);
    });

    it('should remove complete parent promotion and children when removing a parent promotion', function () {
      scope.removeConjunction(scope.conjunctionList[0]);
      expect(scope.conjunctionList.length).toEqual(0);
    });

    it('should update all promotion indicies when removing a parnet promotion', function () {
      scope.newConjunction();
      scope.removeConjunction(scope.conjunctionList[0]);

      expect(scope.conjunctionList[0].index).toEqual(0);
    });
  });

  describe('adding and removing child promotions', function () {
    beforeEach(function () {
      scope.conjunctionList = [];
      scope.newConjunction();
      scope.newConjunctionChild(scope.conjunctionList[0]);
    });

    it('should add new child conjunction to parent promotion', function () {
      expect(scope.conjunctionList[0].childPromotions.length).toEqual(2);
    });

    it('should remove complete child from parent promotion', function () {
      scope.removeConjunctionChild(scope.conjunctionList[0], scope.conjunctionList[0].childPromotions[1]);
      expect(scope.conjunctionList[0].childPromotions.length).toEqual(1);
    });

    it('should update all child indices when a child is removed', function () {
      scope.removeConjunctionChild(scope.conjunctionList[0], scope.conjunctionList[0].childPromotions[0]);
      expect(scope.conjunctionList[0].childPromotions[0].index).toEqual(0);
    });
  });

  describe('selecting promotions', function () {
    beforeEach(function () {
      scope.conjunctionList = [];
      scope.newConjunction();
      scope.updatedFilteredPromotionLists();
      scope.$digest();
    });

    it('should update available promotions for parents to select when a parent promotion is set', function () {
      scope.conjunctionList[0].selectedPromotion = scope.selectedPromotionList[0];
      scope.updatedFilteredPromotionLists();

      scope.$digest();
      expect(scope.filteredPromotionList.length).toEqual(scope.selectedPromotionList.length - 1);
    });

    it('should update available promotion for child promotions to select when a child promotion is set', function () {
      var parentPromotion = scope.conjunctionList[0];
      parentPromotion.childPromotions[0].selectedPromotion = scope.filteredPromotionList[0];
      scope.updateFilteredChildPromotionList(parentPromotion);

      scope.$digest();
      expect(parentPromotion.filteredChildPromotionList.length).toEqual(scope.selectedPromotionList.length - 1);
    });
  });

  describe('saving promotion catalog conjunction', function () {
    beforeEach(function () {
      scope.promotionCatalogConjunctionForm = { $valid: true };
    });

    it('should call API with formatted parent and child conjunctions with catalogs promotion id', function () {
      scope.conjunctionList = [];
      scope.newConjunction();
      scope.conjunctionList[0].selectedPromotion = scope.selectedPromotionList[0];
      scope.conjunctionList[0].childPromotions[0].selectedPromotion = scope.selectedPromotionList[1];

      var promotionCatalogParentMatch = lodash.findWhere(scope.promotionCatalog.companyPromotionCatalogOrderCatalogs, { promotionId:scope.conjunctionList[0].selectedPromotion.id });
      var promotionCatalogChildMatch = lodash.findWhere(scope.promotionCatalog.companyPromotionCatalogOrderCatalogs, { promotionId:scope.conjunctionList[0].childPromotions[0].selectedPromotion.id });
      var expectedPayload = {
        companyPromotionCatalogConjunctions: [{
          promotionCatalogOrderId: promotionCatalogParentMatch.id,
          conjunctions: [{
            promotionCatalogOrderConjunctionId: promotionCatalogChildMatch.id
          }]
        }]
      };

      scope.save();
      expect(promotionCatalogFactory.updatePromotionCatalogConjunction).toHaveBeenCalledWith(routeParams.id, expectedPayload);
    });

    it('should redirect to list page after save', function () {
      scope.save();
      scope.$digest();
      expect(location.path).toHaveBeenCalledWith('promotion-catalog-list');
    });
  });

  describe('deleting promotion catalog conjunction', function () {
    it('should call delete API with catalog it', function () {
      scope.removeRecord();
      expect(promotionCatalogFactory.deletePromotionCatalogConjunction).toHaveBeenCalledWith(routeParams.id);
    });

    it('should redirect to list page after delete', function () {
      scope.removeRecord();
      scope.$digest();
      expect(location.path).toHaveBeenCalledWith('promotion-catalog-list');
    });
  });

  describe('scope helper', function () {
    beforeEach(function () {
      scope.$digest();
    });
    it('should not allow new promotions to be added when max promotions have been seelcted', function () {
      scope.conjunctionList = [];
      expect(scope.shouldDisableNewPromotionConjunctions()).toEqual(false);

      angular.forEach(scope.selectedPromotionList, function () {
        scope.newConjunction();
      });

      expect(scope.shouldDisableNewPromotionConjunctions()).toEqual(true);
    });

    it('should not allow new child promotions when max child promotions have been selected', function () {
      scope.conjunctionList = [];
      scope.newConjunction();
      expect(scope.shouldDisableNewPromotionConjunctions()).toEqual(false);

      angular.forEach(scope.selectedPromotionList, function () {
        scope.newConjunctionChild(scope.conjunctionList[0]);
      });

      expect(scope.shouldDisableNewChildPromotion()).toEqual(true);
    });
  });
});

'use strict';

fdescribe('Controller: PromotionCatalogConjunctionCtrl', function () {

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

    });

    it('should get promotion catalog', function () {

    });

    it('should format start and end dates for promotion catalog', function () {

    });

    it('should get a list of promotions active on catalog dates', function () {

    });

    it('should filter promotion lists by promotions in the catalog', function () {

    });

    it('should get promotion conjunction if action is edit or view', function () {

    });

    it('should set page to viewOnly if page is view or promotion catalog is not in the future', function () {

    });

    describe('format promotion conjunction', function () {
      it('should attach full promotion object to each parent promotion', function () {

      });

      it('should attach full promotion object to each child promotion', function () {

      });

      it('should attach all child promotions to the parent', function () {

      });

      it('should filter available promotions to select after parent and children have been set', function () {

      });
    });
  });

  describe('adding and removing parent promotions', function () {
    it('should add a new record to conjunction list when adding a parent promotion', function () {

    });

    it('should attach a child list with one record to new parent promotion', function () {

    });

    it('should attach a list of available promotions to new parent promotion', function () {

    });

    it('should remove complete parent promotion and children when removing a parent promotion', function () {

    });

    it('should update all promotion indicies when removing a parnet promotion', function () {

    });
  });

  describe('adding and removing child promotions', function () {
    it('should add new child conjunction to parent promotion', function () {

    });

    it('should remove complete child from parent promotion', function () {

    });

    it('should update all child indices when a child is removed', function () {

    });
  });

  describe('selecting promotions', function () {
    it('should update available promotions for parents to select when a parent promotion is set', function () {

    });

    it('should update all child promotions of all oarents when a parent promoton is set', function () {

    });

    it('should update available promotion for child promotions to select when a child promotion is set', function () {

    });
  });


  describe('saving promotion catalog conjunction', function () {
    it('should not save if conjunction list is empty', function () {

    });

    it('should format parent conjunctions with catalogs promotion id', function () {

    });

    it('should format child conjunctions with promotion id and catalogs promotion id', function () {

    });

    it('should call create or edit API', function () {

    });

    it('should redirect to list page after save', function () {

    });
  });

  describe('deleting promotion catalog conjunction', function () {
    it('should call delete API with catalog it', function () {

    });
  });
})
;

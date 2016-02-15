'use strict';

describe('Factory: exciseDutyRelationshipFactory', function () {

  beforeEach(module('ts5App'));

  var exciseDutyRelationshipFactory,
    exciseDutyRelationshipService,
    exciseDutyService,
    countriesService,
    recordsService,
    itemsService,
    rootScope,
    scope;

  beforeEach(inject(function ($rootScope, _exciseDutyRelationshipFactory_, _exciseDutyRelationshipService_, _exciseDutyService_, _countriesService_, _recordsService_, _itemsService_) {
    exciseDutyRelationshipService = _exciseDutyRelationshipService_;
    exciseDutyService = _exciseDutyService_;
    countriesService = _countriesService_;
    recordsService = _recordsService_;
    itemsService = _itemsService_;

    spyOn(exciseDutyService, 'getExciseDutyList');
    spyOn(exciseDutyRelationshipService, 'getRelationshipList');
    spyOn(exciseDutyRelationshipService, 'getRelationship');
    spyOn(exciseDutyRelationshipService, 'createRelationship');
    spyOn(exciseDutyRelationshipService, 'updateRelationship');
    spyOn(exciseDutyRelationshipService, 'deleteRelationship');
    spyOn(countriesService, 'getCountriesList');
    spyOn(recordsService, 'getItemTypes');
    spyOn(itemsService, 'getItemsList');

    rootScope = $rootScope;
    scope = $rootScope.$new();
    exciseDutyRelationshipFactory = _exciseDutyRelationshipFactory_;
  }));

  it('should be defined', function () {
    expect(!!exciseDutyRelationshipFactory).toBe(true);
  });

  describe('exciseDutyService API', function () {
    it('should call exciseDutyService on getExciseDutyList', function () {
      var mockPayload = { fakeKey: 'fakeValue' };
      exciseDutyRelationshipFactory.getRelationshipList(mockPayload);
      expect(exciseDutyRelationshipService.getRelationshipList).toHaveBeenCalledWith(mockPayload);
    });

    it('should call exciseDutyService on getExciseDuty', function () {
      exciseDutyRelationshipFactory.getRelationship(123);
      expect(exciseDutyRelationshipService.getRelationship).toHaveBeenCalledWith(123);
    });

    it('should call exciseDutyService on createExciseDuty', function () {
      exciseDutyRelationshipFactory.createRelationship({});
      expect(exciseDutyRelationshipService.createRelationship).toHaveBeenCalled();
    });

    it('should call exciseDutyService on updateExciseDuty', function () {
      exciseDutyRelationshipFactory.updateRelationship(123, {});
      expect(exciseDutyRelationshipService.updateRelationship).toHaveBeenCalled();
    });

    it('should call exciseDutyService on deleteExciseDuty', function () {
      exciseDutyRelationshipFactory.deleteRelationship(123);
      expect(exciseDutyRelationshipService.deleteRelationship).toHaveBeenCalledWith(123);
    });
  });

  describe('exciseDutyService API', function () {
    it('should call exciseDutyService on getExciseDutyList', function () {
      exciseDutyRelationshipFactory.getExciseDutyList();
      expect(exciseDutyService.getExciseDutyList).toHaveBeenCalled();
    });
  });

  describe('itemsService API', function () {
    it('should call itemsService on getMasterCurrency', function () {
      exciseDutyRelationshipFactory.getMasterItemList({});
      expect(itemsService.getItemsList).toHaveBeenCalledWith({}, true);
    });
  });

  describe('recordsService API', function () {
    it('should call recordsService on getItemTypes', function () {
      exciseDutyRelationshipFactory.getItemTypes();
      expect(recordsService.getItemTypes).toHaveBeenCalled();
    });
  });
});

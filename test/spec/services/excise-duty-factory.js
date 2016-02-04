'use strict';

describe('Factory: exciseDutyFactory', function () {

  beforeEach(module('ts5App'));

  var exciseDutyFactory,
    exciseDutyService,
    rootScope,
    scope;

  beforeEach(inject(function ($rootScope, _exciseDutyFactory_, _exciseDutyService_) {
    exciseDutyService = _exciseDutyService_;

    spyOn(exciseDutyService, 'getExciseDutyList');
    spyOn(exciseDutyService, 'getExciseDuty');
    spyOn(exciseDutyService, 'createExciseDuty');
    spyOn(exciseDutyService, 'updateExciseDuty');
    spyOn(exciseDutyService, 'deleteExciseDuty');

    rootScope = $rootScope;
    scope = $rootScope.$new();
    exciseDutyFactory = _exciseDutyFactory_;
  }));

  it('should be defined', function () {
    expect(!!exciseDutyFactory).toBe(true);
  });

  describe('exciseDutyService API', function () {
    it('should call exciseDutyService on getExciseDutyList', function () {
      var mockPayload = {fakeKey: 'fakeValue'};
      exciseDutyFactory.getExciseDutyList(mockPayload);
      expect(exciseDutyService.getExciseDutyList).toHaveBeenCalledWith(mockPayload);
    });

    it('should call exciseDutyService on getExciseDuty', function () {
      exciseDutyFactory.getExciseDuty(123);
      expect(exciseDutyService.getExciseDuty).toHaveBeenCalledWith(123);
    });

    it('should call exciseDutyService on createExciseDuty', function () {
      exciseDutyFactory.createExciseDuty({});
      expect(exciseDutyService.createExciseDuty).toHaveBeenCalled();
    });

    it('should call exciseDutyService on updateExciseDuty', function () {
      exciseDutyFactory.updateExciseDuty(123, {});
      expect(exciseDutyService.updateExciseDuty).toHaveBeenCalled();
    });

    it('should call exciseDutyService on deleteExciseDuty', function () {
      exciseDutyFactory.deleteExciseDuty(123);
      expect(exciseDutyService.deleteExciseDuty).toHaveBeenCalledWith(123);
    });
  });
});

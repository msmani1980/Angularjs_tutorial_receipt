'use strict';

describe('Service: payloadUtility', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var payloadUtility,
      mockPayload;
  beforeEach(inject(function (_payloadUtility_) {
    payloadUtility = _payloadUtility_;

    mockPayload = {
      startDate: '06/19/2015',
      endDate: '06/19/2016'
    };
  }));

  describe('serializeDates method', function () {
    it('should format dates for API', function () {
      var result = payloadUtility.serializeDates(mockPayload);

      expect(result.startDate).toBe('20150619');
      expect(result.endDate).toBe('20160619');
    });
  });
});

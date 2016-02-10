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

  it('serializeDate method should format dat for API', function () {
    expect(payloadUtility.serializeDate(mockPayload.startDate)).toBe('20150619');
  });

  it('serializeInput method should assign null if value is empty string', function () {
    expect(payloadUtility.serializeInput('')).toBe(null);
  });

  it('sanitize method should assign null to all empty string fields', function () {
    var payload = {
      description: '',
      name: 'egate'
    };
    payloadUtility.sanitize(payload);

    expect(payload.description).toBe(null);
    expect(payload.name).toBe('egate');
  });
});

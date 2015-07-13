'use strict';

describe('Date Utility service', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var dateUtility;
  beforeEach(inject(function (_dateUtility_) {
    dateUtility = _dateUtility_;
  }));

  describe('now() method', function () {

    it('should be defined', function () {
      expect(dateUtility.now).toBeDefined();
    });

    it('should return a timestamp matching the current timestamp',
      function () {
        var currentTimestamp = Date.parse(new Date());
        expect(dateUtility.now()).toEqual(currentTimestamp);
      });

  });

  describe('formatDate() method', function () {

    it('should be defined', function () {
      expect(dateUtility.formatDate).toBeDefined();
    });

    it('should format a date string from one format to another', function () {
      var expectedDateString = '20150619';
      var formattedString = dateUtility.formatDate('06/19/2015', 'L', 'YYYYMMDD');
      expect(formattedString).toEqual(expectedDateString);
    });

  });

  describe('formatDateForAPI method', function () {

    it('should be defined', function () {
      expect(dateUtility.formatDateForAPI).toBeDefined();
    });

    it('should format a date string from one format to another', function () {
      var expectedDateString = '20150619';
      var formattedString = dateUtility.formatDateForAPI('06/19/2015');
      expect(formattedString).toEqual(expectedDateString);
    });

  });

  describe('isValid() method', function(){

    it('should be defined for APP', function () {
      expect(dateUtility.isDateValidForApp).toBeDefined();
    });

    it('should return true for app', function () {
      expect(dateUtility.isDateValidForApp('05/10/1979')).toBe(true);
    });

    it('should return false for app', function () {
      expect(dateUtility.isDateValidForApp('19791005')).toBe(false);
    });

    it('should be defined for API', function () {
      expect(dateUtility.isDateValidForAPI).toBeDefined();
    });

    it('should return true for API', function () {
      expect(dateUtility.isDateValidForAPI('19791005')).toBe(true);
    });

    it('should return false for API', function () {
      expect(dateUtility.isDateValidForAPI('05/10/1979')).toBe(false);
    });

  });

});

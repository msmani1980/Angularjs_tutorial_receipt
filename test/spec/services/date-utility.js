'use strict';
/*global moment*/

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

    it('should format a date string from one format to another',
      function () {
        var expectedDateString = '20150619';
        var formattedString = dateUtility.formatDate('06/19/2015',
          'L', 'YYYYMMDD');
        expect(formattedString).toEqual(expectedDateString);
      });

  });

  describe('formatDateForAPI method', function () {

    it('should be defined', function () {
      expect(dateUtility.formatDateForAPI).toBeDefined();
    });

    it('should format a date string from one format to another',
      function () {
        var expectedDateString = '20150619';
        var formattedString = dateUtility.formatDateForAPI(
          '06/19/2015');
        expect(formattedString).toEqual(expectedDateString);
      });

  });

  describe('formatDateForApp method', function () {

    it('should be defined', function () {
      expect(dateUtility.formatDateForApp).toBeDefined();
    });

    it('should format a date string from one format to another',
      function () {
        var expectedDateString = '06/19/2015';
        var formattedString = dateUtility.formatDateForApp(
          '20150619');
        expect(formattedString).toEqual(expectedDateString);
      });

  });

  describe('formatTimestampForAPI method', function () {

    it('should be defined', function () {
      expect(dateUtility.formatTimestampForAPI).toBeDefined();
    });

    it('should format a timestamp string from one format to another',
      function () {
        var expectedString = '2015-10-01 18:25:00.000000';
        var formattedString = dateUtility.formatTimestampForAPI(
          '10/01/2015 18:25');
        expect(formattedString).toEqual(expectedString);
      });

  });

  describe('formatTimestampForApp method', function () {

    it('should be defined', function () {
      expect(dateUtility.formatTimestampForApp).toBeDefined();
    });

    it('should format a timestamp string from one format to another',
      function () {
        var expectedString = '10/01/2015 18:25';
        var formattedString = dateUtility.formatTimestampForApp(
          '2015-10-01 18:25:12.123456');
        expect(formattedString).toEqual(expectedString);
      });

  });

  describe('isValid() method', function () {

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
      expect(dateUtility.isDateValidForAPI('05/10/1979')).toBe(
        false);
    });

  });

  describe('date comparison', function () {
    it('should return true is date is today', function () {
      var currentTimestamp = moment().format('YYYY/MM/DD');
      expect(dateUtility.isToday(currentTimestamp)).toBe(true);
    });

    it('should return false is date is not today', function () {
      var currentTimestamp = '1979/05/10';
      expect(dateUtility.isToday(currentTimestamp)).toBe(false);
    });

    it('should return true is date is after today', function () {
      expect(dateUtility.isAfterToday('05/10/2080')).toBe(true);
    });

    it('should return false is date is not after today', function () {
      expect(dateUtility.isAfterToday('05/10/2000')).toBe(false);
    });
  });

  describe('tomorrow() method', function () {

    it('should be defined', function () {
      expect(dateUtility.tomorrow).toBeDefined();
    });

    it('should be return tomorrow timestamp', function () {
      var today = new Date();
      var tomorrowControl = today.setDate(today.getDate() + 1);
      var tomorrow = dateUtility.tomorrow();
      expect(tomorrow).toEqual(tomorrowControl);
    });

  });

  describe('yesterday() method', function () {

    it('should be defined', function () {
      expect(dateUtility.yesterday).toBeDefined();
    });

    it('should be return yesterday timestamp', function () {
      var today = new Date();
      var yesterdayControl = today.setDate(today.getDate() - 1);
      var yesterday = dateUtility.yesterday();
      expect(yesterday).toEqual(yesterdayControl);
    });

  });

  describe('isTodayOrEarlier() method', function () {

    it('should be defined', function () {
      expect(dateUtility.isTodayOrEarlier).toBeDefined();
    });

    it('should return true if the date is today', function () {
      var today = dateUtility.nowFormatted();
      var dateIsTodayOrEarlier = dateUtility.isTodayOrEarlier(
        today);
      expect(dateIsTodayOrEarlier).toBeTruthy();
    });

    it('should return true if the date is earlier than today', function () {
      var yesterday = dateUtility.formatDateForApp(dateUtility.yesterday(),
        'x');
      var dateIsTodayOrEarlier = dateUtility.isTodayOrEarlier(
        yesterday);
      expect(dateIsTodayOrEarlier).toBeTruthy();
    });

    it('should return false if the date is later than today', function () {
      var tomorrow = dateUtility.formatDateForApp(dateUtility.tomorrow(),
        'x');
      var dateIsTodayOrEarlier = dateUtility.isTodayOrEarlier(
        tomorrow);
      expect(dateIsTodayOrEarlier).toBeFalsy();
    });

  });

  describe('isYesterdayOrEarlier() method', function () {

    it('should be defined', function () {
      expect(dateUtility.isYesterdayOrEarlier).toBeDefined();
    });

    it('should return false if the date is today', function () {
      var today = dateUtility.nowFormatted();
      var dateIsBeforeYesterday = dateUtility.isYesterdayOrEarlier(
        today);
      expect(dateIsBeforeYesterday).toBeFalsy();
    });

    it('should return true if the date is earlier than yesterday',
      function () {
        var today = new Date();
        var twoDaysAgo = today.setDate(today.getDate() - 2);
        var testDate = dateUtility.formatDateForApp(twoDaysAgo,
          'x');
        var dateIsBeforeYesterday = dateUtility.isYesterdayOrEarlier(
          testDate);
        expect(dateIsBeforeYesterday).toBeTruthy();
      });

  });

  describe('nowFormatted method', function () {

    it('should be defined', function () {
      expect(dateUtility.nowFormatted).toBeDefined();
    });

    it(
      'should return a formatted date in MM/DD/YYYY when no format is passed',
      function () {
        var now = Date.parse(new Date());
        var formattedTimeStamp = dateUtility.nowFormatted();
        var formatControl = dateUtility.formatDate(now, 'x',
          'MM/DD/YYYY');
        expect(formattedTimeStamp).toEqual(formatControl);
      });

    it(
      'should return a formatted date in YYYYMMDD when YYYYMMDD format is passed',
      function () {
        var now = Date.parse(new Date());
        var formattedTimeStamp = dateUtility.nowFormatted('YYYYMMDD');
        var formatControl = dateUtility.formatDate(now, 'x',
          'YYYYMMDD');
        expect(formattedTimeStamp).toEqual(formatControl);
      });

  });

  describe('removeMilliseconds method', function(){
    it('should remove a decimal and all numbers after', function(){
      var expected = '2015-08-07 13:35:59';
      var result = dateUtility.removeMilliseconds('2015-08-07 13:35:59.924555');
      expect(result).toEqual(expected);
    });
  });

  describe('the diff method', function(){

    it('should return a difference in days by default', function(){
      var fromDate = '10/01/2015';
      var toDate = '10/11/2015';
      var result = dateUtility.diff(fromDate,toDate);
      expect(result).toEqual(10);
    });

    it('should return a difference in months if passed as a parameter', function(){
      var fromDate = '10/01/2015';
      var toDate = '11/01/2015';
      var result = dateUtility.diff(fromDate,toDate,'months');
      expect(result).toEqual(1);
    });

  });

});

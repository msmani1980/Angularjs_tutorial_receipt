'use strict';
/* global moment */
/**
 * @ngdoc service
 * @name ts5App.dateUtility
 * @description
 * # dateUtility
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('dateUtility', function (companyFormatUtility) {

    var dateFormatForAPI = 'YYYYMMDD';

    this.getDateFormatForApp = function () {
      return companyFormatUtility.getDateFormat();
    };

    var timestampFormatForAPI = 'YYYY-MM-DD HH:mm:ss.SSSSSS';
    var timestampFormatForApp = 'MM/DD/YYYY HH:mm';

    this.formatDate = function (dateString, formatFrom, formatTo) {
      return moment(dateString, formatFrom).format(formatTo).toString();
    };

    this.formatDateForAPI = function (dateToFormat, dateForAppFormat, dateForAPIFormat) {
      dateForAPIFormat = dateForAPIFormat || dateFormatForAPI;
      dateForAppFormat = dateForAppFormat || this.getDateFormatForApp();

      return this.formatDate(dateToFormat, dateForAppFormat, dateForAPIFormat);
    };

    this.formatDateForApp = function (dateToFormat, dateForAPIFormat, dateForAppFormat) {
      dateForAPIFormat = dateForAPIFormat || dateFormatForAPI;
      dateForAppFormat = dateForAppFormat || this.getDateFormatForApp();

      return this.formatDate(dateToFormat, dateForAPIFormat, dateForAppFormat);
    };

    this.formatTimestampForAPI = function (timestampToFormat, timestampForAppFormat, timestampForAPIFormat) {
      timestampForAppFormat = timestampForAppFormat || timestampFormatForApp;
      timestampForAPIFormat = timestampForAPIFormat || timestampFormatForAPI;

      return this.formatDate(timestampToFormat, timestampForAppFormat,
        timestampForAPIFormat);
    };

    this.formatTimestampForApp = function (timestampToFormat, timestampForAPIFormat,
                                           timestampForAppFormat) {
      timestampForAPIFormat = timestampForAPIFormat || timestampFormatForAPI;
      timestampForAppFormat = timestampForAppFormat || timestampFormatForApp;

      return this.formatDate(timestampToFormat, timestampForAPIFormat,
        timestampForAppFormat);
    };

    this.isDateValidForApp = function (dateToCheck) {
      return moment(dateToCheck, this.getDateFormatForApp(), true).isValid();
    };

    this.isDateValidForAPI = function (dateToCheck) {
      return moment(dateToCheck, dateFormatForAPI, true).isValid();
    };

    this.now = function () {
      return Date.parse(new Date());
    };

    this.nowFormatted = function (formatTo) {
      formatTo = formatTo || this.getDateFormatForApp();
      var formatFrom = 'x';
      var now = this.now();
      return this.formatDate(now, formatFrom, formatTo);
    };

    this.tomorrow = function () {
      var today = new Date();
      return today.setDate(today.getDate() + 1);
    };

    this.tomorrowFormatted = function (formatTo) {
      var formatFrom = 'x';
      formatTo = formatTo || this.getDateFormatForApp();
      var tomorrow = this.tomorrow();
      return this.formatDate(tomorrow, formatFrom, formatTo);
    };

    this.yesterday = function () {
      var today = new Date();
      return today.setDate(today.getDate() - 1);
    };

    this.yesterdayFormatted = function (formatTo) {
      var formatFrom = 'x';
      formatTo = formatTo || this.getDateFormatForApp();
      var today = new Date();
      var yesterday = today.setDate(today.getDate() - 1);
      return this.formatDate(yesterday, formatFrom, formatTo);
    };

    this.dateNumDaysBeforeToday = function (numDays) {
      var today = new Date();
      return today.setDate(today.getDate() - numDays);
    };

    this.dateNumDaysBeforeTodayFormatted = function (numDays, formatTo) {
      var formatFrom = 'x';
      formatTo = formatTo || this.getDateFormatForApp();
      var newDate = this.dateNumDaysBeforeToday(numDays);
      return this.formatDate(newDate, formatFrom, formatTo);
    };

    this.dateNumDaysAfterToday = function (numDays) {
      var today = new Date();
      return today.setDate(today.getDate() + numDays);
    };

    this.dateNumDaysAfterTodayFormatted = function (numDays, formatTo) {
      var formatFrom = 'x';
      formatTo = formatTo || this.getDateFormatForApp();
      var newDate = this.dateNumDaysAfterToday(numDays);
      return this.formatDate(newDate, formatFrom, formatTo);
    };

    this.isToday = function (date) {
      return moment(date, this.getDateFormatForApp()).isSame(moment(), 'day');
    };

    this.isTodayOrEarlier = function (date) {
      return moment(date, this.getDateFormatForApp()).isSameOrBefore(moment(), 'day');
    };

    this.isTomorrowOrLater = function (date) {
      return moment(date, this.getDateFormatForApp()).isAfter(moment(), 'day');
    };

    this.isYesterdayOrEarlier = function (date) {
      return moment(date, this.getDateFormatForApp()).isBefore(moment(), 'day');
    };

    this.isAfterToday = function (date) {
      return moment(date, this.getDateFormatForApp()).isAfter(moment(), 'day');
    };

    this.isAfterOrEqual = function (baseDate, dateToCompare) {
      return moment(baseDate, this.getDateFormatForApp()).isSameOrAfter(moment(dateToCompare, this.getDateFormatForApp()), 'day');
    };

    this.removeMilliseconds = function (date) {
      if (!date) {
        return;
      }

      return date.replace(/\.[0-9]+/, '');
    };

    this.diff = function (from, to, type) {
      var diffType = (type ? type : 'days');
      var fromDate = Date.parse(from);
      var toDate = moment(Date.parse(to));
      return toDate.diff(fromDate, diffType);
    };

    this.getOperationalDay = function (date) {
      date = new Date(date);
      return date.getDay();
    };

  });

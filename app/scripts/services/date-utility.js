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
  .service('dateUtility', function (companyFormatUtility, $localStorage) {

    var dateFormatForAPI = 'YYYYMMDD';
    var dateFormatForReportAPI = 'dd/MM/yyyy';
    var timestampFormatForAPI = 'YYYY-MM-DD HH:mm:ss.SSSSSS';

    this.getReportsDateFormat = function () {
      return dateFormatForReportAPI;
    };

    this.getDateFormatForApp = function () {
      return companyFormatUtility.getDateFormat();
    };

    var timestampFormatForApp = function () {
      return companyFormatUtility.getDateFormat() + ' HH:mm:ss';
    };

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
      timestampForAppFormat = timestampForAppFormat || timestampFormatForApp();
      timestampForAPIFormat = timestampForAPIFormat || timestampFormatForAPI;

      return this.formatDate(timestampToFormat, timestampForAppFormat,
        timestampForAPIFormat);
    };

    this.formatTimestampForApp = function (timestampToFormat, timestampForAPIFormat,
                                           timestampForAppFormat) {
      timestampForAPIFormat = timestampForAPIFormat || timestampFormatForAPI;
      timestampForAppFormat = timestampForAppFormat || timestampFormatForApp();

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

    this.isAfterTodayOrEqual = function (date) {
      return moment(date, this.getDateFormatForApp()).isSameOrAfter(moment(), 'day');
    };

    this.isAfterOrEqual = function (baseDate, dateToCompare) {
      return moment(baseDate, this.getDateFormatForApp()).isSameOrAfter(moment(dateToCompare, this.getDateFormatForApp()), 'day');
    };

    this.isBeforeOrEqual = function (baseDate, dateToCompare) {
      return moment(baseDate, this.getDateFormatForApp()).isSameOrBefore(moment(dateToCompare, this.getDateFormatForApp()), 'day');
    };

    this.removeMilliseconds = function (date) {
      if (!date) {
        return;
      }

      return date.replace(/\.[0-9]+/, '');
    };

    this.diff = function (from, to, type) {
      var diffType = (type ? type : 'days');
      var fromDate = moment(from, this.getDateFormatForApp());
      var toDate = moment(to, this.getDateFormatForApp());
      return toDate.diff(fromDate, diffType);
    };

    this.getOperationalDay = function (date, currentDateFormat) {
      currentDateFormat = currentDateFormat || this.getDateFormatForApp();
      var formattedDate = this.formatDate(date, currentDateFormat, 'MM/DD/YYYY');
      date = new Date(formattedDate);
      return date.getDay();
    };

    this.nowFormattedDatePicker = function (formatTo) {
      formatTo = formatTo || this.getDateFormatForApp();
      var formatFrom = 'x';
      var now = this.now();
      return this.formatDatePicker(now, formatFrom, formatTo);
    };

    this.yesterdayFormattedDatePicker = function (formatTo) {
      var formatFrom = 'x';
      formatTo = formatTo || this.getDateFormatForApp();
      var today = new Date();
      var yesterday = today.setDate(today.getDate() - 1);
      return this.formatDatePicker(yesterday, formatFrom, formatTo);
    };

    this.tomorrowFormattedDatePicker = function (formatTo) {
      var formatFrom = 'x';
      formatTo = formatTo || this.getDateFormatForApp();
      var tomorrow = this.tomorrow();
      return this.formatDatePicker(tomorrow, formatFrom, formatTo);
    };

    this.formatDatePicker = function (dateString, formatFrom, formatTo) {
      var companyTimeOffset = $localStorage.companyObject !== undefined && $localStorage.companyObject !== null ? $localStorage.companyObject.userCompanyTimezoneOffset || 0 : 0;
      return moment(dateString, formatFrom).utcOffset('"' + companyTimeOffset + '"').format(formatTo).toString();
    };

    this.isTodayDatePicker = function (date) {
      return moment(date, this.getDateFormatForApp()).isSame(moment(this.nowFormattedDatePicker(), this.getDateFormatForApp()), 'day');
    };

    this.isTodayOrEarlierDatePicker = function (date) {
      return moment(date, this.getDateFormatForApp()).isSameOrBefore(moment(this.nowFormattedDatePicker(), this.getDateFormatForApp()), 'day');
    };

    this.isTomorrowOrLaterDatePicker = function (date) {
      return moment(date, this.getDateFormatForApp()).isAfter(moment(this.nowFormattedDatePicker(), this.getDateFormatForApp()), 'day');
    };

    this.isYesterdayOrEarlierDatePicker = function (date) {
      return moment(date, this.getDateFormatForApp()).isBefore(moment(this.nowFormattedDatePicker(), this.getDateFormatForApp()), 'day');
    };

    this.isAfterTodayDatePicker = function (date) {
      return moment(date, this.getDateFormatForApp()).isAfter(moment(this.nowFormattedDatePicker(), this.getDateFormatForApp()), 'day');
    };

    this.isAfterOrEqualDatePicker = function (baseDate, dateToCompare) {
      return moment(baseDate, this.getDateFormatForApp()).isSameOrAfter(moment(dateToCompare, this.getDateFormatForApp()), 'day');
    };

    this.isBeforeOrEqualDatePicker = function (baseDate, dateToCompare) {
      return moment(baseDate, this.getDateFormatForApp()).isSameOrBefore(moment(dateToCompare, this.getDateFormatForApp()), 'day');
    };

    this.isAfterDatePicker = function (baseDate, dateToCompare) {
      return moment(baseDate, this.getDateFormatForApp()).isAfter(moment(dateToCompare, this.getDateFormatForApp()), 'day');
    };

    this.dateNumDaysAfterTodayFormattedDatePicker = function (numDays, formatTo) {
      var formatFrom = 'x';
      formatTo = formatTo || this.getDateFormatForApp();
      var newDate = this.dateNumDaysAfterToday(numDays);
      return this.formatDatePicker(newDate, formatFrom, formatTo);
    };

    this.formatTimezoneOffset = function (timezoneOffset) {
      return (timezoneOffset !== undefined) ? (moment().tz(timezoneOffset).utcOffset()) / 60 : 0;
    };

    this.addDays = function(date, days) {
      return moment(date, this.getDateFormatForApp()).add(days, 'days').format(this.getDateFormatForApp()).toString();
    };

    this.addYears = function(date, years) {
      return moment(date, this.getDateFormatForApp()).add(years, 'years').format(this.getDateFormatForApp()).toString();
    };

  });

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
  .service('dateUtility', function () {

    var _dateFormatForAPI = 'YYYYMMDD';
    var _dateFormatForApp = 'MM/DD/YYYY';
    var _timestampFormatForAPI = 'YYYY-MM-DD HH:mm:ss.SSSSSS';
    var _timestampFormatForApp = 'MM/DD/YYYY HH:mm';

    this.formatDate = function (dateString, formatFrom, formatTo) {
      return moment(dateString, formatFrom).format(formatTo).toString();
    };

    this.formatDateForAPI = function (dateToFormat, dateForAppFormat,
      dateForAPIFormat) {
      dateForAppFormat = dateForAppFormat || _dateFormatForApp;
      dateForAPIFormat = dateForAPIFormat || _dateFormatForAPI;

      return this.formatDate(dateToFormat, dateForAppFormat,
        dateForAPIFormat);
    };

    this.formatDateForApp = function (dateToFormat, dateForAPIFormat,
      dateForAppFormat) {
      dateForAPIFormat = dateForAPIFormat || _dateFormatForAPI;
      dateForAppFormat = dateForAppFormat || _dateFormatForApp;

      return this.formatDate(dateToFormat, dateForAPIFormat,
        dateForAppFormat);
    };

    this.formatTimestampForAPI = function (timestampToFormat, timestampForAppFormat,
      timestampForAPIFormat) {
      timestampForAppFormat = timestampForAppFormat || _timestampFormatForApp;
      timestampForAPIFormat = timestampForAPIFormat || _timestampFormatForAPI;

      return this.formatDate(timestampToFormat, timestampForAppFormat,
        timestampForAPIFormat);
    };

    this.formatTimestampForApp = function (timestampToFormat, timestampForAPIFormat,
      timestampForAppFormat) {
      timestampForAPIFormat = timestampForAPIFormat || _timestampFormatForAPI;
      timestampForAppFormat = timestampForAppFormat || _timestampFormatForApp;

      return this.formatDate(timestampToFormat, timestampForAPIFormat,
        timestampForAppFormat);
    };

    this.isDateValidForApp = function (dateToCheck) {
      return moment(dateToCheck, _dateFormatForApp, true).isValid();
    };

    this.isDateValidForAPI = function (dateToCheck) {
      return moment(dateToCheck, _dateFormatForAPI, true).isValid();
    };

    this.now = function () {
      return Date.parse(new Date());
    };

    this.nowFormatted = function (formatTo) {
      var formatFrom = 'x';
      formatTo = formatTo || _dateFormatForApp;
      var now = this.now();
      return this.formatDate(now, formatFrom, formatTo);
    };

    this.tomorrow = function () {
      var today = new Date();
      var tomorrow = today.setDate(today.getDate() + 1);
      return tomorrow;
    };

    this.yesterday = function () {
      var today = new Date();
      var yesterday = today.setDate(today.getDate() - 1);
      return yesterday;
    };

    this.isToday = function (date) {
      return Date.parse(moment().format('MM/DD/YYYY')) === Date.parse(date);
    };
    this.isTodayOrEarlier = function (date) {
      return this.now() >= Date.parse(date);
    };

    this.isYesterdayOrEarlier = function (date) {
      return this.yesterday() >= Date.parse(date);
    };

    this.isAfterToday = function (dateToCompare) {
      var parsedDate = Date.parse(dateToCompare);
      return parsedDate > this.now();
    };

    this.removeMilliseconds = function(date){
      if(!date){
        return;
      }
      return date.replace(/\.[0-9]+/, '');
    };

    this.diff = function(from,to,type) {
     var diffType = (type ? type : 'days');
     var fromDate = Date.parse(from);
     var toDate = moment(Date.parse(to));
     return toDate.diff(fromDate, diffType);
    } ;

  });

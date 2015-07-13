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

    this.formatDate = function (dateString, formatFrom, formatTo) {
      return moment(dateString, formatFrom).format(formatTo).toString();
    };

    this.formatDateForAPI = function (dateToFormat, dateForAppFormat, dateForAPIFormat) {
      dateForAppFormat = dateForAppFormat || _dateFormatForApp;
      dateForAPIFormat = dateForAPIFormat || _dateFormatForAPI;

      return this.formatDate(dateToFormat, dateForAppFormat, dateForAPIFormat);
    };

    this.formatDateForApp = function (dateToFormat, dateForAPIFormat, dateForAppFormat) {
      dateForAPIFormat = dateForAPIFormat || _dateFormatForAPI;
      dateForAppFormat = dateForAppFormat || _dateFormatForApp;

      return this.formatDate(dateToFormat, dateForAPIFormat, dateForAppFormat);
    };

    this.isDateValidForApp = function(dateToCheck) {
      return moment(dateToCheck, _dateFormatForApp, true).isValid();
    };

    this.isDateValidForAPI = function(dateToCheck) {
      return moment(dateToCheck, _dateFormatForAPI, true).isValid();
    };

    this.now = function () {
      return Date.parse(new Date());
    };

  });

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

    var _dateForAPIFormat = 'YYYYMMDD';
    var _dateForAppFormat = 'MM/DD/YYYY';

    this.formatDate = function (dateString, formatFrom, formatTo) {
      return moment(dateString, formatFrom).format(formatTo).toString();
    };

    this.formatDateForAPI = function (dateToFormat, dateForAppFormat, dateForAPIFormat) {
      dateForAppFormat = dateForAppFormat || _dateForAppFormat;
      dateForAPIFormat = dateForAPIFormat || _dateForAPIFormat;

      return this.formatDate(dateToFormat, dateForAppFormat, dateForAPIFormat);
    };

    this.formatDateForApp = function (dateToFormat, dateForAPIFormat, dateForAppFormat) {
      dateForAPIFormat = dateForAPIFormat || _dateForAPIFormat;
      dateForAppFormat = dateForAppFormat || _dateForAppFormat;

      return this.formatDate(dateToFormat, dateForAPIFormat, dateForAppFormat);
    };

    this.now = function () {
      return Date.parse(new Date());
    };

  });

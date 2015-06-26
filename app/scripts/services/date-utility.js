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

    this.formatDate = function (dateString, formatFrom, formatTo) {
      return moment(dateString, formatFrom).format(formatTo).toString();
    };

    this.formatDateForAPI = function (dateToFormat) {
      return moment(dateToFormat, 'L').format('YYYYMMDD').toString();
    };

    this.now = function () {
      return Date.parse(new Date());
    };

  });

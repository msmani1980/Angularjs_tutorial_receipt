'use strict';

//jshint maxcomplexity:11

/**
 * @ngdoc filter
 * @name ts5App.filter:timeinterval
 * @function
 * @description
 * # timeinterval
 * Filter in the ts5App.
 */
angular.module('ts5App')
  .filter('timeinterval', function () {
    return function (milliseconds) {

      var seconds = 0;
      if (milliseconds >= 1000) {
        seconds = Math.round(milliseconds / 1000);
        milliseconds = 0;
      }

      var minutes = 0;
      if (seconds >= 60) {
        minutes = Math.floor(seconds / 60);
        seconds = seconds % 60;
      }

      var hours = 0;
      if (minutes >= 60) {
        hours = Math.floor(minutes / 60);
        minutes = minutes % 60;
      }

      var days = 0;
      if (hours >= 24) {
        days = Math.floor(hours / 24);
        hours = hours % 24;
      }

      var timeString = '';
      if (milliseconds > 0) {
        timeString += (milliseconds + 'ms');
      } else {
        if (days > 0) {
          timeString += (days > 1) ? (days + ' days ') : (days + ' day ');
        }

        if (hours > 0) {
          timeString += (hours + 'h');
        }

        if (minutes > 0) {
          timeString += (minutes + 'm');
        }

        if (seconds > 0) {
          timeString += (seconds + 's');
        }
      }

      return timeString;
    };
  });

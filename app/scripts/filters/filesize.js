'use strict';

/**
 * @ngdoc filter
 * @name ts5App.filter:filesize
 * @function
 * @description
 * # filesize
 * Filter in the ts5App.
 */
angular.module('ts5App')
	.filter('filesize', function () {
	    return function (size) {
	      if (isNaN(size)) {
	        size = 0;
	      }
	
	      if (size < 1024) {
	        return size + ' Bytes';
	      }
	
	      size /= 1024;
	
	      if (size < 1024) {
	        return size.toFixed(2) + ' Kb';
	      }
	
	      size /= 1024;
	
	      if (size < 1024) {
	        return size.toFixed(2) + ' Mb';
	      }
	
	      size /= 1024;
	
	      if (size < 1024) {
	        return size.toFixed(2) + ' Gb';
	      }
	
	      size /= 1024;
	
	      return size.toFixed(2) + ' Tb';
	    };
  });
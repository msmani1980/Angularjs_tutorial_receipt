'use strict';

/**
 * @ngdoc service
 * @name ts5App.companiesFactory
 * @description
 * # companiesFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('companiesFactory', function (tagsService) {

  // Tags
  var getTagsList = function (payload) {
    return tagsService.getTagsList(payload);
  };


  return {

    // Tags
    getTagsList: getTagsList,

  };

});

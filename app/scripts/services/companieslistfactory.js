'use strict';

/**
 * @ngdoc service
 * @name ts5App.companiesListFactory
 * @description
 * # companiesListFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('companiesListFactory', function ($resource, baseUrl) {
    var url = baseUrl + '/api/companies';

    var paramDefaults = {};

    var actions = {
      getList: {
        method: 'GET',
        headers: {
          'userId': 1,
        },
      },
      // Example:
      // create: {
      //   method: 'POST',
      // }
    };

    return $resource(url, paramDefaults, actions);
  });

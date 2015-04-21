'use strict';

/**
 * @ngdoc service
 * @name ts5App.companiesListFactory
 * @description
 * # companiesListFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('companiesListFactory', function ($resource, baseUrl, GlobalMenuService) {

    var user = GlobalMenuService.user.get();

    var url = baseUrl + '/api/companies';
    var paramDefaults = {};
    var actions = {
      getList: {
        method: 'GET',
        headers: {
          'userId': user.id
        }
      }
    };

    return $resource(url, paramDefaults, actions);
  });

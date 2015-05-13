'use strict';

/**
 * @ngdoc service
 * @name ts5App.companiesListFactory
 * @description
 * # companiesListFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('companiesListFactory', function ($resource, ENV, GlobalMenuService) {

    var user = GlobalMenuService.user.get();

    var url = ENV.apiUrl + '/api/companies';
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

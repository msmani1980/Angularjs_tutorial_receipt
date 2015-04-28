'use strict';

/**
 * @ngdoc service
 * @name ts5App.menuService
 * @description
 * # menuService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('menuService', function ($http, $q, $resource, baseUrl) {
    $http.defaults.headers.common.userId = 1;
    $http.defaults.headers.common.companyId = 374;

    var requestURL = baseUrl + '/api/menus/:id';
    var requestParameters = {
      id: '@id',
      limit: 50
    };

    var actions = {
      getMenuList: {
        method: 'GET'
      },
      getMenu: {
        method: 'GET'
      },
      createMenu: {
        method: 'POST'
      },
      updateMenu: {
        method: 'PUT'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    var getMenuList = function () {
      var deferred = $q.defer();
      requestResource.getMenuList().$promise.then(function (data) {
        deferred.resolve(data);
      });
      return deferred.promise;
    };

    var getMenu = function (menuId) {
      var deferred = $q.defer();
      requestResource.getMenu({id: menuId}).$promise.then(function (data) {
        deferred.resolve(data);
      });
      return deferred.promise;
    };

    var updateMenu = function (payload) {
      var deferred = $q.defer();
      requestResource.updateMenu(payload).$promise.then(function (data) {
        deferred.resolve(data);
      });
      return deferred.promise;
    };

    return {
      getMenuList: getMenuList,
      getMenu: getMenu,
      updateMenu: updateMenu
    };
  });

'use strict';

/**
 * @ngdoc service
 * @name ts5App.menuService
 * @description
 * # menuService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('menuService', function ($resource, ENV, Upload, dateUtility, $http) {


    function transformRequest(data) {
      data = angular.fromJson(data);
      if (data && data.startDate) {
        data.startDate = dateUtility.formatDateForAPI(data.startDate);
      }
      if (data && data.endDate) {
        data.endDate = dateUtility.formatDateForAPI(data.endDate);
      }
      return angular.toJson(data);
    }

    function transformResponse(data) {
      data = angular.fromJson(data);
      if (data && data.startDate) {
        data.startDate = dateUtility.formatDate(data.startDate, 'YYYY-MM-DD', 'MM/DD/YYYY');
      }
      if (data && data.endDate) {
        data.endDate = dateUtility.formatDate(data.endDate, 'YYYY-MM-DD', 'MM/DD/YYYY');
      }
      return data;
    }

    var appendTransform = function appendTransform(defaults, transform) {
      defaults = angular.isArray(defaults) ? defaults : [defaults];
      return defaults.concat(transform);
    };

    var requestURL = ENV.apiUrl + '/api/menus/:id';
    var requestParameters = {
      id: '@id',
      limit: 50
    };

    var actions = {
      getMenuList: {
        method: 'GET'
      },
      getMenu: {
        method: 'GET',
        transformResponse: appendTransform($http.defaults.transformResponse, transformResponse)
      },
      createMenu: {
        method: 'POST',
        transformRequest: appendTransform($http.defaults.transformRequest, transformRequest),
        transformResponse: appendTransform($http.defaults.transformResponse, transformResponse)
      },
      updateMenu: {
        method: 'PUT',
        transformRequest: appendTransform($http.defaults.transformRequest, transformRequest),
        transformResponse: appendTransform($http.defaults.transformResponse, transformResponse)
      },
      deleteMenu: {
        method: 'DELETE'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    var getMenuList = function (payload) {
      return requestResource.getMenuList(payload).$promise;
    };

    var getMenu = function (menuId) {
      return requestResource.getMenu({
        id: menuId
      }).$promise;
    };

    var deleteMenu = function (menuId) {
      return requestResource.deleteMenu({
        id: menuId
      }).$promise;
    };

    var updateMenu = function (payload) {
      return requestResource.updateMenu(payload).$promise;
    };

    var createMenu = function (payload) {
      return requestResource.createMenu(payload).$promise;
    };

    var importFromExcel = function (companyId, file) {
      var uploadRequestURL = ENV.apiUrl + '/services/companies/' + companyId + '/file/menu';
      return Upload.upload({
        url: uploadRequestURL,
        file: file
      });
    };

    return {
      getMenuList: getMenuList,
      deleteMenu: deleteMenu,
      getMenu: getMenu,
      updateMenu: updateMenu,
      createMenu: createMenu,
      importFromExcel: importFromExcel
    };
  });

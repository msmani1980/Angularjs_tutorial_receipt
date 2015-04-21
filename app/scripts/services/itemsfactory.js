'use strict';

/**
 * @ngdoc service
 * @name ts5App.itemsFactory
 * @description
 * # itemsFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('itemsFactory', function ($resource,$q, baseUrl) {

    var url = baseUrl + '/api/retail-items1';

    var paramDefaults = {};
    var actions = {
      getList: {
        method: 'GET',
        headers: {
          'userId': 1,
          'companyId': 326
        }
      },
      create: {
        method: 'POST'
      }
    };

    var itemListResource = $resource(url, paramDefaults, actions);

    var getList = function () {

      var baseItemDeffered = $q.defer();

      itemListResource.getList().$promise.then(function (data) {

        baseItemDeffered.resolve(data);

      });

      return baseItemDeffered.promise;

    };

    return {
      getList: getList
    };

  });

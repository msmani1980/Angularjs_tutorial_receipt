'use strict';

/**
 * @ngdoc service
 * @name ts5App.itemsService
 * @description
 * # itemsService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('itemsService', function ($q,$resource,baseUrl) {

    // API URL
    var url = baseUrl + '/api/retail-items1';

    var listParameters = {};
    var createParameters = {};

    var actions = {
      getList: {
        method: 'GET',
        headers: {
          'userId': 1,
          'companyId': 326
        }
      },
      create: {
        method: 'POST',
        headers: {
          'userId': 1,
          'companyId': 326
        }
      }
    };

    // Item List Resource
    var listResource = $resource(url, listParameters, actions);

     // Item Create Resource
    var createResource = $resource(url, createParameters, actions);

    // GETs a list of items from the API
    function getList() {

      var deferred = $q.defer();

      listResource.getList().$promise.then(function (data) {

        deferred.resolve(data);

      });

      return deferred.promise;

    }

    // GX
    function create(itemData) {

      createParameters.retailItem = itemData;

      var deferred = $q.defer();

      createResource.create().$promise.then(function (data) {

        deferred.resolve(data);

      });

      return deferred.promise;

    }

    return {
      getList: getList,
      create: create
    };


  });

'use strict';

/**
 * @ngdoc service
 * @name ts5App.eposConfigService
 * @description
 * # eposConfigService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('eposConfigService', function ($resource, ENV, $q) {

    var eposConfigRequestURL = ENV.apiUrl + '/rsvr/api/epos-config/module/:id';

    var eposConfigManagementActions = {
      getModules: {
        method: 'GET',
        headers: {}
      }
    };

    var eposConfigRequestResource = $resource(eposConfigRequestURL, null, eposConfigManagementActions);

    var getModules = function(payload) {
      //return eposConfigRequestResource.getModules(payload).$promise;

      var p = $q.defer();
      p.resolve({
        "meta": {
          "count": 10,
          "limit": 10,
          "start": 0,
          "ms": 126,
          "filters": -1,
          "version": "portal-rest-services Portal Main REST Module HEAD-SNAPSHOT, 2018-02-01 17:29 local, Build of: mvn # latest-local",
          "adr": "172.27.228.15"
        },
        "response": [
          {
            "id": 200,
            "moduleName": "Data Synchronization",
            "isRequired": false,
            "createdOn": "2015-06-11 23:20:23",
            "orderBy": 1,
            "required": false
          },
          {
            "id": 600,
            "moduleName": "Shop Management",
            "isRequired": false,
            "createdOn": "2015-06-11 23:20:23",
            "orderBy": 2,
            "required": false
          },
          {
            "id": 300,
            "moduleName": "Prerequisites",
            "isRequired": false,
            "createdOn": "2015-06-11 23:20:23",
            "orderBy": 3,
            "required": false
          },
          {
            "id": 100,
            "moduleName": "Cross Device Synchronization",
            "isRequired": false,
            "createdOn": "2015-06-11 23:20:23",
            "orderBy": 3,
            "required": false
          },
          {
            "id": 800,
            "moduleName": "Dashboard",
            "isRequired": false,
            "createdOn": "2016-07-27 15:52:52",
            "orderBy": 4,
            "required": false
          },
          {
            "id": 900,
            "moduleName": "Global",
            "isRequired": false,
            "createdOn": "2016-07-27 18:01:59",
            "orderBy": 5,
            "required": false
          },
          {
            "id": 1000,
            "moduleName": "PED",
            "isRequired": false,
            "createdOn": "2017-04-21 16:00:08",
            "orderBy": 6,
            "required": false
          },
          {
            "id": 700,
            "moduleName": "Uplift",
            "isRequired": false,
            "createdOn": "2015-06-11 23:20:23",
            "orderBy": 7,
            "required": false
          },
          {
            "id": 500,
            "moduleName": "Sales",
            "isRequired": false,
            "createdOn": "2015-06-11 23:20:23",
            "orderBy": 8,
            "required": false
          },
          {
            "id": 400,
            "moduleName": "Reports",
            "isRequired": false,
            "createdOn": "2015-06-11 23:20:23",
            "orderBy": 9,
            "required": false
          }
        ]
      });
      return p.promise;
    };

    return {
      getModules: getModules
    };

  });

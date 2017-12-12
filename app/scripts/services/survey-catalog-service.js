'use strict';

/**
 * @ngdoc service
 * @name ts5App.surveyCatalogService
 * @description
 * # surveyCatalogService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('surveyCatalogService', function ($resource, ENV) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var surveyCatalogRequestURL = ENV.apiUrl + '/rsvr/api/survey/catalog/:surveyCatalogId';

    var surveyCatalogActions = {
      getSurveyCatalogs: {
        method: 'GET'
      },
      getSurveyCatalogById: {
        method: 'GET',
        headers: {}
      },
      createSurveyCatalog: {
        method: 'POST',
        headers: {}
      },
      updateSurveyCatalog: {
        method: 'PUT',
        headers: {}
      },
      deleteSurveyCatalog: {
        method: 'DELETE',
        headers: {}
      }
    };

    var surveyCatalogRequestResource = $resource(surveyCatalogRequestURL, null, surveyCatalogActions);

    var getSurveyCatalogs = function (payload, additionalPayload) {
      if (additionalPayload) {
        angular.extend(payload, additionalPayload);
      }

      return surveyCatalogRequestResource.getSurveyCatalogs(payload).$promise;
    };

    var getSurveyCatalogById = function (surveyCatalogId) {
      var requestParameters = {
        surveyCatalogId: surveyCatalogId
      };

      return surveyCatalogRequestResource.getSurveyCatalogById(requestParameters, surveyCatalogId).$promise;
    };

    var createSurveyCatalog = function (payload) {

      return surveyCatalogRequestResource.createSurveyCatalog(payload).$promise;
    };

    var updateSurveyCatalog = function (surveyCatalogId, payload) {
      var requestParameters = {
        surveyCatalogId: surveyCatalogId
      };

      return surveyCatalogRequestResource.updateSurveyCatalog(requestParameters, payload).$promise;
    };

    var deleteSurveyCatalog = function (surveyCatalogId) {
      var payload = {
        surveyCatalogId: surveyCatalogId
      };

      return surveyCatalogRequestResource.deleteSurveyCatalog(payload).$promise;
    };

    return {
      getSurveyCatalogs: getSurveyCatalogs,
      getSurveyCatalogById: getSurveyCatalogById,
      createSurveyCatalog: createSurveyCatalog,
      updateSurveyCatalog: updateSurveyCatalog,
      deleteSurveyCatalog: deleteSurveyCatalog
    };

  });


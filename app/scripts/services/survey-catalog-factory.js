'use strict';

/**
 * @ngdoc service
 * @name ts5App.surveyCatalogFactory
 * @description
 * # surveyCatalogFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('surveyCatalogFactory', function (globalMenuService, surveyCatalogService) {
    // Service logic
    var getCompanyId = function () {
      return globalMenuService.company.get();
    };

    var getSurveyCatalogs = function (payload) {
      return surveyCatalogService.getSurveyCatalogs(payload);
    };

    var getSurveyCatalog = function(surveyId) {
      return surveyCatalogService.getSurveyCatalogById(surveyId);
    };

    var createSurveyCatalog = function (payload) {
      return surveyCatalogService.createSurveyCatalog(payload);
    };

    var updateSurveyCatalog = function (payload) {
      return surveyCatalogService.updateSurveyCatalog(payload.id, payload);
    };

    var deleteSurveyCatalog = function (surveyId) {
      return surveyCatalogService.deleteSurveyCatalog(surveyId);
    };

    return {
      getSurveyCatalogs: getSurveyCatalogs,
      getSurveyCatalog: getSurveyCatalog,
      createSurveyCatalog: createSurveyCatalog,
      updateSurveyCatalog: updateSurveyCatalog,
      deleteSurveyCatalog: deleteSurveyCatalog,
      getCompanyId: getCompanyId
    };

  });

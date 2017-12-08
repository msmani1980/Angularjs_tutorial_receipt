'use strict';

/**
 * @ngdoc service
 * @name ts5App.surveyService
 * @description
 * # surveyService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('surveyService', function ($resource, ENV) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var surveyRequestURL = ENV.apiUrl + '/rsvr/api/survey/:surId';
    var surveyTypeRequestURL = ENV.apiUrl + '/rsvr/api/records/survey-types';
    
    var surveyActions = {
      getSurveys: {
        method: 'GET'
      },
      getSurveyTypes: {
        method: 'GET',
        isArray: true
      },
      getSurveyById: {
        method: 'GET',
        headers: {}
      },
      createSurvey: {
        method: 'POST',
        headers: {}
      },
      updateSurvey: {
        method: 'PUT',
        headers: {}
      },
      deleteSurvey: {
        method: 'DELETE',
        headers: {}
      }
    };
    
    var surveyRequestResource = $resource(surveyRequestURL, null, surveyActions);
    var surveyTypeRequestResource = $resource(surveyTypeRequestURL, null, surveyActions);
    
    var getSurveys = function (payload, additionalPayload) {
      if (additionalPayload) {
        angular.extend(payload, additionalPayload);
      }

      return surveyRequestResource.getSurveys(payload).$promise;
    };
    
    var getSurveyTypes = function () {
      var payload = {};

      return surveyTypeRequestResource.getSurveyTypes(payload).$promise;
    };

    var getSurveyById = function (companyId, surveyId) {
      var requestParameters = {
        companyId: companyId,
        surId: surveyId
      };

      return surveyRequestResource.getSurveyById(requestParameters, surveyId).$promise;
    };

    var createSurvey = function (companyId, payload) {
      var requestParameters = {
        id: companyId
      };

      return surveyRequestResource.createSurvey(requestParameters, payload).$promise;
    };

    var updateSurvey = function (companyId, surveyId, payload) {
      var requestParameters = {
        id: companyId,
        surId: surveyId
      };

      return surveyRequestResource.updateSurvey(requestParameters, payload).$promise;
    };

    var deleteSurvey = function (companyId, surveyId) {
      var payload = {
        id: companyId,
        surId: surveyId
      };

      return surveyRequestResource.deleteSurvey(payload).$promise;
    };

    return {
      getSurveys: getSurveys,
      getSurveyTypes: getSurveyTypes,
      getSurveyById: getSurveyById,
      createSurvey: createSurvey,
      updateSurvey: updateSurvey,
      deleteSurvey: deleteSurvey
    };
    
  });


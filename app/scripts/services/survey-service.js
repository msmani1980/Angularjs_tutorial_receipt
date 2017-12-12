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
    var surveyQuestionURL = ENV.apiUrl + '/rsvr/api/survey/question';

    var surveyActions = {
      getSurveys: {
        method: 'GET'
      },
      getSurveyTypes: {
        method: 'GET',
        isArray: true
      },
      getSurveyQuestions: {
        method: 'GET'
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
    var surveyQuestionResource = $resource(surveyQuestionURL, null, surveyActions);

    var getSurveys = function (payload, additionalPayload) {
      if (additionalPayload) {
        angular.extend(payload, additionalPayload);
      }

      return surveyRequestResource.getSurveys(payload).$promise;
    };
    
    var getSurveyQuestions = function (payload) {

      return surveyQuestionResource.getSurveyQuestions(payload).$promise;
    };

    var getSurveyTypes = function () {
      var payload = {};

      return surveyTypeRequestResource.getSurveyTypes(payload).$promise;
    };

    var getSurveyById = function (surveyId) {
      var requestParameters = {
        surId: surveyId
      };

      return surveyRequestResource.getSurveyById(requestParameters, surveyId).$promise;
    };

    var createSurvey = function (payload) {

      return surveyRequestResource.createSurvey(payload).$promise;
    };

    var updateSurvey = function (surveyId, payload) {
      var requestParameters = {
        surId: surveyId
      };

      return surveyRequestResource.updateSurvey(requestParameters, payload).$promise;
    };

    var deleteSurvey = function (surveyId) {
      var payload = {
        surId: surveyId 
      };

      return surveyRequestResource.deleteSurvey(payload).$promise;
    };

    return {
      getSurveys: getSurveys,
      getSurveyTypes: getSurveyTypes,
      getSurveyQuestions: getSurveyQuestions,
      getSurveyById: getSurveyById,
      createSurvey: createSurvey,
      updateSurvey: updateSurvey,
      deleteSurvey: deleteSurvey
    };
    
  });


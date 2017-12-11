'use strict';

/**
 * @ngdoc service
 * @name ts5App.surveyQuestionsService
 * @description
 * # surveyQuestionsService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('surveyQuestionsService', function (ENV, $resource) {
    var requestURL = ENV.apiUrl + '/rsvr/api/survey/question/:id';
    var requestParameters = {
      id: '@id'
    };

    var actions = {
      getSurveyQuestions: {
        method: 'GET'
      },
      getSurveyQuestion: {
        method: 'GET'
      },
      createSurveyQuestion: {
        method: 'POST'
      },
      updateSurveyQuestion: {
        method: 'PUT'
      },
      removeSurveyQuestion: {
        method: 'DELETE'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    var getSurveyQuestions = function (payload) {
      return requestResource.getSurveyQuestions(payload).$promise;
    };

    var getSurveyQuestion = function (id) {
      return requestResource.getSurveyQuestion({ id: id }).$promise;
    };

    var createSurveyQuestion = function (payload) {
      return requestResource.createSurveyQuestion(payload).$promise;
    };

    var updateSurveyQuestion = function (id, payload) {
      return requestResource.updateSurveyQuestion({ id: id }, payload).$promise;
    };

    var removeSurveyQuestion = function (id) {
      return requestResource.removeSurveyQuestion({ id: id }).$promise;
    };

    return {
      getSurveyQuestions: getSurveyQuestions,
      getSurveyQuestion: getSurveyQuestion,
      createSurveyQuestion: createSurveyQuestion,
      updateSurveyQuestion: updateSurveyQuestion,
      removeSurveyQuestion: removeSurveyQuestion
    };
  });
